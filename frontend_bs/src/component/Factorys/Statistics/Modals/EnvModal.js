import { faArrowLeft, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
import "../../../../css/EnvModal.css";

const customModalStyles = {
  overlay: {
    backgroundColor: " rgba(0, 0, 0, 0.7)",
    width: "100%",
    height: "100dvh",
    zIndex: "3",
    position: "fixed",
    top: "0",
    left: "0",
  },
};

function EnvModal({ modalOpen, setModalOpen, data, previousModal }) {
  const header = {
    tvoc: "총휘발성유기화합물(ppb)",
    co2: "이산화탄소(ppm)",
    temperature: "온도(°C)",
    pm10: "미세먼지(㎍/㎥)",
    pm2_5: "초미세먼지(㎍/㎥)",
    humid: "습도(%)",
  };

  return (
    <Modal
      isOpen={modalOpen}
      style={customModalStyles}
      className="envmodal layerModal"
      onRequestClose={() => setModalOpen(0)}
      appElement={document.getElementById("root")}
    >
      <div className="header">
        <div className="left" onClick={() => setModalOpen(previousModal)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          &nbsp;뒤로
        </div>
        <div className="right">
          <FontAwesomeIcon icon={faClose} onClick={() => setModalOpen(0)} />
        </div>
      </div>
      <EnvGraphCard
        header={header[data.env]}
        img={data.img}
        endpoint={data.env}
      />
    </Modal>
  );
}

function EnvGraphCard({ header, img, endpoint, title }) {
  const { factoryId } = useParams();

  const [data, setData] = useState([]);
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const today = getFormattedDate(new Date());
  const [date, setDate] = useState(today);
  const [minute, setMinute] = useState(15);
  const [selectedRadio, setSelectedRadio] = useState(0);
  const [options, setOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const firstLoad = useRef(true); // 최초 로드 여부 추적

  const groupDataByModuleName = (data) => {
    return data.reduce((acc, item) => {
      const { timestamp, module_name } = item;
      const value = parseFloat(item[endpoint], 10);
      if (!acc[module_name]) {
        acc[module_name] = [];
      }
      acc[module_name].push([new Date(timestamp).getTime(), value]);
      return acc;
    }, {});
  };

  const createSeriesFromGroupedData = (groupedData) => {
    return Object.keys(groupedData)
      .sort()
      .map((moduleName) => ({
        name: moduleName, // 각 그룹의 이름을 시리즈 이름으로 사용
        data: groupedData[moduleName],
        marker: {
          enabled: false,
        },
        lineWidth: 2,
        linecap: "round",
        states: {
          hover: {
            lineWidth: 3,
          },
        },
        type: "spline",
      }));
  };

  useEffect(() => {
    const newOptions = {
      chart: {
        type: "line",
        backgroundColor: "transparent",
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
            color: "var(--graph-label-color)",
          },
        },
        lineColor: "var(--graph-label-color)",
        tickColor: "var(--graph-label-color)",
      },
      yAxis: {
        title: {
          text: title,
        },
        labels: {
          style: {
            color: "var(--graph-label-color)",
          },
        },
        gridLineColor: "var(--border-color)",
      },
      legend: {
        enabled: true,
        itemStyle: {
          color: "var(--graph-label-color)",
        },
        itemHoverStyle: {
          color: "var(--graph-label-color)",
        },
      },
      credits: {
        enabled: false, // 워터마크 비활성화
      },
      accessibility: {
        enabled: false,
      },
      tooltip: {
        formatter: function () {
          const categories = {
            tvoc: "총휘발성유기화합물",
            co2: "이산화탄소",
            pm10: "미세먼지 (PM10)",
            pm2_5: "초미세먼지 (PM2.5)",
            temperature: "온도",
            humid: "습도",
          };
          const units = {
            tvoc: "ppb",
            co2: "ppm",
            pm10: "㎍/㎥",
            pm2_5: "㎍/㎥",
            temperature: "℃",
            humid: "%",
          };

          const unit = units[endpoint];
          const category = categories[endpoint];

          const date = new Date(this.x).toLocaleString();

          return `<b>${date}</b><br/>${category}: ${this.y}${unit}`;
        },
        style: {
          fontWeight: "light",
          fontFamily: "SUITE-Regular",
        },
      },
      lang: {
        noData: "No data available",
      },
      series: createSeriesFromGroupedData(groupDataByModuleName(data)),
    };

    setOptions(newOptions);
  }, [selectedRadio, data]);

  useEffect(() => {
    const fetchData = async () => {
      if (firstLoad.current) {
        setIsLoading(true); // 데이터 로딩 시작
      }
      try {
        const response = await axios.get(
          `http://junlab.postech.ac.kr:880/api2/airwalldata/${endpoint}?factoryId=${factoryId}&` +
            (selectedRadio == 0 ? `timeSlot=${minute}` : `date=${date}`)
        );
        const data = response.data;
        setData(data);
      } catch (error) {
        console.error("API 요청 실패:", error);
      } finally {
        if (firstLoad.current) {
          setIsLoading(false); // 데이터 로딩 실패
          firstLoad.current = false; // 최초 로드 완료
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 7000);
    return () => clearInterval(interval);
  }, [endpoint, minute, date, selectedRadio]);

  return (
    <div className="graph-card layer2">
      <span className="bar" />
      <div className="header">
        <div className="title">
          <img src={img} alt={""} />
          <span>{header}</span>
        </div>
        <div className="setting">
          <div className="type">
            <label>
              <input
                type="radio"
                value={0}
                name="search-type"
                checked={selectedRadio == 0 ? "checked" : ""}
                onChange={(e) => setSelectedRadio(e.target.value)}
              />
              <span>최근 데이터</span>
            </label>
            <label>
              <input
                type="radio"
                value={1}
                name="search-type"
                onChange={(e) => setSelectedRadio(e.target.value)}
              />
              <span>날짜 데이터</span>
            </label>
          </div>
          <div className={"date" + (selectedRadio == 0 ? " disabled" : "")}>
            <label>
              <span>날짜:</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={today}
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
        {isLoading ? (
          <p
            style={{
              width: "100%",
              height: "240px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Loading...
          </p>
        ) : data.length === 0 ? (
          <p
            style={{
              width: "100%",
              height: "240px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No data available
          </p>
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={{
              style: {
                width: "100%",
                height: "100%",
              },
            }}
          />
        )}
      </div>

      <div></div>
    </div>
  );
}

export default EnvModal;
