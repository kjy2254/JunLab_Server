import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge";
import React, { useEffect } from "react";
import AirQuality from "./AirQuality";
import Alert from "./Alert";
import Log from "./Log";
import styles from "./Statistic.module.css";
import Weather from "./Weather";
import WorkerSummary from "./WorkerSummary";
import WorkshopStatistic from "./WorkshopStatistic";

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

function Statistic(props) {
  useEffect(() => {
    props.setHeaderText("통계");
  }, []);

  return (
    <div className={styles.statistic}>
      <div className={styles.left}>
        <div className={`${styles["first-row"]}`}>
          <Alert />
        </div>
        <div className={`${styles["second-row"]}`}>
          <WorkerSummary />
          <Weather />
        </div>

        <div className={`${styles["third-row"]}`}>
          <WorkshopStatistic />
          <AirQuality />
        </div>
      </div>
      <div className={styles.right}>
        <Log />
      </div>
    </div>
  );
}

export default Statistic;
