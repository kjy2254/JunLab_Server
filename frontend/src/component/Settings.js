import Sidebar from "./Sidebar";
import "../css/Dashboard.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";
import ForbiddenPage from "./ForbiddenPage";
import Route from "./Route";
import "../css/Settings.css";
import "../css/Theme.css";
import SetFloorplan from "./SetFloorplan";
import SetFloorplan2 from "./SetFloorplan2";

function Settings(props) {
  const { factoryId } = useParams();
  const [factoryName, setFactoryName] = useState();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // API 요청을 보내고 데이터를 가져옵니다.
    axios
      .get(`http://junlab.postech.ac.kr:880/api/factory/${factoryId}`)
      .then((response) => {
        setFactoryName(response.data.factoryName);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  });

  if (
    !props.isLogin ||
    (props.role !== "Factory_" + factoryId && props.role !== "Admin")
  ) {
    return (
      <ForbiddenPage
        isLogin={props.isLogin}
        role={props.role}
        name={props.name}
      />
    );
  } else {
    return (
      <div className="settings-container">
        <Sidebar header={factoryName} factoryId={factoryId} selected={"4"} />
        <div className="settings-content bg">
          <div className="main-section">
            <Header
              placeholder="Type any workers..."
              setData={setFilter}
              data={filter}
              isLogin={props.isLogin}
              role={props.role}
              name={props.name}
            />
            <div className="top-section">
              <Route routelist={["공장", factoryName]} finalroute={"설정"} />
            </div>
            <div className="view-section bg2">
              <SetFloorplan2 factoryId={factoryId} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
