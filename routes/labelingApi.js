const express = require("express");
const api = express.Router();
const path = require("path");
const fs = require("fs");
const connection = require("../database/KICT");

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

  const query = `SELECT * FROM origin_image
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
      return res.status(200).json({ message: "모든 이미지가 완료되었습니다." });
    }

    const originId = selectResult[0].id;

    // 해당 origin_image 레코드를 업데이트하여 userId와 현재 시간 설정하기
    const updateQuery = `
      UPDATE origin_image 
      SET labeler = ?, start_time = NOW() 
      WHERE id = ?;
      UPDATE labeler
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
});

api.get("/KICT/progress", (req, res) => {
  let userId = req.query.userId;

  if (!userId) {
    return res.status(400).send("userId field is required.");
  }

  // 첫 번째 쿼리: labeler 테이블에서 유저 정보 가져오기
  let labelerQuery = `
    SELECT 
      id, name, last_origin 
    FROM 
      labeler 
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
        file_name 
      FROM 
        origin_image 
      WHERE 
        labeler = ?
      ORDER BY 
        id
    `;

    connection.query(originImageQuery, [userId], (error, originImageResult) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }

      let labeledOrigins = originImageResult.map((item) => ({
        origin_id: item.origin_id,
        file_name: item.file_name,
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

  const query = `UPDATE labeler 
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
  let class_info = parseInt(req.body.class);

  if (!originId || originId == "null" || originId == "undefined")
    return res.status(400).send("originId field is required.");

  if (isNaN(x) || isNaN(y) || isNaN(size) || isNaN(class_info)) {
    return res.status(400).send("x, y, size, class field is required.");
  }

  const query = `INSERT INTO fragment VALUES(?,?,?,?,?)
                  ON DUPLICATE KEY UPDATE
                  size = ?,
                  class = ?;`;

  connection.query(
    query,
    [originId, x, y, size, class_info, size, class_info],
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

module.exports = api;
