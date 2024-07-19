const express = require("express");
const api = express.Router();
// const connection = require("../database/apiConnection.js");
const connection = require("../database/mysql");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/factory");
  },
  filename: function (req, file, cb) {
    // 확장자를 포함한 고유한 파일명 생성
    const fileExtension = path.extname(file.originalname);
    const fileName = uuidv4() + fileExtension; // 예: 'xxxx-xxxx-xxxx-xxxx.png'
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });
const {
  calcWorkLoadIndex,
  calcEnviromentIndex,
  calclevel,
  generateRandomCode,
} = require("../util/util.js");

api.get("/image/profile/:imagePath", (req, res) => {
  const imagePath = req.params.imagePath;
  const fullPath = path.join(__dirname, "../images/profile", imagePath);
  const defaultProfilePath = path.join(
    __dirname,
    "../images/profile",
    "profile_default.png"
  );

  // 이미지 파일이 존재하는지 확인
  if (fs.existsSync(fullPath)) {
    return res.sendFile(fullPath);
  } else {
    return res.sendFile(defaultProfilePath);
  }
});

api.get("/image/factory/:imagePath", (req, res) => {
  const imagePath = req.params.imagePath;
  const fullPath = path.join(__dirname, "../images/factory", imagePath);
  const defaultFactoryPath = path.join(
    __dirname,
    "../images/factory",
    "factory_default.png"
  );

  // 이미지 파일이 존재하는지 확인
  if (fs.existsSync(fullPath)) {
    return res.sendFile(fullPath);
  } else {
    return res.sendFile(defaultFactoryPath);
  }
});

api.post("/factory", upload.single("image"), (req, res) => {
  const filePath = req.file
    ? `factory/${req.file.filename}`
    : "factory/default";
  const code = generateRandomCode(7);
  const { name, location, industry, contact, manager } = req.body;

  const query = `INSERT INTO factories(factory_name, location, join_date,
                           industry, contact_number, factory_image_url, manager, code)
                 VALUES (?, ?, NOW(), ?, ?, ?, ?, ?);`;

  const queryParams = [
    name,
    location,
    industry,
    contact,
    filePath,
    manager,
    code,
  ];

  if (!name) return res.status(500).send("Factory name is must be filled!");

  connection.query(query, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json({
      message: "Factory added successfully",
      factoryCode: code,
      result,
    });
  });
});

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
  const query = `SELECT factory_name, code FROM factories WHERE factory_id = ?`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    return res.status(200).json(result[0]);
  });
});

api.get("/factory/:factoryId/airwalls", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);

  const query = `SELECT aw.module_id,
                         aw.module_name,
                         aw.last_update,
                         aw.last_tvoc as tvoc,
                         aw.last_co2 as co2,
                         aw.last_temperature as temperature,
                         aw.last_pm10 as pm10,
                         aw.last_pm2_5 as pm2_5,
                         aw.last_humid as humid,
                         aw.last_env_index as env_index,
                         aw.module_description,
                         aw.type,
                         CASE 
                           WHEN aw.last_update >= DATE_SUB(NOW(), INTERVAL 3 MINUTE) THEN true
                           ELSE false
                         END as isOnline,
                         (SELECT COUNT(*) 
                          FROM users u 
                          WHERE u.airwall_id = aw.module_id) as num_of_workers,
                          (SELECT COUNT(*) 
                          FROM users u 
                          LEFT JOIN airwatch awat ON awat.watch_id = u.watch_id
                          WHERE u.airwall_id = aw.module_id
                          AND awat.last_wear = 1
                          AND awat.last_sync >= DATE_SUB(NOW(), INTERVAL 30 SECOND)) as num_of_online_workers
                  FROM airwall aw
                  WHERE aw.factory_id = ? AND aw.enable = 1
                  ORDER BY aw.module_name`;

  connection.query(query, [factoryId], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    return res.status(200).json(results);
  });
});

api.get("/factory/:factoryId/workers", async (req, res) => {
  const factoryId = parseInt(req.params.factoryId);

  const query = `
    SELECT
      u.name, u.user_id,
      u.watch_id, 
      u.profile_image_path,
      u.gender,
      aw.module_name AS airwall_name,
      u.airwall_id,
      w.last_sync,
      w.last_heart_rate,
      w.last_body_temperature,
      w.last_oxygen_saturation,
      w.last_battery_level,
      w.last_tvoc,
      w.last_co2,
      w.last_sync,
      u.last_workload AS workload,
      w.last_health_index AS health_index,
      w.last_wear
    FROM
       users u
    LEFT JOIN
      airwall aw ON aw.module_id = u.airwall_id
    LEFT JOIN
      airwatch w ON w.watch_id = u.watch_id
    WHERE
      u.factory_id = ?;
  `;

  connection.query(query, [factoryId], async (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 현재 시간
    const currentTime = new Date();

    // work_load 예측 비동기 처리
    const promises = result.map(async (user) => {
      return {
        ...user,
        online: Math.abs(currentTime - new Date(user.last_sync)) < 30000,
      };
    });

    try {
      const updatedResult = await Promise.all(promises);
      return res.status(200).json(updatedResult);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
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
               FROM airwatch_data w 
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

  query += ` ORDER BY timestamp DESC`;

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
  const query = `SELECT module_name FROM airwall WHERE factory_id = ?;`;

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
               FROM airwall_data d 
               JOIN airwall m ON d.sensor_module_id = m.module_id
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

  query += ` ORDER BY timestamp DESC`;

  connection.query(query, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.get("/factory/logs", (req, res) => {
  let id = req.query.id;
  let start = req.query.start;
  let end = req.query.end;

  let query = ``;

  if (!start || !end || !id) {
    query += `SELECT DISTINCT ID FROM raw_data ORDER BY CAST(ID AS SIGNED) ASC;`;
    connection.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }

      return res.status(200).json(result);
    });
  } else {
    query += `SELECT * FROM raw_data WHERE CREATED_AT >= ? AND CREATED_AT <= ?`;
    let queryParams = [start, end];

    if (id && id != "전체") {
      query += ` AND id = ?`;
      queryParams.push(id);
    }

    query += ` ORDER BY CREATED_AT DESC;`;

    connection.query(query, queryParams, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }

      return res.status(200).json(result);
    });
  }
});

api.get("/settings/:factoryId/airwalls", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);

  query = `SELECT module_id, module_name, module_description, enable
            FROM airwall
            WHERE factory_id = ?`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.put("/settings/:factoryId/airwalls", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const updatedData = req.body; // 클라이언트가 보낸 업데이트할 데이터

  // 업데이트 쿼리 예시 (구체적인 필드와 조건은 데이터베이스에 맞게 조정 필요)
  const query =
    "UPDATE airwall SET module_name = ?, module_description = ?, enable = ? WHERE factory_id = ? AND module_id = ?";

  // 모든 업데이트 작업을 순차적으로 처리
  updatedData.forEach((item) => {
    connection.query(
      query,
      [
        item.module_name,
        item.module_description,
        item.enable,
        factoryId,
        item.module_id,
      ],
      (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Internal Server Error!");
        }
        // 결과 처리
      }
    );
  });

  // 모든 업데이트가 성공적으로 완료된 후 응답
  return res.status(200).send("Update successful!");
});

api.get("/settings/:factoryId/watchlist", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);

  query = `SELECT watch_id
            FROM airwatch
            WHERE factory_id = ?`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.get("/settings/:factoryId/airwalllist", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);

  query = `SELECT module_id AS airwall_id, module_name
            FROM airwall
            WHERE factory_id = ?`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.get("/settings/:factoryId/workers", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);

  query = `SELECT user_id, name, gender, watch_id, u.airwall_id, a.module_name, u.profile_image_path
            FROM users u
            LEFT JOIN airwall a ON u.airwall_id = a.module_id
            WHERE u.factory_id = ?`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.put("/settings/:factoryId/workers", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const updatedData = req.body; // 클라이언트가 보낸 업데이트할 데이터

  const query =
    "UPDATE users SET watch_id = ?, airwall_id = ? WHERE user_id = ?";

  // 모든 업데이트 작업을 순차적으로 처리
  updatedData.forEach((item) => {
    connection.query(
      query,
      [item.watch_id, item.airwall_id, item.user_id],
      (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Internal Server Error!");
        }
      }
    );
  });

  // 모든 업데이트가 성공적으로 완료된 후 응답
  return res.status(200).send("Update successful!");
});

api.get("/factory/:factoryId/confirms", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);

  query = `SELECT u.id, u.name, u.gender, u.date_of_birth, u.phone_number, u.join_date
            FROM users u
            JOIN factories f ON f.code = u.code
            WHERE f.factory_id = ? AND u.authority = 0`;

  connection.query(query, [factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.put("/confirms/allow/:userId", (req, res) => {
  const userId = req.params.userId;

  // 첫 번째 쿼리: 사용자에 대한 factory_id 가져오기
  const query = `SELECT f.factory_id
                 FROM users u
                 JOIN factories f ON f.code = u.code
                 WHERE u.id = ?`;

  connection.query(query, [userId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 결과 확인
    if (result.length > 0) {
      const factoryId = result[0].factory_id;

      // 두 번째 쿼리: 사용자의 factory_id 설정 및 code와 authority 업데이트
      const query2 = `UPDATE users
                      SET factory_id = ?, code = NULL, authority = 2
                      WHERE id = ?`;

      connection.query(query2, [factoryId, userId], (error, updateResult) => {
        if (error) {
          console.error(error);
          return res.status(500).send("Internal Server Error!");
        }

        // 성공적으로 업데이트 완료
        return res.status(200).send("User has been successfully updated.");
      });
    } else {
      // 사용자에 대한 factory_id를 찾을 수 없음
      return res.status(404).send("Factory ID not found for the user.");
    }
  });
});

api.put("/confirms/reject/:userId", (req, res) => {
  const userId = req.params.userId;

  // 첫 번째 쿼리: 사용자에 대한 factory_id 가져오기
  const query = `UPDATE users
                SET authority = 1
                WHERE id = ?`;

  connection.query(query, [userId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error!");
    }
  });
  return res.status(200).send("User has been successfully updated.");
});

api.get("/airwalldata/:env", (req, res) => {
  const validEnvs = {
    pm10: "pm10",
    tvoc: "tvoc",
    co2: "co2",
    temperature: "temperature",
    humid: "humid",
    pm2_5: "pm2_5",
  };

  const rawEnv = req.params.env;
  const env = validEnvs[rawEnv];

  if (!env) {
    return res.status(400).send("Invalid env parameter");
  }

  const factory_id = req.query.factoryId;
  const date = req.query.date;
  const timeSlot = req.query.timeSlot || 30;

  let query = "";
  let queryParams = [];

  if (date) {
    query = `SELECT ${env}, timestamp, a.module_name
               FROM airwall_data d
               JOIN airwall a ON a.module_id = d.sensor_module_id
               WHERE DATE(timestamp) = ? AND d.factory_id = ? AND a.enable = 1`;
    queryParams.push(date);
  } else {
    query = `SELECT ${env}, timestamp, a.module_name
               FROM airwall_data d
               JOIN airwall a ON a.module_id = d.sensor_module_id
               WHERE timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE) AND d.factory_id = ? AND a.enable = 1`;
    queryParams.push(timeSlot);
  }
  queryParams.push(factory_id);

  connection.query(query, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.get("/index/env/:moduleId", (req, res) => {
  const moduleId = req.params.moduleId;
  const minute = parseInt(req.query.minute) || 300;
  const slot = parseInt(req.query.slot) || 20;

  const currentTime = new Date();

  // minute 단위로 계산하여 시작 시간 구하기
  const startTime = new Date(
    currentTime.getTime() - minute * 60 * 1000 + 9 * 60 * 60 * 1000
  );
  const formattedStartTime = startTime
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  let query = `
    SELECT 
      DATE_FORMAT(timestamp, '%Y-%m-%d %H:') AS time_slot,
      FLOOR(MINUTE(timestamp) / ?) AS slot,
      AVG(value) AS avg_value
    FROM Index_env
    WHERE module_id = ? AND timestamp >= ?
    GROUP BY time_slot, slot
    ORDER BY time_slot, slot
  `;

  connection.query(
    query,
    [slot, moduleId, formattedStartTime],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }

      const formattedResult = result.map((row) => {
        const hourMinute =
          row.time_slot + (row.slot * slot).toString().padStart(2, "0");
        return { x: hourMinute, y: row.avg_value };
      });

      return res.status(200).json(formattedResult);
    }
  );
});

api.get("/:moduleId/workers", (req, res) => {
  const moduleId = req.params.moduleId;

  let query = `
    SELECT name, last_workload, a.last_heart_rate, a.last_body_temperature, a.last_oxygen_saturation, a.last_health_index, profile_image_path,
      CASE 
        WHEN TIMESTAMPDIFF(MINUTE, a.last_sync, NOW()) <= 1 THEN true 
        ELSE false 
      END AS isOnline
    FROM users u 
    LEFT JOIN airwatch a ON u.watch_id = a.watch_id
    WHERE u.airwall_id = ?
  `;

  connection.query(query, [moduleId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    return res.status(200).json(result);
  });
});

module.exports = api;
