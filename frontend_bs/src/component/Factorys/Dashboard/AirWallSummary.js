import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "swiper/css";
import "swiper/css/pagination";
import "../../../css/Dashboard2.css";
import EnvList from "./EnvList";

HighchartsMore(Highcharts);

function AirWallSummary({ setSelectedEnvCard, setEnvModalOpen, setImg }) {
  const [envData, setEnvData] = useState([]);
  const { factoryId } = useParams();
  const [moduleIndex, setModuleIndex] = useState(0);
  const scale = {
    tvoc: 2500,
    co2: 2500,
    pm10: 50,
    pm2_5: 50,
    temperature: 50,
    humid: 100,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setModuleIndex((prevIndex) => (prevIndex + 1) % envData.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [envData.length]);

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
              last_update: new Date(module.last_update).toLocaleString(),
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
        labels: {
          enabled: true,
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
  }, [envData, moduleIndex]);

  return (
    <div className="workshop-summary layer2">
      <span className="bar" />
      <div className="header">
        <span>작업장 환경 상태</span>
        <div className={"level lv" + "1"}>1단계</div>
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
        {envData.map((module, idx) => (
          <>
            <div
              className={`dot${idx == moduleIndex ? " selected" : ""}`}
              id={module.module_id}
              onClick={() => setModuleIndex(idx)}
              data-tooltip-id={"module-tooltip" + module.module_id}
              data-tooltip-content={module.module_name}
            />
            <ReactTooltip
              id={"module-tooltip" + module.module_id}
              place="left"
              effect="solid"
            />
          </>
        ))}
      </div>
      <div className="module-name">측정기: {envData[moduleIndex]?.name}</div>
      <div className="module-update">
        마지막 측정 시간: {envData[moduleIndex]?.last_update}
      </div>
    </div>
  );
}

export default AirWallSummary;
