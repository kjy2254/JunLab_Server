const express = require("express");
const api = express.Router();
const connection = require("../database/apiConnection");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const util = require("util");
const unlinkAsync = util.promisify(fs.unlink);

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const UUID = uuidv4();
    const newFileName = `${UUID}${fileExtension}`;
    req.UUID = UUID;
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

api.get("/factory/:factoryId/users", (req, res) => {
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
    }));

    // 결과를 JSON 형식으로 응답
    return res.status(200).json(updatedResult);
  });
});

api.get("/factories", (req, res) => {
  const query = "SELECT * FROM factories";

  connection.query(query, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    // 결과를 JSON 형식으로 응답
    return res.status(200).json(result);
  });
});

api.get("/factory/:factoryId", (req, res) => {
  const factoryId = req.params.factoryId;

  // 첫 번째 쿼리: 공장 이름 조회
  const query1 = "SELECT factory_name FROM factories WHERE factory_id = ?";

  // 두 번째 쿼리: 공장에 속한 가장 최근의 센서 모듈 조회
  const query2 = `
        SELECT last_update
        FROM sensor_modules
        WHERE (factory_id, last_update) IN (
            SELECT factory_id, MAX(last_update)
            FROM sensor_modules
            WHERE factory_id = ?
            GROUP BY factory_id
        );
    `;

  connection.query(query1, [factoryId], (error, result1) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    if (result1.length === 0) {
      return res.status(404).send("Factory not found");
    }

    // 공장 이름 결과 가져오기
    const factoryName = result1[0].factory_name;

    // 두 번째 쿼리 실행
    connection.query(query2, [factoryId], (error, result2) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }

      // const last_update = result2[0].last_update;

      // const utcLastUpdate = result2[0].last_update;
      const last_update = new Date(result2[0].last_update).toLocaleString(
        "ko-KR",
        { timeZone: "Asia/Seoul" }
      );

      // 결과를 JSON 형태로 반환
      res.status(200).json({ factoryName, last_update });
    });
  });
});

api.get("/factory/:factoryId/schemes", (req, res) => {
  const factoryId = req.params.factoryId;

  // MySQL 쿼리 작성
  const sql = `
    SELECT * FROM scheme_file WHERE factory_id = ? ORDER BY page ASC;
  `;

  connection.query(sql, [factoryId], (error, results) => {
    if (error) {
      console.error("Error executing MySQL query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // 결과에서 UUID 리스트 추출
    const images = results.map((result) => ({
      imageName: result.name + "." + result.expansion,
      width: result.width,
      height: result.height,
      page: result.page,
      originalImageName: result.original_name + "." + result.expansion,
      schemeName: result.scheme_name,
    }));

    // 결과 반환
    res.json({ images });
  });
});

api.get("/factory/:factoryId/dashboard", (req, res) => {
  const factoryId = req.params.factoryId;

  const query1 = `SELECT
  u.name,
  w.watch_id,
  w.last_sync,
  w.last_heart_rate,
  w.last_body_temperature,
  w.last_oxygen_saturation,
  w.last_battery_level,
  w.last_tvoc AS watch_last_tvoc,
  w.last_co2 AS watch_last_co2
FROM
  users u
JOIN
  watches w ON u.user_id = w.user_id
WHERE
  u.factory_id = 5;

`;

  const query2 = `SELECT
  sm.module_id,
  sm.module_name,
  sm.module_description,
  sm.last_update AS module_last_update,
  sm.last_tvoc AS module_last_tvoc,
  sm.last_co2 AS module_last_co2,
  sm.last_temperature,
  sm.last_pm1_0,
  sm.last_pm2_5,
  sm.last_pm10
FROM
  sensor_modules sm
WHERE
  sm.factory_id = ?;
`;

  const dots = [];

  // Function to convert user data to dot format
  const userToDot = (user) => ({
    x: 10,
    y: 10,
    type: "worker",
    level: "2", // You may set the level based on some condition
    description: {
      name: user.name,
      heartrate: user.last_heart_rate,
      temperature: user.last_body_temperature,
      oxygen: parseInt(user.last_oxygen_saturation),
    },
  });

  // Function to convert module data to dot format
  const moduleToDot = (module) => ({
    x: 20,
    y: 20,
    type: "module",
    level: "3", // You may set the level based on some condition
    description: {
      name: module.module_name,
      tvoc: module.module_last_tvoc,
      co2: module.module_last_co2,
      temperature: module.last_temperature,
      finedust: module.last_pm2_5,
    },
  });

  connection.query(query1 + query2, [factoryId, factoryId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    const dots = [];
    dots.push(...result[0].map(userToDot));
    dots.push(...result[1].map(moduleToDot));

    return res.status(200).json(dots);
  });
});

api.get("/factory/dashboard/:factoryId", async (req, res) => {
  const factoryId = req.params.factoryId;

  try {
    // 센서 모듈 데이터 가져오기
    const sensorModulesQuery = `
      SELECT *, scheme_file.scheme_name
      FROM sensor_modules
      LEFT JOIN scheme_file ON sensor_modules.factory_id = scheme_file.factory_id AND sensor_modules.page = scheme_file.page
      WHERE sensor_modules.factory_id = ?;
    `;

    const sensorModules = await executeQuery(sensorModulesQuery, [factoryId]);

    // 사용자 데이터 가져오기
    const usersQuery = `
    SELECT
      u.x AS user_x,
      u.y AS user_y,
      u.name AS worker_name,
      sm.*,
      w.last_sync,
      w.last_heart_rate,
      w.last_body_temperature,
      w.last_oxygen_saturation,
      w.last_battery_level,
      w.last_tvoc,
      w.last_co2,
      w.level,
      sf.scheme_name,
      CONCAT(sf.name, '.', sf.expansion) AS imageName
    FROM
      users u
    LEFT JOIN
      sensor_modules sm ON u.factory_id = sm.factory_id AND u.page = sm.page
    LEFT JOIN
      watches w ON u.user_id = w.user_id
    LEFT JOIN
      scheme_file sf ON u.factory_id = sf.factory_id AND u.page = sf.page
    WHERE
      u.factory_id = ?;
  `;

    const users = await executeQuery(usersQuery, [factoryId]);

    // 데이터를 그룹화하여 반환
    const groupedResult = groupData(sensorModules, users);

    res.json(groupedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const groupData = (sensorModules, users) => {
  const groupedData = {};

  // 센서 모듈 그룹화
  sensorModules.forEach((module) => {
    const schemeName = module.scheme_name || "default"; // 기본값은 "default"로 설정
    if (!groupedData[schemeName]) {
      groupedData[schemeName] = {
        workers: new Set(), // 중복 방지를 위해 Set 사용
        modules: [],
      };
    }

    groupedData[schemeName].modules.push({
      x: module.x,
      y: module.y,
      level: module.level || "",
      description: {
        name: module.module_name,
        tvoc: module.last_tvoc || "",
        co2: module.last_co2 || "",
        temperature: module.last_temperature || "",
        finedust: module.last_pm2_5 || "",
      },
    });
  });

  // 사용자 데이터 추가
  users.forEach((user) => {
    const schemeName = user.scheme_name || "default"; // 기본값은 "default"로 설정
    if (!groupedData[schemeName]) {
      groupedData[schemeName] = {
        workers: new Set(), // 중복 방지를 위해 Set 사용
        modules: [],
      };
    }

    // 중복 방지를 위해 Set에 추가
    groupedData[schemeName].workers.add(
      JSON.stringify({
        x: user.user_x,
        y: user.user_y,
        level: user.level || "",
        description: {
          name: user.worker_name,
          heartrate: user.last_heart_rate || "",
          temperature: user.last_body_temperature || "",
          oxygen: user.last_oxygen_saturation || "",
        },
      })
    );
  });

  // Set을 배열로 변환하여 반환
  for (const key in groupedData) {
    groupedData[key].workers = Array.from(groupedData[key].workers).map(
      (worker) => JSON.parse(worker)
    );

    // imageName 추가
    groupedData[key].imageName =
      users.find((user) => user.scheme_name === key)?.imageName || "";
    // groupedData[key].width =
    //   users.find((user) => user.scheme_name === key)?.width || "";
    // groupedData[key].height =
    //   users.find((user) => user.scheme_name === key)?.height || "";
  }

  delete groupedData.default;

  return groupedData;
};

const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

api.get("/floorset/:factoryId", async (req, res) => {
  try {
    const factoryId = req.params.factoryId;

    // floorplans 데이터 조회 쿼리
    const floorplansQuery = `
      SELECT sf.page, sf.name AS imageName, sf.width, sf.height, sf.scheme_name,
             u.user_id AS worker_id, u.name AS worker_name, u.x AS worker_x, u.y AS worker_y,
             sm.module_id, sm.module_name, sm.x AS module_x, sm.y AS module_y
      FROM scheme_file sf
      LEFT JOIN users u ON sf.factory_id = u.factory_id AND sf.page = u.page
      LEFT JOIN sensor_modules sm ON sf.factory_id = sm.factory_id AND sf.page = sm.page
      WHERE sf.factory_id = ?;
    `;

    // unset 데이터 조회 쿼리
    const unsetQuery = `
      SELECT user_id, name, x, y
      FROM users
      WHERE factory_id = ? AND page IS NULL;
    `;

    const floorplansParams = [factoryId];
    const unsetParams = [factoryId];

    // floorplans 조회
    const floorplansResults = await executeQuery(
      floorplansQuery,
      floorplansParams
    );

    // unset 조회
    const unsetResults = await executeQuery(unsetQuery, unsetParams);

    // 가공된 데이터 초기화
    const floorplans = [];
    const unset = {
      workers: [],
      modules: [],
    };

    // floorplans 데이터 가공
    floorplansResults.forEach((row) => {
      let floorplan = floorplans.find((f) => f.page === row.page);

      if (!floorplan) {
        floorplan = {
          page: row.page,
          imageName: row.imageName,
          width: row.width,
          height: row.height,
          schemeName: row.scheme_name,
          workers: [],
          modules: [],
        };

        floorplans.push(floorplan);
      }

      if (
        row.worker_id &&
        !floorplan.workers.some((w) => w.id === row.worker_id)
      ) {
        floorplan.workers.push({
          id: row.worker_id,
          name: row.worker_name,
          x: row.worker_x,
          y: row.worker_y,
        });
      }

      if (
        row.module_id &&
        !floorplan.modules.some((m) => m.id === row.module_id)
      ) {
        floorplan.modules.push({
          id: row.module_id,
          name: row.module_name,
          x: row.module_x,
          y: row.module_y,
        });
      }
    });

    // unset 데이터 가공
    unset.workers = unsetResults.map((row) => ({
      id: row.user_id,
      name: row.name,
      x: row.x,
      y: row.y,
    }));

    // 결과 반환
    const result = {
      floorplans,
      unset,
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching floorplans:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

api.post("/saveImage", (req, res) => {
  const { factoryId, page, image, dimensions, originalImageName } = req.body;

  // 이미지 파일을 저장할 폴더 경로
  const uploadPath = path.join(__dirname, "../images"); // uploads 폴더가 존재해야 합니다.

  // 파일의 확장자 추출
  const fileExtension = path
    .extname(originalImageName)
    .toLowerCase()
    .replaceAll(".", "");

  const fileId = uuidv4();

  // 새로운 파일 이름 생성 (uuid 활용)
  const newFileName = `${fileId}.${fileExtension}`;

  // 이미지 파일의 전체 경로
  const filePath = path.join(uploadPath, newFileName);

  // 이미지 파일 저장
  fs.writeFileSync(filePath, image, "base64");

  // MySQL 쿼리 작성
  const sql = `
    INSERT INTO scheme_file (id, factory_id, original_name, expansion, width, height, page)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

  // 파일 정보 데이터
  const fileData = [
    fileId,
    factoryId, // 이 부분은 scheme_file 테이블에 factory_id 컬럼이 없어서 적절하게 수정이 필요합니다.
    originalImageName,
    fileExtension,
    dimensions.width,
    dimensions.height,
    page,
  ];

  // MySQL 쿼리 실행
  connection.query(sql, fileData, (error, results) => {
    if (error) {
      console.error("Error executing MySQL query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.json({
      success: true,
      message: "저장이 완료되었습니다.",
    });
  });
});

api.post("/saveImage2", upload.single("image"), (req, res) => {
  const jsonData = JSON.parse(req.body.data);
  const query = `UPDATE scheme_file
  SET
    name = ?,
    original_name = ?,
    expansion = ?,
    width = ?,
    height = ?,
    scheme_name = scheme_name
  WHERE factory_id = ? AND page = ?;
  `;

  const tmp = jsonData.originalImageName.split(".");

  const values = [
    req.UUID,
    tmp[0],
    tmp[1],
    jsonData.dimensions.width,
    jsonData.dimensions.height,
    jsonData.factoryId,
    jsonData.page,
  ];

  connection.query(
    `SELECT name, expansion  FROM scheme_file WHERE factory_id = ? AND page = ?`,
    [jsonData.factoryId, jsonData.page],
    async (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
      }
      const toDelete = result[0].name + "." + result[0].expansion;

      try {
        // 파일 경로 구성
        const filePath = "./images/" + toDelete;

        // 비동기적으로 파일을 삭제합니다.
        await unlinkAsync(filePath);
        console.log(`${toDelete} 파일이 성공적으로 삭제되었습니다.`);
      } catch (unlinkError) {
        console.error("파일 삭제 오류:", unlinkError);
      }
    }
  );

  connection.query(query, values, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }
    return res.json({
      success: true,
      message: "저장이 완료되었습니다.",
    });
  });
});

api.get("/factory/:factoryId/tvoc", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const queryDate = req.query.date || getCurrentDate();
  const count = req.query.count || "all";
  // count가 'all'이 아닌 경우에는 최대 개수를 적용
  const limit = count === "all" ? "" : "LIMIT " + parseInt(count);

  const partitionName = "p" + queryDate.replaceAll("/", "").replaceAll("-", "");

  const today = new Date().toISOString().split("T")[0].replaceAll("-", "/");

  if (queryDate > today) {
    console.log("Out-of-bounds data request!");
    return res.status(200).json({});
  }

  // TVOC 데이터를 가져오는 쿼리를 작성합니다.
  const query = `
        SELECT
            sd.sensor_module_id,
            sd.tvoc AS tvoc_value,
            DATE_FORMAT(sd.timestamp, '%Y/%m/%d %H:%i:%s') AS timestamp_value
        FROM (
            SELECT
                sensor_module_id,
                tvoc,
                timestamp
            FROM
                sensor_data PARTITION(${partitionName})
            WHERE
                factory_id = ? AND DATE(timestamp) = ?
            ORDER BY
                timestamp DESC  -- 최신 데이터가 먼저 나오도록 정렬
        ) AS sd
    `;

  // 쿼리 실행
  connection.query(query + limit, [factoryId, queryDate], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 결과 데이터를 원하는 형태로 가공
    const formattedData = {};
    result.forEach((row) => {
      const moduleId = row.sensor_module_id;
      if (!formattedData[moduleId]) {
        formattedData[moduleId] = {
          tvoc: [],
        };
      }
      // 모듈 별로 최신 데이터 30개만 선택
      if (formattedData[moduleId].tvoc.length < count || count === "all") {
        formattedData[moduleId].tvoc.push({
          name: row.timestamp_value,
          y: parseFloat(row.tvoc_value), // 문자열을 숫자로 변환
        });
      }
    });

    // TVOC 데이터를 반환
    return res.status(200).json(formattedData);
  });
});

api.get("/factory/:factoryId/tvoc2", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const queryDate = req.query.date || getCurrentDate();
  const count = req.query.count || "all";
  // count가 'all'이 아닌 경우에는 최대 개수를 적용
  const limit = count === "all" ? "" : "LIMIT " + parseInt(count);

  const partitionName = "p" + queryDate.replaceAll("/", "").replaceAll("-", "");

  const today = new Date().toISOString().split("T")[0].replaceAll("-", "/");

  if (queryDate > today) {
    console.log("Out-of-bounds data request!");
    return res.status(200).json({});
  }

  // TVOC 데이터를 가져오는 쿼리를 작성합니다.
  const query = `
    SELECT
        sm.module_name,
        sd.tvoc AS tvoc_value,
        DATE_FORMAT(sd.timestamp, '%Y/%m/%d %H:%i:%s') AS timestamp_value
    FROM (
        SELECT
            sensor_module_id,
            tvoc,
            timestamp
        FROM
            sensor_data PARTITION(${partitionName})
        WHERE
            factory_id = ? AND DATE(timestamp) = ?
        ORDER BY
            timestamp DESC  -- 최신 데이터가 먼저 나오도록 정렬
    ) AS sd
    INNER JOIN sensor_modules sm ON sd.sensor_module_id = sm.module_id
    ORDER BY
        sd.timestamp DESC
  `;

  // 쿼리 실행
  connection.query(query + limit, [factoryId, queryDate], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 결과 데이터를 원하는 형태로 가공
    const formattedData = {};
    result.forEach((row) => {
      const moduleName = row.module_name;
      if (!formattedData[moduleName]) {
        formattedData[moduleName] = {
          tvoc: [],
        };
      }
      // 모듈 별로 최신 데이터 30개만 선택
      if (formattedData[moduleName].tvoc.length < count || count === "all") {
        formattedData[moduleName].tvoc.push({
          name: row.timestamp_value,
          y: parseFloat(row.tvoc_value), // 문자열을 숫자로 변환
        });
      }
    });

    // TVOC 데이터를 반환
    return res.status(200).json(formattedData);
  });
});

api.get("/factory/:factoryId/co2", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const queryDate = req.query.date || getCurrentDate();
  const count = req.query.count || "all";
  // count가 'all'이 아닌 경우에는 최대 개수를 적용
  const limit = count === "all" ? "" : "LIMIT " + parseInt(count);
  const partitionName = "p" + queryDate.replaceAll("/", "").replaceAll("-", "");

  const today = new Date().toISOString().split("T")[0].replaceAll("-", "/");

  if (queryDate > today) {
    console.log("Out-of-bounds data request!");
    return res.status(200).json({});
  }

  // TVOC 데이터를 가져오는 쿼리를 작성합니다.
  const query = `
        SELECT
            sd.sensor_module_id,
            sd.co2 AS co2_value,
            DATE_FORMAT(sd.timestamp, '%Y/%m/%d %H:%i:%s') AS timestamp_value
        FROM (
            SELECT
                sensor_module_id,
                co2,
                timestamp
            FROM
                sensor_data PARTITION(${partitionName})
            WHERE
                factory_id = ? AND DATE(timestamp) = ?
            ORDER BY
                timestamp DESC  -- 최신 데이터가 먼저 나오도록 정렬
        ) AS sd
    `;

  // 쿼리 실행
  connection.query(query + limit, [factoryId, queryDate], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 결과 데이터를 원하는 형태로 가공
    const formattedData = {};
    result.forEach((row) => {
      const moduleId = row.sensor_module_id;
      if (!formattedData[moduleId]) {
        formattedData[moduleId] = {
          co2: [],
        };
      }
      // 모듈 별로 최신 데이터 30개만 선택
      if (formattedData[moduleId].co2.length < count || count === "all") {
        formattedData[moduleId].co2.push({
          name: row.timestamp_value,
          y: parseFloat(row.co2_value), // 문자열을 숫자로 변환
        });
      }
    });

    // TVOC 데이터를 반환
    return res.status(200).json(formattedData);
  });
});

api.get("/factory/:factoryId/co22", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const queryDate = req.query.date || getCurrentDate();
  const count = req.query.count || "all";
  // count가 'all'이 아닌 경우에는 최대 개수를 적용
  const limit = count === "all" ? "" : "LIMIT " + parseInt(count);
  const partitionName = "p" + queryDate.replaceAll("/", "").replaceAll("-", "");

  const today = new Date().toISOString().split("T")[0].replaceAll("-", "/");

  if (queryDate > today) {
    console.log("Out-of-bounds data request!");
    return res.status(200).json({});
  }

  // CO2 데이터를 가져오는 쿼리를 작성합니다.
  const query = `
    SELECT
        sm.module_name,
        sd.co2 AS co2_value,
        DATE_FORMAT(sd.timestamp, '%Y/%m/%d %H:%i:%s') AS timestamp_value
    FROM (
        SELECT
            sensor_module_id,
            co2,
            timestamp
        FROM
            sensor_data PARTITION(${partitionName})
        WHERE
            factory_id = ? AND DATE(timestamp) = ?
        ORDER BY
            timestamp DESC  -- 최신 데이터가 먼저 나오도록 정렬
    ) AS sd
    INNER JOIN sensor_modules sm ON sd.sensor_module_id = sm.module_id
    ORDER BY
        sd.timestamp DESC
  `;

  // 쿼리 실행
  connection.query(query + limit, [factoryId, queryDate], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 결과 데이터를 원하는 형태로 가공
    const formattedData = {};
    result.forEach((row) => {
      const moduleName = row.module_name;
      if (!formattedData[moduleName]) {
        formattedData[moduleName] = {
          co2: [],
        };
      }
      // 모듈 별로 최신 데이터 30개만 선택
      if (formattedData[moduleName].co2.length < count || count === "all") {
        formattedData[moduleName].co2.push({
          name: row.timestamp_value,
          y: parseFloat(row.co2_value), // 문자열을 숫자로 변환
        });
      }
    });

    // CO2 데이터를 반환
    return res.status(200).json(formattedData);
  });
});

api.get("/factory/:factoryId/temperature", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  let queryDate = req.query.date || getCurrentDate();
  const count = req.query.count || "all";
  // count가 'all'이 아닌 경우에는 최대 개수를 적용
  const limit = count === "all" ? "" : "LIMIT " + parseInt(count);
  const partitionName = "p" + queryDate.replaceAll("/", "").replaceAll("-", "");

  if (queryDate === "undefined") {
    queryDate = getCurrentDate();
  }

  const today = new Date().toISOString().split("T")[0].replaceAll("-", "/");

  if (queryDate > today) {
    console.log("Out-of-bounds data request!");
    return res.status(200).json({});
  }

  // TVOC 데이터를 가져오는 쿼리를 작성합니다.
  const query = `
        SELECT
            sd.sensor_module_id,
            sd.temperature AS temperature_value,
            DATE_FORMAT(sd.timestamp, '%Y/%m/%d %H:%i:%s') AS timestamp_value
        FROM (
            SELECT
                sensor_module_id,
                temperature,
                timestamp
            FROM
                sensor_data PARTITION(${partitionName})
            WHERE
                factory_id = ? AND DATE(timestamp) = ?
            ORDER BY
                timestamp DESC  -- 최신 데이터가 먼저 나오도록 정렬
        ) AS sd
    `;

  // 쿼리 실행
  connection.query(query + limit, [factoryId, queryDate], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 결과 데이터를 원하는 형태로 가공
    const formattedData = {};
    result.forEach((row) => {
      const moduleId = row.sensor_module_id;
      if (!formattedData[moduleId]) {
        formattedData[moduleId] = {
          temperature: [],
        };
      }
      // 모듈 별로 최신 데이터 30개만 선택
      if (
        formattedData[moduleId].temperature.length < count ||
        count === "all"
      ) {
        formattedData[moduleId].temperature.push({
          name: row.timestamp_value,
          y: parseFloat(row.temperature_value), // 문자열을 숫자로 변환
        });
      }
    });

    // TVOC 데이터를 반환
    return res.status(200).json(formattedData);
  });
});

api.get("/factory/:factoryId/temperature2", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  let queryDate = req.query.date || getCurrentDate();
  const count = req.query.count || "all";
  // count가 'all'이 아닌 경우에는 최대 개수를 적용
  const limit = count === "all" ? "" : "LIMIT " + parseInt(count);
  const partitionName = "p" + queryDate.replaceAll("/", "").replaceAll("-", "");

  if (queryDate === "undefined") {
    queryDate = getCurrentDate();
  }

  const today = new Date().toISOString().split("T")[0].replaceAll("-", "/");

  if (queryDate > today) {
    console.log("Out-of-bounds data request!");
    return res.status(200).json({});
  }

  // 온도 데이터를 가져오는 쿼리를 작성합니다.
  const query = `
    SELECT
        sm.module_name,
        sd.temperature AS temperature_value,
        DATE_FORMAT(sd.timestamp, '%Y/%m/%d %H:%i:%s') AS timestamp_value
    FROM (
        SELECT
            sensor_module_id,
            temperature,
            timestamp
        FROM
            sensor_data PARTITION(${partitionName})
        WHERE
            factory_id = ? AND DATE(timestamp) = ?
        ORDER BY
            timestamp DESC  -- 최신 데이터가 먼저 나오도록 정렬
    ) AS sd
    INNER JOIN sensor_modules sm ON sd.sensor_module_id = sm.module_id
    ORDER BY
        sd.timestamp DESC
  `;

  // 쿼리 실행
  connection.query(query + limit, [factoryId, queryDate], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 결과 데이터를 원하는 형태로 가공
    const formattedData = {};
    result.forEach((row) => {
      const moduleName = row.module_name;
      if (!formattedData[moduleName]) {
        formattedData[moduleName] = {
          temperature: [],
        };
      }
      // 모듈 별로 최신 데이터 30개만 선택
      if (
        formattedData[moduleName].temperature.length < count ||
        count === "all"
      ) {
        formattedData[moduleName].temperature.push({
          name: row.timestamp_value,
          y: parseFloat(row.temperature_value), // 문자열을 숫자로 변환
        });
      }
    });

    // 온도 데이터를 반환
    return res.status(200).json(formattedData);
  });
});

api.get("/factory/:factoryId/finedust", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const queryDate = req.query.date || getCurrentDate();
  const count = req.query.count || "all";
  // count가 'all'이 아닌 경우에는 최대 개수를 적용
  const limit = count === "all" ? "" : "LIMIT " + parseInt(count);
  const partitionName = "p" + queryDate.replaceAll("/", "").replaceAll("-", "");

  const today = new Date().toISOString().split("T")[0].replaceAll("-", "/");

  if (queryDate > today) {
    console.log("Out-of-bounds data request!");
    return res.status(200).json({});
  }

  // TVOC 데이터를 가져오는 쿼리를 작성합니다.
  const query = `
        SELECT
            sd.sensor_module_id,
            sd.pm1_0 AS pm1_0_value,
            sd.pm2_5 AS pm2_5_value,
            sd.pm10 AS pm10_value,
            DATE_FORMAT(sd.timestamp, '%Y/%m/%d %H:%i:%s') AS timestamp_value
        FROM (
            SELECT
                sensor_module_id,
                pm1_0,
                pm2_5,
                pm10,
                timestamp
            FROM
                sensor_data PARTITION(${partitionName})
            WHERE
                factory_id = ? AND DATE(timestamp) = ?
            ORDER BY
                timestamp DESC  -- 최신 데이터가 먼저 나오도록 정렬
        ) AS sd
    `;

  // 쿼리 실행
  connection.query(query + limit, [factoryId, queryDate], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 결과 데이터를 원하는 형태로 가공
    const formattedData = {};
    result.forEach((row) => {
      const moduleId = row.sensor_module_id;
      if (!formattedData[moduleId]) {
        formattedData[moduleId] = {
          pm1_0: [],
          pm2_5: [],
          pm10: [],
        };
      }
      // 모듈 별로 최신 데이터 30개만 선택
      if (formattedData[moduleId].pm1_0.length < count || count === "all") {
        formattedData[moduleId].pm1_0.push({
          name: row.timestamp_value,
          y: parseFloat(row.pm1_0_value), // 문자열을 숫자로 변환
        });
      }

      if (formattedData[moduleId].pm2_5.length < count || count === "all") {
        formattedData[moduleId].pm2_5.push({
          name: row.timestamp_value,
          y: parseFloat(row.pm2_5_value), // 문자열을 숫자로 변환
        });
      }

      if (formattedData[moduleId].pm10.length < count || count === "all") {
        formattedData[moduleId].pm10.push({
          name: row.timestamp_value,
          y: parseFloat(row.pm10_value), // 문자열을 숫자로 변환
        });
      }
    });

    // TVOC 데이터를 반환
    return res.status(200).json(formattedData);
  });
});

api.get("/factory/:factoryId/finedust2", (req, res) => {
  const factoryId = parseInt(req.params.factoryId);
  const queryDate = req.query.date || getCurrentDate();
  const count = req.query.count || "all";
  // count가 'all'이 아닌 경우에는 최대 개수를 적용
  const limit = count === "all" ? "" : "LIMIT " + parseInt(count);
  const partitionName = "p" + queryDate.replaceAll("/", "").replaceAll("-", "");

  const today = new Date().toISOString().split("T")[0].replaceAll("-", "/");

  if (queryDate > today) {
    console.log("Out-of-bounds data request!");
    return res.status(200).json({});
  }

  // 미세먼지 데이터를 가져오는 쿼리를 작성합니다.
  const query = `
    SELECT
        sm.module_name,
        sd.pm1_0 AS pm1_0_value,
        sd.pm2_5 AS pm2_5_value,
        sd.pm10 AS pm10_value,
        DATE_FORMAT(sd.timestamp, '%Y/%m/%d %H:%i:%s') AS timestamp_value
    FROM (
        SELECT
            sensor_module_id,
            pm1_0,
            pm2_5,
            pm10,
            timestamp
        FROM
            sensor_data PARTITION(${partitionName})
        WHERE
            factory_id = ? AND DATE(timestamp) = ?
        ORDER BY
            timestamp DESC  -- 최신 데이터가 먼저 나오도록 정렬
    ) AS sd
    INNER JOIN sensor_modules sm ON sd.sensor_module_id = sm.module_id
    ORDER BY
        sd.timestamp DESC
  `;

  // 쿼리 실행
  connection.query(query + limit, [factoryId, queryDate], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error!");
    }

    // 결과 데이터를 원하는 형태로 가공
    const formattedData = {};
    result.forEach((row) => {
      const moduleName = row.module_name;
      if (!formattedData[moduleName]) {
        formattedData[moduleName] = {
          pm1_0: [],
          pm2_5: [],
          pm10: [],
        };
      }
      // 모듈 별로 최신 데이터 30개만 선택
      if (formattedData[moduleName].pm1_0.length < count || count === "all") {
        formattedData[moduleName].pm1_0.push({
          name: row.timestamp_value,
          y: parseFloat(row.pm1_0_value), // 문자열을 숫자로 변환
        });
      }

      if (formattedData[moduleName].pm2_5.length < count || count === "all") {
        formattedData[moduleName].pm2_5.push({
          name: row.timestamp_value,
          y: parseFloat(row.pm2_5_value), // 문자열을 숫자로 변환
        });
      }

      if (formattedData[moduleName].pm10.length < count || count === "all") {
        formattedData[moduleName].pm10.push({
          name: row.timestamp_value,
          y: parseFloat(row.pm10_value), // 문자열을 숫자로 변환
        });
      }
    });

    // 미세먼지 데이터를 반환
    return res.status(200).json(formattedData);
  });
});

module.exports = api;
