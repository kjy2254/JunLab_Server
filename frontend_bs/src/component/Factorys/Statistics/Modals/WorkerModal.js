import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../../../../css/WorkerModal.css";
import { healthIndexToText } from "../../../../util";
import Tooltip from "../../../Tooltip";
import HealthGraphCard from "../../HealthGraphCard";

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

function WorkerModal({ modalOpen, setModalOpen, selectedWorker, back }) {
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
      isOpen={modalOpen == 3}
      style={customModalStyles}
      className="workermodal layerModal"
      shouldCloseOnOverlayClick={false}
      appElement={document.getElementById("root")}
      onRequestClose={() => setModalOpen(0)}
    >
      <span className="back" onClick={() => setModalOpen(back)}>
        <FontAwesomeIcon icon={faArrowLeft} />
        &nbsp;뒤로
      </span>
      <FontAwesomeIcon
        className="close"
        icon={faClose}
        onClick={() => setModalOpen(0)}
      />
      <div className="header">
        <div className="user-info">
          <span className="name">{data?.name}</span>
          <span className="watch">작업장: {data?.airwall_name || "-"}</span>
          <span className="watch">워치: {data?.watch_id}</span>
        </div>
        <div className="right">
          <div className="score">
            <span title={`Index: ${data?.health_index}`}>
              건강 상태: {healthIndexToText(data?.health_index)} &nbsp;
            </span>
            <Tooltip
              content={[
                "건강 점수는 바이오 측정치들을 복합적으로 고려한 수치입니다.",
                "- 1을 초과하는 경우 인체에 영향이 있을 수 있습니다.",
              ]}
              directionX="left"
              directionY="bottom"
            >
              <FontAwesomeIcon icon={faCircleQuestion} />
            </Tooltip>
          </div>
          <div className="score">
            <div>작업강도:</div>
            <div className={`workload lv${data.workload}`}>
              {data?.workload}단계
            </div>
          </div>
        </div>
      </div>
      <HealthGraphCard
        header={"심박수(bpm)"}
        selectedWorker={selectedWorker}
        endpoint={"heartrate"}
      />
      <HealthGraphCard
        header={"체온(°C)"}
        selectedWorker={selectedWorker}
        endpoint={"temperature"}
      />
      <HealthGraphCard
        header={"산소포화도(%)"}
        selectedWorker={selectedWorker}
        endpoint={"oxygen"}
      />
    </Modal>
  );
}

export default WorkerModal;
