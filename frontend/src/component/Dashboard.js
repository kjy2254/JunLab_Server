import Sidebar from "./Sidebar";
import "../css/Dashboard.css";
import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";
import ForbiddenPage from "./ForbiddenPage";
import Route from "./Route";
import Floorplan from "./Floorplan";
import Panel from "./Panel";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

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

  const options1 = {
    title: {
      text: null,
    },
    chart: {
      type: "pie",
      animation: true,
      height: 200,
      backgroundColor: "#e6ecf0",
      borderRadius: 25,
      margin: 10,
      // style: {
      //   maxWidth: 300,
      //   minWidth: 100,
      // },
    },
    credits: {
      enabled: false,
    },
    subtitle: {
      useHTML: true,
      text: "<span style='font-weight: bold;'>전체 작업자</span><br/>10명",
      verticalAlign: "middle",
      y: 15,
      style: {
        fontSize: "18px", // 원하는 글씨 크기로 조절
        textAlign: "center",
      },
    },
    tooltip: {
      // valueDecimals: 1,
      valueSuffix: " 명",
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        colorByPoint: true,
        type: "pie",
        size: "110%",
        innerSize: "80%",
        dataLabels: {
          enabled: true,
          crop: false,
          distance: "-10%",
          style: {
            fontWeight: "bold",
            fontSize: "16px",
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      crop: false,
      distance: "-10%",
      style: {
        fontWeight: "bold",
      },
      connectorWidth: 0,
    },
    colors: ["#ce1515", "#ffd901", "#30B402"],
    series: [
      {
        name: "",
        data: [
          {
            name: "위험",
            y: 2,
          },
          {
            name: "경고",
            y: 5,
          },
          {
            name: "정상",
            y: 15,
          },
        ],
      },
    ],
  };

  const options2 = {
    title: {
      text: null,
    },
    chart: {
      type: "pie",
      // width: 200,
      height: 200,
      animation: true,
      backgroundColor: "#e6ecf0",
      borderRadius: 25,
      margin: 10,
    },
    credits: {
      enabled: false,
    },
    subtitle: {
      useHTML: true,
      text: "<span style='font-weight: bold;'>현재 구역</span><br/>5명",
      verticalAlign: "middle",
      y: 15,
      style: {
        fontSize: "18px", // 원하는 글씨 크기로 조절
        textAlign: "center",
      },
    },
    tooltip: {
      // valueDecimals: 1,
      valueSuffix: " 명",
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        colorByPoint: true,
        type: "pie",
        size: "110%",
        innerSize: "80%",
        dataLabels: {
          enabled: true,
          crop: false,
          distance: "-10%",
          style: {
            fontWeight: "bold",
            fontSize: "16px",
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      crop: false,
      distance: "-10%",
      style: {
        fontWeight: "bold",
      },
      connectorWidth: 0,
    },
    colors: ["#ce1515", "#ffd901", "#30B402"],
    series: [
      {
        name: "",
        data: [
          {
            name: "위험",
            y: 2,
          },
          {
            name: "경고",
            y: 4,
          },
          {
            name: "정상",
            y: 3,
          },
        ],
      },
    ],
  };

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
            <div className="view-section">
              <div className="view-left">
                <select className="dropdown">
                  <option value="1">A동</option>
                  <option value="1">B동</option>
                  <option value="1">C동</option>
                </select>
                <Floorplan />
              </div>
              <div className="view-right">
                {/* <Fragment>
                  <HighchartsReact highcharts={Highcharts} options={options1} />
                </Fragment>
                <Fragment>
                  <HighchartsReact highcharts={Highcharts} options={options2} />
                </Fragment> */}
                <Panel />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
