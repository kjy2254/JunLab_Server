const connection = require("../database/mysql");
const axios = require("axios");
const { promisify } = require("util");

const queryAsync = promisify(connection.query).bind(connection);

function fetchRecentDataForModule(moduleId) {
  return new Promise((resolve, reject) => {
    if (moduleId === null) {
      resolve({
        type: "env",
        tvoc: Array(30).fill(null),
        co2: Array(30).fill(null),
        pm2_5: Array(30).fill(null),
        temperature: Array(30).fill(null),
        humid: Array(30).fill(null),
      });
      return;
    }

    const dataQuery = `
      SELECT
        DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') as minute,
        AVG(tvoc) as avg_tvoc,
        AVG(co2) as avg_co2,
        AVG(pm2_5) as avg_pm2_5,
        AVG(temperature) as avg_temperature,
        AVG(humid) as avg_humid
      FROM airwall_data
      WHERE sensor_module_id = ?
        AND timestamp >= NOW() - INTERVAL 30 MINUTE
      GROUP BY minute
      ORDER BY minute;
    `;

    connection.query(dataQuery, [moduleId], (dataError, dataResult) => {
      if (dataError) {
        reject(dataError);
        return;
      }

      const tvocData = Array(30).fill(null);
      const co2Data = Array(30).fill(null);
      const pmData = Array(30).fill(null);
      const tempData = Array(30).fill(null);
      const humidData = Array(30).fill(null);
      const thirtyMinutesAgo = new Date(new Date().getTime() - 30 * 60 * 1000);

      dataResult.forEach((row) => {
        const minuteIndex = Math.floor(
          (new Date(row.minute) - thirtyMinutesAgo) / (60 * 1000)
        );
        if (minuteIndex >= 0 && minuteIndex < 30) {
          const avgTvoc = parseFloat(row.avg_tvoc);
          const avgCo2 = parseFloat(row.avg_co2);
          const avgPm = parseFloat(row.avg_pm2_5);
          const avgTemp = parseFloat(row.avg_temperature);
          const avgHumid = parseFloat(row.avg_humid);
          tvocData[minuteIndex] = isNaN(avgTvoc) ? null : avgTvoc;
          co2Data[minuteIndex] = isNaN(avgCo2) ? null : avgCo2;
          pmData[minuteIndex] = isNaN(avgPm) ? null : avgPm;
          tempData[minuteIndex] = isNaN(avgTemp) ? null : avgTemp;
          humidData[minuteIndex] = isNaN(avgHumid) ? null : avgHumid;
        }
      });

      resolve({
        type: "env",
        tvoc: tvocData,
        co2: co2Data,
        pm2_5: pmData,
        temperature: tempData,
        humid: humidData,
      });
    });
  });
}

function fetchRecentHealthDataForWatch(watchId) {
  return new Promise((resolve, reject) => {
    const dataQuery = `
      SELECT
        DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') as minute,
        AVG(heart_rate) as avg_heart_rate,
        AVG(body_temperature) as avg_body_temperature
      FROM airwatch_data
      WHERE device_id = ?
        AND timestamp >= NOW() - INTERVAL 30 MINUTE
      GROUP BY minute
      ORDER BY minute;
    `;

    connection.query(dataQuery, [watchId], (dataError, dataResult) => {
      if (dataError) {
        reject(dataError);
        return;
      }

      const heartRateData = Array(30).fill(null);
      const temperatureData = Array(30).fill(null);
      const thirtyMinutesAgo = new Date(new Date().getTime() - 30 * 60 * 1000);

      dataResult.forEach((row) => {
        const minuteIndex = Math.floor(
          (new Date(row.minute) - thirtyMinutesAgo) / (60 * 1000)
        );
        if (minuteIndex >= 0 && minuteIndex < 30) {
          const avgHeartRate = parseFloat(row.avg_heart_rate);
          const avgBodyTemperature = parseFloat(row.avg_body_temperature);
          heartRateData[minuteIndex] = isNaN(avgHeartRate)
            ? null
            : avgHeartRate;
          temperatureData[minuteIndex] = isNaN(avgBodyTemperature)
            ? null
            : avgBodyTemperature;
        }
      });

      resolve({
        type: "hc",
        heart_rate: heartRateData,
        body_temperature: temperatureData,
      });
    });
  });
}

function fetchRecentDataForUser(user) {
  return Promise.all([
    fetchRecentDataForModule(user.airwall_id),
    fetchRecentHealthDataForWatch(user.watch_id),
  ]).then(([moduleResult, watchResult]) => {
    return {
      type: "level",
      heart_rate: watchResult.heart_rate,
      body_temperature: watchResult.body_temperature,
      tvoc: moduleResult.tvoc,
      co2: moduleResult.co2,
      pm2_5: moduleResult.pm2_5,
      temperature: moduleResult.temperature,
      humid: moduleResult.humid,
    };
  });
}

async function Enviroment() {
  const query = `SELECT module_id FROM airwall;`;

  try {
    const result = await queryAsync(query);
    const moduleIds = result.map((row) => row.module_id);

    await Promise.all(
      moduleIds.map(async (moduleId) => {
        try {
          const finalResult = await fetchRecentDataForModule(moduleId);
          const response = await axios.post(
            "http://127.0.0.1:9900/predict",
            finalResult
          );
          console.log(
            `Result for module_id ${moduleId}:`,
            JSON.stringify(response.data)
          );

          const insertQuery = `
            INSERT INTO Index_env (timestamp, value, module_id, model_version)
            VALUES (NOW(), ?, ?, ?);
          `;

          const envIndex = response.data["환경 지수"];
          const modelVersion = response.data["env_version"];

          await queryAsync(insertQuery, [envIndex, moduleId, modelVersion]);

          const updateQuery = `
            UPDATE airwall
            SET last_env_index = ?
            WHERE module_id = ?;
          `;

          await queryAsync(updateQuery, [envIndex, moduleId]);
        } catch (error) {
          console.error(
            `Error processing data for module_id ${moduleId}:`,
            error
          );
        }
      })
    );
  } catch (error) {
    console.error("Error fetching module_ids:", error);
  }
}

async function Health() {
  const query = `SELECT watch_id FROM airwatch;`;

  try {
    const result = await queryAsync(query);
    const watchIds = result.map((row) => row.watch_id);

    await Promise.all(
      watchIds.map(async (watchId) => {
        try {
          const finalResult = await fetchRecentHealthDataForWatch(watchId);
          const response = await axios.post(
            "http://127.0.0.1:9900/predict",
            finalResult
          );
          console.log(
            `Result for watch_id ${watchId}:`,
            JSON.stringify(response.data)
          );

          const insertQuery = `
            INSERT INTO Index_health (timestamp, value, watch_id, model_version)
            VALUES (NOW(), ?, ?, ?);
          `;

          const healthIndex = response.data["건강 지수"];
          const modelVersion = response.data["hc_version"];

          await queryAsync(insertQuery, [healthIndex, watchId, modelVersion]);

          const updateQuery = `
            UPDATE airwatch
            SET last_health_index = ?
            WHERE watch_id = ?;
          `;

          await queryAsync(updateQuery, [healthIndex, watchId]);
        } catch (error) {
          console.error(
            `Error processing data for watch_id ${watchId}:`,
            error
          );
        }
      })
    );
  } catch (error) {
    console.error("Error fetching watch_ids:", error);
  }
}

async function Workload() {
  const query = `SELECT user_id, watch_id, airwall_id FROM users;`;

  try {
    const result = await queryAsync(query);
    const users = result;

    await Promise.all(
      users.map(async (user) => {
        try {
          const finalResult = await fetchRecentDataForUser(user);
          const response = await axios.post(
            "http://127.0.0.1:9900/predict",
            finalResult
          );
          console.log(
            `Result for user_id ${user.user_id}:`,
            JSON.stringify(response.data)
          );

          const insertQuery = `
            INSERT INTO Index_workload (timestamp, value, user_id, model_env_version, model_health_version)
            VALUES (NOW(), ?, ?, ?, ?);
          `;

          const workloadIndex = response.data["작업 강도"];
          const modelEnvVersion = response.data["env_version"];
          const modelHealthVersion = response.data["hc_version"];

          await queryAsync(insertQuery, [
            workloadIndex,
            user.user_id,
            modelEnvVersion,
            modelHealthVersion,
          ]);

          const updateQuery = `
            UPDATE users
            SET last_workload = ?
            WHERE user_id = ?;
          `;

          await queryAsync(updateQuery, [workloadIndex, user.user_id]);
        } catch (error) {
          console.error(
            `Error processing data for user_id ${user.user_id}:`,
            error
          );
        }
      })
    );
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// 30초마다 실행

setInterval(Enviroment, 30000);
setInterval(Health, 30000);
setInterval(Workload, 30000);
