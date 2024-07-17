import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import co2 from "../../../image/co22.svg";
import finedust from "../../../image/finedust2.svg";
import humid from "../../../image/humid2.svg";
import temperature from "../../../image/temperature2.svg";
import tvoc from "../../../image/tvoc2.svg";
import ultrafinedust from "../../../image/ultrafinedust2.svg";
import { EnvIndexToText } from "../../../util";
import EnvModal from "./Modals/EnvModal";
import styles from "./Statistic.module.css";

function AirQuality() {
  const [envData, setEnvData] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [pause, setPause] = useState(false);
  const { factoryId } = useParams();

  const [modal, setModal] = useState({ open: false, img: null, env: null });

  const scaleValue = (value, scale) => {
    return Math.min(2, parseFloat(value) / scale || 0);
  };

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
              last_update: module.isOnline
                ? new Date(module.last_update).toLocaleTimeString()
                : new Date(module.last_update).toLocaleTimeString(),
              last_update_long: new Date(module.last_update).toLocaleString(),
              marker: {
                symbol: "diamond",
                radius: 4,
              },
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

  useEffect(() => {
    if (envData.length > 0) {
      setSelectedModule(envData[0].id);
    } else {
      setEnvData(defaultSeries);
      setSelectedModule("no-data");
    }
  }, [envData.length]);

  useEffect(() => {
    if (envData.length > 0) {
      const interval = setInterval(() => {
        if (pause) return;
        setSelectedModule((prevModule) => {
          const currentIndex = envData.findIndex((e) => e.id === prevModule);
          const nextIndex = (currentIndex + 1) % envData.length;
          return envData[nextIndex].id;
        });
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [envData.length, pause]);

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

  const scale = {
    tvoc: 2500,
    co2: 2500,
    pm10: 50,
    pm2_5: 50,
    temperature: 50,
    humid: 100,
  };

  const options = useMemo(() => {
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

  return (
    <div className={`${styles["air-quality"]} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div className={styles.header}>
        <span>공기질 현황</span>
        <div className={styles.select}>
          <FontAwesomeIcon
            onClick={() => setPause((prev) => !prev)}
            icon={pause ? faPlay : faPause}
          />
          <select
            value={selectedModule}
            onChange={(e) => {
              setSelectedModule(e.target.value);
              setPause(true);
            }}
          >
            {envData.length == 0 ? (
              <option>데이터 없음</option>
            ) : (
              envData.map((e) => (
                <option
                  key={e.id}
                  value={e.id}
                  title={`ID: ${e.id}\nDescription: ${e.module_description}`}
                >
                  {e.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
      <hr />
      <span className={`${styles["air-index"]} ${styles.level_default} layer3`}>
        공기질 지수:{" "}
        {EnvIndexToText(
          envData.find((e) => e.id === selectedModule)?.env_index
        )}
      </span>
      <div className={styles.body}>
        <div className={styles.radar}>
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
        <div className={`${styles["air-cards"]}`}>
          <div
            className={`${styles["card"]} ${styles.level_default} layer3`}
            onClick={() =>
              setModal({ ...modal, open: true, img: tvoc, env: "tvoc" })
            }
          >
            <img className={styles.icon} src={tvoc} />
            <div className={styles.body}>
              <div className={styles.title}>TVOC</div>
              <div className={styles.text}>
                {envData.find((e) => e.id === selectedModule)?.originData[0]}
                ppb
              </div>
            </div>
          </div>
          <div
            className={`${styles["card"]} ${styles.level_default} layer3`}
            onClick={() =>
              setModal({ ...modal, open: true, img: co2, env: "co2" })
            }
          >
            <img className={styles.icon} src={co2} />
            <div className={styles.body}>
              <div className={styles.title}>CO2</div>
              <div className={styles.text}>
                {envData.find((e) => e.id === selectedModule)?.originData[1]}
                ppm
              </div>
            </div>
          </div>
          <div
            className={`${styles["card"]} ${styles.level_default} layer3`}
            onClick={() =>
              setModal({ ...modal, open: true, img: finedust, env: "pm10" })
            }
          >
            <img className={styles.icon} src={finedust} />
            <div className={styles.body}>
              <div className={styles.title}>미세먼지(PM10)</div>
              <div className={styles.text}>
                {envData.find((e) => e.id === selectedModule)?.originData[2]}
                ㎍/㎥
              </div>
            </div>
          </div>
          <div
            className={`${styles["card"]} ${styles.level_default} layer3`}
            onClick={() =>
              setModal({
                ...modal,
                open: true,
                img: ultrafinedust,
                env: "pm2_5",
              })
            }
          >
            <img className={styles.icon} src={ultrafinedust} />
            <div className={styles.body}>
              <div className={styles.title}>미세먼지(PM2.5)</div>
              <div className={styles.text}>
                {envData.find((e) => e.id === selectedModule)?.originData[3]}
                ㎍/㎥
              </div>
            </div>
          </div>
          <div
            className={`${styles["card"]} ${styles.level_default} layer3`}
            onClick={() =>
              setModal({
                ...modal,
                open: true,
                img: temperature,
                env: "temperature",
              })
            }
          >
            <img className={styles.icon} src={temperature} />
            <div className={styles.body}>
              <div className={styles.title}>온도</div>
              <div className={styles.text}>
                {envData.find((e) => e.id === selectedModule)?.originData[4]}°C
              </div>
            </div>
          </div>
          <div
            className={`${styles["card"]} ${styles.level_default} layer3`}
            onClick={() =>
              setModal({
                ...modal,
                open: true,
                img: humid,
                env: "humid",
              })
            }
          >
            <img className={styles.icon} src={humid} />
            <div className={styles.body}>
              <div className={styles.title}>습도</div>
              <div className={styles.text}>
                {envData.find((e) => e.id === selectedModule)?.originData[5]}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className={`${styles["timestamp"]}`}>
        Update: {envData.find((e) => e.id === selectedModule)?.last_update_long}
      </span>
      <EnvModal
        modalOpen={modal.open}
        modalClose={() => {
          setModal({ ...modal, open: false });
        }}
        selectedEnvCard={modal.env}
        img={modal.img}
      />
    </div>
  );
}

export default AirQuality;
