import React, {Fragment, useEffect, useState} from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import noData from "highcharts/modules/no-data-to-display";
import '../css/Chart.css';
import {calculateGradientColors} from "../util";
import axios from "axios";
import {Link} from "react-router-dom";

function Chart(props) {
    const { chartIcon, chartName, chartSubname,  chartUnit, chartColor, factoryId, moduleId, data } = props;

    const link = chartSubname.replaceAll(' ', '');
    const endPoint = link.toLowerCase();

    const [sensorData, setSensorData] = useState({});

    const fetchData = async () => {
        try {
            axios.get(`http://junlab.postech.ac.kr:880/api/factory/${factoryId}/${endPoint}`) //today로 수정 필요
                .then((response) => {
                    // API 응답에서 데이터를 추출합니다.
                    const dataResponse = response.data;

                    // API 응답에서 원하는 데이터를 추출합니다. 예시에서는 1번 모듈의 데이터를 사용합니다.
                    const dataArray = dataResponse[moduleId] && dataResponse[moduleId][data] ? dataResponse[moduleId][data] : [];

                    // 데이터를 상태에 설정합니다.
                    setSensorData(dataArray);
                })
                .catch((error) => {
                    console.error('API 요청 실패:', error);
                });
        }
        catch (error) {
            console.error('API 요청 실패:', error);
        }
    }

    useEffect(() => {
        // API 요청을 보내고 데이터를 가져옵니다.
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 10000);
        // 컴포넌트가 언마운트될 때 clearInterval을 호출하여 인터벌 정리
        return () => {
            clearInterval(interval);
        };
    }, []);

    let chartValue;
    let chartDiff = 0;
    noData(Highcharts);

    if (sensorData.length > 0) {
        chartValue = sensorData[sensorData.length - 1].y;
    }

    if (sensorData.length > 1) {
        const lastValue = sensorData[sensorData.length - 1].y;
        const prevValue = sensorData[sensorData.length - 2].y;

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
        lang: {
          noData: "No data available"
        },
        series: [{ name: data, data: sensorData }]
    }

    if (sensorData.length === 0) {
        options.lang.noData = "No data available"; // 데이터가 없을 때 메시지 설정
        options.noData = {
            style: {
                fontWeight: '300',
                fontSize: '15px',
                color: '#333333'
            }
        };
    }

    return (
        <Link className="chart-area" to={`/iitp/factoryManagement/factory/${props.factoryId}/${link}`}>
            <div className="chart-info">
                <div className="flex">
                    <div className="chart-icon">
                        <img src={chartIcon}/>
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
        </Link>
    );
}

export default Chart;
