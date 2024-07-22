import React, { useEffect, useState } from "react";
import AirQualitySummary from "./AirQualitySummary";
import Alert from "./Alert";
import Log from "./Log";
import EnvModal from "./Modals/EnvModal";
import HealthIndexModal from "./Modals/HealthIndexModal";
import WorkerModal from "./Modals/WorkerModal";
import WorkloadModal from "./Modals/WorkloadModal";
import WorkShopModal from "./Modals/WorkShopModal";
import styles from "./Statistic.module.css";
import Weather from "./Weather";
import WorkerSummary from "./WorkerSummary";

function Statistic(props) {
  useEffect(() => {
    props.setHeaderText("통계");
  }, []);

  const [previousModal, setPreviousModal] = useState(0);

  const [workloadModalData, setWorkloadModalData] = useState({});
  const [healthIndexModalData, setHealthIndexModalData] = useState({});
  const [workerModalData, setWorkerModalData] = useState({});
  const [workShopModalData, setWorkShopModalData] = useState({});
  const [envModalData, setEnvModalData] = useState({});

  const [modalIndex, setModalIndex] = useState(0);

  return (
    <div className={styles.statistic}>
      <div className={styles.left}>
        <div className={`${styles["first-row"]}`}>
          <Alert />
        </div>
        <div className={`${styles["second-row"]}`}>
          <WorkerSummary
            setWorkloadModalData={setWorkloadModalData}
            setHealthIndexModalData={setHealthIndexModalData}
            setWorkerModalData={setWorkerModalData}
            setModalOpen={setModalIndex}
          />
          <Weather />
        </div>
        {/* 
        <div className={`${styles["third-row"]}`}>
          <WorkshopStatistic
            setWorkShopModalData={setWorkShopModalData}
            setModalOpen={setModalIndex}
          />
          <AirQuality
            setEnvModalData={setEnvModalData}
            setModalOpen={setModalIndex}
          />
        </div> */}
        <div className={`${styles["third-row"]}`}>
          <AirQualitySummary
            setEnvModalData={setEnvModalData}
            setModalOpen={setModalIndex}
          />
        </div>
      </div>
      <div className={styles.right}>
        <Log />
      </div>

      <WorkloadModal
        modalOpen={modalIndex == 1}
        setModalOpen={setModalIndex}
        data={workloadModalData}
        setPreviousModal={setPreviousModal}
        setWorkerModalData={setWorkerModalData}
      />
      <HealthIndexModal
        modalOpen={modalIndex == 2}
        setModalOpen={setModalIndex}
        data={healthIndexModalData}
        setPreviousModal={setPreviousModal}
        setWorkerModalData={setWorkerModalData}
      />
      <WorkerModal
        modalOpen={modalIndex == 3}
        setModalOpen={setModalIndex}
        data={workerModalData}
        previousModal={previousModal}
      />
      <WorkShopModal
        modalOpen={modalIndex == 4}
        setModalOpen={setModalIndex}
        data={workShopModalData}
        setPreviousModal={setPreviousModal}
        setWorkerModalData={setWorkerModalData}
        setEnvModalData={setEnvModalData}
      />
      <EnvModal
        modalOpen={modalIndex == 5}
        setModalOpen={setModalIndex}
        data={envModalData}
        previousModal={previousModal}
      />
    </div>
  );
}

export default Statistic;
