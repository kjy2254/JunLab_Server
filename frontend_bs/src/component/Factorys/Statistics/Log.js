import React, { useState } from "react";
import styles from "./Statistic.module.css";

function Log() {
  const [logs, setLogs] = useState([]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newLog = generateLog();
  //     setLogs((prevLogs) => [newLog, ...prevLogs]);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  const generateLog = () => {
    const severityLevels = ["INFO", "WARN", "DANGER", "CRITICAL"];
    const severity =
      severityLevels[Math.floor(Math.random() * severityLevels.length)];

    const workerNames = ["홍길동", "김철수", "이영희", "박민수", "최지훈"];
    const workerName =
      workerNames[Math.floor(Math.random() * workerNames.length)];

    const intensityLevels = [2, 3, 4, 5];
    const intensity =
      intensityLevels[Math.floor(Math.random() * intensityLevels.length)];

    const message = `${workerName} 작업자의 작업강도가 ${intensity}단계에 도달했습니다.`;
    const timestamp = new Date().toLocaleTimeString();

    return {
      timestamp,
      severity,
      message,
    };
  };

  return (
    <div className={`${styles["log"]} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div className={styles.header}>위험도 로그</div>
      <hr />
      <div className={styles.body}>
        {logs.map((log, index) => (
          <div className={`${styles["log-card"]}`} key={index}>
            <div
              className={`${styles["info"]} ${
                styles[log.severity.toLowerCase()]
              }`}
            >
              <div className={styles.severity}>{log.severity}</div>
              <div className={styles.time}>{log.timestamp}</div>
            </div>
            <div className={styles.message}>{log.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Log;
