const express = require("express");
const session = require("express-session");
const api = express.Router();
const path = require("path");
const fs = require("fs");
const { connection, sessionOption } = require("../database/KICT");
const bcrypt = require("bcrypt");

let MySQLStore = require("express-mysql-session")(session);
let sessionStore = new MySQLStore(sessionOption);
api.use(
  session({
    key: "session_cookie_name",
    secret: "~",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

/* -------------------로그인 api----------------------- */
api.post("/KICT/signup", (req, res) => {
  // 데이터 받아서 결과 전송
  const id = req.body.id;
  const password = req.body.password;
  const name = req.body.name;

  const sendData = { isSuccess: "" };

  console.log(id, password);

  if (id && password) {
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [id],
      (error, results) => {
        // DB에 같은 이름의 회원아이디가 있는지 확인
        if (error) throw error;
        if (results.length <= 0) {
          // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우
          const hasedPassword = bcrypt.hashSync(password, 10); // 입력된 비밀번호를 해시한 값
          connection.query(
            "INSERT INTO user (id, password, name) VALUES(?,?,?)",
            [id, hasedPassword, name],
            (error) => {
              if (error) throw error;
              req.session.save(function () {
                sendData.isSuccess = true;
                // console.log("저장성공");
                res.send(sendData);
              });
            }
          );
        } else {
          // DB에 같은 이름의 회원아이디가 있는 경우
          sendData.isSuccess = "이미 존재하는 아이디 입니다!";
          res.send(sendData);
        }
      }
    );
  } else {
    sendData.isSuccess = "아이디와 비밀번호를 입력하세요!";
    res.send(sendData);
  }
});

api.post("/KICT/login", (req, res) => {
  // 데이터 받아서 결과 전송
  const id = req.body.id;
  const password = req.body.password;
  const sendData = {
    isLogin: "",
    user: { id: "", name: "", role: "" },
  };

  if (id && password) {
    // id와 pw가 입력되었는지 확인
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [id],
      function (error, results) {
        if (error) throw error;
        if (results.length > 0) {
          // db에서의 반환값이 있다 = 일치하는 아이디가 있다.
          bcrypt.compare(password, results[0].password, (err, result) => {
            // 입력된 비밀번호가 해시된 저장값과 같은 값인지 비교
            if (result === true) {
              // 비밀번호가 일치하면
              req.session.is_logined = true; // 세션 정보 갱신

              const user = {
                id: results[0].id,
                name: results[0].name,
                role: results[0].role,
              };
              req.session.user = user;
              // req.session.name = results[0].name;

              req.session.save(function () {
                sendData.isLogin = true;
                sendData.user = user;
                res.send(sendData);
              });
            } else {
              // 비밀번호가 다른 경우
              sendData.isLogin = "로그인 정보가 일치하지 않습니다.";
              res.send(sendData);
            }
          });
        } else {
          // db에 해당 아이디가 없는 경우
          sendData.isLogin = "아이디 정보가 일치하지 않습니다.";
          res.send(sendData);
        }
      }
    );
  } else {
    // 아이디, 비밀번호 중 입력되지 않은 값이 있는 경우
    sendData.isLogin = "아이디와 비밀번호를 입력하세요!";
    res.send(sendData);
  }
});

api.get("/KICT/logout", (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/KICT/");
  });
});

api.get("/KICT/authcheck", (req, res) => {
  const sendData = {
    isLogin: false,
    user: { id: "", name: "", role: "" },
  };
  if (req.session.is_logined) {
    sendData.isLogin = true;
    sendData.user = req.session.user;
  }
  res.send(sendData);
});

/* -------------------일반 api----------------------- */
api.get("/image/KICT/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const img = path.join(__dirname, "../images/labeling/KICT", imageName);

  // 이미지 파일이 존재하는지 확인
  if (fs.existsSync(img)) {
    return res.sendFile(img);
  } else {
    return res.status(404).send("Image not found");
  }
});

api.get("/KICT/origin", (req, res) => {
  let originId = req.query.originId;

  if (!originId || originId == "null" || originId == "undefined")
    return res.status(200).json({ message: "missing originId" });

  const query = `SELECT * FROM origin_view
                  WHERE id = ?;`;

  connection.query(query, [originId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result[0] || { message: "Invalid originId!" });
  });
});

api.post("/KICT/origin", (req, res) => {
  let userId = req.query.userId;

  if (!userId || userId === "null" || userId === "undefined")
    return res.status(400).send("userId field is required.");

  // 유저가 작업 중인 origin_image의 진행율 조회
  const progressQuery = `
    SELECT progress_percentage
    FROM origin_view
    WHERE labeler = ?
  `;

  connection.query(
    progressQuery,
    [userId],
    (progressError, progressResults) => {
      if (progressError) {
        console.log(progressError);
        return res.status(500).send("Internal Server Error!");
      }

      // 진행율이 모두 99% 이상인지 확인
      const allProgressComplete = progressResults.every(
        (row) => row.progress_percentage >= 99
      );

      if (!allProgressComplete) {
        return res.status(200).json({
          message:
            "보유한 모든 이미지의 라벨링이 끝나야 새로운 이미지를 할당받을 수 있습니다.",
        });
      }

      // null labeler를 가진 origin_image 레코드 중 하나의 id를 가져오기
      const selectQuery = `
      SELECT id 
      FROM origin_image 
      WHERE labeler IS NULL 
      LIMIT 1
    `;

      connection.query(selectQuery, [], (selectError, selectResult) => {
        if (selectError) {
          console.log(selectError);
          return res.status(500).send("Internal Server Error!");
        }

        if (selectResult.length === 0) {
          return res
            .status(200)
            .json({ message: "더 이상 불러올 이미지가 없습니다." });
        }

        const originId = selectResult[0].id;

        // 해당 origin_image 레코드를 업데이트하여 userId와 현재 시간 설정하기
        const updateQuery = `
        UPDATE origin_image 
        SET labeler = ?, start_time = NOW() 
        WHERE id = ?;
        UPDATE user
        SET last_origin = ?
        WHERE id = ?;
      `;

        connection.query(
          updateQuery,
          [userId, originId, originId, userId],
          (updateError, updateResult) => {
            if (updateError) {
              console.log(updateError);
              return res.status(500).send("Internal Server Error!");
            }

            return res.status(200).json({ originId: originId });
          }
        );
      });
    }
  );
});

api.get("/KICT/progress", (req, res) => {
  let userId = req.query.userId;
  let role = req.query.role;

  if (!userId) {
    return res.status(400).send("userId field is required.");
  }

  // 첫 번째 쿼리: labeler 테이블에서 유저 정보 가져오기
  let labelerQuery = `
    SELECT 
      id, name, last_origin 
    FROM 
      user 
    WHERE 
      id = ?
  `;

  connection.query(labelerQuery, [userId], (error, labelerResult) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    if (labelerResult.length === 0) {
      return res.status(404).json({ message: "Unknown id" });
    }

    let labeler = labelerResult[0];

    // 두 번째 쿼리: origin_image 테이블에서 라벨링한 오리진 리스트 가져오기
    let originImageQuery = `
      SELECT 
        id AS origin_id, 
        file_name,
        start_time, progress_percentage
      FROM 
        origin_view 
      WHERE 
        labeler = ?
      ORDER BY 
        start_time DESC
    `;

    if (role == "admin") {
      originImageQuery = `
      SELECT 
        id AS origin_id, 
        file_name,
        start_time, labeler, progress_percentage
      FROM 
        origin_view 
      WHERE 
        labeler IS NOT NULL
      ORDER BY 
        start_time DESC
    `;
    }

    connection.query(originImageQuery, [userId], (error, originImageResult) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }

      let labeledOrigins = originImageResult.map((item) => ({
        origin_id: item.origin_id,
        file_name: item.file_name,
        start_time: item.start_time,
        labeler: item.labeler,
        progress_percentage: item.progress_percentage,
      }));

      return res.status(200).json({
        labeler_id: labeler.id,
        name: labeler.name,
        last_origin_id: labeler.last_origin,
        labeled_origins: labeledOrigins,
      });
    });
  });
});

api.put("/KICT/progress", (req, res) => {
  let userId = req.query.userId;
  let originId = req.query.originId;

  if (!userId || userId == "null" || userId == "undefined")
    return res.status(400).send("userId field is required.");

  if (!originId || originId == "null" || originId == "undefined")
    return res.status(400).send("originId field is required.");

  const query = `UPDATE user 
                  SET last_origin = ?
                  WHERE id = ?`;

  connection.query(query, [originId, userId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json({ message: "Update successfully" });
  });
});

api.post("/KICT/fragment", (req, res) => {
  let originId = req.body.originId;
  let x = parseInt(req.body.x);
  let y = parseInt(req.body.y);
  let size = parseInt(req.body.size);
  let class_info = req.body.class;

  if (!originId || originId == "null" || originId == "undefined")
    return res.status(400).send("originId field is required.");

  if (isNaN(x) || isNaN(y) || isNaN(size) || !class_info) {
    return res.status(400).send("x, y, size, class field is required.");
  }

  const query = `INSERT INTO fragment VALUES(?,?,?,?, ?,?,?,?,?,?)
                  ON DUPLICATE KEY UPDATE
                  class1 = ?,
                  class2 = ?,
                  class3 = ?,
                  class4 = ?,
                  class5 = ?,
                  class0 = ?;`;

  connection.query(
    query,
    [
      originId,
      x,
      y,
      size,
      class_info[0],
      class_info[1],
      class_info[2],
      class_info[3],
      class_info[4],
      class_info[5],
      class_info[0],
      class_info[1],
      class_info[2],
      class_info[3],
      class_info[4],
      class_info[5],
    ],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }
      return res.status(200).json({ message: "Update successfully" });
    }
  );
});

api.get("/KICT/fragments", (req, res) => {
  let originId = req.query.originId;

  if (!originId || originId == "null" || originId == "undefined")
    return res.status(200).json({ message: "missing originId" });

  const query = `SELECT * FROM fragment
                  WHERE origin_id = ?;`;

  connection.query(query, [originId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json(result);
  });
});

api.delete("/KICT/fragment", (req, res) => {
  let originId = req.query.originId;
  let x = parseInt(req.query.x);
  let y = parseInt(req.query.y);
  let size = parseInt(req.query.size);

  if (!originId || originId == "null" || originId == "undefined")
    return res.status(400).send("originId field is required.");

  if (isNaN(x) || isNaN(y) || isNaN(size)) {
    return res.status(400).send("x, y, size, class field is required.");
  }

  const query = `DELETE FROM fragment 
                  WHERE origin_id = ?
                    AND x = ?
                    AND y = ?
                    AND size = ?;
                  ;`;

  connection.query(query, [originId, x, y, size], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json({ message: "Delete successfully" });
  });
});

api.post("/KICT/fragment/reset", (req, res) => {
  let originId = req.body.originId;

  const query = `DELETE FROM fragment WHERE origin_id = ? AND class0 != 1`;

  connection.query(query, [originId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json({ message: "Reset successfully" });
  });
});

api.post("/KICT/elapsedTime", (req, res) => {
  let originId = req.body.originId;
  let elapsedTime = req.body.elapsedTime;

  if (!originId || originId == "null" || originId == "undefined")
    return res.status(400).send("originId field is required.");

  const query = `UPDATE origin_image 
                  SET elapsed_time = ?
                  WHERE id = ?;`;

  connection.query(query, [elapsedTime, originId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.status(200).json({ message: "Update successfully" });
  });
});

module.exports = api;
