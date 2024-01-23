const express = require("express");
const api = express.Router();
const connection = require("../database/apiConnection");
const {
  calcWorkLoadIndex,
  calcEnviromentIndex,
  calclevel,
} = require("../util/logic.js");

api.get("/factories", (req, res) => {
  const query = "SELECT * FROM factories";

  connection.query(query, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.get("/factory/:factoryId/name", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const query = `SELECT factory_name FROM factories WHERE factory_id = ?`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    return res.status(200).json(result[0]);
  });
});

api.get("/factory/:factoryId/tvoc", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const query = `SELECT module_id, module_name, last_update, last_tvoc as tvoc FROM sensor_modules WHERE factory_id = ?`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    return res.status(200).json(result);
  });
});

api.get("/factory/:factoryId/co2", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const query = `SELECT module_id, module_name, last_update, last_co2 as co2 FROM sensor_modules WHERE factory_id = ?`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    return res.status(200).json(result);
  });
});

api.get("/factory/:factoryId/temperature", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const query = `SELECT module_id, module_name, last_update, last_temperature as temperature FROM sensor_modules WHERE factory_id = ?`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    return res.status(200).json(result);
  });
});

api.get("/factory/:factoryId/finedust", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const query = `SELECT module_id, module_name, last_update, last_pm1_0 as finedust FROM sensor_modules WHERE factory_id = ?`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    return res.status(200).json(result);
  });
});

api.get("/factory/:factoryId/workers", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);

  const query = `
    SELECT
      w.watch_id,
      w.last_sync,
      CASE
        WHEN w.last_battery_level BETWEEN 2.7 AND 4.2 THEN
          ROUND(((w.last_battery_level - 2.7) / (4.2 - 2.7)) * 100)
        ELSE
          NULL
      END AS adjusted_battery_level,
      w.last_heart_rate,
      w.last_body_temperature,
      w.last_oxygen_saturation,
      w.last_battery_level,
      w.last_tvoc,
      w.last_co2,
      u.name,
      w.last_sync
    FROM
      watches w
    JOIN
      users u ON w.user_id = u.user_id
    WHERE
      u.factory_id = ?;
  `;

  // 쿼리 실행
  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 현재 시간
    const currentTime = new Date();

    // 30초 미만이면 online: true, 그 외에는 online: false로 설정
    const updatedResult = result.map((user) => ({
      ...user,
      online: Math.abs(currentTime - new Date(user.last_sync)) < 30000,
      // online: true,
      work_level: calclevel(
        calcWorkLoadIndex(user.last_heart_rate, 0, 0),
        calcEnviromentIndex(user.last_tvoc, user.last_co2, 0, 0, 0)
      ).level,
    }));

    // 결과를 JSON 형식으로 응답
    return res.status(200).json(updatedResult);
  });
});

api.get("/factory/:factoryId/airwatches", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const query = `SELECT name, watch_id FROM users WHERE factory_id = ?;`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    return res.status(200).json(result);
  });
});

api.get("/airwatchdata", (req, res) => {
  let watchId = req.query.watch;
  let userName = req.query.name;
  let factoryId = req.query.factoryId;
  let start = req.query.start;
  let end = req.query.end;

  if (watchId == "전체" || userName == "전체") {
    watchId = "";
    userName = "";
  }

  if (!watchId && !userName && !factoryId) {
    return res
      .status(400)
      .send("One of watchId, userName, and factoryId is required.");
  }

  if (!start || !end) {
    return res.status(400).send("Date range value does not exist");
  }

  let query = `SELECT name, device_id, heart_rate, body_temperature, oxygen_saturation, tvoc, co2, battery_level, timestamp
               FROM watch_data w 
               JOIN users u ON w.user_id = u.user_id
               WHERE timestamp >= ? AND timestamp <= ?`;
  let queryParams = [start, end];

  if (watchId) {
    query += ` AND device_id = ?`;
    queryParams.push(watchId);
  }
  if (userName) {
    query += ` AND u.name = ?`;
    queryParams.push(userName);
  }
  if (factoryId) {
    query += ` AND u.factory_id = ?`;
    queryParams.push(factoryId);
  }

  connection.query(query, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.get("/factory/:factoryId/airwalls", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const query = `SELECT module_name FROM sensor_modules WHERE factory_id = ?;`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    return res.status(200).json(result);
  });
});

api.get("/airwalldata", (req, res) => {
  let moduleName = req.query.name;
  let factoryId = req.query.factoryId;
  let start = req.query.start;
  let end = req.query.end;

  if (moduleName == "전체") {
    moduleName = "";
  }

  if (!moduleName && !factoryId) {
    return res.status(400).send("One of moduleName and factoryId is required.");
  }

  if (!start || !end) {
    return res.status(400).send("Date range value does not exist");
  }

  let query = `SELECT module_name, temperature, tvoc, co2, pm1_0, pm2_5, pm10, timestamp
               FROM sensor_data d 
               JOIN sensor_modules m ON d.sensor_module_id = m.module_id
               WHERE timestamp >= ? AND timestamp <= ?`;
  let queryParams = [start, end];

  if (moduleName) {
    query += ` AND m.module_name = ?`;
    queryParams.push(moduleName);
  }
  if (factoryId) {
    query += ` AND m.factory_id = ?`;
    queryParams.push(factoryId);
  }

  connection.query(query, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

module.exports = api;
