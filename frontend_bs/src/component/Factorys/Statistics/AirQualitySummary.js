import {
  faClock,
  faIdCard,
  faPlugCircleCheck,
  faPlugCircleXmark,
  faReceipt,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import co2 from "../../../image/co22.svg";
import finedust from "../../../image/finedust2.svg";
import humid from "../../../image/humid2.svg";
import temperature from "../../../image/temperature2.svg";
import tvoc from "../../../image/tvoc2.svg";
import ultrafinedust from "../../../image/ultrafinedust2.svg";
import { EnvIndexToText } from "../../../util";
import styles from "./AirQualitySummary.module.css";

function AirQualitySummary({ setEnvModalData, setModalOpen }) {
  const [envData, setEnvData] = useState([]);
  const [aqData, setAqData] = useState([]);
  const [selectedModule, setSelectedModule] = useState();
  const [hoverModule, setHoverModule] = useState();
  const [reflow, setReflow] = useState(false);

  const progressBarRef = useRef(null);
  const { factoryId } = useParams();

  const scale = {
    tvoc: 2500,
    co2: 2500,
    pm10: 50,
    pm2_5: 50,
    temperature: 50,
    humid: 100,
  };
  const scaleValue = (value, scale) => {
    return Math.min(2, parseFloat(value) / scale || 0);
  };

  useEffect(() => {
    if (hoverModule == selectedModule || !hoverModule) {
      setReflow((prev) => !prev);
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.animation = "none";
      void progressBarRef.current.offsetHeight;
      progressBarRef.current.style.animation = null;
    }
  }, [hoverModule]);

  const handleMouseEnter = (id) => {
    setHoverModule(id);
  };

  const handleMouseLeave = () => {
    setHoverModule();
  };

  // 공기질 그래프 데이터 fetch
  const fetchAirQualityChartData = () => {
    axios
      .get(
        `http://junlab.postech.ac.kr:880/api2/index/env/${selectedModule}?minute=300&slot=20`
      )
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          x: item.x,
          y: item.y,
        }));
        setAqData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    if (selectedModule) {
      fetchAirQualityChartData();
    }
  }, [selectedModule]);

  // 환경 데이터 fetch
  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/airwalls`
        )
        .then((response) => {
          const newGraphData = response.data.map((module) => {
            const newData = {
              name: module.module_name,
              module_description: module.module_description,
              id: module.module_id,
              env_index: module.env_index,
              data: [
                scaleValue(module.tvoc, scale.tvoc),
                scaleValue(module.co2, scale.co2),
                scaleValue(module.pm10, scale.pm10),
                scaleValue(module.pm2_5, scale.pm2_5),
                scaleValue(module.temperature, scale.temperature),
                scaleValue(module.humid, scale.humid),
              ],
              originData: [
                parseFloat(module.tvoc) || 0,
                parseFloat(module.co2) || 0,
                parseFloat(module.pm10) || 0,
                parseFloat(module.pm2_5) || 0,
                parseFloat(module.temperature) || 0,
                parseFloat(module.humid) || 0,
              ],
              last_update: new Date(module.last_update).toLocaleDateString(),
              last_update_long: new Date(
                module.last_update
              ).toLocaleTimeString(),
              marker: {
                symbol: "diamond",
                radius: 4,
              },
              num_of_workers: module.num_of_workers,
              num_of_online_workers: module.num_of_online_workers,
              isOnline: module.isOnline,
            };
            return newData;
          });
          setEnvData(newGraphData);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // 초기 값 설정
  useEffect(() => {
    if (envData.length > 0) {
      setSelectedModule(envData[0].id);
    } else {
      setEnvData(defaultSeries);
      setSelectedModule("no-data");
    }
  }, [envData.length]);

  // 주기적으로 다음 작업장 카드로 이동
  useEffect(() => {
    if (envData.length > 0) {
      const interval = setInterval(() => {
        if (hoverModule == selectedModule) return;
        setSelectedModule((prevModule) => {
          const currentIndex = envData.findIndex((e) => e.id === prevModule);
          const nextIndex = (currentIndex + 1) % envData.length;
          return envData[nextIndex].id;
        });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [envData.length, selectedModule, reflow]);

  const defaultSeries = [
    {
      name: "데이터 없음",
      data: ["-", "-", "-", "-", "-", "-"],
      originData: ["-", "-", "-", "-", "-", "-"],
      enableMouseTracking: false,
      showInLegend: false,
      id: "no-data",
    },
  ];

  const radarOptions = useMemo(() => {
    return {
      chart: {
        polar: true,
        type: "area",
        backgroundColor: "transparent",
        plotBorderColor: "transparent",
      },
      title: {
        text: null,
      },
      pane: {
        size: "90%",
        startAngle: 0,
        endAngle: 360,
      },
      xAxis: {
        categories: [
          "TVOC",
          "CO2",
          "미세먼지 (PM10)",
          "초미세먼지 (PM2.5)",
          "온도",
          "습도",
        ],
        tickmarkPlacement: "on",
        lineWidth: 0,
        labels: {
          style: {
            color: "var(--graph-label-color)",
            fontWeight: "light",
            fontFamily: "SUITE-Regular",
          },
        },
      },
      legend: {
        itemStyle: {
          fontFamily: "SUITE-Regular",
          color: "var(--graph-label-color)",
        },
        enabled: false,
      },
      yAxis: {
        gridLineInterpolation: "polygon",
        lineWidth: 0,
        min: 0,
        max: 1.5,
        labels: {
          enabled: false,
          style: {
            color: "var(--graph-label-color)",
            fontWeight: "light",
            fontFamily: "SUITE-Regular",
          },
        },
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        series: {
          pointPlacement: 0,
          animation: {
            duration: 500, // 애니메이션 지속 시간 줄이기
            easing: "none", // 이징 효과 (선택 사항)
          },
          color: "#5fc8f1",
        },
      },
      tooltip: {
        formatter: function () {
          const categories = [
            "총휘발성유기화합물",
            "이산화탄소",
            "미세먼지 (PM10)",
            "초미세먼지 (PM2.5)",
            "온도",
            "습도",
          ];
          const units = ["ppb", "ppm", "㎍/㎥", "㎍/㎥", "℃", "%"];
          const originalValue =
            this.series.userOptions.originData[this.point.index];
          const unit = units[this.point.index];
          const scales = {
            총휘발성유기화합물: 2500,
            이산화탄소: 2500,
            "미세먼지 (PM10)": 50,
            "초미세먼지 (PM2.5)": 50,
            온도: 50,
            습도: 100,
          };
          const scaledValue =
            originalValue / scales[categories[this.point.index]];

          return `<b>상대 지수: ${scaledValue.toFixed(2)}</b><br/>${
            categories[this.point.index]
          }: ${originalValue} ${unit}`;
        },
        style: {
          fontWeight: "light",
          fontFamily: "SUITE-Regular",
        },
      },
      series:
        envData.length > 0
          ? envData.find((e) => e.id === selectedModule)
          : defaultSeries,
    };
  }, [envData, selectedModule]);

  const aqOptions = useMemo(() => {
    return {
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
        categories: aqData.map((d) => d.x),
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
          data: aqData.map((d) => d.y),
        },
      ],
    };
  }, [aqData, selectedModule]);

  return (
    <div className={`${styles["air-quality"]} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div className={styles.header}>
        <span>작업장 공기질 현황</span>
      </div>
      <hr />
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={`${styles["h2"]}`}>&gt; 작업장 인원</div>
          <div className={`${styles["workshop-card-wrapper"]}`}>
            {envData.map((e) => (
              <div
                className={`${styles["card"]} layer3`}
                key={e.id}
                title={`ID: ${e.id}\nDescription: ${e.module_description}`}
                onClick={() => {
                  setSelectedModule(e.id);
                }}
                onMouseEnter={() => handleMouseEnter(e.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className={`${styles["text"]}`}>
                  <div className={`${styles["name"]}`}>{e.name}</div>
                  <div className={`${styles["name"]}`}>
                    {e.num_of_online_workers}/{e.num_of_workers} 명
                  </div>
                </div>

                <div
                  ref={hoverModule === e.id ? progressBarRef : null}
                  className={`${styles["progress-bar"]} ${
                    selectedModule == e.id ? styles["selected"] : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
        <hr className="vertical" />
        <div className={styles.right}>
          <div className={`${styles["h2"]}`}>
            &gt; 실시간 작업장 공기질 상태
          </div>
          <div className={`${styles["info-card-wrapper"]}`}>
            <div className={`${styles["card"]} layer3`}>
              <span className={`${styles["key"]}`}>
                <FontAwesomeIcon
                  icon={
                    envData.find((e) => e.id === selectedModule)?.isOnline
                      ? faPlugCircleCheck
                      : faPlugCircleXmark
                  }
                  style={{
                    color: "white",
                    background: envData.find((e) => e.id === selectedModule)
                      ?.isOnline
                      ? "green"
                      : "rgb(150, 3, 3)",
                  }}
                />
                &nbsp;연결상태
              </span>
              <span className={`${styles["value"]}`}>
                {envData.find((e) => e.id === selectedModule)?.isOnline
                  ? "온라인"
                  : "오프라인"}
              </span>
            </div>
            <div
              className={`${styles["card"]} layer3`}
              title={`Index: ${
                envData.find((e) => e.id === selectedModule)?.env_index
              }`}
            >
              <span className={`${styles["key"]}`}>
                <FontAwesomeIcon icon={faWind} />
                &nbsp;공기질 상태
              </span>
              <span className={`${styles["value"]}`}>
                {EnvIndexToText(
                  envData.find((e) => e.id === selectedModule)?.env_index
                )}
              </span>
            </div>
            <div
              className={`${styles["card"]} layer3`}
              title={`Date: ${
                envData.find((e) => e.id === selectedModule)?.last_update
              }`}
            >
              <span className={`${styles["key"]}`}>
                <FontAwesomeIcon icon={faClock} />
                &nbsp;측정시간
              </span>
              <span className={`${styles["value"]}`}>
                {envData.find((e) => e.id === selectedModule)?.last_update_long}
              </span>
            </div>
            <div
              className={`${styles["card"]} layer3`}
              title={`Index: ${
                envData.find((e) => e.id === selectedModule)?.env_index
              }`}
            >
              <span className={`${styles["key"]}`}>
                <FontAwesomeIcon icon={faIdCard} />
                &nbsp;측정기 ID
              </span>
              <span className={`${styles["value"]}`}>
                {envData.find((e) => e.id === selectedModule)?.id}
              </span>
            </div>
            <div
              className={`${styles["card"]} layer3`}
              title={`Index: ${
                envData.find((e) => e.id === selectedModule)?.env_index
              }`}
            >
              <span className={`${styles["key"]}`}>
                <FontAwesomeIcon icon={faReceipt} />
                &nbsp;설명
              </span>
              <span className={`${styles["value"]}`}>
                {envData.find((e) => e.id === selectedModule)
                  ?.module_description || "-"}
              </span>
            </div>
          </div>
          <div className={`${styles["env-card-wrapper"]}`}>
            <div
              className={`${styles["card"]} layer3`}
              onClick={() => {
                setEnvModalData({ img: tvoc, env: "tvoc" });
                setModalOpen(5);
              }}
            >
              <div className={styles.text}>
                <span className={styles.key}>
                  <img className={styles.icon} src={tvoc} />
                  TVOC
                </span>
                <span className={styles.value}>
                  {envData.find((e) => e.id === selectedModule)?.originData[0]}
                  ppb
                </span>
              </div>
            </div>
            <div
              className={`${styles["card"]} layer3`}
              onClick={() => {
                setEnvModalData({ img: co2, env: "co2" });
                setModalOpen(5);
              }}
            >
              <div className={styles.text}>
                <span className={styles.key}>
                  <img className={styles.icon} src={co2} />
                  CO2
                </span>
                <span className={styles.value}>
                  {envData.find((e) => e.id === selectedModule)?.originData[1]}
                  ppm
                </span>
              </div>
            </div>
            <div
              className={`${styles["card"]} layer3`}
              onClick={() => {
                setEnvModalData({ img: finedust, env: "pm10" });
                setModalOpen(5);
              }}
            >
              <div className={styles.text}>
                <span className={styles.key}>
                  <img className={styles.icon} src={finedust} />
                  미세먼지
                </span>
                <span className={styles.value}>
                  {envData.find((e) => e.id === selectedModule)?.originData[2]}
                  ㎍/㎥
                </span>
              </div>
            </div>
            <div
              className={`${styles["card"]} layer3`}
              onClick={() => {
                setEnvModalData({ img: ultrafinedust, env: "pm2_5" });
                setModalOpen(5);
              }}
            >
              <div className={styles.text}>
                <span className={styles.key}>
                  <img className={styles.icon} src={ultrafinedust} />
                  초미세먼지
                </span>
                <span className={styles.value}>
                  {envData.find((e) => e.id === selectedModule)?.originData[3]}
                  ㎍/㎥
                </span>
              </div>
            </div>
            <div
              className={`${styles["card"]} layer3`}
              onClick={() => {
                setEnvModalData({ img: temperature, env: "temperature" });
                setModalOpen(5);
              }}
            >
              <div className={styles.text}>
                <span className={styles.key}>
                  <img className={styles.icon} src={temperature} />
                  온도
                </span>
                <span className={styles.value}>
                  {envData.find((e) => e.id === selectedModule)?.originData[4]}
                  °C
                </span>
              </div>
            </div>
            <div
              className={`${styles["card"]} layer3`}
              onClick={() => {
                setEnvModalData({ img: humid, env: "humid" });
                setModalOpen(5);
              }}
            >
              <div className={styles.text}>
                <span className={styles.key}>
                  <img className={styles.icon} src={humid} />
                  습도
                </span>
                <span className={styles.value}>
                  {envData.find((e) => e.id === selectedModule)?.originData[5]}%
                </span>
              </div>
            </div>
          </div>
          <div className={`${styles["graph-wrapper"]}`}>
            <div className={`${styles["graph-radar"]} layer3`}>
              <HighchartsReact
                highcharts={Highcharts}
                options={radarOptions}
                containerProps={{
                  style: {
                    width: "100%",
                    height: "100%",
                  },
                }}
              />
            </div>
            <div className={`${styles["graph-aq"]} layer3`}>
              <HighchartsReact
                highcharts={Highcharts}
                options={aqOptions}
                containerProps={{
                  style: {
                    width: "100%",
                    height: "100%",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirQualitySummary;
