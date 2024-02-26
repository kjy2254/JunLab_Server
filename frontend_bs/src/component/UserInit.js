import React, { useState } from "react";
import "../css/UserInit.css";
import { Link } from "react-router-dom";
import axios from "axios";

function UserInit() {
  return (
    <div className="user-init">
      <div className="user-init-wrapper layer2">
        <label>
          이름
          <input type="text" />
        </label>
        <div className="gender-birth">
          <label>
            성별
            <label>
              남
              <input
                type="radio"
                value="name"
                name="search-type"
                // checked={selected.type == "name" ? "checked" : ""}
                // onChange={(e) =>
                //   setSelected({ ...selected, type: e.target.value })
                // }
              />
            </label>
            <label>
              여
              <input
                type="radio"
                value="watch"
                name="search-type"
                // onChange={(e) =>
                //   setSelected({ ...selected, type: e.target.value })
                // }
              />
            </label>
          </label>

          <label>
            생년월일
            <input type="date" />
          </label>
        </div>

        <label>
          이메일
          <input type="text" />
        </label>
        <label>
          전화번호
          <input type="text" />
        </label>
        <label>
          주소
          <input type="text" />
        </label>
      </div>
      {/* 초기정보 입력 페이지
      <br /> 이곳에서 개인정보를 입력하고 user id를 알려줌.
      <br /> 수정과 저장이 가능해야함.
      <br /> 저장 할 시 authlevel 을 1로 올림(승인 요청 상태)
      <br /> 관리자는 authlevel 이 1인 대기자들 명단을 확인 해서 공장에 할당 후
      level 2(일반사용자)로 변경가능
      <br /> 일반 사용자는 자신의 생체 기록을 확인하고 다운로드 할 수 있어야함.
      <br />
      <br /> 매니저 레벨로 할당할 경우 해당 공장에 대한 정보를 볼 수 있는 권한이
      생김.
      <br /> 헤더에서 매니저 페이지와 일반 사용자 페이지간의 전환이 가능해야 함. */}
    </div>
  );
}

export default UserInit;
