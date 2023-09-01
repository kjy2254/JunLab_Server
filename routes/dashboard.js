const express = require("express");
const dashboard = express.Router();

dashboard.get("/", (req, res) => {
    res.render("IITP/dashboard")
})

module.exports = dashboard;