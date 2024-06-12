import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronLeft,
  faChevronRight,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "../../../css/Dashboard2.css";
import Tooltip from "../../Tooltip";
import EnvList from "./EnvList";

HighchartsMore(Highcharts);

function AirWallSummary({ setSelectedEnvCard, setEnvModalOpen, setImg }) {
  const [envData, setEnvData] = useState([]);
  const { factoryId } = useParams();
  const [moduleIndex, setModuleIndex] = useState(0);
  const [pause, setPause] = useState(false);
  const [showColor, setShowColor] = useState(false);

  const scale = {
    tvoc: 2500,
    co2: 2500,
    pm10: 50,
    pm2_5: 50,
    temperature: 50,
    humid: 100,
  };

  const slide = (forward) => {
    if (forward) {
      setModuleIndex((prevIndex) => (prevIndex + 1) % envData.length);
    } else {
      setModuleIndex(
        (prevIndex) => (prevIndex - 1 + envData.length) % envData.length
      );
    }
  };

  useEffect(() => {
    let interval;
    if (!pause) {
      interval = setInterval(() => {
        slide(true);
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [envData.length, pause]);

  useEffect(() => {
    const handleResize = () => {
      Highcharts.charts.forEach((chart) => {
        if (chart) {
          chart.reflow();
        }
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        background: [],
      },
      xAxis: {
        categories: [
          "총휘발성유기화합물",
          "이산화탄소",
          "미세먼지 (PM10)",
          "초미세먼지 (PM2.5)",
          "온도",
          "습도",
        ],
        tickmarkPlacement: "on",
        lineWidth: 0,
        labels: {
          style: {
            color: "var(--graph-lable-color)",
            fontWeight: "light",
            fontFamily: "SUITE-Regular",
          },
        },
      },
      legend: {
        itemStyle: {
          fontFamily: "SUITE-Regular",
          color: "var(--graph-lable-color)",
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
            color: "var(--graph-lable-color)",
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
    <div className="airwall-summary layer2">
      <span className="bar" />
      <div className="header">
        <span>작업장 환경 상태</span>
        <div className="score">
          <span>환경 점수: 0.67 &nbsp;</span>
          <Tooltip
            content={[
              "환경 점수는 측정된 환경 값들을 복합적으로 고려한 수치입니다.",
              "- 1을 초과하는 경우 인체에 영향이 있을 수 있습니다.",
            ]}
          >
            <FontAwesomeIcon icon={faCircleQuestion} />
          </Tooltip>
        </div>
      </div>
      <div className="radar-env">
        <div className="radar">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
        <EnvList
          data={envData[moduleIndex]?.originData}
          setSelectedEnvCard={setSelectedEnvCard}
          setEnvModalOpen={setEnvModalOpen}
          setImg={setImg}
        />
      </div>
      <div className="module-list">
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="left"
          onClick={() => slide(false)}
        />
        {envData.map((module, idx) => (
          <div
            className={`dot${idx == moduleIndex ? " selected" : ""}`}
            id={module.module_id}
            title={`ID: ${module.id}`}
            onClick={() => setModuleIndex(idx)}
          />
        ))}
        <FontAwesomeIcon
          icon={faChevronRight}
          className="right"
          onClick={() => slide(true)}
        />
      </div>
      <div
        className="module-name"
        title={envData[moduleIndex]?.module_description}
      >
        측정기: {envData[moduleIndex]?.name}
      </div>
      <div
        className="module-update"
        title={envData[moduleIndex]?.last_update_long}
      >
        마지막 측정 시간: {envData[moduleIndex]?.last_update}
      </div>
      <div className="options">
        <FontAwesomeIcon
          icon={pause ? faPlay : faPause}
          onClick={() => setPause((prev) => !prev)}
        />
        <span>차트에 색상 표시 &nbsp;</span>
        <input
          type="checkbox"
          checked={showColor}
          onChange={() => setShowColor((prev) => !prev)}
        />
      </div>
    </div>
  );
}

export default AirWallSummary;
