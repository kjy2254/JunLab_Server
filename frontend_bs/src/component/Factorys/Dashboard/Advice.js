import React from "react";
import "../../../css/Dashboard2.css";

function Advice() {
  return (
    <div className="advice layer2">
      <span className="bar" />
      <div className="header">
        <span>권고사항</span>
      </div>
      <div className="advice-content">
        <div className="box">
          <span className="level">1단계(정상)</span>
          <span className="color lv1" />
          <span className="text">작업 지속</span>
        </div>
        <div className="box">
          <span className="level">2단계(정상)</span>
          <span className="color lv2" />
          <span className="text">환풍기 가동</span>
        </div>
        <div className="box">
          <span className="level">3단계(경고)</span>
          <span className="color lv3" />
          <span className="text">집진기 가동</span>
        </div>
        <div className="box">
          <span className="level">4단계(경고)</span>
          <span className="color lv4" />
          <span className="text">작업자 휴식</span>
        </div>
        <div className="box">
          <span className="level">5단계(위험)</span>
          <span className="color lv5" />
          <span className="text">작업정지</span>
        </div>
      </div>
    </div>
  );
}

export default Advice;
