const express = require("express");
const router = express.Router();
const connection = require('../database/mysql');
const e = require("express");

function toTimestamp(str) { // 날짜 포맷 substring 이용해서 하도록 수정 예정
    const date = new Date(str);
    console.log("formatted date:", date);
    return date.getTime() / 1000;
}

router.get("/data", (req, res, next) => {
    // 시작범위, 종료범위, 기기번호
    const device = req.query.device;
    let start = req.query.start;
    let end = req.query.end;

    console.log('device: ' + device);
    console.log('start: ' + start);
    console.log('end: ' + end);

    // start 있는 경우
    if (typeof start != 'undefined') {
        // start & end 있는 경우 -> 두 기간 사이 조회
        if (typeof end != 'undefined') {
            if (typeof device != 'undefined') {
                connection.query('SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE DEVICE_NUM = ? AND CREATED_AT BETWEEN ? AND ?', [device, start, end], (error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send('Internal Server Error!');
                    }
                    res.status(200).send(result);
                });
            } else {
                connection.query('SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE CREATED_AT BETWEEN ? AND ?', [start, end], (error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send('Internal Server Error!');
                    }
                    res.status(200).send(result);
                });
            }
        }
        // start만 있는 경우 -> start 부터 현재 시간까지 조회
        else {
            if (typeof device != 'undefined') {
                connection.query('SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE DEVICE_NUM = ? AND CREATED_AT >= ?', [device, start], (error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send('Internal Server Error!');
                    }
                    res.status(200).send(result);
                });
            } else {
                connection.query('SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE CREATED_AT >= ?', [start], (error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send('Internal Server Error!');
                    }
                    res.status(200).send(result);
                });
            }
        }
    } else {
        // end만 있는 경우 -> 처음부터 end까지 조회
        if (typeof end != 'undefined') {
            if (typeof device != 'undefined') {
                connection.query('SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE DEVICE_NUM = ? AND CREATED_AT <= ?', [device, end], (error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send('Internal Server Error!');
                    }
                    res.status(200).send(result);
                });
            } else {
                connection.query('SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE CREATED_AT <= ?', [end], (error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send('Internal Server Error!');
                    }
                    res.status(200).send(result);
                });
            }
        }
        // 둘 다 없는 경우 -> 전체 기간 조회
        else {
            // 특정 device 조회
            if (typeof device != 'undefined') {
                connection.query('SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA WHERE DEVICE_NUM = ?', device, (error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send('Internal Server Error!');
                    }
                    res.status(200).send(result);
                });
            }
            // 전체조회
            else {
                connection.query('SELECT *, DATE_FORMAT(created_at, \'%Y/%m/%d %H:%i:%s\') AS CREATED_AT from SENSOR_DATA', (error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send('Internal Server Error!');
                    }
                    res.status(200).send(result);
                });
            }
        }
    }

});

router.post("/data", (req, res, next) => {
    let data = {...req.body, "created_at": new Date(Date.now())};

    connection.query('INSERT INTO SENSOR_DATA SET ?', data, (er) => {
        if (er) {
            console.log(er);
            res.status(500).send('Internal Server Error!');
        } else {
            res.status(201).send();
        }
    });
});

module.exports = router;