const tf = require("@tensorflow/tfjs-node");
const path = require("path");
const connection = require("../database/mysql");

let model;

// 모델 로드 함수
async function loadModel() {
  if (!model) {
    const modelPath = path.resolve(__dirname, "./wl_model5/model.json");
    model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log("Model loaded");
  }
}

// 예측 함수
async function workload(input) {
  if (!model) {
    // loadModel();
    throw new Error("Model not loaded. Call loadModel() first.");
  }
  const tensorInput = tf.tensor(input, [1, 4, 30]); // 입력 모양을 명시적으로 설정
  const prediction = model.predict(tensorInput);
  const result = prediction.arraySync()[0];

  // 가장 높은 값과 그 값의 인덱스를 찾기
  const maxIndex = result.indexOf(Math.max(...result));

  // console.log(input, result);
  return { result, value: maxIndex + 1 };
}

async function predictWorkLoadByUserId(userId) {
  // const userId = parseInt(id);
  await loadModel();

  const query1 = `WITH RECURSIVE time_intervals AS (
                          SELECT NOW() - INTERVAL 29 MINUTE AS start_time
                          UNION ALL
                          SELECT start_time + INTERVAL 1 MINUTE
                          FROM time_intervals
                          WHERE start_time + INTERVAL 1 MINUTE <= NOW()
                      )
                      SELECT 
                          DATE_FORMAT(t.start_time, '%Y-%m-%d %H:%i') AS minute,
                          ROUND(AVG(a.heart_rate), 2) AS avg_heart_rate,
                          ROUND(AVG(a.body_temperature), 2) AS avg_body_temperature
                      FROM 
                          time_intervals t
                      LEFT JOIN 
                          airwatch_data a 
                      ON 
                          DATE_FORMAT(a.timestamp, '%Y-%m-%d %H:%i') = DATE_FORMAT(t.start_time, '%Y-%m-%d %H:%i')
                          AND a.user_id = ?
                      GROUP BY 
                          t.start_time
                      ORDER BY 
                          t.start_time;`;

  const query2 = `WITH RECURSIVE time_intervals AS (
                      SELECT NOW() - INTERVAL 29 MINUTE AS start_time
                      UNION ALL
                      SELECT start_time + INTERVAL 1 MINUTE
                      FROM time_intervals
                      WHERE start_time + INTERVAL 1 MINUTE <= NOW()
                  )
                  SELECT 
                      DATE_FORMAT(t.start_time, '%Y-%m-%d %H:%i') AS minute,
                      ROUND(AVG(a.tvoc), 2) AS avg_tvoc,
                      ROUND(AVG(a.co2), 2) AS avg_co2
                  FROM 
                      time_intervals t
                  LEFT JOIN 
                      airwall_data a 
                  ON 
                      DATE_FORMAT(a.timestamp, '%Y-%m-%d %H:%i') = DATE_FORMAT(t.start_time, '%Y-%m-%d %H:%i')
                      AND a.sensor_module_id = (SELECT airwall_id FROM users WHERE user_id = ?)
                  GROUP BY 
                      t.start_time
                  ORDER BY 
                      t.start_time;`;

  return new Promise((resolve, reject) => {
    connection.query(
      query1 + query2,
      [userId, userId],
      async (error, result) => {
        if (error) {
          console.log(error);
          return reject("Internal Server Error!");
        }

        const avgHeartRates = result[0].map((row) =>
          row.avg_heart_rate !== null ? parseFloat(row.avg_heart_rate) : null
        );
        const avgBodyTemperatures = result[0].map((row) =>
          row.avg_body_temperature !== null
            ? parseFloat(row.avg_body_temperature)
            : null
        );
        const avgTvoc = result[1].map((row) =>
          row.avg_tvoc !== null ? parseFloat(row.avg_tvoc) : null
        );
        const avgCo2 = result[1].map((row) =>
          row.avg_co2 !== null ? parseFloat(row.avg_co2) : null
        );

        const input = [[avgTvoc, avgCo2, avgHeartRates, avgBodyTemperatures]];

        try {
          const prediction = await workload(input);
          resolve(prediction.value);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

// 모듈 내보내기
module.exports = { workload, predictWorkLoadByUserId };
