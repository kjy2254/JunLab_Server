import React, { useEffect, useState } from "react";
import AirQualitySummary from "./AirQualitySummary";
import Alert from "./Alert";
import AlertModal from "./Modals/AlertModal";
import EnvModal from "./Modals/EnvModal";
import WorkerModal from "./Modals/WorkerModal";
import WorkloadModal from "./Modals/WorkloadModal";
import styles from "./Statistic.module.css";
import Weather from "./Weather";
import WorkerList from "./WorkerList";
import WorkerSummary from "./WorkerSummary";

function Statistic(props) {
  useEffect(() => {
    props.setHeaderText("통계");
  }, []);

  const [modalIndex, setModalIndex] = useState(0);
  const [previousModal, setPreviousModal] = useState(0);

  const [workloadModalData, setWorkloadModalData] = useState({});
  const [workerModalData, setWorkerModalData] = useState({});
  const [envModalData, setEnvModalData] = useState({});
  const [alertModalData, setAlertModalData] = useState([]);

  const [update, setUpdate] = useState(false);

  const doUpdate = () => setUpdate((prev) => !prev);
  useEffect(() => {
    const interval = setInterval(() => doUpdate(), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.statistic}>
      <div className={styles.left}>
        <div className={`${styles["first-row"]}`}>
          <Alert
            setAlertModalData={setAlertModalData}
            setModalOpen={setModalIndex}
            update={update}
          />
        </div>
        <div className={`${styles["second-row"]}`}>
          <WorkerSummary
            setWorkloadModalData={setWorkloadModalData}
            setWorkerModalData={setWorkerModalData}
            setModalOpen={setModalIndex}
            update={update}
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
            setWorkloadModalData={setWorkloadModalData}
            setModalOpen={setModalIndex}
            setPreviousModal={setPreviousModal}
            update={update}
          />
        </div>
      </div>
      <div className={styles.right}>
        <WorkerList
          doUpdate={doUpdate}
          update={update}
          setModalOpen={setModalIndex}
          setPreviousModal={setPreviousModal}
          setWorkerModalData={setWorkerModalData}
        />
      </div>

      <WorkloadModal
        modalOpen={modalIndex == 1}
        setModalOpen={setModalIndex}
        data={workloadModalData}
        setPreviousModal={setPreviousModal}
        setWorkerModalData={setWorkerModalData}
        doUpdate={doUpdate}
        update={update}
      />
      {/* <HealthIndexModal
        modalOpen={modalIndex == 2}
        setModalOpen={setModalIndex}
        data={healthIndexModalData}
        setPreviousModal={setPreviousModal}
        setWorkerModalData={setWorkerModalData}
      /> */}
      <AlertModal
        modalOpen={modalIndex == 2}
        setModalOpen={setModalIndex}
        data={alertModalData}
        doUpdate={doUpdate}
      />
      <WorkerModal
        modalOpen={modalIndex == 3}
        setModalOpen={setModalIndex}
        data={workerModalData}
        previousModal={previousModal}
        update={update}
      />
      {/* <WorkShopModal
        modalOpen={modalIndex == 4}
        setModalOpen={setModalIndex}
        data={workShopModalData}
        setPreviousModal={setPreviousModal}
        setWorkerModalData={setWorkerModalData}
        setEnvModalData={setEnvModalData}
      /> */}
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
