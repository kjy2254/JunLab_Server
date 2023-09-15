const express = require('express')
const session = require('express-session')
const path = require('path');
const login = express.Router();

const connection = require('../database/apiConnection');
const sessionOption = require('../database/sessionOptions');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

login.use(express.static(path.join(__dirname, './frontend/build')));
login.use(bodyParser.urlencoded({ extended: false }));
login.use(bodyParser.json());

let MySQLStore = require('express-mysql-session')(session);
let sessionStore = new MySQLStore(sessionOption);
login.use(session({
    key: 'session_cookie_name',
    secret: '~',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

login.get('/authcheck', (req, res) => {
    const sendData = { isLogin: "", role: "", name:"" };
    if (req.session.is_logined) {
        sendData.isLogin = true;
        sendData.role = req.session.role;
        sendData.name = req.session.name;
    } else {
        sendData.isLogin = false;
    }
    res.send(sendData);
});

login.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/iitp/factoryManagement/');
    });
});

login.post("/login", (req, res) => { // 데이터 받아서 결과 전송
    const username = req.body.userId;
    const password = req.body.userPassword;
    const sendData = { isLogin: "", role: "", name: "" };

    if (username && password) {             // id와 pw가 입력되었는지 확인

        console.log("Asdf1");
        connection.query('SELECT * FROM users WHERE username = ?', [username], function (error, results) {
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.
                console.log("Asdf2");
                bcrypt.compare(password , results[0].password, (err, result) => {    // 입력된 비밀번호가 해시된 저장값과 같은 값인지 비교
                    console.log("Asdf3");
                    if (result === true) {                  // 비밀번호가 일치하면
                        req.session.is_logined = true;      // 세션 정보 갱신
                        req.session.name = results[0].last_name + results[0].first_name;
                        req.session.role = results[0].role;

                        req.session.save(function () {
                            sendData.isLogin = true;
                            sendData.role = results[0].role;
                            sendData.name = results[0].last_name + results[0].first_name;
                            res.send(sendData);
                        });
                    }
                    else{                                   // 비밀번호가 다른 경우
                        sendData.isLogin = "로그인 정보가 일치하지 않습니다."
                        res.send(sendData);
                    }
                })
            } else {    // db에 해당 아이디가 없는 경우
                sendData.isLogin = "아이디 정보가 일치하지 않습니다."
                res.send(sendData);
            }
        });
    } else {            // 아이디, 비밀번호 중 입력되지 않은 값이 있는 경우
        sendData.isLogin = "아이디와 비밀번호를 입력하세요!"
        res.send(sendData);
    }
});

login.post("/signup", (req, res) => {  // 데이터 받아서 결과 전송
    const username = req.body.userId;
    const password = req.body.userPassword;
    const password2 = req.body.userPassword2;
    const email = req.body.email;

    const sendData = { isSuccess: "" };

    if (username && password && password2) {
        connection.query('SELECT * FROM users WHERE username = ?', [username], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && password == password2) {         // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우
                const hasedPassword = bcrypt.hashSync(password, 10);    // 입력된 비밀번호를 해시한 값
                connection.query('INSERT INTO users (username, password, email, role) VALUES(?,?,?,?)', [username, hasedPassword, email, 'Default'], function (error, data) {
                    if (error) throw error;
                    req.session.save(function () {
                        sendData.isSuccess = true
                        res.send(sendData);
                    });
                });
            } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
                sendData.isSuccess = "입력된 비밀번호가 서로 다릅니다."
                res.send(sendData);
            }
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
                sendData.isSuccess = "이미 존재하는 아이디 입니다!"
                res.send(sendData);
            }
        });
    } else {
        sendData.isSuccess = "아이디와 비밀번호를 입력하세요!"
        res.send(sendData);
    }

});

module.exports = login;