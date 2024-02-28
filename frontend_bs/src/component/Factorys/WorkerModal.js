import React from "react";
import "../../css/WorkerModal.css";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import axios from "axios";
import GraphCard from "./GraphCard";

const customModalStyles = {
  overlay: {
    backgroundColor: " rgba(0, 0, 0, 0.7)",
    width: "100%",
    height: "100dvh",
    zIndex: "3",
    position: "fixed",
    top: "0",
    left: "0",
  },
};

export function WorkerModal({ modalOpen, setModalOpen, selectedWorker }) {
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get(`http://junlab.postech.ac.kr:880/api2/user/${selectedWorker}/info`)
      .then((response) => {
        const data = response.data;
        // console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  }, [selectedWorker]);

  return (
    <Modal
      isOpen={modalOpen}
      style={customModalStyles}
      className="workermodal layerModal"
      shouldCloseOnOverlayClick={false}
      appElement={document.getElementById("root")}
    >
      <div className="header">
        <div className="user-info">
          <span className="name">{data?.name}</span>
          <span className="watch">Watch: {data?.watch_id}</span>
        </div>
        <div className="right">
          위험도: &nbsp;
          <div className={"level lv1"}>1단계</div>
          <FontAwesomeIcon icon={faClose} onClick={() => setModalOpen(false)} />
        </div>
      </div>
      <GraphCard
        header={"심박수(bpm)"}
        selectedWorker={selectedWorker}
        endpoint={"heartrate"}
      />
      <GraphCard
        header={"체온(°C)"}
        selectedWorker={selectedWorker}
        endpoint={"temperature"}
      />
      <GraphCard
        header={"산소포화도(%)"}
        selectedWorker={selectedWorker}
        endpoint={"oxygen"}
      />
    </Modal>
  );
}

// export default WorkerModal;
