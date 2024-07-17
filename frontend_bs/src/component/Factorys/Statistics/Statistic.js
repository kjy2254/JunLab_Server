import React, { useEffect, useState } from "react";
import AirQuality from "./AirQuality";
import Alert from "./Alert";
import Log from "./Log";
import styles from "./Statistic.module.css";
import Weather from "./Weather";
import WorkerSummary from "./WorkerSummary";
import WorkshopStatistic from "./WorkshopStatistic";

function Statistic(props) {
  useEffect(() => {
    props.setHeaderText("통계");
  }, []);

  const [update, setUpdate] = useState(true);

  return (
    <div className={styles.statistic}>
      <div className={styles.left}>
        <div className={`${styles["first-row"]}`}>
          <Alert />
        </div>
        <div className={`${styles["second-row"]}`}>
          <WorkerSummary update={update} setUpdate={setUpdate} />
          <Weather />
        </div>

        <div className={`${styles["third-row"]}`}>
          <WorkshopStatistic update={update} />
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
