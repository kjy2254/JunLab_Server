const express = require("express");
const api = express.Router();
const connection = require("../database/mysql");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/profile");
  },
  filename: function (req, file, cb) {
    // 확장자를 포함한 고유한 파일명 생성
    const fileExtension = path.extname(file.originalname);
    const fileName = uuidv4() + fileExtension; // 예: 'xxxx-xxxx-xxxx-xxxx.png'
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

api.get("/:userId/info", (req, res) => {
  const userId = parseInt(req.params.userId);

  if (!userId) return res.status(400).send("Unknown UserId!");

  const query = `
    SELECT
      u.user_id, u.name, a.module_name AS airwall_name, u.watch_id, 
      w.level, u.last_workload AS workload, w.last_health_index AS health_index,
      w.last_health_level AS health_level, w.last_wear, 
        CASE 
          WHEN TIMESTAMPDIFF(MINUTE, last_sync, NOW()) <= 1 THEN TRUE
          ELSE FALSE
        END AS online
    FROM
    users u
    LEFT JOIN
    airwatch w ON w.watch_id = u.watch_id
    LEFT JOIN
    airwall a ON a.module_id = u.airwall_id
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

api.get("/:userId/heartrate", (req, res) => {
  const userId = parseInt(req.params.userId);
  let date = req.query.date;
  let timeSlot = req.query.timeSlot;

  let queryParams = [userId];

  let query = ``;

  if (date) {
    queryParams.push(date);
    query += `
      SELECT
        heart_rate as heartrate, timestamp
      FROM
        airwatch_data
      WHERE
        user_id = ? AND date(timestamp) = ?;
      `;
  } else {
    if (!timeSlot) timeSlot = 30;
    queryParams.push(timeSlot);
    query += `
      SELECT
        heart_rate as heartrate, timestamp
      FROM
        airwatch_data
      WHERE
        user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE);
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

api.get("/:userId/temperature", (req, res) => {
  const userId = parseInt(req.params.userId);
  let date = req.query.date;
  let timeSlot = req.query.timeSlot;

  let queryParams = [userId];

  let query = ``;

  if (date) {
    queryParams.push(date);
    query += `
      SELECT
        body_temperature as temperature, timestamp
      FROM
        airwatch_data
      WHERE
        user_id = ? AND date(timestamp) = ?;
      `;
  } else {
    if (!timeSlot) timeSlot = 30;
    queryParams.push(timeSlot);
    query += `
      SELECT
        body_temperature as temperature, timestamp
      FROM
        airwatch_data
      WHERE
        user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE);
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

api.get("/:userId/oxygen", (req, res) => {
  const userId = parseInt(req.params.userId);
  let date = req.query.date;
  let timeSlot = req.query.timeSlot;

  let queryParams = [userId];

  let query = ``;

  if (date) {
    queryParams.push(date);
    query += `
      SELECT
      oxygen_saturation as oxygen, timestamp
      FROM
        airwatch_data
      WHERE
        user_id = ? AND date(timestamp) = ? AND oxygen_saturation != ".ING.";
      `;
  } else {
    if (!timeSlot) timeSlot = 30;
    queryParams.push(timeSlot);
    query += `
      SELECT
      oxygen_saturation as oxygen, timestamp
      FROM
        airwatch_data
      WHERE
        user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE) AND oxygen_saturation != ".ING.";
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

api.get("/:userId/profile", (req, res) => {
  const userId = parseInt(req.params.userId);

  const query1 = `
    SELECT
    u.user_id, u.name, u.gender, u.email, u.address, u.phone_number, u.factory_id, u.profile_image_path,
    DATE_FORMAT(u.date_of_birth, '%Y-%m-%d') AS date_of_birth,
    f.factory_name, DATE_FORMAT(u.join_date, '%Y-%m-%d') AS join_date,
    u.authority, h.height, h.weight, h.smoke_per_day, h.drink_per_week,
    h.job, h.employment_period, h.illness
    FROM
    users u
    LEFT JOIN
    user_health h ON u.user_id = h.user_id
    LEFT JOIN
    factories f ON u.factory_id = f.factory_id
    WHERE
    u.user_id = ?;
  `;

  connection.query(query1, [userId], (error, results1) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 첫 번째 쿼리 결과가 비어있는지 확인
    if (results1.length === 0) {
      return res.status(404).send({ message: "User not found." });
    }

    // 사용자 정보가 있는 경우, 추가 정보 조회
    const query2 = `SELECT f.factory_name
                    FROM users u
                    LEFT JOIN
                    factories f ON u.manager_of = f.factory_id
                    WHERE u.user_id = ?;`;

    connection.query(query2, [userId], (error, results2) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }

      // 사용자의 관리자 정보가 있는 경우 처리
      const managerOf = results2.length > 0 ? results2[0].factory_name : null;

      const returnData = {
        ...results1[0],
        manager_of: managerOf,
      };

      return res.status(200).json(returnData);
    });
  });
});

api.put("/:userId/profile", upload.single("image"), (req, res) => {
  const userId = parseInt(req.params.userId);
  if (req.file) {
    const newFileName = req.file.filename;
    const selectQuery = `SELECT profile_image_path FROM users WHERE user_id = ?`;
    const updateQuery = `UPDATE users SET profile_image_path = ? WHERE user_id = ?;`;
    const imagePath = `profile/${newFileName}`;

    // 먼저 현재 프로필 이미지 경로 조회
    connection.query(selectQuery, [userId], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }
      if (results.length > 0 && results[0].profile_image_path) {
        // 이전 프로필 이미지 파일 삭제
        if (!results[0].profile_image_path.includes("defalut")) {
          const oldFilePath = path.join(
            __dirname,
            `../images/${results[0].profile_image_path}`
          );
          console.log("oldpath:", oldFilePath);
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.log(`Failed to delete old profile image: ${err}`);
            }
          });
        }
      }
      // 새 프로필 이미지 경로로 업데이트
      connection.query(updateQuery, [imagePath, userId], (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Internal Server Error!");
        }
      });
    });
  }
  const updateUserQuery = `
    UPDATE users SET
    name = ?,
    gender = ?,
    email = ?,
    address = ?,
    phone_number = ?,
    date_of_birth = ?
    WHERE user_id = ?;
  `;

  const toNullable = (value) => {
    return !value || value === "null" ? null : value;
  };

  const userParams = [
    req.body.name,
    req.body.gender,
    req.body.email,
    req.body.address,
    req.body.phone_number,
    toNullable(req.body.date_of_birth),
    userId,
  ];

  connection.query(updateUserQuery, userParams, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    const insertOrUpdateHealthQuery = `
      INSERT INTO user_health
      (user_id, height, weight, smoke_per_day, drink_per_week, job, employment_period, illness)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      height = VALUES(height),
      weight = VALUES(weight),
      smoke_per_day = VALUES(smoke_per_day),
      drink_per_week = VALUES(drink_per_week),
      job = VALUES(job),
      employment_period = VALUES(employment_period),
      illness = VALUES(illness);
    `;

    const healthParams = [
      req.body.user_id,
      toNullable(req.body.height),
      toNullable(req.body.weight),
      toNullable(req.body.smoke_per_day),
      toNullable(req.body.drink_per_week),
      toNullable(req.body.job),
      toNullable(req.body.employment_period),
      toNullable(req.body.illness),
    ];

    connection.query(
      insertOrUpdateHealthQuery,
      healthParams,
      (error, results) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .send("Internal Server Error on updating health info!");
        }

        return res.status(204).send("Profile updated successfully.");
      }
    );
  });
});

api.put("/:userId/airwall", (req, res) => {
  const userId = parseInt(req.params.userId);

  let id = req.query.id;
  if (id == "null") {
    id = null;
  }

  let query = `UPDATE users SET airwall_id = ? WHERE user_id = ?;`;

  connection.query(query, [id, userId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

module.exports = api;
