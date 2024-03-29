const express = require("express");
const api = express.Router();
const connection = require("../database/apiConnection.js");
const connection2 = require("../database/mysql.js");
const path = require("path");
const fs = require("fs");
const {
  calcWorkLoadIndex,
  calcEnviromentIndex,
  calclevel,
} = require("../util/logic.js");

api.get("/image/:imageName", (req, res) => {
  const { imageName } = req.params;
  // 이미지 파일의 경로 설정 (images 폴더 내에 이미지 파일이 있어야 함)
  const imagePath = path.join(__dirname, "../images", imageName);
  const defaultPath = path.join(__dirname, "../images/factory_default.png");

  // 이미지 파일이 존재하는지 확인
  if (fs.existsSync(imagePath)) {
    // 이미지 파일을 읽어 응답으로 전송
    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error("이미지 파일을 읽어오지 못했습니다.", err);
        return res.status(404).send("이미지를 찾을 수 없습니다.");
      }
    });
  } else {
    // 이미지 파일을 찾을 수 없을 때 기본 이미지를 응답으로 보냅니다.
    res.sendFile(defaultPath, (err) => {
      if (err) {
        console.error("기본 이미지 파일을 읽어오지 못했습니다.", err);
        return res.status(404).send("이미지를 찾을 수 없습니다.");
      }
    });
  }
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
  const query = `SELECT module_id, module_name, last_update, last_tvoc as tvoc, module_description 
  FROM sensor_modules 
  WHERE factory_id = ? AND enable = 1`;

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
  const query = `SELECT module_id, module_name, last_update, last_co2 as co2, module_description 
  FROM sensor_modules 
  WHERE factory_id = ? AND enable = 1`;

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
  const query = `SELECT module_id, module_name, last_update, last_temperature as temperature, module_description 
  FROM sensor_modules 
  WHERE factory_id = ? AND enable = 1`;

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
  const query = `SELECT module_id, module_name, last_update, last_pm1_0 as finedust, module_description 
  FROM sensor_modules 
  WHERE factory_id = ? AND enable = 1`;

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
      u.watch_id,
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
      u.name, u.user_id,
      w.last_sync
    FROM
       users u
    LEFT JOIN
      watches w ON w.watch_id = u.watch_id
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

api.get("/factory/logs", (req, res) => {
  let id = req.query.id;
  let start = req.query.start;
  let end = req.query.end;

  let query = ``;

  if (!start || !end || !id) {
    query += `SELECT DISTINCT ID FROM sensor_data ORDER BY CAST(ID AS SIGNED) ASC;`;
    connection2.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }

      return res.status(200).json(result);
    });
  } else {
    query += `SELECT * FROM sensor_data WHERE CREATED_AT >= ? AND CREATED_AT <= ?`;
    let queryParams = [start, end];

    if (id && id != "전체") {
      query += ` AND id = ?`;
      queryParams.push(id);
    }

    query += ` ORDER BY CREATED_AT DESC;`;

    connection2.query(query, queryParams, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }

      return res.status(200).json(result);
    });
  }
});

api.get("/user/:userId/info", (req, res) => {
  const userId = parseInt(req.params.userId);

  const query = `
    SELECT
      u.user_id, u.name, w.watch_id, w.last_sync, w.level
    FROM
    users u
    LEFT JOIN
    watches w ON w.watch_id = u.watch_id
    WHERE
      u.user_id = ?;
  `;

  connection.query(query, [userId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result[0]);
  });
});

api.get("/user/:userId/heartrate", (req, res) => {
  const userId = parseInt(req.params.userId);
  let start = req.query.start;
  let end = req.query.end;
  let timeSlot = req.query.timeSlot;

  let queryParams = [userId];

  let query = ``;

  if (start && end) {
    queryParams.push(start, end);
    query += `
      SELECT
        heart_rate as heartrate, timestamp
      FROM
        watch_data w
      JOIN
        users u ON w.user_id = u.user_id
      WHERE
        u.user_id = ? AND timestamp >= ? AND timestamp <= ? AND w.heart_rate != ".ING.";
      `;
  } else {
    if (!timeSlot) timeSlot = 90;
    queryParams.push(timeSlot);
    query += `
      SELECT
        heart_rate as heartrate, timestamp
      FROM
        watch_data w
      JOIN
        users u ON w.user_id = u.user_id
      WHERE
        u.user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE) AND w.heart_rate != ".ING.";
      `;
  }

  connection.query(query, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.get("/user/:userId/temperature", (req, res) => {
  const userId = parseInt(req.params.userId);
  let start = req.query.start;
  let end = req.query.end;
  let timeSlot = req.query.timeSlot;

  let queryParams = [userId];

  let query = ``;

  if (start && end) {
    queryParams.push(start, end);
    query += `
      SELECT
        body_temperature as temperature, timestamp
      FROM
        watch_data w
      JOIN
        users u ON w.user_id = u.user_id
      WHERE
        u.user_id = ? AND timestamp >= ? AND timestamp <= ?;
      `;
  } else {
    if (!timeSlot) timeSlot = 90;
    queryParams.push(timeSlot);
    query += `
      SELECT
        body_temperature as temperature, timestamp
      FROM
        watch_data w
      JOIN
        users u ON w.user_id = u.user_id
      WHERE
        u.user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE);
      `;
  }

  connection.query(query, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.get("/user/:userId/oxygen", (req, res) => {
  const userId = parseInt(req.params.userId);
  let start = req.query.start;
  let end = req.query.end;
  let timeSlot = req.query.timeSlot;

  let queryParams = [userId];

  let query = ``;

  if (start && end) {
    queryParams.push(start, end);
    query += `
      SELECT
      oxygen_saturation as oxygen, timestamp
      FROM
        watch_data w
      JOIN
        users u ON w.user_id = u.user_id
      WHERE
        u.user_id = ? AND timestamp >= ? AND timestamp <= ? AND w.oxygen_saturation != ".ING.";
      `;
  } else {
    if (!timeSlot) timeSlot = 90;
    queryParams.push(timeSlot);
    query += `
      SELECT
      oxygen_saturation as oxygen, timestamp
      FROM
        watch_data w
      JOIN
        users u ON w.user_id = u.user_id
      WHERE
        u.user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE) AND w.oxygen_saturation != ".ING.";
      `;
  }

  connection.query(query, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.get("/settings/:factoryId/airwalls", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);

  query = `SELECT module_id, module_name, module_description, enable
            FROM sensor_modules
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
    "UPDATE sensor_modules SET module_name = ?, module_description = ?, enable = ? WHERE factory_id = ? AND module_id = ?";

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
            FROM watches
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

  query = `SELECT user_id, name, role, gender, watch_id
            FROM users
            WHERE factory_id = ?`;

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

  const query = "UPDATE users SET watch_id = ? WHERE user_id = ?";

  // 모든 업데이트 작업을 순차적으로 처리
  updatedData.forEach((item) => {
    connection.query(query, [item.watch_id, item.user_id], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }
    });
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
  const env =
    req.params.env == "finedust" ? "pm1_0 AS finedust" : req.params.env;
  let factoryId = req.query.factoryId;
  let date = req.query.date;
  let timeSlot = req.query.timeSlot;

  if (!factoryId) return res.status(400).send("factory id is necessary");

  let queryParams = [factoryId];

  // 파티션 존재 여부를 확인하는 쿼리
  const checkPartitionQuery = `
          SELECT
            COUNT(*) as count
          FROM
            information_schema.partitions
          WHERE
            table_schema = 'factorymanagement' AND
            table_name = 'sensor_data' AND
            partition_name = ?;
          `;

  // 파티션 이름 생성
  const partitionName = "p" + date?.replaceAll("/", "").replaceAll("-", "");

  // 파티션 존재 여부 확인
  connection.query(checkPartitionQuery, [partitionName], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 파티션이 존재하지 않는 경우
    if (!timeSlot && result[0].count === 0) {
      return res.status(200).json([]);
    }
    // 파티션이 존재하는 경우, 원래 쿼리 실행
    let query = ``;
    if (date) {
      queryParams.push(date);
      query += `
    SELECT
    s.${env}, s.timestamp, m.module_name
    FROM
      sensor_data PARTITION(${partitionName}) s 
    JOIN
      sensor_modules m ON s.sensor_module_id = m.module_id
    WHERE
      s.factory_id = ?;
    `;
    } else {
      if (!timeSlot) timeSlot = 90;
      queryParams.push(timeSlot);
      query += `
    SELECT
    s.${env}, s.timestamp, m.module_name
    FROM
      sensor_data s 
    JOIN
      sensor_modules m ON s.sensor_module_id = m.module_id
    WHERE
      s.factory_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE);
    `;
    }

    connection.query(query, queryParams, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }
      return res.status(200).json(result);
    });
  });
});

module.exports = api;
