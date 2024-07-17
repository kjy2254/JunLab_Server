import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EnvIndexToText } from "../../../util";
import styles from "./Statistic.module.css";

function WorkshopStatistic({ update }) {
  const { factoryId } = useParams();
  const [envData, setEnvData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/airwalls`
        )
        .then((response) => {
          setEnvData(response.data);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [update]);

  return (
    <div className={`${styles["workshop-statistic"]} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div className={styles.header}>
        <span>작업장 통계</span>
      </div>
      <hr />
      <div className={styles.body}>
        {envData.map((e, index) => (
          <div
            className={`${styles.card} ${styles.level_default} layer3`}
            key={index}
          >
            <div className={styles.title}>{e.module_name}</div>
            <hr />
            <div className={styles.text}>
              <div className={styles.aq} title={`Index: ${e.env_index}`}>
                <span className={styles.head}>&gt; 공기질 지수</span>
                <span>{EnvIndexToText(e.env_index)}</span>
              </div>
              <hr className="vertical" />
              <div className={styles.worker}>
                <span className={styles.head}>&gt; 작업자</span>
                <span>{e.num_of_workers}명</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkshopStatistic;
