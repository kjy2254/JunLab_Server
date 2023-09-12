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
import Header from "./Header";

function Dashboard() {
    const [workerData, setWorkerData] = useState([]);
    const [factoryName, setFactoryName] = useState();
    const [filter, setFilter] = useState('');

    const { factoryId } = useParams();

    useEffect(() => {
        axios.get(`http://junlab.postech.ac.kr:880/api/factory/${factoryId}`)
            .then((response) => {
                setFactoryName(response.data.factoryName);
            })
            .catch((error) => {
                console.error('API 요청 실패:', error);
            });
        axios.get(`http://junlab.postech.ac.kr:880/api/factory/${factoryId}/users`)
            .then((response) => {
                setWorkerData(response.data);
            })
            .catch((error) => {
                console.error('API 요청 실패:', error);
            });
    }, []);

    return (
        <div className="dashboard-container">
            <Sidebar
                header={factoryName}
                factoryId={factoryId}
                selected={"1"}
            />
            <div className="dashboard-content">
                <div className="main-section">
                    <Header
                        placeholder="Type any workers..."
                        setData={setFilter}
                        data={filter}
                    />
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
                            data="tvoc"
                            chartColor="#FFC246"
                            factoryId={factoryId}
                        />
                        <Chart
                            chartIcon={co2}
                            chartName="이산화탄소"
                            chartSubname="CO2"
                            chartUnit="ppb"
                            data="co2"
                            chartColor="#5470DE"
                            factoryId={factoryId}
                        />
                        <Chart
                            chartIcon={temperature}
                            chartName="온도"
                            chartSubname="Temperature"
                            chartUnit="°C"
                            data="temperature"
                            chartColor="#07BEAA"
                            factoryId={factoryId}
                        />
                        <Chart
                            chartIcon={finedust}
                            chartName="미세먼지"
                            chartSubname="Fine Dust"
                            chartUnit="㎍/㎥"
                            data="pm10"
                            chartColor="#1786C4"
                            factoryId={factoryId}
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
