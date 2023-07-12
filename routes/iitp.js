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


router.get("/data", (req, res, next) => {
    const id = req.query.id;
    let start = req.query.start;
    let end = req.query.end;

    let today_st = year + "/" + month2 + "/" + day;

    if (typeof start == 'undefined' || typeof start == '') start = '2023/01/01';
    if (typeof end == 'undefined' || typeof end == '') {
        end = today_st + ' 23:59:59';
    }
    else{
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

router.get("/", (req, res) => {
    res.render("IITP")
})

router.post("/data", (req, res, next) => {
    let data = {...req.body, "created_at": new Date(Date.now())};

    console.log(data);

    data.PM100 = data["pm10"];
    data.PM10 = data["pm1.0"];
    data.PM25 = data["pm2.5"];
    delete data["pm10"];
    delete data["pm1.0"];
    delete data["pm2.5"];

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

router.get("/table", (req, res) => {
    const id = req.query.id;
    let start = req.query.start;
    let end = req.query.end;

    let today_st = year + "/" + month2 + "/" + day;

    if (typeof start == 'undefined' || typeof start == '') start = '2023/01/01';
    if (typeof end == 'undefined' || typeof end == '') {
        end = today_st + ' 23:59:59';
    }
    else{
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

    connection.query("SELECT DISTINCT ID FROM SENSOR_DATA; " + query, data, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error!');
        }
        let id_list = [];
        result[0].forEach(e => id_list.push(e.ID));
        res.render("SensorTable", {data: result[1], id_list: id_list});
    });
})

router.get("/table/export", (req, res) => {
    let query = '';
    let data = [];

    let select = 'ID, BATT, MAGx, MAGy, MAGz, ZYROx, ZYROy, ZYROz, ACCx, ACCy, ACCz, AQI, TVOC, EC2, PM10 AS \'PM1.0\', PM25 AS \'PM2.5\', PM10 AS \'PM10\', IRUN, RED, ECG, TEMP';

    // start만 있는 경우
    if (typeof start != 'undefined') {
        // start & end 있는 경우 -> 두 기간 사이 조회
        if (typeof end != 'undefined') {
            if (typeof id != 'undefined') {
                query = 'SELECT ' + select + ', DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE ID = ? AND CREATED_AT BETWEEN ? AND ?';
                data = [id, start, end];
            } else {
                query = 'SELECT ' + select + ', DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE CREATED_AT BETWEEN ? AND ?';
                data = [start, end];
            }
        }
        // start만 있는 경우 -> start 부터 현재 시간까지 조회
        else {
            if (typeof id != 'undefined') {
                query = 'SELECT ' + select + ', DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE ID = ? AND CREATED_AT >= ?';
                data = [id, start];
            } else {
                query = 'SELECT ' + select + ', DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE CREATED_AT >= ?';
                data = [start];
            }
        }
    } else {
        // end만 있는 경우 -> 처음부터 end까지 조회
        if (typeof end != 'undefined') {
            if (typeof id != 'undefined') {
                query = 'SELECT ' + select + ', DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE ID = ? AND CREATED_AT <= ?';
                data = [id, end];
            } else {
                query = 'SELECT ' + select + ', DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE CREATED_AT <= ?';
                data = [end];
            }
        }
        // 둘 다 없는 경우 -> 전체 기간 조회
        else {
            // 특정 id 조회
            if (typeof id != 'undefined') {
                query = 'SELECT ' + select + ', DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE ID = ?';
                data = [id];
            }
            // 전체조회
            else {
                query = 'SELECT ' + select + ', DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA';
                data = [];
            }
        }
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

        let csv_data = json_data.parse(resultData);

        res.setHeader("Content-Type", "text/csv");

        res.setHeader("Content-Disposition", "attachment; filename=sensor.csv");

        res.status(200).end(csv_data);
    });
})

module.exports = router;