const express = require("express");
const session = require("express-session");
const path = require("path");
const login = express.Router();

const connection = require("../database/apiConnection");
const labelConnection = require("../database/labelConnection");
const sessionOption = require("../database/sessionOptions");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

login.use(express.static(path.join(__dirname, "./frontend/build")));
login.use(bodyParser.urlencoded({ extended: false }));
login.use(bodyParser.json());

let MySQLStore = require("express-mysql-session")(session);
let sessionStore = new MySQLStore(sessionOption);
login.use(
  session({
    key: "session_cookie_name",
    secret: "~",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

login.get("/authcheck2", (req, res) => {
  const sendData = {
    isLogin: "",
    name: "",
    userId: "",
    authority: "",
    manageOf: "",
  };
  if (req.session.is_logined) {
    sendData.isLogin = true;
    sendData.name = req.session.name;
    sendData.userId = req.session.userId;
    sendData.authority = req.session.authority;
    sendData.manageOf = req.session.manageOf;
  } else {
    sendData.isLogin = false;
  }
  res.send(sendData);
});

login.get("/logout2", function (req, res) {
  // console.log("logout");
  req.session.destroy(function (err) {
    res.redirect("/factoryManagement/");
  });
});

login.post("/login2", (req, res) => {
  // 데이터 받아서 결과 전송
  const id = req.body.userId;
  const password = req.body.userPassword;
  const sendData = {
    isLogin: "",
    name: "",
    userId: "",
    authority: "",
    manageOf: "",
  };

  if (id && password) {
    // id와 pw가 입력되었는지 확인
    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      function (error, results) {
        if (error) throw error;
        if (results.length > 0) {
          // db에서의 반환값이 있다 = 일치하는 아이디가 있다.
          bcrypt.compare(password, results[0].password, (err, result) => {
            // 입력된 비밀번호가 해시된 저장값과 같은 값인지 비교
            if (result === true) {
              // 비밀번호가 일치하면
              req.session.is_logined = true; // 세션 정보 갱신
              req.session.name = results[0].name;
              req.session.userId = results[0].id;
              req.session.authority = results[0].authority;
              req.session.manageOf = results[0].manager_of;

              req.session.save(function () {
                sendData.isLogin = true;
                sendData.name = results[0].name;
                sendData.userId = results[0].id;
                sendData.authority = results[0].authority;
                sendData.manageOf = results[0].manager_of;
                res.send(sendData);
              });
            } else {
              // 비밀번호가 다른 경우
              sendData.isLogin = "로그인 정보가 일치하지 않습니다.";
              res.send(sendData);
            }
          });
        } else {
          // db에 해당 아이디가 없는 경우
          sendData.isLogin = "아이디 정보가 일치하지 않습니다.";
          res.send(sendData);
        }
      }
    );
  } else {
    // 아이디, 비밀번호 중 입력되지 않은 값이 있는 경우
    sendData.isLogin = "아이디와 비밀번호를 입력하세요!";
    res.send(sendData);
  }
});

login.post("/label-login", (req, res) => {
  // 데이터 받아서 결과 전송
  const id = req.body.labelerId;

  if (id) {
    labelConnection.query(
      "SELECT * FROM labeler WHERE id = ?",
      [id],
      (error, results) => {
        if (results.length != 0) {
          res.send({ isLogin: true, id: results[0].id, type: results[0].type });
        } else {
          res.send({ isLogin: false });
        }
      }
    );
  } else {
    res.send({ isLogin: false });
  }
});

login.post("/signup2", (req, res) => {
  // 데이터 받아서 결과 전송
  const id = req.body.id;
  const password = req.body.password;
  const password2 = req.body.password2;
  const name = req.body.name;
  const gender = req.body.gender == "남성" ? "Male" : "Female";
  const birth = req.body.birth;
  const code = req.body.code;
  const email = req.body.email;
  const phone = req.body.phone;
  const address = req.body.address;

  const sendData = { isSuccess: "" };

  // console.log(username, password, password2, email);

  if (id && password && password2) {
    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      (error, results) => {
        // DB에 같은 이름의 회원아이디가 있는지 확인
        if (error) throw error;
        if (results.length <= 0 && password == password2) {
          // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우
          const hasedPassword = bcrypt.hashSync(password, 10); // 입력된 비밀번호를 해시한 값
          connection.query(
            "INSERT INTO users (id, password, name, gender, date_of_birth, email, phone_number, address, role, code, join_date) VALUES(?,?,?,?,?,?,?,?,?,?, NOW())",
            [
              id,
              hasedPassword,
              name,
              gender,
              birth,
              email,
              phone,
              address,
              "Default",
              code,
            ],
            (error) => {
              if (error) throw error;
              req.session.save(function () {
                sendData.isSuccess = true;
                console.log("저장성공");
                res.send(sendData);
              });
            }
          );
        } else if (password != password2) {
          // 비밀번호가 올바르게 입력되지 않은 경우
          sendData.isSuccess = "입력된 비밀번호가 서로 다릅니다.";
          res.send(sendData);
        } else {
          // DB에 같은 이름의 회원아이디가 있는 경우
          sendData.isSuccess = "이미 존재하는 아이디 입니다!";
          res.send(sendData);
        }
      }
    );
  } else {
    sendData.isSuccess = "아이디와 비밀번호를 입력하세요!";
    res.send(sendData);
  }
});

module.exports = login;
