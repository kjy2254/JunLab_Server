import Sidebar from "./Sidebar";
import "../css/Theme.css";
import "../css/Account.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";
import edit from "../image/edit.svg";

function Account(props) {
  const [filter, setFilter] = useState("");

  const { factoryId } = useParams();

  return (
    <div className="account-container ">
      <Sidebar header={""} factoryId={factoryId} />
      <div className="account-content">
        <div className="account-main-section bg">
          <Header
            placeholder="Type any settings..."
            setData={setFilter}
            data={filter}
            isLogin={props.isLogin}
            role={props.role}
            name={props.name}
            userId={props.userId}
          />
          <AccountComponent />
        </div>
      </div>
    </div>
  );
}

function AccountComponent() {
  return (
    <div className="center">
      <div className="center bg-layer1 ac-bgcolor1">
        <div className="bg-layer2 ac-bgcolor2">
          <p className="left-align-text">
            계정 정보
            <button className="btn-container" onClick={() => {}}>
              <img src={edit} width={20} className="img-form" />
            </button>
          </p>
          <div className="Account-scroll">
            <p className="margin-left-1 display-flex">
              권한
              <p className="account-title">미승인</p>
            </p>
            <p className="margin-left-1">
              공장
              <input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              관리자
              <input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              연락처<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              이메일<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              생년월일<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              추가<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              추가<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              추가<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              추가<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              추가<input className="input-form"></input>
            </p>
          </div>
        </div>
        <div className="bg-layer2 ac-bgcolor2">
          <p className="left-align-text">직원 정보</p>
          <div className="Account-scroll">
            <p className="margin-left-1">
              이름<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              이름<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              이름<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              이름<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              이름<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              이름<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              이름<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              이름<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              이름<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              이름<input className="input-form"></input>
            </p>
            <p className="margin-left-1">
              이름<input className="input-form"></input>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
