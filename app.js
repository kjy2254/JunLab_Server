var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var factoryApi = require("./routes/factoryApi");
var labelingApi = require("./routes/labelingApi");
var longinApi = require("./routes/loginApi");
var userApi = require("./routes/userApi");
// var modelApi = require("./routes/modelApi");
const cors = require("cors");
const bodyParser = require("body-parser");
var app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

// skip 함수 정의
function skipLogging(req) {
  return (
    req.url.includes("load-more") ||
    req.url.includes(".js") ||
    req.url.includes(".css") ||
    req.url.includes("favicon") ||
    req.originalUrl.includes("api")
  );
}
app.use(
  logger("[:remote-addr] :method :url", { skip: skipLogging }),
  (req, res, next) => {
    next();
  }
);
app.get("/", (req, res) => {
  res.render("Home");
});
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "frontend_bs/build")));
app.use(express.static(path.join(__dirname, "labelingsystem/build")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.text());
// cors 설정
app.use(
  cors({
    origin: "*", // 모든 출처 허용 옵션
  })
);
app.use("/static", express.static("static"));
app.get("/iitp", (req, res) => {
  res.render("./IITP");
});
app.use("/api2", factoryApi);
app.use("/api/labeling", labelingApi);
app.use("/login", longinApi);
// app.use("/api2/model", modelApi);
app.use("/api2/user", userApi);
// app.get("/factorymanagement/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend_bs/build/index.html"));
// });
// app.get("/labeling/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend_bs/build/index.html"));
// });
app.get("/factorymanagement/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend_bs/build/index.html"));
});

app.get("/KICT/*", (req, res) => {
  res.sendFile(path.join(__dirname, "labelingsystem/build/index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send("404 Not found");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
