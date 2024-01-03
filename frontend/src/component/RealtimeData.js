import Sidebar from "./Sidebar";
import "../css/RealtimeData.css";
import "../css/Theme.css";
import Chart from "./Chart";
import React, { useEffect, useState } from "react";
import WorkerSummary from "./WorkerSummary";
import axios from "axios";
import { useParams } from "react-router-dom";
import Route from "./Route";
import finedust from "../image/finedust.svg";
import temperature from "../image/temperature.svg";
import co2 from "../image/co2.svg";
import tvoc from "../image/tvoc.svg";
import Header from "./Header";
import ForbiddenPage from "./ForbiddenPage";

function RealtimeData(props) {
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

  // useEffect(() => {
  //     axios.get(`http://junlab.postech.ac.kr:880/api/factory/${factoryId}/users`)
  //         .then((response) => {
  //             setWorkerData(response.data);
  //         })
  //         .catch((error) => {
  //             console.error('API 요청 실패:', error);
  //         });
  // }, []);

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
        <Sidebar header={factoryName} factoryId={factoryId} selected={"2"} />
        <div className="dashboard-content">
          <div className="main-section bg">
            <Header
              placeholder="Type any workers..."
              setData={setFilter}
              data={filter}
              isLogin={props.isLogin}
              name={props.name}
              role={props.role}
            />
            <div className="top-section">
              <Route
                routelist={["공장", factoryName]}
                finalroute={"실시간 데이터"}
              />
              <div className="last-update text-color">
                Last Update: {lastUpdate}
              </div>
            </div>
            <div className="module-selector">
              <select className="dropdown">
                <option value="1">A동</option>
                <option value="1">B동</option>
                <option value="1">C동</option>
              </select>
            </div>
            <div className="chart-section">
              <Chart
                chartIcon={tvoc}
                chartName="휘발성유기화합물"
                chartSubname="TVOC"
                chartUnit="ppb"
                data="tvoc"
                chartColor="#FFC246"
                factoryId={factoryId}
              />
              <Chart
                chartIcon={co2}
                chartName="이산화탄소"
                chartSubname="CO2"
                chartUnit="ppb"
                data="co2"
                chartColor="#5470DE"
                factoryId={factoryId}
              />
              <Chart
                chartIcon={temperature}
                chartName="온도"
                chartSubname="Temperature"
                chartUnit="°C"
                data="temperature"
                chartColor="#07BEAA"
                factoryId={factoryId}
              />
              <Chart
                chartIcon={finedust}
                chartName="미세먼지"
                chartSubname="Fine Dust"
                chartUnit="㎍/㎥"
                data="pm10"
                chartColor="#1786C4"
                factoryId={factoryId}
              />
            </div>
            <div className="summary-header">작업자 상태 요약</div>
            <div className="summary-card-area bg2">
              {workerData.map((worker, index) => (
                <WorkerSummary
                  key={index}
                  workerName={worker.name}
                  ID={worker.watch_id}
                  bpm={worker.last_heart_rate}
                  temperature={worker.last_body_temperature}
                  spo2={worker.last_oxygen_saturation}
                  online={worker.online ? "Online" : "Offline"}
                  batt={worker.adjusted_battery_level}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RealtimeData;
