import {
  faCloud,
  faCloudShowersHeavy,
  faCloudSun,
  faDroplet,
  faLocationDot,
  faSun,
  faTemperatureHigh,
  faUmbrella,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Statistic.module.css";

function Weather() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { factoryId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(`http://junlab.postech.ac.kr:9977/weather?factory_id=${factoryId}`)
        .then((response) => {
          setData(response.data);
          if (response.data.sky) {
            setLoading(false);
          }
          console.log(response.data);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 600000);
    return () => clearInterval(interval);
  }, [factoryId]);

  const formatTime = (datetime) => {
    const [date, time] = datetime.split(" ");
    const [hours, minutes] = time.split(":");
    const intHours = parseInt(hours, 10);
    const period = intHours >= 12 ? "오후" : "오전";
    const formattedHours = intHours % 12 || 12;
    return `${date} ${period} ${formattedHours}시 ${minutes}분`;
  };

  const getWeatherIcon = (skyCondition) => {
    switch (skyCondition) {
      case "맑음":
        return faSun;
      case "구름많음":
        return faCloud;
      case "흐림":
        return faCloudSun;
      case "비":
        return faUmbrella;
      default:
        return faSun;
    }
  };

  return (
    <div className={`${styles["weather"]} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div className={styles.header}>
        <span>기상 정보</span>
      </div>
      <hr />
      <div className={styles.body}>
        <div className={`${styles.location} layer3`}>
          <FontAwesomeIcon icon={faLocationDot} />
          <span>{data.location}</span>
        </div>
        <div className={styles.cards}>
          <div className={`${styles.card} ${styles.level_default} layer3`}>
            <span className={styles.title}>날씨</span>
            {loading ? (
              <div id="spinner" />
            ) : (
              <FontAwesomeIcon icon={getWeatherIcon(data.sky)} />
            )}
            <span className={styles.value}>{data.sky}</span>
          </div>
          <div className={`${styles.card} ${styles.level_default} layer3`}>
            <span className={styles.title}>기온</span>
            {loading ? (
              <div id="spinner" />
            ) : (
              <FontAwesomeIcon icon={faTemperatureHigh} />
            )}
            <span className={styles.value}>{data.temperature}</span>
          </div>
          <div className={`${styles.card} ${styles.level_default} layer3`}>
            <span className={styles.title}>습도</span>
            {loading ? (
              <div id="spinner" />
            ) : (
              <FontAwesomeIcon icon={faDroplet} />
            )}
            <span className={styles.value}>{data.humidity}</span>
          </div>
          <div className={`${styles.card} ${styles.level_default} layer3`}>
            <span className={styles.title}>강수량</span>
            {loading ? (
              <div id="spinner" />
            ) : (
              <FontAwesomeIcon icon={faCloudShowersHeavy} />
            )}
            <span className={styles.value}>{data.precipitation}</span>
          </div>
        </div>
        <div className={styles.time}>
          예보시각: {data.update && formatTime(data.update)}
        </div>
      </div>
    </div>
  );
}

export default Weather;
