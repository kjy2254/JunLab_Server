const express = require("express");
const api = express.Router();
const connection = require("../database/mysql");

api.put("/env", (req, res) => {
  const id = req.body.id;
  const score = req.body.score;
  const labeler = req.body.labeler;

  const query = `UPDATE env_df SET y = ?, label_by = ?, label_time = NOW()
                 WHERE id = ?;`;

  connection.query(query, [score, labeler, id], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    return res.status(200).send("Update Successfully");
  });
});

api.put("/health", (req, res) => {
  const id = req.body.id;
  const score = req.body.score;
  const labeler = req.body.labeler;

  const query = `UPDATE health_df SET y = ?, label_by = ?, label_time = NOW()
                 WHERE id = ?;`;

  connection.query(query, [score, labeler, id], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    return res.status(200).send("Update Successfully");
  });
});

api.get("/progress", (req, res) => {
  const labeler_id = req.query.id;
  const type = req.query.type;
  let table = "";

  if (!labeler_id) {
    return res.status(400).send("ID is necessary");
  }

  if (type === "health") {
    table = "health_df";
  } else if (type === "env") {
    table = "env_df";
  } else {
    return res.status(400).send("Type Error");
  }

  // 테이블 이름을 쿼리에 직접 삽입하기 전에 유효성 검사를 수행합니다.
  const query = `SELECT id, label_time, y 
                 FROM ${table} 
                 WHERE label_by = ?
                 ORDER BY label_time DESC;`;

  connection.query(query, [labeler_id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error!");
    }

    const returnData = { length: result.length, labeled: result };

    return res.status(200).json(returnData);
  });
});

api.get("/data/:id", (req, res) => {
  const id = req.params.id == "undefined" ? undefined : req.params.id;
  const type = req.query.type == "undefined" ? undefined : req.query.type;

  let query = ``;
  const param = [];

  if (id) {
    param.push(parseInt(id));
    query = `
      SELECT e.x AS env_x, h.x AS health_x, e.y AS env_y, h.y AS health_y, w.worker_id, fake_name, age, gender, height, weight, illness, job, smoke, num_of_drink, employment_period, e.id
      FROM health_df h
      JOIN worker w ON h.worker_id = w.worker_id
      JOIN env_df e ON h.id = e.id
      WHERE e.id = ?
    `;
  } else {
    if (!type) return res.status(400).send("ID or Type is required");
    query = `
      SELECT e.x AS env_x, h.x AS health_x, e.y AS env_y, h.y AS health_y, w.worker_id, fake_name, age, gender, height, weight, illness, job, smoke, num_of_drink, employment_period, e.id
      FROM health_df h
      JOIN worker w ON h.worker_id = w.worker_id
      JOIN env_df e ON h.id = e.id
      WHERE ${type === "health" ? "h.y IS NULL" : "e.y IS NULL"}
      ORDER BY rand()
      LIMIT 1;
    `;
  }

  connection.query(query, param, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    if (result.length > 0) {
      try {
        // x 열의 데이터를 JSON 객체로 파싱
        const parsedEnvXData = JSON.parse(result[0].env_x);
        const parsedHealthXData = JSON.parse(result[0].health_x);
        // x 열 데이터 외의 다른 정보를 포함하는 객체 생성
        const additionalData = {
          workerId: result[0].worker_id,
          fakeName: result[0].fake_name,
          age: result[0].age,
          gender: result[0].gender,
          height: result[0].height,
          weight: result[0].weight,
          illness: result[0].illness,
          job: result[0].job,
          smoke: result[0].smoke,
          numOfDrink: result[0].num_of_drink,
          employmentPeriod: result[0].employment_period,
          id: result[0].id,
          health_y: result[0].health_y,
          env_y: result[0].env_y,
        };

        // 최종 반환 객체에 x 열 데이터와 추가 데이터를 모두 포함
        const finalData = {
          ...parsedEnvXData,
          ...parsedHealthXData,
          ...additionalData,
        };

        return res.status(200).json(finalData);
      } catch (parseError) {
        console.error("JSON 파싱 실패:", parseError);
        return res.status(500).send("Error parsing JSON data");
      }
    } else {
      return res.status(404).send("No data found");
    }
  });
});

module.exports = api;
