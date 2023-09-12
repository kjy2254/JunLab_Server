import React, {useState, useEffect, Fragment} from 'react';
import axios from 'axios';
import Sidebar from "./Sidebar";
import '../css/Details.css';
import {useParams} from "react-router-dom";
import Header from "./Header";
import path from "../image/path.svg";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

import finedust from "../image/finedust.svg"
import temperature from "../image/temperature.svg"
import co2 from "../image/co2.svg"
import tvoc from "../image/tvoc.svg"

function Details() {

    const {factoryId, data} = useParams();
    const link = data.replaceAll(' ', '');
    const endPoint = link.toLowerCase();

    const [factoryName, setFactoryName] = useState();

    const [date, setDate] = useState();

    const updateDate = e => setDate(e.target.value);

    const [filter, setFilter] = useState('');

    const [selected, setSelected] = useState('pm1.0');

    const map = {
        "TVOC": {
            "chartIcon": tvoc,
            "chartName": "휘발성유기화합물",
            "chartSubname": "TVOC",
            "chartUnit": "ppb",
            "min": 0,
            "max": 2000
        },
        "Temperature": {
            "chartIcon": temperature,
            "chartName": "온도",
            "chartSubname": "Temperature",
            "chartUnit": "°C",
            "min": -10,
            "max": 70
        },
        "CO2": {
            "chartIcon": co2,
            "chartName": "이산화탄소",
            "chartSubname": "CO2",
            "chartUnit": "ppb",
            "min": 400,
            "max": 4000
        },
        "FineDust": {
            "chartIcon": finedust,
            "chartName": "미세먼지",
            "chartSubname": "Fine dust",
            "chartUnit": "㎍/㎥",
            "min": 0,
            "max": 500
        },
    };

    const [formattedData, setFormattedData] = useState([]);

    useEffect(() => {
        // API 요청을 보내고 데이터를 가져옵니다.
        axios.get(`http://junlab.postech.ac.kr:880/api/factory/${factoryId}`)
            .then((response) => {
                setFactoryName(response.data.factoryName);
            })
            .catch((error) => {
                console.error('API 요청 실패:', error);
            });
    }, []);

    const fetchData = async () => {
        axios.get(`http://junlab.postech.ac.kr:880/api/factory/${factoryId}/${endPoint}?date=${date ? date : ''}`)
            .then((response) => {
                const dataResponse = response.data;

                // API 응답에서 원하는 데이터를 추출합니다.
                const formattedData = Object.keys(dataResponse).map(moduleId => {
                    if (endPoint !== 'finedust') {
                        const moduleData = dataResponse[moduleId][endPoint].map(item => ({
                            x: new Date(item.name),
                            y: item.y
                        }));
                        return {
                            name: `Module_${moduleId} (${data})`,
                            data: moduleData
                        };
                    } else {
                        const pm1_0data = dataResponse[moduleId]['pm1_0'].map(item => ({
                            x: new Date(item.name),
                            y: item.y
                        }));
                        const pm2_5data = dataResponse[moduleId]['pm2_5'].map(item => ({
                            x: new Date(item.name),
                            y: item.y
                        }));
                        const pm10data = dataResponse[moduleId]['pm10'].map(item => ({
                            x: new Date(item.name),
                            y: item.y
                        }));

                        if (selected === 'pm1.0') {
                            return {
                                name: `Module_${moduleId} (pm1.0)`,
                                data: pm1_0data,
                            };
                        } else if (selected === 'pm2.5') {
                            return {
                                name: `Module_${moduleId} (pm2.5)`,
                                data: pm2_5data,
                            };
                        } else {
                            return {
                                name: `Module_${moduleId} (pm10)`,
                                data: pm10data,
                            };
                        }
                    }
                });
                // 데이터를 상태에 설정합니다.
                setFormattedData(formattedData);
            })
            .catch((error) => {
                console.error('API 요청 실패:', error);
            });
    }

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 10000);
        // 컴포넌트가 언마운트될 때 clearInterval을 호출하여 인터벌 정리
        return () => {
            clearInterval(interval);
        };
    }, [date, data, selected]);


    const options = {
        accessibility: {
            enabled: false
        },
        chart: {
            type: 'line',
        },
        title: {
            text: null // 'none' 대신에 null로 title을 비활성화합니다.
        },
        credits: {
            enabled: false
        },
        xAxis: {
            visible: true,
            type: 'datetime', // x축을 날짜/시간 형식으로 설정
            // tickInterval: 1000, // 간격을 1초로 설정
            labels: {
                enabled: false // x축 라벨 숨기기
            },
            title: {
                text: "time"
            },
        },
        yAxis: {
            min: map[data].min,
            max: map[data].max,
            labels: {
                enabled: false // y축 레이블을 비활성화합니다.
            },
            title: {
                text: map[data].chartUnit
            },
            gridLineWidth: 0
        },
        plotOptions: {
            series: {
                stacking: 'overlap',
                smooth: true,
                dataLabels: {
                    enabled: false,
                    format: "<b>{point.y}</b>",
                }
            },
            line: {
                marker: {
                    enabled: false // 점 비활성화
                },
                smooth: true,
            },
        },
        lang: {
            noData: "No data available"
        },

        legend: {
            enabled: true,
            // 범례 항목 설정
            labelFormatter: function () {
                const seriesName = this.name; // 데이터 시리즈 이름
                const color = this.color; // 데이터 시리즈 색상
                return `<span style="color:${color}">${seriesName}</span>`; // 색상과 시리즈 이름을 포함한 HTML 반환
            }
        },

        series: formattedData
    }

    if (formattedData.length === 0) {
        options.lang.noData = "No data available"; // 데이터가 없을 때 메시지 설정
        options.noData = {
            style: {
                fontWeight: '300',
                fontSize: '15px',
                color: '#333333'
            }
        };
        options.xAxis.visible = false;
        options.yAxis.visible = false;
    }

    return (
        <div className="detail-container">
            <Sidebar
                header={factoryName}
                factoryId={factoryId}
                selected="2"
            />
            <div className="detail-content">
                <Header
                    placeholder="Type any factories..."
                    setData={setFilter}
                    data={filter}
                />
                <div className="path-section">
                    <div className="path">
                        <img src={path}/>
                        &nbsp;Factory
                    </div>
                    <div className="path">
                        <img src={path}/>
                        &nbsp;{factoryName}
                    </div>
                    <div className="path-selected">
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8 0V8H0L8 0Z"
                                  fill="url(#paint0_linear_104_907)"/>
                            <defs>
                                <linearGradient id="paint0_linear_104_907" x1="13.1265" y1="6.66481" x2="3.15937"
                                                y2="12.9836" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#0043FF"/>
                                    <stop offset="1" stopColor="#A370F1"/>
                                </linearGradient>
                            </defs>
                        </svg>
                        &nbsp;{data}
                    </div>
                </div>
                <div className="detail-section">
                    <div className="detail-info">
                        <div className="flex">
                            <div className="chart-icon">
                                <img src={map[data].chartIcon}/>
                            </div>
                            <div className="chart-name-area">
                                <div className="chart-name">
                                    {map[data].chartName}
                                </div>
                                <div className="chart-subname">
                                    {map[data].chartSubname}
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className={(endPoint === "finedust" ? "" : "none")} >
                                <button
                                    className={"button " + (selected === 'pm1.0' ? 'button-selected' : '')}
                                    onClick={() => setSelected('pm1.0')}
                                >pm1.0
                                </button>
                                <button
                                    className={"button " + (selected === 'pm2.5' ? 'button-selected' : '')}
                                    onClick={() => setSelected('pm2.5')}
                                >pm2.5
                                </button>
                                <button
                                    className={"button " + (selected === 'pm10' ? 'button-selected' : '')}
                                    onClick={() => setSelected('pm10')}
                                >pm10
                                </button>
                            </div>
                            <input
                                type="date"
                                onChange={updateDate}
                                value={date || ""}
                            />
                        </div>
                    </div>
                    <div className="detail-chart">
                        <Fragment>
                            <HighchartsReact highcharts={Highcharts} options={options}/>
                        </Fragment>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;
