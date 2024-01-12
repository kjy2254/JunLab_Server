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
  const container = document.querySelector(".Account-scroll");

  const renderInputFields = (count) => {
    const inputFields = [];

    for (let i = 1; i < count; i++) {
      inputFields.push(
        <p className="flex-container margin-left-2" key={i}>
          작업자{i} <input className="input-form"/>
        </p>
      );
    }

    return inputFields;
  };

  return (
    <div className="center bg-layer1">
      <div className="bg-layer2 ac-bgcolor2">
        <p className="left-align-text">
          계정 정보
          <button className="btn-container" onClick={() => {}}>
            <img src={edit} width={20} className="img-form" />
          </button>
        </p>
        <div className="Account-scroll">
          <p className="flex-container margin-left-2 display-flex">
            권한
            <p className="flex-container account-title">미승인</p>
          </p>
          <p className="margin-left-2">
            공장
            <input className="input-form"></input>
          </p>
          <p className="flex-container margin-left-2">
            관리자
            <input className="input-form"></input>
          </p>
          <p className="flex-container margin-left-2">
            연락처<input className="input-form"></input>
          </p>
          <p className="flex-container margin-left-2">
            이메일<input className="input-form"></input>
          </p>
          <p className="flex-container margin-left-2">
            생년월일<input className="input-form"></input>
          </p>
        </div>
      </div>
      <div className="bg-layer2 ac-bgcolor2">
        <p className="left-align-text">직원 정보</p>
        <div className="Account-scroll">{renderInputFields(40)}</div>{" "}
      </div>
    </div>
  );
}

export default Account;
