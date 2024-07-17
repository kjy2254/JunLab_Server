import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../../css/Dashboard2.css";
import Tooltip from "../../Tooltip";
import HealthIndexModal from "./Modals/HealthIndexModal";
import WorkerModal from "./Modals/WorkerModal";
import WorkloadModal from "./Modals/WorkloadModal";
import styles from "./Statistic.module.css";

function WorkerSummary({ update, setUpdate }) {
  const [workerModalOpen, setWorkerModalOpen] = useState(0);
  const [previousModal, setPreviousModal] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(() => (d) => true);
  const [headerText, setHeaderText] = useState("");

  const { factoryId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/workers`
        );
        const sortedData = response.data.sort((a, b) => {
          // 두 항목이 모두 온라인 상태일 경우
          if (a.online && b.online) {
            return (
              b.last_wear - a.last_wear ||
              b.workload - a.workload ||
              a.name.localeCompare(b.name, "ko-KR")
            );
          }
          // 두 항목이 모두 오프라인 상태일 경우
          if (!a.online && !b.online) {
            return a.name.localeCompare(b.name, "ko-KR");
          }
          // 한쪽만 온라인인 경우 온라인 상태가 먼저 오도록 정렬
          return b.online - a.online;
        });

        setData(sortedData);
        // console.log(response.data);
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 7000);
    return () => clearInterval(interval);
  }, [factoryId, update]);

  const openModal = (filterCondition, headerText) => {
    setFilter(() => filterCondition);
    setHeaderText(headerText);
  };

  return (
    <div className={`${styles["worker-summary"]} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div className={styles.header}>작업자 통계</div>
      <hr />
      <div className={styles.body}>
        <div className={styles.stat}>
          <div className={styles.watch}>
            <span className={styles.h2}> &gt; 워치 착용현황</span>
            <div className={styles.cards}>
              <div
                className={`${styles.count} ${styles.typeA} ${styles.level_default} layer3`}
                onClick={() => {
                  setWorkerModalOpen(2);
                  openModal((d) => true, `작업자 총원: ${data.length}명`);
                }}
              >
                <span className={styles.key}>총원</span>
                <span className={styles.value}>{data.length} 명</span>
              </div>
              <div
                className={`${styles.count} ${styles.typeA} ${styles.level_default} layer3`}
                onClick={() => {
                  setWorkerModalOpen(2);
                  openModal(
                    (d) => d.online && d.last_wear,
                    `착용중: ${
                      data.filter((d) => d.online && d.last_wear).length
                    }명`
                  );
                }}
              >
                <span className={styles.key}>착용중</span>
                <span className={styles.value}>
                  {data.filter((d) => d.online && d.last_wear).length} 명
                </span>
              </div>
              <div
                className={`${styles.count} ${styles.typeA} ${styles.level_default} layer3`}
                onClick={() => {
                  setWorkerModalOpen(2);
                  openModal(
                    (d) => !d.online || !d.last_wear,
                    `미착용: ${
                      data.length -
                      data.filter((d) => d.online && d.last_wear).length
                    }명`
                  );
                }}
              >
                <span className={styles.key}>미착용</span>
                <span className={styles.value}>
                  {data.length -
                    data.filter((d) => d.online && d.last_wear).length}{" "}
                  명
                </span>
              </div>
            </div>
          </div>
          <hr className={styles.vertical} />
          <div className={styles.level}>
            <div className={styles.substat}>
              <span className={styles.h2}>
                &gt; 작업 강도 현황&nbsp;
                <Tooltip
                  content={[
                    "작업 강도란?",
                    "- 작업자의 워치로 측정된 바이탈과 작업장의 공기질을 복합적으로 고려한 수치입니다.",
                  ]}
                  directionX="right"
                  directionY="bottom"
                >
                  <FontAwesomeIcon icon={faCircleQuestion} />
                </Tooltip>
              </span>
              <div className={styles.cards}>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level5} layer3`}
                  onClick={() => {
                    setWorkerModalOpen(2);
                    openModal(
                      (d) => d.online && d.last_wear === 1 && d.workload === 5,
                      `작업강도 5단계: ${
                        data.filter(
                          (d) =>
                            d.online && d.last_wear === 1 && d.workload === 5
                        ).length
                      }명`
                    );
                  }}
                >
                  <span className={styles.key}>5단계</span>
                  <span className={styles.value}>
                    {
                      data.filter(
                        (d) => d.online && d.last_wear === 1 && d.workload === 5
                      ).length
                    }{" "}
                    명
                  </span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level4} layer3`}
                  onClick={() => {
                    setWorkerModalOpen(2);
                    openModal(
                      (d) => d.online && d.last_wear === 1 && d.workload === 4,
                      `작업강도 4단계: ${
                        data.filter(
                          (d) =>
                            d.online && d.last_wear === 1 && d.workload === 4
                        ).length
                      }명`
                    );
                  }}
                >
                  <span className={styles.key}>4단계</span>
                  <span className={styles.value}>
                    {
                      data.filter(
                        (d) => d.online && d.last_wear === 1 && d.workload === 4
                      ).length
                    }{" "}
                    명
                  </span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level3} layer3`}
                  onClick={() => {
                    setWorkerModalOpen(2);
                    openModal(
                      (d) => d.online && d.last_wear === 1 && d.workload === 3,
                      `작업강도 3단계: ${
                        data.filter(
                          (d) =>
                            d.online && d.last_wear === 1 && d.workload === 3
                        ).length
                      }명`
                    );
                  }}
                >
                  <span className={styles.key}>3단계</span>
                  <span className={styles.value}>
                    {
                      data.filter(
                        (d) => d.online && d.last_wear === 1 && d.workload === 3
                      ).length
                    }{" "}
                    명
                  </span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level2} layer3`}
                  onClick={() => {
                    setWorkerModalOpen(2);
                    openModal(
                      (d) => d.online && d.last_wear === 1 && d.workload === 2,
                      `작업강도 2단계: ${
                        data.filter(
                          (d) =>
                            d.online && d.last_wear === 1 && d.workload === 2
                        ).length
                      }명`
                    );
                  }}
                >
                  <span className={styles.key}>2단계</span>
                  <span className={styles.value}>
                    {
                      data.filter(
                        (d) => d.online && d.last_wear === 1 && d.workload === 2
                      ).length
                    }{" "}
                    명
                  </span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level1} layer3`}
                  onClick={() => {
                    setWorkerModalOpen(2);
                    openModal(
                      (d) => d.online && d.last_wear === 1 && d.workload === 1,
                      `작업강도 1단계: ${
                        data.filter(
                          (d) =>
                            d.online && d.last_wear === 1 && d.workload === 1
                        ).length
                      }명`
                    );
                  }}
                >
                  <span className={styles.key}>1단계</span>
                  <span className={styles.value}>
                    {
                      data.filter(
                        (d) => d.online && d.last_wear === 1 && d.workload === 1
                      ).length
                    }{" "}
                    명
                  </span>
                </div>
              </div>
            </div>
            <hr />
            <div className={styles.substat}>
              <span className={styles.h2}>
                &gt; 작업자 건강상태 현황&nbsp;
                <Tooltip
                  content={[
                    "건강 지수란?",
                    "- 작업자의 워치로 측정된 바이탈을 복합적으로 고려한 수치입니다.",
                  ]}
                  directionX="right"
                  directionY="bottom"
                >
                  <FontAwesomeIcon icon={faCircleQuestion} />
                </Tooltip>
              </span>
              <div className={styles.cards}>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level5} layer3`}
                  onClick={() => {
                    setWorkerModalOpen(1);
                    openModal(
                      (d) =>
                        d.online && d.last_wear === 1 && d.health_index >= 0.9,
                      `건강상태 매우 나쁨: ${
                        data.filter((d) => d.health_index >= 0.9).length
                      }명`
                    );
                  }}
                >
                  <span className={styles.key}>매우 나쁨</span>
                  <span className={styles.value}>
                    {
                      data.filter(
                        (d) =>
                          d.online && d.last_wear === 1 && d.health_index >= 0.9
                      ).length
                    }{" "}
                    명
                  </span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level4} layer3`}
                  onClick={() => {
                    setWorkerModalOpen(1);
                    openModal(
                      (d) =>
                        d.online &&
                        d.last_wear === 1 &&
                        d.health_index < 0.9 &&
                        d.health_index >= 0.6,
                      `건강상태 나쁨: ${
                        data.filter(
                          (d) =>
                            d.online &&
                            d.last_wear === 1 &&
                            d.health_index < 0.9 &&
                            d.health_index >= 0.6
                        ).length
                      }명`
                    );
                  }}
                >
                  <span className={styles.key}>나쁨</span>
                  <span className={styles.value}>
                    {
                      data.filter(
                        (d) =>
                          d.online &&
                          d.last_wear === 1 &&
                          d.health_index < 0.9 &&
                          d.health_index >= 0.6
                      ).length
                    }{" "}
                    명
                  </span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level3} layer3`}
                  onClick={() => {
                    setWorkerModalOpen(1);
                    openModal(
                      (d) =>
                        d.online &&
                        d.last_wear === 1 &&
                        d.health_index < 0.6 &&
                        d.health_index >= 0.3,
                      `건강상태 보통: ${
                        data.filter(
                          (d) =>
                            d.online &&
                            d.last_wear === 1 &&
                            d.health_index < 0.6 &&
                            d.health_index >= 0.3
                        ).length
                      }명`
                    );
                  }}
                >
                  <span className={styles.key}>보통</span>
                  <span className={styles.value}>
                    {
                      data.filter(
                        (d) =>
                          d.online &&
                          d.last_wear === 1 &&
                          d.health_index < 0.6 &&
                          d.health_index >= 0.3
                      ).length
                    }{" "}
                    명
                  </span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level2} layer3`}
                  onClick={() => {
                    setWorkerModalOpen(1);
                    openModal(
                      (d) =>
                        d.online &&
                        d.last_wear === 1 &&
                        d.health_index < 0.3 &&
                        d.health_index >= 0.1,
                      `건강상태 좋음: ${
                        data.filter(
                          (d) =>
                            d.online &&
                            d.last_wear === 1 &&
                            d.health_index < 0.3 &&
                            d.health_index >= 0.1
                        ).length
                      }명`
                    );
                  }}
                >
                  <span className={styles.key}>좋음</span>
                  <span className={styles.value}>
                    {
                      data.filter(
                        (d) =>
                          d.online &&
                          d.last_wear === 1 &&
                          d.health_index < 0.3 &&
                          d.health_index >= 0.1
                      ).length
                    }{" "}
                    명
                  </span>
                </div>
                <div
                  className={`${styles.count} ${styles.typeB} ${styles.level1} layer3`}
                  onClick={() => {
                    setWorkerModalOpen(1);
                    openModal(
                      (d) =>
                        d.online && d.last_wear === 1 && d.health_index < 0.1,
                      `건강상태 매우 좋음: ${
                        data.filter(
                          (d) =>
                            d.online &&
                            d.last_wear === 1 &&
                            d.health_index < 0.1
                        ).length
                      }명`
                    );
                  }}
                >
                  <span className={styles.key}>매우 좋음</span>
                  <span className={styles.value}>
                    {
                      data.filter(
                        (d) =>
                          d.online && d.last_wear === 1 && d.health_index < 0.1
                      ).length
                    }{" "}
                    명
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WorkloadModal
        modalOpen={workerModalOpen}
        setModalOpen={setWorkerModalOpen}
        data={data}
        filter={filter}
        headerText={headerText}
        setSelectedWorker={setSelectedWorker}
        setPreviousModal={setPreviousModal}
        setUpdate={setUpdate}
      />
      <HealthIndexModal
        modalOpen={workerModalOpen}
        setModalOpen={setWorkerModalOpen}
        data={data}
        filter={filter}
        headerText={headerText}
        setSelectedWorker={setSelectedWorker}
        setPreviousModal={setPreviousModal}
      />
      <WorkerModal
        modalOpen={workerModalOpen}
        setModalOpen={setWorkerModalOpen}
        selectedWorker={selectedWorker}
        back={previousModal}
      />
    </div>
  );
}

export default WorkerSummary;
