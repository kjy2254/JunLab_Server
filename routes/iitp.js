const express = require("express");
const iitp = express.Router();
const connection = require('../database/mysql');
const path = require("path");
const data_exporter = require('json2csv').Parser;

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const month2 = (month) < 10 ? ("0" + month) : (month);
const day = today.getDate();
let today_st = year + "/" + month2 + "/" + day;

iitp.use(express.static(path.join(__dirname, '../frontend/build')));

function jsonKeyUpperCase(object) {
    if (Array.isArray(object)) {
        // 리스트<맵> 형식으로 넘어오는 경우 처리
        object.forEach((item, index) => {
            object[index] = Object.fromEntries(Object.entries(item).map(([key, value]) => [key.toUpperCase(), value]));
        });
        return object;
    } else {
        // 맵 형식으로 넘어오는 경우 처리
        return Object.fromEntries(Object.entries(object).map(([key, value]) => [key.toUpperCase(), value]));
    }
}

/**
 * @swagger
 * tags:
 *   name: Sensor
 *   description: 센서 데이터 추가, 조회
 */

/**
 * @swagger
 * /iitp/api/sensor?id={device_id}&start={start_date}&end={end_date}:
 *   get:
 *      summary: "조건에 맞는 센서 데이터 조회"
 *      description: "요청 경로에 값을 담아 서버에 보낸다. (파라미터가 없을 경우 전체 정보를 조회한다)"
 *      tags: [Sensor]
 *      parameters:
 *        - in: query
 *          name: id
 *          required: false
 *          description: Device ID
 *          schema:
 *            type: string
 *            default: 1
 *        - in: query
 *          name: start
 *          required: false
 *          description: Start Date e.g.) YYYY/MM/DD
 *          schema:
 *            type: string
 *            default: 2023/07/13
 *        - in: query
 *          name: end
 *          required: false
 *          description: End Date e.g.) YYYY/MM/DD
 *          schema:
 *            type: string
 *            default: 2023/07/13
 *      responses:
 *        "200":
 *          description: Information read success
 *          content:
 *            application/json:
 *
 *              schema:
 *                type: object
 *                properties:
 *                  ok:
 *                    type: boolean
 *                  data:
 *                    type: object
 *                    example: [{ "INDEX": 3315,
 *                                "ID": 1,
 *                                "BATT": 3.7,
 *                                "MAGx": 6687,
 *                                "MAGy": 3047,
 *                                "MAGz": 2673,
 *                                "ZYROx": 4063,
 *                                "ZYROy": 62864,
 *                                "ZYROz": 1043,
 *                                "ACCx": 65138,
 *                                "ACCy": 29,
 *                                "ACCz": 1874,
 *                                "AQI": 1,
 *                                "TVOC": 16,
 *                                "EC2": 400,
 *                                "PM10": 0,
 *                                "PM25": 0,
 *                                "PM100": 0,
 *                                "IRUN": 19225,
 *                                "RED": 17433,
 *                                "ECG": 30241,
 *                                "TEMP": 27.5,
 *                                "CREATED_AT": "2023/07/12 13:02:58" }]
 */
iitp.get("/api/sensor", (req, res, next) => {
    const id = req.query.id;
    let start = req.query.start;
    let end = req.query.end;

    // 현재 날짜 정보 가져오기
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const month2 = (month < 10) ? ("0" + month) : (month);
    const day = today.getDate();
    const today_st = year + "/" + month2 + "/" + day;

    // 기본값 설정
    if (!start) start = '2023/01/01';
    if (!end) end = today_st;

    let query = '';
    let data = [];

    if (!id || id === 'all') {
        query = 'SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT FROM SENSOR_DATA WHERE CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC;';
        data = [start, end + ' 23:59:59'];
    } else {
        query = 'SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT FROM SENSOR_DATA WHERE ID = ? AND CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC;';
        data = [id, start, end + ' 23:59:59'];
    }

    connection.query(query, data, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error!');
        }
        return res.status(200).json(result);
    });
});


/**
 * @swagger
 *  /iitp/api/sensor:
 *    post:
 *      tags: [Sensor]
 *      summary: "센서 데이터 추가"
 *      description: "POST 방식으로 센서 값을 등록한다."
 *      produces: text/plain
 *      requestBody:
 *          description: "21개의 센서값을 순서대로 나열 (구분자: ',') <br /> [ID, BATT, MAGx, MAGy, MAGz, ZYROx, ZYROy, ZYROz, ACCx, ACCy, ACCz, AQI, TVOC, EC2, PM1.0, PM2.5, PM10, IRUN, RED, ECG, TEMP]"
 *          required: true
 *          content:
 *            text/plain:
 *              schema:
 *                  type: string
 *                  example: 3, 3.7, 6687.0, 3047.0, 2673.0, 4063.0, 62864.0, 1043.0, 65138.0, 29.0, 1874.0, 1.0, 16.0, 400, 1, 2, 3, 19225.0, 17433.0, 30241.0, 27.5
 *      responses:
 *       201:
 *        description: Information create success
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
iitp.post("/api/sensor", (req, res) => {
    const keys = [
        'ID',
        'BATT',
        'MAGx',
        'MAGy',
        'MAGz',
        'ZYROx',
        'ZYROy',
        'ZYROz',
        'ACCx',
        'ACCy',
        'ACCz',
        'AQI',
        'TVOC',
        'EC2',
        'PM10',
        'PM25',
        'PM100',
        'IRUN',
        'RED',
        'ECG',
        'TEMP'
    ];

    const values = req.body.replaceAll(' ', '').split(',');

    if (values.length !== keys.length) {
        return res.status(400).send('Invalid number of values');
    }

    const data = keys.reduce((acc, curr, idx) => {
        return { ...acc, [curr]: values[idx] };
    }, { "CREATED_AT": new Date() });

    if (isNaN(parseInt(data.ID))) {
        return res.status(400).send('Invalid ID');
    }

    connection.query("INSERT INTO SENSOR_DATA SET ?", data, (error) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
        return res.status(201).send('Data addition successful');
    });
});


iitp.get("/", (req, res) => {
    res.render("IITP/IITP")
})

const itemsPerPage = 30; // 페이지당 아이템 수

iitp.get("/table2", (req, res) => {
    let id = req.query.id || 'all'; // 기본값은 'all'
    let start = req.query.start || today_st; // 기본값은 오늘 날짜 00:00:00
    let end = req.query.end || today_st; // 기본값은 오늘 날짜 23:59:59
    let page = parseInt(req.query.page) || 1; // 현재 페이지, 기본값은 1

    let query = '';
    let data = [];

    const idQuery = 'SELECT DISTINCT ID FROM SENSOR_DATA;';
    connection.query(idQuery, (idError, idResult) => {
        if (idError) {
            console.log(idError);
            res.status(500).send('Internal Server Error!');
            return;
        }

        let id_list = idResult.map(item => item.ID);

        if (typeof id == 'undefined' || id === 'all') {
            query = 'SELECT COUNT(*) as total_items FROM SENSOR_DATA WHERE CREATED_AT BETWEEN ? AND ?; ';
            query += 'SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC LIMIT ? OFFSET ?;';
            data = [start, end + ' 23:59:59', start, end + ' 23:59:59', itemsPerPage, (page - 1) * itemsPerPage];
        } else {
            query = 'SELECT COUNT(*) as total_items FROM SENSOR_DATA WHERE ID = ? AND CREATED_AT BETWEEN ? AND ?; ';
            query += 'SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE ID = ? AND CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC LIMIT ? OFFSET ?;';
            data = [id, start, end + ' 23:59:59', id, start, end + ' 23:59:59', itemsPerPage, (page - 1) * itemsPerPage];
        }

        connection.query(query, data, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send('Internal Server Error!');
                return;
            }

            const totalItems = results[0][0].total_items || 0;
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            res.render("IITP/SensorTable", {
                data: results[1] || [],
                id_list: id_list,
                currentPage: page,
                itemsPerPage: itemsPerPage,
                totalPages: totalPages,
                totalItems: totalItems, // 추가
                id: id, // id 추가
                start: start, // start 추가
                end: end // end 추가
            });
        });
    });
});

iitp.get("/table", (req, res) => {
    const id = req.query.id || 'all';
    const start = req.query.start || today_st;
    const end = req.query.end || today_st;
    const itemsPerPage = req.query.itemsPerPage || 30; // 기본값은 30

    const idQuery = 'SELECT DISTINCT ID FROM SENSOR_DATA;';
    connection.query(idQuery, (idError, idResult) => {
        if (idError) {
            console.log(idError);
            res.status(500).send('Internal Server Error!');
            return;
        }

        let id_list = idResult.map(item => item.ID);

        let query = '';
        let data = [];

        if (typeof id == 'undefined' || id === 'all') {
            query = 'SELECT COUNT(*) as total_items FROM SENSOR_DATA WHERE CREATED_AT BETWEEN ? AND ?; ';
            data = [start, end + ' 23:59:59'];
        } else {
            query = 'SELECT COUNT(*) as total_items FROM SENSOR_DATA WHERE ID = ? AND CREATED_AT BETWEEN ? AND ?; ';
            data = [id, start, end + ' 23:59:59'];
        }

        connection.query(query, data, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send('Internal Server Error!');
                return;
            }

            const totalItems = results[0].total_items || 0;

            res.render("IITP/SensorTablescroll", {
                id_list: id_list,
                totalItems: totalItems,
                id: id,
                start: start,
                end: end,
                itemsPerPage: itemsPerPage // 추가
            });
        });
    });
});



iitp.get('/load-more', (req, res) => {
    let id = req.query.id || 'all';
    let start = req.query.start || today_st;
    let end = req.query.end || today_st;
    let page = parseInt(req.query.page) || 1;

    let query = '';
    let data = [];

    if (typeof id == 'undefined' || id === 'all') {
        query = 'SELECT COUNT(*) as total_items FROM SENSOR_DATA WHERE CREATED_AT BETWEEN ? AND ?; ';
        query += 'SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC LIMIT ? OFFSET ?;';
        data = [start, end + ' 23:59:59', start, end + ' 23:59:59', itemsPerPage, (page - 1) * itemsPerPage];
    } else {
        query = 'SELECT COUNT(*) as total_items FROM SENSOR_DATA WHERE ID = ? AND CREATED_AT BETWEEN ? AND ?; ';
        query += 'SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE ID = ? AND CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC LIMIT ? OFFSET ?;';
        data = [id, start, end + ' 23:59:59', id, start, end + ' 23:59:59', itemsPerPage, (page - 1) * itemsPerPage];
    }

    connection.query(query, data, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error!');
            return;
        }
        res.json(results[1] || []);
    });
});

iitp.get("/table/export", (req, res) => {
    const id = req.query.id;
    let start = req.query.start;
    let end = req.query.end;

    let today_st = year + "/" + month2 + "/" + day;

    if (typeof start == 'undefined' || typeof start == '') start = '2023/01/01';
    if (typeof end == 'undefined' || typeof end == '') {
        end = today_st + ' 23:59:59';
    } else {
        end = end + ' 23:59:59';
    }

    let query = '';
    let data = [];

    const select = 'ID, BATT, MAGx, MAGy, MAGz, ZYROx, ZYROy, ZYROz, ACCx, ACCy, ACCz, AQI, TVOC, EC2, PM10 AS \'PM1.0\', PM25 AS \'PM2.5\', PM10 AS \'PM10\', IRUN, RED, ECG, TEMP';

    if (typeof id == 'undefined' || id == 'all') {
        query = 'SELECT ' + select + ', DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC;';
        data = [start, end];
    } else {
        query = 'SELECT ' + select + ', DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE ID = ? AND CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC;';
        data = [id, start, end];
    }

    connection.query(query, data, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error!');
        }
        let resultData = JSON.parse(JSON.stringify(result));

        // csv로 변환

        let file_header = ['ID', 'BATT', 'MAGx', 'MAGy', 'MAGz', 'ZYROx', 'ZYROy', 'ZYROz', 'ACCx', 'ACCy', 'ACCz', 'AQI', 'TVOC', 'eC2', 'pm1.0', 'pm2.5', 'pm10', 'IRUN', 'RED', 'ECG', 'Temp'];
        let json_data = new data_exporter({file_header});
        if (resultData.length != 0) {
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=sensor.csv");
            let csv_data = json_data.parse(resultData);
            res.status(200).end(csv_data);
        } else {
            res.status(200).end();
        }
    });
})

// iitp.get('/console', (req, res) => {
//     connection.query("SELECT DISTINCT ID FROM SENSOR_DATA;", (error, result) => {
//         if (error) {
//             console.log(error);
//             res.status(500).send('Internal Server Error!');
//         }
//         let id_list = [];
//         result.forEach(e => id_list.push(e.ID));
//         res.render('IITP/console', {id_list: id_list});
//     });
// })

iitp.get('/console', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});


module.exports = iitp;