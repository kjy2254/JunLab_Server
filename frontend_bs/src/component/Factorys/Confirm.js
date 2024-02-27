import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../css/Confirm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";

function Confirm(props) {
  useEffect(() => {
    props.setHeaderText("가입 승인");
  }, []);
  const { factoryId } = useParams();
  const [data, setData] = useState([]);

  const fetchData = () => {
    axios
      .get(`http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/confirms`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  function action(isConfirm, id, name) {
    const actionType = isConfirm ? "승인" : "거절";
    const apiUrl = `http://junlab.postech.ac.kr:880/api2/confirms/${
      isConfirm ? "allow" : "reject"
    }/${id}`;

    if (window.confirm(`'${name}'의 가입을 ${actionType}하시겠습니까?`)) {
      axios
        .put(apiUrl)
        .then(() => {
          alert(`가입을 ${actionType}하였습니다.`);
          fetchData();
        })
        .catch((error) => {
          alert(`API 요청 실패: ${error}`);
        });
    }
  }

  return (
    <div className="confirm">
      <div className="confirm-wrapper layer2">
        <span className="bar" />
        <div className="header">
          <span>가입 대기자</span>
        </div>
        <table>
          <thead>
            <tr>
              <td>이름</td>
              <td>성별</td>
              <td>생년월일</td>
              <td>전화번호</td>
              <td>가입시간</td>
              <td>승인</td>
            </tr>
          </thead>
          <tbody>
            {data?.map((e) => (
              <tr>
                <td>{e.name}</td>
                <td>{e.gender}</td>
                <td>{new Date(e.date_of_birth).toLocaleDateString()}</td>
                <td>{e.phone_number}</td>
                <td>
                  {new Date(e.join_date).toLocaleDateString() +
                    " " +
                    new Date(e.join_date).toLocaleTimeString()}
                </td>
                <td>
                  <button className="allow">
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ width: "100%", height: "100%" }}
                      onClick={() => action(true, e.id, e.name)}
                    />
                  </button>
                  <button className="reject">
                    <FontAwesomeIcon
                      icon={faXmark}
                      style={{ width: "100%", height: "100%" }}
                      onClick={() => action(false, e.id, e.name)}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Confirm;
