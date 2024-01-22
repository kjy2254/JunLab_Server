import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTable } from "react-table";
import "../css/Dashboard.css";
import finedust from "../image/finedust.svg";
import temperature from "../image/temperature.svg";
import co2 from "../image/co2.svg";
import tvoc from "../image/tvoc.svg";
import defaultProfile from "../image/profile_default.png";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function Dashboard(props) {
  props.setHeaderText("통합상황판");
  return (
    <div className="dashboard">
      <div className="dashboard-wrapper">
        {/* <h5>통합상황판</h5> */}
        <div className="first-row">
          <EnvCard title={"TVOC"} unit={"ppb"} endpoint={"tvoc"} img={tvoc} />
          <EnvCard title={"CO2"} unit={"ppb"} endpoint={"co2"} img={co2} />
          <EnvCard
            title={"Temperature"}
            unit={"°C"}
            endpoint={"temperature"}
            img={temperature}
          />
          <EnvCard
            title={"Fine Dust"}
            unit={"㎍/㎥"}
            endpoint={"finedust"}
            img={finedust}
          />
        </div>
        <div className="second-row">
          <WorkerSummary />
          <WorkerStatistic />
        </div>
        <div className="third-row">
          <Advice />
        </div>
      </div>
    </div>
  );
}

function EnvCard({ title, unit, endpoint, img }) {
  const { factoryId } = useParams();
  const [data, setData] = useState({});
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/${endpoint}`
        )
        .then((response) => {
          // console.log(response.data);
          setData(response.data);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="env-card">
      <span class="bar" />
      <img src={img} />
      <div className="text">
        <span className="title">{title}</span>
        <span className="value">
          {data.length > 0 &&
          new Date() - new Date(data[index].last_update) < 30000
            ? `${data[index][endpoint]} ${unit}`
            : "Offline"}
        </span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 16 16"
        className={`left ${index === 0 ? "disabled" : "able"}`}
        onClick={() => {
          if (0 < index) setIndex(index - 1);
        }}
      >
        <path
          fillRule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 16 16"
        className={`right ${index == data.length - 1 ? "disabled" : ""}`}
        onClick={() => {
          if (data.length - 1 > index) setIndex(index + 1);
        }}
      >
        <path
          fillRule="evenodd"
          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
        />
      </svg>
      <span className="module-name">{data[index]?.module_name}</span>
    </div>
  );
}

function WorkerSummary() {
  const { factoryId } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/workers`
        )
        .then((response) => {
          console.log(response.data);
          setData(response.data);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="worker-summary">
      <span class="bar" />
      <div className="header">
        <span>작업자 상태</span>
      </div>

      <table>
        <thead>
          <tr>
            <th width={200}>작업자</th>
            <th width={120}>
              <circle cx="6.5" cy="6.5" r="6.5" fill="#FF0000"></circle>
              심박수(bpm)
            </th>
            <th width={120}>체온(°C)</th>
            <th width={120}>산소포화도(%)</th>
            <th width={90}>위험도</th>
            <th width={100}>상태</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((e) => (
              <tr>
                <td>
                  <div className="table-worker">
                    <img src={defaultProfile} width={42} height={42} />
                    <div className="info">
                      <span className="name">{e.name}</span>
                      <span className="watch">Watch: {e.watch_id}</span>
                    </div>
                  </div>
                </td>
                <td>{e.last_heart_rate}</td>
                <td>{e.last_body_temperature}</td>
                <td>{parseInt(e.last_oxygen_saturation)}</td>
                <td>
                  <div className="level lv1">1단계</div>
                </td>
                <td>
                  {e.online ? (
                    <div className="state">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                      >
                        <circle cx="6.5" cy="6.5" r="6.5" fill="#81FF02" />
                      </svg>
                      Online
                    </div>
                  ) : (
                    <div className="state">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                      >
                        <circle cx="6.5" cy="6.5" r="6.5" fill="#FF0000" />
                      </svg>
                      Offline
                    </div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkerStatistic() {
  const { factoryId } = useParams();

  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent", // 배경을 투명하게 설정
      plotBorderWidth: null, // 테두리 제거
      plotShadow: false, // 그림자 제거
      // height: 250,
      width: 300,
      height: 300,
      plotBorderColor: "transparent",
    },
    credits: {
      enabled: false, // 워터마크 제거
    },
    title: {
      text: null,
    },
    tooltip: {
      enabled: false,
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        // allowPointSelect: true,
        // cursor: "pointer",
        dataLabels: {
          enabled: true,
          distance: -18,
          inside: true, // 데이터 라벨을 차트 안쪽에 표시
          format: "<b>{point.name}</b>",
          style: {
            color: "white",
            fontWeight: "light",
            fontFamily: "SUITE-Regular",
          },
        },
        innerSize: "70%", // 도넛 차트 두께 조절
      },
    },
    series: [
      {
        name: "Share",
        colorByPoint: true,
        data: [
          { name: "1단계", y: 3, color: "rgb(34,180,237)" },
          { name: "2단계", y: 2, color: "rgb(150,208,96)" },
          { name: "3단계", y: 1, color: "rgb(255,252,75)" },
          { name: "4단계", y: 1, color: "rgb(253,188,58)" },
          { name: "5단계", y: 1, color: "rgb(250,0,25)" },
        ],
      },
    ],
  };

  return (
    <div className="worker-statistic">
      <span class="bar"></span>
      <div className="header">
        <span>작업자 통계</span>
      </div>
      <div className="pie-chart">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <div className="description">
        <span>1단계</span>
        <span>3명</span>
      </div>
      <div className="description">
        <span>2단계</span>
        <span>2명</span>
      </div>
      <div className="description">
        <span>3단계</span>
        <span>1명</span>
      </div>
      <div className="description">
        <span>4단계</span>
        <span>1명</span>
      </div>
      <div className="description">
        <span>5단계</span>
        <span>1명</span>
      </div>
    </div>
  );
}

function Advice() {
  return (
    <div className="advice">
      <span class="bar" />
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

export default Dashboard;
