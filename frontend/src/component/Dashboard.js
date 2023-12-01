import Sidebar from "./Sidebar";
import "../css/Dashboard.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";
import ForbiddenPage from "./ForbiddenPage";
import Route from "./Route";

function Dashboard(props) {
  const [workerData, setWorkerData] = useState([]);
  const [factoryName, setFactoryName] = useState();
  const [lastUpdate, setLastUpdate] = useState();
  const [filter, setFilter] = useState("");

  const { factoryId } = useParams();

  const fetchData = async () => {
    try {
      axios
        .get(`http://junlab.postech.ac.kr:880/api/factory/${factoryId}`)
        .then((response) => {
          setFactoryName(response.data.factoryName);
          setLastUpdate(response.data.last_update);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
      axios
        .get(`http://junlab.postech.ac.kr:880/api/factory/${factoryId}/users`)
        .then((response) => {
          setWorkerData(response.data);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  useEffect(() => {
    // API 요청을 보내고 데이터를 가져옵니다.
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 7000);
    // 컴포넌트가 언마운트될 때 clearInterval을 호출하여 인터벌 정리
    return () => {
      clearInterval(interval);
    };
  }, []);

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
      <div className="dashboard-container">
        <Sidebar header={factoryName} factoryId={factoryId} selected={"1"} />
        <div className="dashboard-content">
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
              <Route
                routelist={["공장", "한금 포항공장"]}
                finalroute={"통합상황판"}
              />
            </div>
            <div className="summary-section">
              총 작업자수: 10 빨간색: 3 노란색: 5 초록색: 2
            </div>
            <div className="view-section"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
