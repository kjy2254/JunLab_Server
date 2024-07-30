import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/ChangePW.css";

function ChangePW(props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  // const [message, setMessage] = useState("");

  const { userId } = useParams();

  useEffect(() => {
    props.setHeaderText("비밀번호 변경");
  }, [props]);

  const handleChangePassword = async () => {
    try {
      axios
        .post("http://junlab.postech.ac.kr:880/login/change-password", {
          userId,
          oldPassword,
          newPassword,
          newPassword2,
        })
        .then((response) => {
          alert(response.data.message);
          if (response.data.isSuccess) {
            window.location.href = `http://junlab.postech.ac.kr:880/login/logout2`;
          }
        });
    } catch (error) {
      alert("서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="change-password">
      <div>
        <label>
          현재 비밀번호:
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          새 비밀번호:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          새 비밀번호 확인:
          <input
            type="password"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleChangePassword}>비밀번호 변경</button>
    </div>
  );
}

export default ChangePW;
