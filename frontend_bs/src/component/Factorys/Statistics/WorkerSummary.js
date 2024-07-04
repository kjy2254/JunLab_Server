import React, { useState } from "react";
import styles from "./Statistic.module.css";
import WorkerModal from "./WorkerModal";

function WorkerSummary() {
  const [workerModalOpen, setWorkerModalOpen] = useState(false);
  return (
    <div className={`${styles["worker-summary"]} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div className={styles.header}>작업자 통계</div>
      <hr />
      <div className={styles.body}>
        <div className={styles.stat}>
          <div className={styles.watch}>
            <span> &gt; 워치 착용현황</span>
            <div className={styles.col}>
              <div
                className={`${styles.count} ${styles.typeA} ${styles.level_default} layer1`}
                onClick={() => setWorkerModalOpen(true)}
              >
                <span className={styles.key}>총원</span>
                <span className={styles.value}>27 명</span>
              </div>
              <div
                className={`${styles.count} ${styles.typeA} ${styles.level_default} layer1`}
              >
                <span className={styles.key}>착용중</span>
                <span className={styles.value}>12 명</span>
              </div>
              <div
                className={`${styles.count} ${styles.typeA} ${styles.level_default} layer1`}
              >
                <span className={styles.key}>미착용</span>
                <span className={styles.value}>15 명</span>
              </div>
            </div>
          </div>
          <hr className={styles.vertical} />
          <div className={styles.level}>
            <div className={styles.substat}>
              <span> &gt; 작업자 건강지수 현황</span>
              <div className={styles.row}>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level5} layer1`}
                >
                  <span className={styles.key}>2.0~</span>
                  <span className={styles.value}>0 명</span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level4} layer1`}
                >
                  <span className={styles.key}>1.5~2.0</span>
                  <span className={styles.value}>4 명</span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level3} layer1`}
                >
                  <span className={styles.key}>1.0~1.5</span>
                  <span className={styles.value}>8 명</span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level2} layer1`}
                >
                  <span className={styles.key}>0.5~1.0</span>
                  <span className={styles.value}>5 명</span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level1} layer1`}
                >
                  <span className={styles.key}>0~0.5</span>
                  <span className={styles.value}>3 명</span>
                </div>
              </div>
            </div>
            <hr />
            <div className={styles.substat}>
              <span> &gt; 작업 강도 현황</span>
              <div className={styles.row}>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level5} layer1`}
                >
                  <span className={styles.key}>5단계</span>
                  <span className={styles.value}>1 명</span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level4} layer1`}
                >
                  <span className={styles.key}>4단계</span>
                  <span className={styles.value}>3 명</span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level3} layer1`}
                >
                  <span className={styles.key}>3단계</span>
                  <span className={styles.value}>10 명</span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level2} layer1`}
                >
                  <span className={styles.key}>2단계</span>
                  <span className={styles.value}>4 명</span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level1} layer1`}
                >
                  <span className={styles.key}>1단계</span>
                  <span className={styles.value}>2 명</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WorkerModal
        modalOpen={workerModalOpen}
        setModalOpen={setWorkerModalOpen}
      />
    </div>
  );
}

export default WorkerSummary;
