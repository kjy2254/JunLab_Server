const express = require("express");
const api = express.Router();
const connection = require('../database/apiConnection');
const path = require('path');
const fs = require('fs');

function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}


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

    // 첫 번째 쿼리: 공장 이름 조회
    const query1 = 'SELECT factory_name FROM factories WHERE factory_id = ?';

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
            return res.status(500).send('Internal Server Error!');
        }
        if (result1.length === 0) {
            return res.status(404).send('Factory not found');
        }

        // 공장 이름 결과 가져오기
        const factoryName = result1[0].factory_name;

        // 두 번째 쿼리 실행
        connection.query(query2, [factoryId], (error, result2) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Internal Server Error!');
            }

            // const last_update = result2[0].last_update;

            // const utcLastUpdate = result2[0].last_update;
            const last_update = new Date(result2[0].last_update).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });


            // 결과를 JSON 형태로 반환
            res.status(200).json({ factoryName, last_update });
        });
    });
});

api.get('/image/:imageName', (req, res) => {
    const { imageName } = req.params;
    // 이미지 파일의 경로 설정 (images 폴더 내에 이미지 파일이 있어야 함)
    const imagePath = path.join(__dirname, '../images', imageName + '.png');
    const defaultPath = path.join(__dirname, '../images/factory_default.png');

    // 이미지 파일이 존재하는지 확인
    if (fs.existsSync(imagePath)) {
        // 이미지 파일을 읽어 응답으로 전송
        res.sendFile(imagePath, (err) => {
            if (err) {
                console.error('이미지 파일을 읽어오지 못했습니다.', err);
                return res.status(404).send('이미지를 찾을 수 없습니다.');
            }
        });
    } else {
        // 이미지 파일을 찾을 수 없을 때 기본 이미지를 응답으로 보냅니다.
        res.sendFile(defaultPath, (err) => {
            if (err) {
                console.error('기본 이미지 파일을 읽어오지 못했습니다.', err);
                return res.status(404).send('이미지를 찾을 수 없습니다.');
            }
        });
    }
});

api.get('/factory/:factoryId/tvoc', (req, res) => {
    const factoryId = parseInt(req.params.factoryId);
    const queryDate = req.query.date || getCurrentDate();
    const count = req.query.count || 'all';
    // count가 'all'이 아닌 경우에는 최대 개수를 적용
    const limit = count === 'all' ? '' : 'LIMIT ' + parseInt(count);

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
                sensor_data
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
            return res.status(500).send('Internal Server Error!');
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
            if (formattedData[moduleId].tvoc.length < count || count === 'all') {
                formattedData[moduleId].tvoc.push({
                    name: row.timestamp_value,
                    y: parseFloat(row.tvoc_value),  // 문자열을 숫자로 변환
                });
            }
        });

        // TVOC 데이터를 반환
        return res.status(200).json(formattedData);
    });
});

api.get('/factory/:factoryId/co2', (req, res) => {
    const factoryId = parseInt(req.params.factoryId);
    const queryDate = req.query.date || getCurrentDate();
    const count = req.query.count || 'all';
    // count가 'all'이 아닌 경우에는 최대 개수를 적용
    const limit = count === 'all' ? '' : 'LIMIT ' + parseInt(count);

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
                sensor_data
            WHERE
                factory_id = ? AND DATE(timestamp) = ?
            ORDER BY
                timestamp DESC  -- 최신 데이터가 먼저 나오도록 정렬
        ) AS sd
    `;

    // 쿼리 실행
    connection.query(query, [factoryId, queryDate], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error!');
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
            if (formattedData[moduleId].co2.length < count || count === 'all') {
                formattedData[moduleId].co2.push({
                    name: row.timestamp_value,
                    y: parseFloat(row.co2_value),  // 문자열을 숫자로 변환
                });
            }
        });

        // TVOC 데이터를 반환
        return res.status(200).json(formattedData);
    });
});

api.get('/factory/:factoryId/temperature', (req, res) => {
    const factoryId = parseInt(req.params.factoryId);
    let queryDate = req.query.date || getCurrentDate();
    const count = req.query.count || 'all';
    // count가 'all'이 아닌 경우에는 최대 개수를 적용
    const limit = count === 'all' ? '' : 'LIMIT ' + parseInt(count);

    if (queryDate === 'undefined') {
        queryDate = getCurrentDate();
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
                sensor_data
            WHERE
                factory_id = ? AND DATE(timestamp) = ?
            ORDER BY
                timestamp DESC  -- 최신 데이터가 먼저 나오도록 정렬
        ) AS sd
    `;

    // 쿼리 실행
    connection.query(query, [factoryId, queryDate], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error!');
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
            if (formattedData[moduleId].temperature.length < count || count === 'all') {
                formattedData[moduleId].temperature.push({
                    name: row.timestamp_value,
                    y: parseFloat(row.temperature_value),  // 문자열을 숫자로 변환
                });
            }
        });

        // TVOC 데이터를 반환
        return res.status(200).json(formattedData);
    });
});

api.get('/factory/:factoryId/finedust', (req, res) => {
    const factoryId = parseInt(req.params.factoryId);
    const queryDate = req.query.date || getCurrentDate();
    const count = req.query.count || 'all';
    // count가 'all'이 아닌 경우에는 최대 개수를 적용
    const limit = count === 'all' ? '' : 'LIMIT ' + parseInt(count);

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
                sensor_data
            WHERE
                factory_id = ? AND DATE(timestamp) = ?
            ORDER BY
                timestamp DESC  -- 최신 데이터가 먼저 나오도록 정렬
        ) AS sd
    `;

    // 쿼리 실행
    connection.query(query, [factoryId, queryDate], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error!');
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
            if (formattedData[moduleId].pm1_0.length < count || count === 'all') {
                formattedData[moduleId].pm1_0.push({
                    name: row.timestamp_value,
                    y: parseFloat(row.pm1_0_value),  // 문자열을 숫자로 변환
                });
            }

            if (formattedData[moduleId].pm2_5.length < count || count === 'all') {
                formattedData[moduleId].pm2_5.push({
                    name: row.timestamp_value,
                    y: parseFloat(row.pm2_5_value),  // 문자열을 숫자로 변환
                });
            }

            if (formattedData[moduleId].pm10.length < count || count === 'all') {
                formattedData[moduleId].pm10.push({
                    name: row.timestamp_value,
                    y: parseFloat(row.pm10_value),  // 문자열을 숫자로 변환
                });
            }
        });

        // TVOC 데이터를 반환
        return res.status(200).json(formattedData);
    });
});


module.exports = api;