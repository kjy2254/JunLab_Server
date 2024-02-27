import React, { useEffect } from "react";
import "../../css/MyPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faVenus,
  faMars,
} from "@fortawesome/free-solid-svg-icons";
function UserInit(props) {
  useEffect(() => {
    props.setHeaderText("내 정보");
  }, []);

  const data = { gender: "male" };

  return (
    <div className="mypage">
      <div className="mypage-wrapper layer2">
        <span className="header">기본 프로필</span>
        <hr />
        <img src={`http://junlab.postech.ac.kr:880/api2/image/factory_1.png`} />
        <div className="name">
          <FontAwesomeIcon
            icon={data.gender == "male" ? faMars : faVenus}
            className={data.gender == "male" ? "male" : "female"}
          />
          김이름
        </div>
        <hr />
        <div className="info-wrapper">
          <div className="key">이메일:</div>
          <span>example@postech.ac.kr</span>
        </div>
        <div className="info-wrapper">
          <div className="key">주소:</div> <span> 경북 포항시 </span>
        </div>
        <div className="info-wrapper">
          <div className="key">HP:</div> <span> 010-1234-5678 </span>
        </div>
        <div className="info-wrapper">
          <div className="key">생년월일:</div> <span> 1998-01-01 </span>
        </div>
        <div className="info-wrapper">
          <div className="key">소속:</div> <span> 포항공과대학교 </span>
        </div>
        {/* <div className="info-wrapper">
          <div className="key">가입일:</div> <span> 2024-01-01 </span>
        </div>
        <div className="info-wrapper">
          <div className="key">권한:</div> <span> 일반사용자 </span>
        </div> */}
        {/* <hr /> */}
        <div className="bottom">
          <span>가입일: 2024-02-04</span>
          <span>권한: 일반사용자</span>
        </div>
      </div>

      <div className="mypage-wrapper layer2">
        <span className="header">건강 프로필</span>
        <hr />
        <div className="info-wrapper">
          <div className="key">키:</div>
          <span> 180cm</span>
        </div>
        <div className="info-wrapper">
          <div className="key">몸무게:</div>
          <span> 80kg</span>
        </div>
        <div className="info-wrapper">
          <div className="key">흡연:</div>
          <span> x</span>
        </div>
        <div className="info-wrapper">
          <div className="key">음주:</div>
          <span> 0.5병/주</span>
        </div>
        <div className="info-wrapper">
          <div className="key">직종:</div>
          <span> 주조</span>
        </div>
        <div className="info-wrapper">
          <div className="key">근속년수:</div>
          <span> 7년</span>
        </div>
        <div className="info-wrapper">
          <div className="key">질환:</div>
          <span> -</span>
        </div>
        <div className="bottom edit">
          <button>수정</button>
        </div>
      </div>
    </div>
  );
}

export default UserInit;
