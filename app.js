var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ejs = require("ejs");
var indexRouter = require('./routes/index');
var iitpRouter = require('./routes/iitp');
const cors = require('cors');
const bodyParser = require("body-parser");
const fs = require('fs');
var app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

//logger
app.use(logger({
    format: 'dev',
    stream: fs.createWriteStream('app.log', {'flags': 'w'})
}));
app.use(logger("[:remote-addr] :method :url"), (req, res, next) =>{
    next();
});


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.text());
// cors 설정
app.use(cors({
    origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
}));

app.use('/static', express.static('static'));
app.use('/', indexRouter);
app.use('/iitp', iitpRouter);

const { swaggerUi, specs } = require("./swagger/swagger")
app.use("/iitp/docs/api", swaggerUi.serve, swaggerUi.setup(specs))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    // next(createError(404));
    res.status(404).send('404 Not found');
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
