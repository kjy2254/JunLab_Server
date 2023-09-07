import Sidebar from './Sidebar';
import '../css/Dashboard.css';
import Chart from "./Chart";
import React, {useEffect, useState} from "react";
import WorkerSummary from "./WorkerSummary";
import axios from "axios";
import {useParams} from "react-router-dom";
import finedust from "../image/finedust.svg"
import temperature from "../image/temperature.svg"
import co2 from "../image/co2.svg"
import tvoc from "../image/tvoc.svg"
import path from "../image/path.svg"

function Dashboard() {
    const [tvocData, setTvocData] = useState({});
    const [co2Data, setCo2Data] = useState({});
    const [temperatureData, setTemperatureData] = useState({});
    const [pmData, setPmData] = useState({});
    const [workerData, setWorkerData] = useState([]);
    const [factoryName, setFactoryName] = useState();

    const { factoryId } = useParams();

    const fetchData = async () => {
        try {
            // Promise.all을 사용하여 병렬로 API 요청을 보냅니다.
            const [sensorsResponse, usersResponse, factoryResponse] = await Promise.all([
                axios.get(`http://localhost:880/api/factory/${factoryId}/sensors`),
                axios.get(`http://localhost:880/api/factory/${factoryId}/users`),
                axios.get(`http://localhost:880/api/factory/${factoryId}`)
            ]);

            // API 응답에서 데이터를 추출합니다.
            const sensorsData = sensorsResponse.data;
            const usersData = usersResponse.data;
            const factoryData = factoryResponse.data;

            // 각 모듈의 데이터를 추출하여 객체로 관리합니다.
            const tvocSensorData = {};
            const co2SensorData = {};
            const temperatureSensorData = {};
            const pmSensorData = {};

            for (const moduleId in sensorsData) {
                if (sensorsData.hasOwnProperty(moduleId)) {
                    const moduleData = sensorsData[moduleId];
                    tvocSensorData[moduleId] = moduleData.tvoc;
                    co2SensorData[moduleId] = moduleData.co2;
                    temperatureSensorData[moduleId] = moduleData.temperature;
                    pmSensorData[moduleId] = moduleData.pm1_0;
                }
            }
            // 데이터를 상태에 설정합니다.
            setTvocData(tvocSensorData);
            setCo2Data(co2SensorData);
            setTemperatureData(temperatureSensorData);
            setPmData(pmSensorData);
            setWorkerData(usersData);
            setFactoryName(factoryData.factoryName);
        } catch (error) {
            console.error('API 요청 실패:', error);
        }
    };

    // setInterval(() => {
    //     fetchData();
    // }, 10000);

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(() => {
            fetchData();
        }, 10000);
        // 컴포넌트가 언마운트될 때 clearInterval을 호출하여 인터벌 정리
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="dashboard-container">
            <Sidebar
                header={factoryName}
                selected={"1"}
            />
            <div className="dashboard-content">
                <div className="main-section">
                    <header className="dashboard-header">
                        {/*<h1>대시보드</h1>*/}
                    </header>
                    <div className="path-section">
                        <div className="path">
                            <img src={path}/>
                            &nbsp;Factory
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
                            &nbsp;{factoryName}
                        </div>
                    </div>
                    <div className="chart-section">
                        <Chart
                            chartIcon={tvoc}
                            chartName="휘발성유기화합물"
                            chartSubname="TVOC"
                            chartUnit="ppb"
                            data={tvocData[1]}
                            chartColor="#FFC246"
                        />
                        <Chart
                            chartIcon={co2}
                            chartName="이산화탄소"
                            chartSubname="CO2"
                            chartUnit="ppb"
                            data={co2Data[1]}
                            chartColor="#5470DE"
                        />
                        <Chart
                            chartIcon={temperature}
                            chartName="온도"
                            chartSubname="Temperature"
                            chartUnit="°C"
                            data={temperatureData[1]}
                            chartColor="#07BEAA"
                        />
                        <Chart
                            chartIcon={finedust}
                            chartName="미세먼지"
                            chartSubname="Fine Dust"
                            chartUnit="㎍/㎥"
                            data={pmData[1]}
                            chartColor="#1786C4"
                        />
                    </div>
                    <div className="summary-header">
                        작업자 상태 요약
                    </div>
                    <div className="summary-card-area">
                        {workerData.map((worker, index) => (
                            <WorkerSummary
                                key={index}
                                workerName={worker.full_name}
                                ID={worker.watch_id}
                                bpm={worker.heart_rate}
                                temperature={worker.body_temperature}
                                spo2={worker.oxygen_saturation}
                                online={worker.status === 1 ? 'Online' : 'Offline'}
                                batt={worker.battery_level}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
