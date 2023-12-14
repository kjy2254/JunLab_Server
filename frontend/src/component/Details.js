import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../css/Details.css";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Route from "./Route";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

import finedust from "../image/finedust.svg";
import temperature from "../image/temperature.svg";
import co2 from "../image/co2.svg";
import tvoc from "../image/tvoc.svg";
import ForbiddenPage from "./ForbiddenPage";

function Details(props) {
  const { factoryId, data } = useParams();
  const link = data.replaceAll(" ", "");
  const endPoint = link.toLowerCase();

  const [factoryName, setFactoryName] = useState();

  const [date, setDate] = useState();
  const [count, setCount] = useState("");

  const updateDate = (e) => setDate(e.target.value);
  const updateCount = (e) => setCount(e.target.value);

  const [filter, setFilter] = useState("");

  const [selected, setSelected] = useState("pm1.0");

  const map = {
    TVOC: {
      chartIcon: tvoc,
      chartName: "휘발성유기화합물",
      chartSubname: "TVOC",
      chartUnit: "ppb",
      min: 0,
      max: 2000,
    },
    Temperature: {
      chartIcon: temperature,
      chartName: "온도",
      chartSubname: "Temperature",
      chartUnit: "°C",
      min: -10,
      max: 70,
    },
    CO2: {
      chartIcon: co2,
      chartName: "이산화탄소",
      chartSubname: "CO2",
      chartUnit: "ppb",
      min: 400,
      max: 4000,
    },
    FineDust: {
      chartIcon: finedust,
      chartName: "미세먼지",
      chartSubname: "Fine dust",
      chartUnit: "㎍/㎥",
      min: 0,
      max: 500,
    },
  };

  const [formattedData, setFormattedData] = useState([]);

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

  const fetchData = async () => {
    axios
      .get(
        `http://junlab.postech.ac.kr:880/api/factory/${factoryId}/${endPoint}2?date=${
          date ? date : ""
        }&count=${count}`
      )
      .then((response) => {
        const dataResponse = response.data;

        // API 응답에서 원하는 데이터를 추출합니다.
        const formattedData = Object.keys(dataResponse).map((moduleId) => {
          if (endPoint !== "finedust") {
            const moduleData = dataResponse[moduleId][endPoint].map((item) => ({
              x: new Date(item.name),
              y: item.y,
            }));
            return {
              name: `${moduleId} (${data})`,
              data: moduleData,
            };
          } else {
            const pm1_0data = dataResponse[moduleId]["pm1_0"].map((item) => ({
              x: new Date(item.name),
              y: item.y,
            }));
            const pm2_5data = dataResponse[moduleId]["pm2_5"].map((item) => ({
              x: new Date(item.name),
              y: item.y,
            }));
            const pm10data = dataResponse[moduleId]["pm10"].map((item) => ({
              x: new Date(item.name),
              y: item.y,
            }));

            if (selected === "pm1.0") {
              return {
                name: `${moduleId} (pm1.0)`,
                data: pm1_0data,
              };
            } else if (selected === "pm2.5") {
              return {
                name: `${moduleId} (pm2.5)`,
                data: pm2_5data,
              };
            } else {
              return {
                name: `${moduleId} (pm10)`,
                data: pm10data,
              };
            }
          }
        });
        // 데이터를 상태에 설정합니다.
        setFormattedData(formattedData);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 7000);
    // 컴포넌트가 언마운트될 때 clearInterval을 호출하여 인터벌 정리
    return () => {
      clearInterval(interval);
    };
  }, [date, data, selected, count]);

  const sortedData = formattedData.map((series) => ({
    ...series,
    data: series.data.sort((a, b) => a.x - b.x), // x 값을 오름차순으로 정렬
  }));

  const filteredData = sortedData.map((series) => ({
    ...series,
    data: series.data.map((point) => {
      // 데이터 포인트의 y값이 범위 내에 있는지 확인
      const yValue = point.y;
      if (yValue >= 0 && yValue <= 10000) {
        return point; // 범위 내에 있는 데이터 포인트 유지
      } else {
        return {
          ...point,
          y: null, // 범위를 벗어나는 데이터는 null로 설정하여 숨김
        };
      }
    }),
  }));

  const options = {
    accessibility: {
      enabled: false,
    },
    chart: {
      type: "line",
      zoomType: "x",
      resetZoomButton: {
        theme: {
          fill: "#F8F9FB",
          stroke: "silver",
          r: 15,
          states: {
            hover: {
              fill: "rgba(23, 133, 194, 0.73)",
              style: {
                color: "white",
              },
            },
          },
        },
      },
    },
    title: {
      text: null, // 'none' 대신에 null로 title을 비활성화합니다.
    },
    credits: {
      enabled: false,
    },
    time: {
      useUTC: false,
    },
    xAxis: {
      visible: true,
      type: "datetime", // x축을 날짜/시간 형식으로 설정
      labels: {
        formatter: function () {
          if (this.isFirst || this.isLast) {
            return Highcharts.dateFormat(
              "%Y/%m/%d %H:%M:%S",
              this.value + 9 * 60 * 60 * 1000
            );
          } else {
            return "";
          }
        },
      },
      title: {
        text: "time",
      },
    },
    yAxis: {
      // min: map[data].min,
      // max: map[data].max,
      visible: true,
      labels: {
        enabled: true, // y축 레이블을 비활성화합니다.
      },
      title: {
        text: map[data].chartUnit,
      },
      gridLineWidth: 0,
    },
    plotOptions: {
      series: {
        smooth: false,
        dataLabels: {
          enabled: false,
          format: "<b>{point.y}</b>",
        },
        turboThreshold: 50000,
      },
      line: {
        marker: {
          enabled: false, // 점 비활성화
        },
        smooth: true,
      },
    },
    lang: {
      noData: "No data available",
    },

    legend: {
      enabled: true,
      // 범례 항목 설정
      labelFormatter: function () {
        const seriesName = this.name; // 데이터 시리즈 이름
        const color = this.color; // 데이터 시리즈 색상
        return `<span style="color:${color}">${seriesName}</span>`; // 색상과 시리즈 이름을 포함한 HTML 반환
      },
    },

    series: filteredData,
  };

  if (formattedData.length === 0) {
    options.lang.noData = "No data available"; // 데이터가 없을 때 메시지 설정
    options.noData = {
      style: {
        fontWeight: "300",
        fontSize: "15px",
        color: "#333333",
      },
    };
    options.xAxis.visible = false;
    options.yAxis.visible = false;
  }

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
      <div className="detail-container">
        <Sidebar header={factoryName} factoryId={factoryId} selected={"3"} />
        <div className="detail-content">
          <Header
            placeholder="Type any factories..."
            setData={setFilter}
            data={filter}
            isLogin={props.isLogin}
            name={props.name}
            role={props.role}
          />
          <Route routelist={["공장", factoryName]} finalroute={data} />
          <div className="detail-section">
            <div className="detail-info">
              <div className="flex">
                <div className="chart-icon">
                  <img src={map[data].chartIcon} alt={"icon"} />
                </div>
                <div className="chart-name-area">
                  <div className="chart-name">{map[data].chartName}</div>
                  <div className="chart-subname">{map[data].chartSubname}</div>
                </div>
              </div>
              <div className="flex">
                <div className={endPoint === "finedust" ? "" : "none"}>
                  <button
                    className={
                      "button " +
                      (selected === "pm1.0" ? "button-selected" : "")
                    }
                    onClick={() => setSelected("pm1.0")}
                  >
                    pm1.0
                  </button>
                  <button
                    className={
                      "button " +
                      (selected === "pm2.5" ? "button-selected" : "")
                    }
                    onClick={() => setSelected("pm2.5")}
                  >
                    pm2.5
                  </button>
                  <button
                    className={
                      "button " + (selected === "pm10" ? "button-selected" : "")
                    }
                    onClick={() => setSelected("pm10")}
                  >
                    pm10
                  </button>
                </div>
                <div className="input-number">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 12 12"
                    fill="none"
                    onClick={() => setCount("")}
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0.29289 0.29289C0.68342 -0.09763 1.31658 -0.09763 1.70711 0.29289L6 4.58579L10.2929 0.29289C10.6834 -0.09763 11.3166 -0.09763 11.7071 0.29289C12.0976 0.68342 12.0976 1.31658 11.7071 1.70711L7.4142 6L11.7071 10.2929C12.0976 10.6834 12.0976 11.3166 11.7071 11.7071C11.3166 12.0976 10.6834 12.0976 10.2929 11.7071L6 7.4142L1.70711 11.7071C1.31658 12.0976 0.68342 12.0976 0.29289 11.7071C-0.09763 11.3166 -0.09763 10.6834 0.29289 10.2929L4.58579 6L0.29289 1.70711C-0.09763 1.31658 -0.09763 0.68342 0.29289 0.29289Z"
                      fill="#4A5568"
                    />
                  </svg>

                  <input
                    type="number"
                    onChange={updateCount}
                    value={count || ""}
                    min={"1"}
                    placeholder={"개수"}
                  />
                </div>
                <input type="date" onChange={updateDate} value={date || ""} />
              </div>
            </div>
            <div className="detail-chart">
              <Fragment>
                <HighchartsReact highcharts={Highcharts} options={options} />
              </Fragment>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Details;
