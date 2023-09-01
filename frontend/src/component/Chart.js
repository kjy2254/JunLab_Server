import React, {Fragment} from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import '../css/Chart.css';
import {calculateGradientColors} from "../util";

function Chart(props) {
    const { chartIcon, chartName, chartSubname, chartValue, chartUnit, chartDiff, data, chartColor } = props;

    const options = {
        chart: {
            type: 'area',
            width: null,
            height: 90
        },
        title: {
            text: null // 'none' 대신에 null로 title을 비활성화합니다.
        },
        credits: {
            enabled: false
        },
        xAxis: {
            visible: false // 'none' 대신에 visible 속성을 사용하여 x축을 비활성화합니다.
        },
        yAxis: {
            labels: {
                enabled: false // y축 레이블을 비활성화합니다.
            },
            title: {
                text: null // y축 제목도 비활성화합니다.
            },
            gridLineWidth: 0
        },
        legend: {
            enabled: false // 범례도 비활성화합니다.
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                smooth: true,
                dataLabels: {
                    enabled: false,
                    format: "<b>{point.y}</b>",
                }
            },
            area: {
                color: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, // 위에서 아래로 그라데이션
                    stops: calculateGradientColors(chartColor)
                },
                marker: {
                    enabled: false // 점 비활성화
                },
            }
        },
        series: [{ name: "data", data: data }]
    }

    return (
        <div className="chart-area">
            <div className="chart-info">
                <div className="flex">
                    <div className="chart-icon">
                        {chartIcon}
                    </div>
                    <div className="chart-name-area">
                        <div className="chart-name">
                            {chartName}
                        </div>
                        <div className="chart-subname">
                            {chartSubname}
                        </div>
                    </div>
                </div>
                <div className="chart-value-area">
                    <div className="chart-value">
                        <div className="chart-value-num">
                            {chartValue}
                        </div>
                        <div className="chart-value-unit">
                            {chartUnit}
                        </div>
                    </div>
                    <div className="chart-diff">
                        {chartDiff}%
                    </div>
                </div>
            </div>
            <div className="chart">
                <Fragment>
                    <HighchartsReact highcharts={Highcharts} options={options} />
                </Fragment>
            </div>
        </div>
    );
}

export default Chart;
