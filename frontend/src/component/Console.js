import '../css/Console.css'
import React, {useEffect, useState} from "react";
import axios from "axios";

function Console() {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        axios.get(`http://junlab.postech.ac.kr:880/api/sensors`)
            .then((response) => {
                const newData = response.data;
                setData(newData);
            })
            .catch((error) => {
                console.error('API 요청 실패:', error);
            });
    }

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 7000);
        // 컴포넌트가 언마운트될 때 clearInterval을 호출하여 인터벌 정리
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <div className="title">
                <h2>실시간 데이터</h2>
            </div>
            <div className="console-area">
                {data.map((v) => (
                    <div
                        className="console-card"
                        key={v.ID}
                    >
                        <div className="console-header">
                            <a>
                                <strong>ID:</strong> <span>{v.ID}</span>
                            </a>
                            <a>
                                <strong>BATT:</strong> <span>{v.BATT}</span>
                            </a>
                        </div>
                        <div className="console-details">
                            <div>
                                <p><strong>AQI:</strong> <span>{v.AQI}</span></p>
                                <p><strong>PM1.0:</strong> <span>{v.PM10}</span></p>
                                <p><strong>PM2.5:</strong> <span>{v.PM25}</span></p>
                                <p><strong>PM10:</strong> <span>{v.PM100}</span></p>
                                <p></p>
                            </div>
                            <div>
                                <p><strong>TVOC:</strong> <span>{v.TVOC}</span></p>
                                <p><strong>EC2:</strong> <span>{v.EC2}</span></p>
                                <p><strong>IRUN:</strong> <span>{v.IRUN}</span></p>
                                <p><strong>TEMP:</strong> <span>{v.TEMP}</span></p>
                            </div>
                        </div>
                        <div className="console-footer">
                            <p><strong>LAST_UPDATE:</strong> <span>{v.CREATED_AT}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Console;
