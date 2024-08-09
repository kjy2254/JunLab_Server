import axios from "axios";
import React, { useState } from "react";
import styles from "./Login.module.css";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  function postLogin() {
    const userData = {
      id: id,
      password: password,
    };
    axios
      .post("http://junlab.postech.ac.kr:880/api/labeling/KICT/login", userData)
      .then((response) => {
        const data = response.data;
        if (data.isLogin === true) {
          window.location.href = `/KICT/`;
        } else {
          alert(data.isLogin);
        }
      });
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      postLogin();
    }
  };

  return (
    <div className={`${styles.login} layer1`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="376"
        height="317"
        fill="none"
        className={styles.bottom}
      >
        <path
          fill="#2B87F3"
          d="M98 59.596c-28-61.6-77-63.667-98-57v314l375-1c2.4-80.8-78-135.333-118-150-41.333-9.667-131-44.4-159-106Z"
        ></path>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="235"
        height="255"
        fill="none"
        className={styles.top}
      >
        <path
          fill="#62CFF1"
          fill-opacity="0.5"
          d="M68.1 80.835C29.568 58.825 50.747 26.4 66.154 12.937L221.33 57.304l-47.588 170.031c-54.155 25.255-83.028 7.944-90.695-3.868-5.774-13.59 7.306-40.363 14.567-52.051 19.963-22.85 22.57-48.563 21.379-58.563-6.44-19.763-36.613-29.58-50.894-32.018Z"
        ></path>
        <path
          fill="#62CFF1"
          d="M88 72C43.2 60 55.333 19 67 0l168 1v196c-47.2 43.2-81 33.333-92 23-9.6-12.8-4-45.333 0-60 13.6-30.4 9-58.667 5-69-12-19.2-45-20.667-60-19Z"
        ></path>
      </svg>
      <div className={`${styles["login-wrapper"]}`}>
        <h1 className={`${styles["logo"]}`}>교량 외관망도 라벨링 시스템</h1>
        <div className={`${styles["form"]} layer2`}>
          <div>
            <h5>로그인</h5>
          </div>
          <div className={`${styles["input-wrapper"]}`}>
            <div className={`${styles["id-wrapper"]}`}>
              <span>아이디</span>
              <input
                id="id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div className={`${styles["pw-wrapper"]}`}>
              <span>패스워드</span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
          <div className={`${styles["button-wrapper"]}`}>
            <button onClick={postLogin}>로그인</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
