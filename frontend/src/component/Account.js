import Sidebar from "./Sidebar";
import "../css/Theme.css";
import "../css/Account.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";

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
          <p className="left-align-text">계정 정보</p>
          <div className="scroll">
            <p>테스트</p>
            <p>테스트</p>
            <p>테스트</p>
            <p>테스트</p>
            <p>테스트</p>
            <p>테스트</p>
            <p>테스트</p>
            <p>테스트</p>
            <p>테스트</p>
            <p>테스트</p>
            <p>테스트</p>
            <p>테스트</p>
            <p>테스트</p>
            <p>케케케</p>
            <p>케케케</p>
            <p>케케케</p>
            <p>케케케</p>
            <p>케케케</p>
            <p>케케케</p>
            <p>케케케</p>
          </div>
        </div>
        <div className="bg-layer2 ac-bgcolor2">
          <p className="left-align-text">직원 정보</p>
        </div>
      </div>
    </div>
  );
}

export default Account;
