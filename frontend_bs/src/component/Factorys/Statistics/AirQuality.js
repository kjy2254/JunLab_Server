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
import styles from "./Statistic.module.css";

function AirQuality() {
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
              data: [
                parseFloat(module.tvoc) / scale.tvoc || 0,
                parseFloat(module.co2) / scale.co2 || 0,
                parseFloat(module.pm10) / scale.pm10 || 0,
                parseFloat(module.pm2_5) / scale.pm2_5 || 0,
                parseFloat(module.temperature) / scale.temperature || 0,
                parseFloat(module.humid) / scale.humid || 0,
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
                : new Date(module.last_update).toLocaleTimeString() +
                  "(오프라인)",
              last_update_long: new Date(module.last_update).toLocaleString(),
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

  const defaultSeries = [
    {
      name: "데이터 없음",
      data: [0, 0, 0, 0, 0, 0],
      enableMouseTracking: false,
      showInLegend: false,
    },
  ];

  const [envData, setEnvData] = useState([]);
  const [moduleIndex, setModuleIndex] = useState(0);
  const [showColor, setShowColor] = useState(false);
  const { factoryId } = useParams();
  const scale = {
    tvoc: 2500,
    co2: 2500,
    pm10: 50,
    pm2_5: 50,
    temperature: 50,
    humid: 100,
  };

  const options = useMemo(() => {
    const plotBands = showColor
      ? [
          {
            from: 0,
            to: 1.0,
            color: "var(--radar-green)",
          },
          {
            from: 1.0,
            to: 1.5,
            color: "var(--radar-yellow)",
          },
          {
            from: 1.5,
            to: 2.0,
            color: "var(--radar-red)",
          },
        ]
      : [];

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
        plotBands: plotBands,
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
          const scaledValue = this.y;
          return `<b>위험 지수: ${scaledValue.toFixed(2)}</b><br/>${
            categories[this.point.index]
          }: ${originalValue} ${unit}`;
        },
        style: {
          fontWeight: "light",
          fontFamily: "SUITE-Regular",
        },
      },
      series: envData.length > 0 ? [envData[moduleIndex]] : defaultSeries,
    };
  }, [envData, moduleIndex, showColor]);

  return (
    <div className={`${styles["air-quality"]} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div className={styles.header}>
        <span>공기질 현황</span>
        <select>
          <option>작업장 1</option>
          <option>작업장 2</option>
          <option>작업장 3</option>
          <option>작업장 4</option>
          <option>작업장 5</option>
        </select>
      </div>
      <hr />
      <span className={`${styles["air-index"]} ${styles.level4} layer1`}>
        공기질 지수: 1.7
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
          <div className={`${styles["card"]} ${styles.level5} layer1`}>
            <img className={styles.icon} src={tvoc} />
            <div className={styles.body}>
              <div className={styles.title}>TVOC</div>
              <div className={styles.text}>1672ppb</div>
            </div>
          </div>
          <div className={`${styles["card"]} ${styles.level4} layer1`}>
            <img className={styles.icon} src={co2} />
            <div className={styles.body}>
              <div className={styles.title}>CO2</div>
              <div className={styles.text}>450ppm</div>
            </div>
          </div>
          <div className={`${styles["card"]} ${styles.level3} layer1`}>
            <img className={styles.icon} src={finedust} />
            <div className={styles.body}>
              <div className={styles.title}>미세먼지(PM10)</div>
              <div className={styles.text}>10㎍/㎥</div>
            </div>
          </div>
          <div className={`${styles["card"]} ${styles.level2} layer1`}>
            <img className={styles.icon} src={ultrafinedust} />
            <div className={styles.body}>
              <div className={styles.title}>미세먼지(PM2.5)</div>
              <div className={styles.text}>13㎍/㎥</div>
            </div>
          </div>
          <div className={`${styles["card"]} ${styles.level1} layer1`}>
            <img className={styles.icon} src={temperature} />
            <div className={styles.body}>
              <div className={styles.title}>온도</div>
              <div className={styles.text}>27°C</div>
            </div>
          </div>
          <div className={`${styles["card"]} ${styles.level2} layer1`}>
            <img className={styles.icon} src={humid} />
            <div className={styles.body}>
              <div className={styles.title}>습도</div>
              <div className={styles.text}>39%</div>
            </div>
          </div>
        </div>
      </div>
      <span className={`${styles["timestamp"]}`}>
        Update: 2024/07/03 14:17:33
      </span>
    </div>
  );
}

export default AirQuality;
