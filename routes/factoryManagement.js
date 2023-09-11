const express = require("express");
const path = require("path");
const factoryManagement = express.Router();


factoryManagement.use(express.static(path.join(__dirname, '../frontend/build')));

factoryManagement.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
})

module.exports = factoryManagement;