const express = require("express");
const router = express.Router();
const connection = require('../database/mysql');

router.get("/data", function (req, res, next) {
    connection.query('SELECT * from SENSOR_DATA', (error, rows, fields) => {
        if (error) throw error;
        res.send(rows);
    });
});

router.post("/data", function (req, res, next) {
    connection.query('SELECT * from SENSOR_DATA', (error, rows, fields) => {
        if (error) throw error;
        res.send(rows);
    });
    res.send(req.body);
});

module.exports = router;