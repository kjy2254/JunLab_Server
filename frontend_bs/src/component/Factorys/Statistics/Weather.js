import {
  faCloud,
  faCloudShowersHeavy,
  faDroplet,
  faLocationDot,
  faTemperatureHigh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./Statistic.module.css";

function Weather() {
  return (
    <div className={`${styles["weather"]} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div className={styles.header}>
        <span>기상 정보</span>
      </div>
      <hr />
      <div className={styles.body}>
        <div className={`${styles.location} layer1`}>
          <FontAwesomeIcon icon={faLocationDot} />
          <span>경상북도 포항시 북구</span>
        </div>
        <div className={styles.cards}>
          <div className={`${styles.card} ${styles.level_default} layer1`}>
            <span className={styles.title}>날씨</span>
            <FontAwesomeIcon icon={faCloud} />
            <span className={styles.value}>구름많음</span>
          </div>
          <div className={`${styles.card} ${styles.level_default} layer1`}>
            <span className={styles.title}>기온</span>
            <FontAwesomeIcon icon={faTemperatureHigh} />
            <span className={styles.value}>33°C</span>
          </div>
          <div className={`${styles.card} ${styles.level_default} layer1`}>
            <span className={styles.title}>습도</span>
            <FontAwesomeIcon icon={faDroplet} />
            <span className={styles.value}>58%</span>
          </div>
          <div className={`${styles.card} ${styles.level_default} layer1`}>
            <span className={styles.title}>강수량</span>
            <FontAwesomeIcon icon={faCloudShowersHeavy} />
            <span className={styles.value}>0mm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;
