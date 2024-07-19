import {
  faClose,
  faPlugCircleCheck,
  faPlugCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Modal from "react-modal";
import { healthIndexToLevel, healthIndexToText } from "../../../../util";
import styles from "./HealthIndexModal.module.css";

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

function HealthIndexModal({
  modalOpen,
  setModalOpen,
  data,
  filter,
  headerText,
  setSelectedWorker,
  setPreviousModal,
}) {
  const filteredData = data.filter(filter);

  return (
    <Modal
      isOpen={modalOpen == 1}
      style={customModalStyles}
      className={`${styles.workermodal} layerModal`}
      appElement={document.getElementById("root")}
      onRequestClose={() => setModalOpen(0)}
    >
      <FontAwesomeIcon
        className={styles.close}
        icon={faClose}
        onClick={() => setModalOpen(0)}
      />
      <div className={styles.header}>
        <div className={`${styles["title"]}`}>{headerText}</div>
      </div>
      <div className={`${styles.body} layer2`}>
        <div className={`${styles["card-wrapper"]}`}>
          {filteredData.length > 0 ? (
            filteredData?.map((e, index) => (
              <div
                className={`${styles.card} layer3`}
                key={index}
                onClick={() => {
                  setSelectedWorker(e.user_id);
                  setModalOpen(3);
                  setPreviousModal(1);
                }}
              >
                <div className={styles.status}>
                  <FontAwesomeIcon
                    icon={e.online ? faPlugCircleCheck : faPlugCircleXmark}
                    style={{
                      color: "white",
                      background: e.online ? "green" : "rgb(150, 3, 3)",
                    }}
                  />
                  {e.online
                    ? "온라인" + (e.last_wear == 1 ? "/착용중" : "/미착용")
                    : "오프라인"}
                </div>
                <img
                  className={
                    e.online && e.last_wear == 1
                      ? styles[`level${healthIndexToLevel(e.health_index)}`]
                      : styles.offline
                  }
                  src={`http://junlab.postech.ac.kr:880/api2/image/${e.profile_image_path}`}
                  width={120}
                  height={120}
                />
                <div className={styles.name}>{e.name}</div>
                <div className={styles.text} title={`index: ${e.health_index}`}>
                  <span>건강 상태:</span>
                  <span>{healthIndexToText(Math.max(e.health_index, 0))}</span>
                </div>
                <hr />
                <div className={styles.text}>
                  <span>심박수:</span>
                  <span>{e.last_heart_rate}bpm</span>
                </div>
                <div className={styles.text}>
                  <span>체온:</span>
                  <span>{e.last_body_temperature}°C</span>
                </div>
                <div className={styles.text}>
                  <span>산소포화도:</span>
                  <span>{e.last_oxygen_saturation || "-"}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noData}>No data available</div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default HealthIndexModal;
