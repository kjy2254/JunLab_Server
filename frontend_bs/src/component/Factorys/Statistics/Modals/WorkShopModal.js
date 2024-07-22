import {
  faClock,
  faClose,
  faIdCard,
  faIndustry,
  faPlugCircleCheck,
  faPlugCircleXmark,
  faReceipt,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import co2 from "../../../../image/co22.svg";
import finedust from "../../../../image/finedust2.svg";
import humid from "../../../../image/humid2.svg";
import temperature from "../../../../image/temperature2.svg";
import tvoc from "../../../../image/tvoc2.svg";
import ultrafinedust from "../../../../image/ultrafinedust2.svg";
import { EnvIndexToText, healthIndexToText } from "../../../../util";
import styles from "./WorkShopModal.module.css";

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

function WorkShopModal({
  modalOpen,
  setModalOpen,
  data,
  setPreviousModal,
  setWorkerModalData,
  setEnvModalData,
}) {
  const [options, setOptions] = useState({});
  const [chartData, setChartData] = useState([]);
  const [workers, setWorkers] = useState([]);

  const fetchChartData = () => {
    axios
      .get(
        `http://junlab.postech.ac.kr:880/api2/index/env/${data?.module_id}?minute=300&slot=20`
      )
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          x: item.x,
          y: item.y,
        }));
        setChartData(formattedData);
        console.log("res", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    if (data?.module_id) {
      fetchChartData();
    }
  }, [data]);

  useEffect(() => {
    const newOptions = {
      chart: {
        type: "column",
        backgroundColor: "transparent",
      },
      title: {
        text: "",
        align: "left", // 제목을 왼쪽 정렬
        style: {
          fontFamily: "SUITE-Regular", // 폰트 패밀리 설정
          color: "white", // 폰트 색상 설정
        },
      },
      xAxis: {
        categories: chartData.map((d) => d.x),
        labels: {
          style: {
            color: "var(--graph-label-color)",
          },
          formatter: function () {
            if (this.isFirst) {
              return ""; // 첫 번째 값 비워두기
            }
            // x 값을 "HH시 mm분" 형식으로 표시
            const date = new Date(this.value);
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            return `${hours}시 ${minutes}분`;
          },
        },
        lineColor: "var(--graph-label-color)",
        tickColor: "var(--graph-label-color)",
        startOnTick: true,
        endOnTick: true,
        min: -1,
      },
      yAxis: {
        title: {
          text: null,
        },
        labels: {
          enabled: false,
        },
        gridLineColor: "var(--border-color)",
        gridLineDashStyle: "Dash",
        tickPositions: [1, 3, 6, 10],
        min: 0,
        max: 12,
        endOnTick: false, // y축 끝에 대한 틱 비활성화
        startOnTick: false, // y축 시작에 대한 틱 비활성화
        plotBands: [
          {
            from: 0,
            to: 1,
            color: "transparent",
            label: {
              align: "left",
              style: {
                color: "var(--graph-label-color)",
              },
              text: "매우 좋음",
            },
          },
          {
            from: 1,
            to: 3,
            color: "transparent",
            label: {
              align: "left",
              style: {
                color: "var(--graph-label-color)",
              },
              text: "좋음",
            },
          },
          {
            from: 3,
            to: 6,
            color: "transparent",
            label: {
              align: "left",
              style: {
                color: "var(--graph-label-color)",
              },
              text: "보통",
            },
          },
          {
            from: 6,
            to: 10,
            color: "transparent",
            label: {
              align: "left",
              style: {
                color: "var(--graph-label-color)",
              },
              text: "나쁨",
            },
          },
          {
            from: 10,
            to: Infinity,
            color: "transparent",
            label: {
              align: "left",
              style: {
                color: "var(--graph-label-color)",
              },
              text: "매우 나쁨",
            },
          },
        ],
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
      plotOptions: {
        series: {
          pointWidth: 20, // 막대그래프 너비 설정
          borderRadius: 15,
          pointPadding: 0.1, // 막대 간의 간격 설정
          groupPadding: 0.1, // 그룹 간의 간격 설정
        },
      },
      tooltip: {
        formatter: function () {
          let quality;
          if (this.y < 1) {
            quality = "매우 좋음";
          } else if (this.y < 3) {
            quality = "좋음";
          } else if (this.y < 6) {
            quality = "보통";
          } else if (this.y < 10) {
            quality = "나쁨";
          } else {
            quality = "매우 나쁨";
          }
          return `공기질: ${this.y.toFixed(2)}(${quality})`;
        },
      },
      lang: {
        noData: "No data available",
      },
      series: [
        {
          name: "공기질",
          data: chartData.map((d) => d.y),
        },
      ],
    };

    setOptions(newOptions);
  }, [chartData]);

  useEffect(() => {
    axios
      .get(`http://junlab.postech.ac.kr:880/api2/${data?.module_id}/workers`)
      .then((response) => {
        console.log(response.data);
        setWorkers(response.data);
      });
  }, [data]);

  return (
    <Modal
      isOpen={modalOpen}
      style={customModalStyles}
      className={`${styles.workshopmodal} layerModal`}
      appElement={document.getElementById("root")}
      onRequestClose={() => setModalOpen(0)}
    >
      <FontAwesomeIcon
        className={styles.close}
        icon={faClose}
        onClick={() => setModalOpen(0)}
      />
      {/* <div className={styles.header}>
        <div className={`${styles["title"]}`}>작업장: {data?.module_name}</div>
      </div> */}
      <div className={`${styles.body} layer2`}>
        <div className={`${styles["wrapper"]}`}>
          <span className={`${styles["header"]}`}>실시간 공기질 현황</span>
          <div className={`${styles["air-info"]}`}>
            <div className={`${styles["info-card"]} layer3`}>
              <span className={`${styles["key"]}`}>
                <FontAwesomeIcon icon={faIndustry} />
                작업장
              </span>
              <span className={`${styles["value"]}`} title={data?.module_name}>
                {data?.module_name}
              </span>
            </div>
            <div className={`${styles["info-card"]} layer3`}>
              <span className={`${styles["key"]}`}>
                <FontAwesomeIcon
                  icon={data?.online ? faPlugCircleCheck : faPlugCircleXmark}
                  style={{
                    color: "white",
                    background: data?.isOnline ? "green" : "rgb(150, 3, 3)",
                  }}
                />
                상태
              </span>
              <span
                className={`${styles["value"]}`}
                title={data?.isOnline ? "온라인" : "오프라인"}
              >
                {data?.isOnline ? "온라인" : "오프라인"}
              </span>
            </div>
            <div className={`${styles["info-card"]} layer3`}>
              <span className={`${styles["key"]}`}>
                <FontAwesomeIcon icon={faWind} />
                공기질 상태
              </span>
              <span
                className={`${styles["value"]}`}
                title={EnvIndexToText(data?.env_index)}
              >
                {EnvIndexToText(data?.env_index)}
              </span>
            </div>
            <div className={`${styles["info-card"]} layer3`}>
              <span className={`${styles["key"]}`}>
                <FontAwesomeIcon icon={faClock} />
                측정시간
              </span>
              <span
                className={`${styles["value"]}`}
                title={new Date(data?.last_update).toLocaleTimeString()}
              >
                {new Date(data?.last_update).toLocaleTimeString()}
              </span>
            </div>
            <div className={`${styles["info-card"]} layer3`}>
              <span className={`${styles["key"]}`}>
                <FontAwesomeIcon icon={faIdCard} />
                측정기 ID
              </span>
              <span className={`${styles["value"]}`} title={data?.module_id}>
                {data?.module_id}
              </span>
            </div>
            <div className={`${styles["info-card"]} layer3`}>
              <span className={`${styles["key"]}`}>
                <FontAwesomeIcon icon={faReceipt} />
                설명
              </span>
              <span
                className={`${styles["value"]}`}
                title={data?.module_description || "-"}
              >
                {data?.module_description || "-"}
              </span>
            </div>
          </div>

          <div className={`${styles["env-cards"]}`}>
            <div
              className={`${styles["env-card"]} layer3`}
              onClick={() => {
                setEnvModalData({ img: tvoc, env: "tvoc" });
                setModalOpen(5);
                setPreviousModal(4);
              }}
            >
              <img className={styles.icon} src={tvoc} />
              <div className={styles.text}>
                <span className={styles.key}>TVOC</span>
                <span className={styles.value}>
                  {parseFloat(data?.tvoc).toFixed(1)}ppb
                </span>
              </div>
            </div>
            <div
              className={`${styles["env-card"]} layer3`}
              onClick={() => {
                setEnvModalData({ img: co2, env: "co2" });
                setModalOpen(5);
                setPreviousModal(4);
              }}
            >
              <img className={styles.icon} src={co2} />
              <div className={styles.text}>
                <span className={styles.key}>CO2</span>
                <span className={styles.value}>
                  {parseFloat(data?.co2).toFixed(1)}ppm
                </span>
              </div>
            </div>
            <div
              className={`${styles["env-card"]} layer3`}
              onClick={() => {
                setEnvModalData({ img: tvoc, env: "tvoc" });
                setModalOpen(5);
                setPreviousModal(4);
              }}
            >
              <img className={styles.icon} src={finedust} />
              <div className={styles.text}>
                <span className={styles.key}>미세먼지(PM10)</span>
                <span className={styles.value}>
                  {parseFloat(data?.pm10).toFixed(1)}㎍/㎥
                </span>
              </div>
            </div>
            <div className={`${styles["env-card"]} layer3`}>
              <img className={styles.icon} src={ultrafinedust} />
              <div className={styles.text}>
                <span className={styles.key}>초미세먼지(PM2.5)</span>
                <span className={styles.value}>
                  {parseFloat(data?.pm2_5).toFixed(1)}㎍/㎥
                </span>
              </div>
            </div>
            <div className={`${styles["env-card"]} layer3`}>
              <img className={styles.icon} src={temperature} />
              <div className={styles.text}>
                <span className={styles.key}>온도</span>
                <span className={styles.value}>
                  {parseFloat(data?.temperature).toFixed(1)}°C
                </span>
              </div>
            </div>
            <div className={`${styles["env-card"]} layer3`}>
              <img className={styles.icon} src={humid} />
              <div className={styles.text}>
                <span className={styles.key}>습도</span>
                <span className={styles.value}>
                  {parseFloat(data?.humid).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <hr />
          <span className={`${styles["header"]}`}>공기질 동향</span>
          <div className={`${styles.graph} layer3`}>
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
          </div>
          <hr />
          <span className={`${styles["header"]}`}>작업자 현황(온라인)</span>
          <div className={`${styles["workers"]}`}>
            {workers
              ?.filter((w) => w.isOnline == 1)
              .map((e) => (
                <div
                  className={`${styles["worker-card"]} layer3`}
                  onClick={() => {
                    setModalOpen(3);
                    setPreviousModal(4);
                    console.log(e);
                    setWorkerModalData({ selectedWorker: e.user_id });
                  }}
                >
                  <div className={`${styles["status"]}`}>
                    <img
                      src={`http://junlab.postech.ac.kr:880/api2/image/${e.profile_image_path}`}
                    />
                    <div className={`${styles["info"]}`}>
                      <span>{e.name}</span>
                      <div className={`${styles["vitals"]}`}>
                        <span className={`${styles["vital"]}`}>
                          심박수: {e.last_heart_rate}bpm
                        </span>
                        <span className={`${styles["vital"]}`}>
                          체온: {e.last_body_temperature}°C
                        </span>
                        <span className={`${styles["vital"]}`}>
                          산소포화도: {e.last_oxygen_saturation}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles["index"]}`}>
                    <span
                      className={`${styles["vital"]}`}
                      title={`Index: ${e.last_health_index}`}
                    >
                      건강 상태: {healthIndexToText(e.last_health_index)}
                    </span>
                    <span className={`${styles["vital"]}`}>
                      작업 강도: {e.last_workload}단계
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <hr />
          <span className={`${styles["header"]}`}>작업자 현황(오프라인)</span>
          <div className={`${styles["workers"]}`}>
            {workers
              ?.filter((w) => w.isOnline == 0)
              .map((e) => (
                <div
                  className={`${styles["worker-card"]} layer3`}
                  onClick={() => {
                    setModalOpen(3);
                    setPreviousModal(4);
                    console.log(e);
                    setWorkerModalData({ selectedWorker: e.user_id });
                  }}
                >
                  <div className={`${styles["status"]}`}>
                    <img
                      src={`http://junlab.postech.ac.kr:880/api2/image/${e.profile_image_path}`}
                    />
                    <div className={`${styles["info"]}`}>
                      <span>{e.name}</span>
                      <div className={`${styles["vitals"]}`}>
                        <span className={`${styles["vital"]}`}>
                          심박수: {e.last_heart_rate}bpm
                        </span>
                        <span className={`${styles["vital"]}`}>
                          체온: {e.last_body_temperature}°C
                        </span>
                        <span className={`${styles["vital"]}`}>
                          산소포화도: {e.last_oxygen_saturation}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles["index"]}`}>
                    <span
                      className={`${styles["vital"]}`}
                      title={`Index: ${e.last_health_index}`}
                    >
                      건강 상태: {healthIndexToText(e.last_health_index)}
                    </span>
                    <span className={`${styles["vital"]}`}>
                      작업 강도: {e.last_workload}단계
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default WorkShopModal;
