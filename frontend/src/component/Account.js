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
        </div>
        <span>asdf</span>
      </div>
    </div>
  );
}

export default Account;
