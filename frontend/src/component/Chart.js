import React, {Fragment} from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import '../css/Chart.css';
import {calculateGradientColors} from "../util";

function Chart(props) {
    const { chartIcon, chartName, chartSubname,  chartUnit,  data, chartColor } = props;

    const dataArray = data || [];
    let chartValue;
    let chartDiff = 0;

    if (dataArray.length > 0) {
        chartValue = dataArray[dataArray.length - 1].y;
    }

    if (dataArray.length > 1) {
        const lastValue = dataArray[dataArray.length - 1].y;
        const prevValue = dataArray[dataArray.length - 2].y;

        if (prevValue !== 0) {
            chartDiff = ((lastValue - prevValue) / prevValue) * 100;
        }
    }

    const options = {
        accessibility: {
            enabled: false
        },
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
                color: chartColor,
                smooth: true,
                dataLabels: {
                    enabled: false,
                    format: "<b>{point.y}</b>",
                }
            },
            area: {
                fillColor: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, // 위에서 아래로 그라데이션
                    stops: calculateGradientColors(chartColor)
                },
                marker: {
                    enabled: false // 점 비활성화
                },
            }
        },
        series: [{ name: chartSubname, data: data }]
    }

    return (
        <div className="chart-area">
            <div className="chart-info">
                <div className="flex">
                    <div className="chart-icon">
                        <img src={chartIcon}/>
                        {/*{chartIcon}*/}
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
                    <div className="chart-diff" style={{ color: chartDiff < 0 ? '#0653b0' : '' }}>
                        {chartDiff >= 0 ? `+${chartDiff.toFixed(2)}%` : `${chartDiff.toFixed(2)}%`}
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
