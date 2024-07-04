import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Modal from "react-modal";
import "../../../css/WorkerModal.css";
import Tooltip from "../../Tooltip";

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

function WorkerModal({ modalOpen, setModalOpen, data }) {
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
          <span className="watch">AirWall: {data?.airwall_name}</span>
        </div>
        <div className="right">
          <FontAwesomeIcon icon={faClose} onClick={() => setModalOpen(false)} />
          <div className="score">
            <span>건강 점수: 0.67 &nbsp;</span>
            <Tooltip
              content={[
                "건강 점수는 바이오 측정치들을 복합적으로 고려한 수치입니다.",
                "- 1을 초과하는 경우 인체에 영향이 있을 수 있습니다.",
              ]}
            >
              <FontAwesomeIcon icon={faCircleQuestion} />
            </Tooltip>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default WorkerModal;
