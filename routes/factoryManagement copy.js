const express = require("express");
const path = require("path");
const factorymanagement2 = express.Router();

factorymanagement2.use(
  express.static(path.join(__dirname, "../frontend_bs/build"))
);

factorymanagement2.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend_bs/build/index.html"));
});

module.exports = factorymanagement2;
