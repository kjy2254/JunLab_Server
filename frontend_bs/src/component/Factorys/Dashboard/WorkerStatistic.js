import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import "../../../css/Dashboard2.css";

function WorkerStatistic({ data }) {
  const levelCounts = data.reduce((acc, worker) => {
    const level = worker.workload;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(levelCounts).map((level) => ({
    name: `${level}단계`,
    y: levelCounts[level],
    color: getLevelColor(level), // 색상은 작업 단계에 따라 정의
  }));

  function getLevelColor(level) {
    switch (level) {
      case "1":
        return "rgb(34,180,237)";
      case "2":
        return "rgb(150,208,96)";
      case "3":
        return "rgb(255,252,75)";
      case "4":
        return "rgb(253,188,58)";
      case "5":
        return "rgb(250,0,25)";
      default:
        return "rgb(200,200,200)";
    }
  }

  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent", // 배경을 투명하게 설정
      plotBorderWidth: null, // 테두리 제거
      plotShadow: false, // 그림자 제거
      width: 300,
      height: 300,
      plotBorderColor: "transparent",
    },
    accessibility: {
      enabled: false,
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
        data: chartData,
      },
    ],
  };

  return (
    <div className="worker-statistic layer2">
      <span className="bar"></span>
      <div className="header">
        <span>작업자 통계</span>
      </div>
      <div className="pie-chart">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <div className="description">
        <span>1단계</span>
        <span>{levelCounts[1] || 0} 명</span>
      </div>
      <div className="description">
        <span>2단계</span>
        <span>{levelCounts[2] || 0} 명</span>
      </div>
      <div className="description">
        <span>3단계</span>
        <span>{levelCounts[3] || 0} 명</span>
      </div>
      <div className="description">
        <span>4단계</span>
        <span>{levelCounts[4] || 0} 명</span>
      </div>
      <div className="description">
        <span>5단계</span>
        <span>{levelCounts[5] || 0} 명</span>
      </div>
    </div>
  );
}
export default WorkerStatistic;
