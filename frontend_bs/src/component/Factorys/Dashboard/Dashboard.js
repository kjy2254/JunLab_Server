import React, { useEffect, useState } from "react";
import "../../../css/Dashboard2.css";
import Advice from "./Advice";
import AirWallSummary from "./AirWallSummary";
import EnvModal from "./EnvModal";
import WorkerModal from "./WorkerModal";
import WorkerStatistic from "./WorkerStatistic";
import WorkerSummary from "./WorkerSummary";

function Dashboard(props) {
  const [onlineData, setOnlineData] = useState([]);
  const [workerModalOpen, setWorkerModalOpen] = useState(false);
  const [envModalOpen, setEnvModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(0);
  const [selectedEnvCard, setSelectedEnvCard] = useState(0);
  const [img, setImg] = useState();

  useEffect(() => {
    props.setHeaderText("통합상황판");
  }, []);

  useEffect(() => {
    if (envModalOpen || workerModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [envModalOpen, workerModalOpen]); // 모달 상태가 변경될 때마다 실행

  return (
    <div className="dashboard">
      <div className="dashboard-wrapper">
        <div className="first-row">
          <AirWallSummary
            setSelectedEnvCard={setSelectedEnvCard}
            setEnvModalOpen={setEnvModalOpen}
            setImg={setImg}
          />
        </div>
        <div className="second-row">
          <WorkerSummary
            onlineData={onlineData}
            setOnlineData={setOnlineData}
            setModalOpen={setWorkerModalOpen}
            setSelectedWorker={setSelectedWorker}
          />
          <WorkerStatistic data={onlineData} />
        </div>
        <div className="third-row">
          <Advice />
        </div>
        <WorkerModal
          modalOpen={workerModalOpen}
          setModalOpen={setWorkerModalOpen}
          selectedWorker={selectedWorker}
        />
        <EnvModal
          modalOpen={envModalOpen}
          setModalOpen={setEnvModalOpen}
          selectedEnvCard={selectedEnvCard}
          img={img}
        />
      </div>
    </div>
  );
}

export default Dashboard;
