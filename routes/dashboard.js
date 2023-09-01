const express = require("express");
const path = require("path");
const dashboard = express.Router();


dashboard.use(express.static(path.join(__dirname, '../frontend/build')));


dashboard.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
})

module.exports = dashboard;