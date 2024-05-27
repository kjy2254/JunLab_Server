const connection = require("./database/mysql");
const axios = require("axios");

const fetchAirQualityData = (serialNum) => {
  const now = new Date();
  const startTime =
    new Date(now.getTime() - 60 * 1000)
      .toISOString()
      .replace(/[-:T.]/g, "")
      .substring(0, 14) + "00";
  const endTime =
    now
      .toISOString()
      .replace(/[-:T.]/g, "")
      .substring(0, 14) + "00";

  const payload = {
    serialNum,
    startTime,
    endTime,
    type: "Co2,Humid,Pm10,Pm25,Temperature,Tvoc",
  };

  //   console.log(startTime, endTime);
  axios
    .post("http://mqtt.brilcom.com:8080/mqtt/GetAirQuality", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      const airQualityData = response.data.data;

      if (airQualityData.length > 0) {
        // myreport 값을 기준으로 최신 데이터 찾기
        const latestData = airQualityData.reduce((latest, current) => {
          return new Date(current.myreport) > new Date(latest.myreport)
            ? current
            : latest;
        });

        const { myreport, Tvoc, Co2, Pm10, Temperature } = latestData;

        // 데이터베이스 업데이트
        const query1 = `
          UPDATE airwall SET 
            last_update = ?, 
            last_tvoc = ?, 
            last_co2 = ?, 
            last_temperature = ?, 
            last_pm10 = ? 
          WHERE module_id = ? AND (last_update IS NULL OR last_update < ?)
        `;

        const values1 = [
          myreport,
          Tvoc,
          Co2,
          Temperature,
          Pm10,
          serialNum,
          myreport,
        ];

        connection.query(query1, values1, (error, results) => {
          if (error) {
            console.error("DB 업데이트 실패:", error);
          } else {
            console.log(
              `DB 업데이트 {${serialNum}} myreport: ${myreport}, tvoc: ${Tvoc}, co2: ${Co2}, pm10: ${Pm10}, temp: ${Temperature}`
            );
          }
        });

        // 데이터베이스 삽입
        const query2 = `
            INSERT INTO airwall_data (sensor_module_id, factory_id, temperature, tvoc, co2, pm10, timestamp)
            SELECT ?, factory_id, ?, ?, ?, ?, ?
            FROM airwall
            WHERE module_id = ?;`;

        const values2 = [
          serialNum,
          Temperature,
          Tvoc,
          Co2,
          Pm10,
          now,
          serialNum,
          serialNum,
        ];

        connection.query(query2, values2, (error, results) => {
          if (error) {
            console.error("DB 삽입 실패:", error);
          }
        });
      } else {
        console.log(`No data available for ${serialNum}`);
      }
    })
    .catch((error) => {
      console.error(`API 요청 실패 for ${serialNum}:`, error);
    });
};

const moduleList = [];

const getModuleList = () => {
  const query = `SELECT module_id 
                 FROM airwall 
                 WHERE type = 'PICO'`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("DB 조회 실패:", error);
      return;
    }

    // moduleList를 업데이트
    moduleList.length = 0; // 기존 배열 초기화
    results.forEach((row) => {
      moduleList.push(row.module_id);
    });

    // console.log("Updated module list:", moduleList);
  });
};

// 초기 모듈 리스트 가져오기
getModuleList();

// 7초마다 모듈 리스트 업데이트 및 데이터 fetch
setInterval(() => {
  getModuleList();

  moduleList.forEach((serialNum) => {
    fetchAirQualityData(serialNum);
  });
}, 20000);

// 서버가 종료되지 않도록 유지
process.stdin.resume();
