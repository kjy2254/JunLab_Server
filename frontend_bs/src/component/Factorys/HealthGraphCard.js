import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import "../../css/WorkerModal.css";

function HealthGraphCard({ header, selectedWorker, endpoint, title }) {
  const [data, setData] = useState([]);
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const today = getFormattedDate(new Date());
  const [startDate, setStartDate] = useState(today + " 00:00:00");
  const [endDate, setEndDate] = useState(today + " 23:59:59");
  const [minute, setMinute] = useState(30);
  const [selectedRadio, setSelectedRadio] = useState(0);
  const [options, setOptions] = useState({});

  useEffect(() => {
    const newOptions = {
      chart: {
        type: "line",
        backgroundColor: "var(--layer2-bg-color)",
        zoomType: "x", // x축 방향으로 줌 기능 활성화
        resetZoomButton: {
          theme: {
            fill: "white",
            r: 7,
            style: {
              fontFamily: "SUITE-Regular",
            },
          },
        },
      },
      title: {
        text: null,
      },
      xAxis: {
        type: "datetime",
        labels: {
          formatter: function () {
            // selectedRadio가 0일 때만 'n분 전'으로 표시
            if (selectedRadio == 0 && minute < 2000) {
              const timestamp = this.value;
              const now = new Date().getTime();
              const diff = Math.floor((now - timestamp) / (60 * 1000)); // 분 단위로 차이 계산

              if (diff <= 0) {
                return "지금"; // 현재 시간
              } else {
                return diff + " 분 전"; // n분 전
              }
            } else {
              // 다른 모드일 경우 날짜 표시
              return new Date(this.value).toLocaleDateString();
            }
          },
          style: {
            color: "var(--graph-lable-color)",
          },
        },
        lineColor: "var(--graph-lable-color)",
        tickColor: "var(--graph-lable-color)",
      },
      yAxis: {
        title: {
          text: title,
        },
        labels: {
          formatter: function () {
            return this.value.toFixed(1); // 소수점 첫째 자리까지 표시
          },
          style: {
            color: "var(--graph-lable-color)",
          },
        },
        ...(endpoint === "oxygen" && {
          min: 80,
          max: 102,
          startOnTick: false, // y축이 min 값에서 시작하도록 강제
          endOnTick: false, // y축이 max 값에서 끝나도록 강제
        }),
        ...(endpoint === "temperature" && {
          min: 20,
          max: 42,
          startOnTick: false, // y축이 min 값에서 시작하도록 강제
          endOnTick: false, // y축이 max 값에서 끝나도록 강제
        }),
        ...(endpoint === "heartrate" && {
          min: 60,
          max: 140,
        }),
        gridLineColor: "var(--border-color)",
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false, // 워터마크 비활성화
      },
      accessibility: {
        enabled: false,
      },
      tooltip: {
        formatter: function () {
          const date = new Date(this.x);
          const dateStr = date.toLocaleString();
          return `${dateStr}<br>${endpoint}:${this.point.y.toFixed(1)}`;
        },
      },

      series: [
        {
          // name: "Heart Rate",
          data: data.map((item) => [
            new Date(item.timestamp).getTime(),
            parseFloat(item[endpoint]),
          ]),
          marker: {
            enabled: false, // 점 비활성화
          },
          lineWidth: 2, // 선의 두께 설정
          linecap: "round", // 선의 끝 모양을 둥글게
          states: {
            hover: {
              lineWidth: 3, // 마우스 오버 시 선의 두께
            },
          },
          type: "spline",
        },
      ],
    };

    setOptions(newOptions);
  }, [selectedRadio, data]);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api2/user/${selectedWorker}/${endpoint}?` +
            (selectedRadio == 0
              ? `timeSlot=${minute}`
              : `start=${startDate}&end=${endDate}`)
        )
        .then((response) => {
          const data = response.data;
          setData(data);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 7000);
    return () => clearInterval(interval);
  }, [selectedWorker, minute, startDate, endDate, selectedRadio]);

  return (
    <div className="graph-card layer2">
      <span className="bar" />
      <div className="header">
        <span>{header}</span>
        <div className="setting">
          <div className="type">
            <label>
              <input
                type="radio"
                value={0}
                name={"search-type" + endpoint}
                checked={selectedRadio == 0 ? "checked" : ""}
                onChange={(e) => setSelectedRadio(e.target.value)}
              />
              <span>최근 데이터</span>
            </label>
            <label>
              <input
                type="radio"
                value={1}
                name={"search-type" + endpoint}
                onChange={(e) => setSelectedRadio(e.target.value)}
              />
              <span>날짜 데이터</span>
            </label>
          </div>
          <div className={"date" + (selectedRadio == 0 ? " disabled" : "")}>
            <label>
              <span>시작 날짜:</span>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              <span>끝 날짜:</span>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
          <div
            className={
              "number-wrapper" + (selectedRadio == 1 ? " disabled" : "")
            }
          >
            <input
              type="number"
              min="1"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
            />
            <span className="unit">분</span>
          </div>
        </div>
      </div>
      <div className="chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{
            style: {
              width: "100%",
              // maxHeight: "15rem",
              height: "240px",
            },
          }}
        />
      </div>
    </div>
  );
}

export default HealthGraphCard;
