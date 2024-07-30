import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from "./AlertModal.module.css";

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

function AlertModal({ modalOpen, setModalOpen, data, doUpdate }) {
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(true);

  const filteredLogs = data.data?.filter((e) => {
    const matchesWorker = selectedWorker ? e.user_id == selectedWorker : true;
    const matchesWorkshop = selectedWorkshop
      ? e.module_id === selectedWorkshop
      : true;
    const matchesReadStatus = showUnreadOnly ? e.read === 0 : true;
    return matchesWorker && matchesWorkshop && matchesReadStatus;
  });

  const handleReadStatusChange = (logId, newReadStatus) => {
    axios
      .put(`http://junlab.postech.ac.kr:880/api2/actionlogs`, {
        id: logId,
        read: newReadStatus,
      })
      .then((response) => {
        console.log("Update successful", response);
        // 필요시 상태 갱신 로직 추가
        doUpdate();
      })
      .catch((error) => {
        console.error("Error updating read status", error);
      });
  };

  useEffect(() => {
    setShowUnreadOnly(true);
  }, [modalOpen]);

  return (
    <Modal
      isOpen={modalOpen}
      style={customModalStyles}
      className={`${styles.alertmodal} layerModal`}
      appElement={document.getElementById("root")}
      onRequestClose={() => setModalOpen(0)}
    >
      <FontAwesomeIcon
        className={styles.close}
        icon={faClose}
        onClick={() => setModalOpen(0)}
      />
      <div className={`${styles.body} layer2`}>
        <div className={styles.search}>
          <span>필터</span>
          <div className={styles.forms}>
            <div className={styles.worker}>
              <label for="worker">작업자</label>
              <select
                id="worker"
                value={selectedWorker}
                onChange={(e) => {
                  setSelectedWorker(e.target.value);
                  setSelectedWorkshop("");
                }}
              >
                <option value="" selected>
                  선택
                </option>
                {data.users?.map((u) => (
                  <option value={u.user_id} key={u.user_id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.workshop}>
              <label for="workshop">작업장</label>
              <select
                id="workshop"
                value={selectedWorkshop}
                onChange={(e) => {
                  setSelectedWorkshop(e.target.value);
                  setSelectedWorker("");
                }}
              >
                <option value="" selected>
                  선택
                </option>
                {data.modules?.map((m) => (
                  <option value={m.module_id} key={m.module_id}>
                    {m.module_name}
                  </option>
                ))}
              </select>
            </div>

            <div className={`${styles["read"]}`}>
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
              />
              <span>&nbsp;읽지 않음만 표시</span>
            </div>
          </div>
        </div>
        <div className={`${styles["alert-wrapper"]}`}>
          {filteredLogs?.map((e) => (
            <div className={`${styles["card"]}`}>
              <div className={`${styles["date-time"]}`}>
                <span className={`${styles["date"]}`}>
                  {new Date(e.create_time).toLocaleDateString()}
                </span>
                <span className={`${styles["time"]}`}>
                  {new Date(e.create_time).toLocaleTimeString()}
                </span>
              </div>
              <span className={`${styles["log"]}`}>{e.log}</span>
              <div className={`${styles["read"]}`}>
                <span>읽음</span>
                <input
                  type="checkbox"
                  checked={e.read}
                  onChange={(ev) =>
                    handleReadStatusChange(e.id, ev.target.checked ? 1 : 0)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default AlertModal;
