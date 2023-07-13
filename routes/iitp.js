const express = require("express");
const router = express.Router();
const connection = require('../database/mysql');
const {stringify} = require("nodemon/lib/utils");
const data_exporter = require('json2csv').Parser;

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const month2 = (month) < 10 ? ("0" + month) : (month);
const day = today.getDate();

function jsonKeyUpperCase(object){
    if(Array.isArray(object)){
        // 리스트<맵> 형식으로 넘어오는 경우 처리
        object.forEach((item, index) =>{
            object[index] = Object.fromEntries(Object.entries(item).map(([key, value]) => [key.toUpperCase(), value]));
        });
        return object;
    }
    else {
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
router.get("/api/sensor", (req, res, next) => {
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


    if (typeof id == 'undefined' || id == 'all') {
        query = 'SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC;';
        data = [start, end];
    } else {
        query = 'SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE ID = ? AND CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC;';
        data = [id, start, end];
    }

    connection.query(query, data, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error!');
        }
        res.status(200).send(result);
    });

});

/**
 * @swagger
 *  /iitp/api/sensor:
 *    post:
 *      tags: [Sensor]
 *      summary: "센서 데이터 추가"
 *      description: "POST 방식으로 센서 값을 등록한다."
 *      produces: application/json
 *      requestBody:
 *          description: "각 센서 데이터 값 입력"
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      ID:
 *                          type: number
 *                          default: 1
 *                      BATT:
 *                          type: number
 *                          default: 3.7
 *                      MAGx:
 *                          type: number
 *                          default: 6687
 *                      MAGy:
 *                          type: number
 *                          default: 3047
 *                      MAGz:
 *                          type: number
 *                          default: 2673
 *                      ZYROx:
 *                          type: number
 *                          default: 4063
 *                      ZYROy:
 *                          type: number
 *                          default: 62864
 *                      ZYROz:
 *                          type: number
 *                          default: 1043
 *                      ACCx:
 *                          type: number
 *                          default: 65138
 *                      ACCy:
 *                          type: number
 *                          default: 29
 *                      ACCz:
 *                          type: number
 *                          default: 1874
 *                      AQI:
 *                          type: number
 *                          default: 1
 *                      TVOC:
 *                          type: number
 *                          default: 16
 *                      EC2:
 *                          type: number
 *                          default: 400
 *                      PM1.0:
 *                          type: number
 *                          default: 0
 *                      PM2.5:
 *                          type: number
 *                          default: 0
 *                      PM10:
 *                          type: number
 *                          default: 0
 *                      IRUN:
 *                          type: number
 *                          default: 19225
 *                      RED:
 *                          type: number
 *                          default: 17433
 *                      ECG:
 *                          type: number
 *                          default: 30241
 *                      TEMP:
 *                          type: number
 *                          default: 37
 *      responses:
 *       201:
 *        description: Information create success
 *       404:
 *        description: NotFound
 *       500:
 *        description: Server Error
 */
router.post("/api/sensor", (req, res, next) => {
    let data = {...req.body, "created_at": new Date(Date.now())};

    data = jsonKeyUpperCase(data);

    data.PM100 = data["PM10"];
    data.PM10 = data["PM1.0"];
    data.PM25 = data["PM2.5"];
    delete data["PM1.0"];
    delete data["PM2.5"];

    console.log(data);

    connection.query("INSERT INTO SENSOR_DATA SET ?", data, (er) => {
        if (er) {
            console.log(er);
            res.status(500).send('Internal Server Error!');
        } else {
            res.status(201).send();
        }
    });
});

router.get("/", (req, res) => {
    res.render("IITP/IITP")
})

router.get("/table", (req, res) => {
    const id = req.query.id;
    let start = req.query.start;
    let end = req.query.end;

    let today_st = year + "/" + month2 + "/" + day;

    if (typeof start == 'undefined' || start === '') {
        start = today_st + ' 00:00:00';
    }
    if (typeof end == 'undefined' || end === '') {
        end = today_st + ' 23:59:59';
    } else {
        end = end + ' 23:59:59';
    }


    console.log(start, end);

    let query = '';
    let data = [];


    if (typeof id == 'undefined' || id === 'all') {
        query = 'SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC;';
        data = [start, end];
    } else {
        query = 'SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE ID = ? AND CREATED_AT BETWEEN ? AND ? ORDER BY CREATED_AT DESC;';
        data = [id, start, end];
    }

    connection.query("SELECT DISTINCT ID FROM SENSOR_DATA; " + query, data, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error!');
        }
        let id_list = [];
        result[0].forEach(e => id_list.push(e.ID));
        res.render("IITP/SensorTable", {data: result[1], id_list: id_list});
    });
})

router.get("/table/export", (req, res) => {
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

module.exports = router;