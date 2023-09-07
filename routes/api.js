const express = require("express");
const api = express.Router();
const connection = require('../database/apiConnection');
const path = require('path');

api.get('/factory/:factoryId/users', (req, res) => {
    const factoryId = parseInt(req.params.factoryId);

    // 특정 공장에 속한 모든 사용자의 최근 watch data와 사용자 정보 및 watch_id 가져오기
    const query = `
        SELECT
            u.user_id,
            CONCAT(u.first_name, " ", u.last_name) AS full_name,
            wd.heart_rate,
            wd.body_temperature,
            wd.oxygen_saturation,
            wd.is_on,
            wd.battery_level,
            wd.timestamp,
            wd.watch_id
        FROM
            users AS u
        INNER JOIN
            user_factory_map AS uf ON u.user_id = uf.user_id
        LEFT JOIN (
            SELECT
                wd1.user_id,
                wd1.heart_rate,
                wd1.body_temperature,
                wd1.oxygen_saturation,
                wd1.is_on,
                wd1.battery_level,
                wd1.timestamp,
                w1.watch_id
            FROM
                watch_data wd1
            INNER JOIN (
                SELECT
                    user_id,
                    MAX(timestamp) AS max_timestamp
                FROM
                    watch_data
                GROUP BY
                    user_id
            ) wd2 ON wd1.user_id = wd2.user_id AND wd1.timestamp = wd2.max_timestamp
            LEFT JOIN watches w1 ON wd1.user_id = w1.user_id
        ) AS wd ON u.user_id = wd.user_id
        WHERE
            uf.factory_id = ?
    `;

    // 쿼리 실행
    connection.query(query, [factoryId], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error!');
        }
        // 결과를 JSON 형식으로 응답
        return res.status(200).json(result);
    });
});

api.get('/factory/:factoryId/sensors', (req, res) => {
    const factoryId = parseInt(req.params.factoryId);

    // 각 센서 모듈에 대해 최근 30개의 데이터를 가져오는 서브쿼리
    const subquery = `
    SELECT
      sd.sensor_module_id,
      sd.tvoc AS tvoc_sequence,
      sd.co2 AS co2_sequence,
      sd.temperature AS temperature_sequence,
      sd.pm1_0 AS pm1_0_sequence,
      sd.pm2_5 AS pm2_5_sequence,
      sd.pm10 AS pm10_sequence,
      sd.timestamp AS timestamp_sequence
    FROM
      sensor_data sd
    WHERE
      sd.factory_id = ?
    ORDER BY
      sd.timestamp ASC
    LIMIT 30
  `;

    // 메인 쿼리: 각 모듈별로 서브쿼리를 실행하여 데이터를 가져옴
    const query = `
    SELECT
      sm.module_id,
      sm.module_name,
      sd.sensor_module_id,
      GROUP_CONCAT(tvoc_sequence) AS tvoc_sequence,
      GROUP_CONCAT(co2_sequence) AS co2_sequence,
      GROUP_CONCAT(temperature_sequence) AS temperature_sequence,
      GROUP_CONCAT(pm1_0_sequence) AS pm1_0_sequence,
      GROUP_CONCAT(pm2_5_sequence) AS pm2_5_sequence,
      GROUP_CONCAT(pm10_sequence) AS pm10_sequence,
      GROUP_CONCAT(timestamp_sequence) AS timestamp_sequence
    FROM (
      ${subquery}
    ) AS sd
    INNER JOIN
      sensor_modules sm ON sd.sensor_module_id = sm.module_id
    GROUP BY
      sm.module_id, sd.sensor_module_id;
  `;

    // 쿼리 실행
    connection.query(query, [factoryId], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error!');
        }

        // 결과 데이터를 원하는 형태로 가공
        const formattedData = {};
        result.forEach((row) => {
            const moduleId = row.module_id;
            if (!formattedData[moduleId]) {
                formattedData[moduleId] = {
                    tvoc: row.tvoc_sequence.split(',').map(Number).map((value, index) => ({
                        name: row.timestamp_sequence.split(',')[index],
                        y: value
                    })),
                    co2: row.co2_sequence.split(',').map(Number).map((value, index) => ({
                        name: row.timestamp_sequence.split(',')[index],
                        y: value
                    })),
                    temperature: row.temperature_sequence.split(',').map(Number).map((value, index) => ({
                        name: row.timestamp_sequence.split(',')[index],
                        y: value
                    })),
                    pm1_0: row.pm1_0_sequence.split(',').map(Number).map((value, index) => ({
                        name: row.timestamp_sequence.split(',')[index],
                        y: value
                    })),
                    pm2_5: row.pm2_5_sequence.split(',').map(Number).map((value, index) => ({
                        name: row.timestamp_sequence.split(',')[index],
                        y: value
                    })),
                    pm10: row.pm10_sequence.split(',').map(Number).map((value, index) => ({
                        name: row.timestamp_sequence.split(',')[index],
                        y: value
                    })),
                };
            }
        });

        // 결과를 반환
        return res.status(200).json(formattedData);
    });
});

api.get('/factories', (req, res) => {
    const query = 'SELECT * FROM factories';

    connection.query(query, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error!');
        }
        // 결과를 JSON 형식으로 응답
        return res.status(200).json(result);
    });
});

api.get('/factory/:factoryId', (req, res) => {
    const factoryId = req.params.factoryId;
    const query = 'SELECT factory_name FROM factories WHERE factory_id = ?';

    connection.query(query, [factoryId], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error!');
        }
        if (result.length === 0) {
            return res.status(404).send('Factory not found');
        }
        const factoryName = result[0].factory_name;
        res.status(200).json({ factoryName });
    });
});

api.get('/image/:imageName', (req, res) => {
    const { imageName } = req.params;
    // 이미지 파일의 경로 설정 (images 폴더 내에 이미지 파일이 있어야 함)
    const imagePath = path.join(__dirname, '../images', imageName);

    // 이미지 파일을 읽어 응답으로 전송
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('이미지 파일을 읽어오지 못했습니다.', err);
            res.status(404).send('이미지를 찾을 수 없습니다.');
        }
    });
});

module.exports = api;