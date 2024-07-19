import {
  faClose,
  faMars,
  faPlugCircleCheck,
  faPlugCircleXmark,
  faVenus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
import {
  EnvIndexToText,
  healthIndexToLevel,
  healthIndexToText,
} from "../../../../util";
import styles from "./WorkloadModal.module.css";

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

function WorkloadModal({
  modalOpen,
  setModalOpen,
  data,
  headerText,
  setSelectedWorker,
  filter,
  setPreviousModal,
  setUpdate,
}) {
  const filteredData = data?.filter(filter);
  const { factoryId } = useParams();
  const [modules, setModules] = useState([]);

  const fetchModules = () => {
    // console.log("filater", filteredData);
    axios
      .get(`http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/airwalls`)
      .then((response) => {
        setModules(response.data);
      });
  };

  useEffect(() => {
    fetchModules();
  }, [modalOpen, data]);

  return (
    <Modal
      isOpen={modalOpen == 2}
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
              <div className={`${styles.card} layer3`} key={index}>
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
                <div className={styles.cardbody}>
                  <div className={styles.profile}>
                    <img
                      className={
                        e.online && e.last_wear == 1
                          ? styles[`level${healthIndexToLevel(e.health_index)}`]
                          : styles.offline
                      }
                      src={`http://junlab.postech.ac.kr:880/api2/image/${e.profile_image_path}`}
                      width={120}
                      height={120}
                      onClick={() => {
                        setSelectedWorker(e.user_id);
                        setModalOpen(3);
                        setPreviousModal(2);
                      }}
                    />
                    <div className={styles.name}>
                      <FontAwesomeIcon
                        icon={e.gender == "Male" ? faMars : faVenus}
                        style={{
                          color: e.gender == "Male" ? "skyblue" : "orange",
                          height: "100%",
                        }}
                      />
                      {e.name}
                    </div>
                  </div>
                  <hr className={styles.vertical} />
                  <div className={styles.info}>
                    <div className={styles.text}>
                      <span>작업장:</span>
                      <select
                        onChange={(s) => {
                          axios
                            .put(
                              `http://junlab.postech.ac.kr:880/api2/user/${e.user_id}/airwall?id=${s.target.value}`
                            )
                            .then(() => setUpdate((prev) => !prev));
                        }}
                      >
                        <option value={"null"}>선택</option>
                        {modules?.map((m) => (
                          <option
                            selected={m.module_name == e.airwall_name}
                            value={m.module_id}
                          >
                            {m.module_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      className={styles.text}
                      title={`Index: ${
                        modules?.find((m) => m.module_name == e.airwall_name)
                          ?.env_index
                      }`}
                    >
                      <span>공기질:</span>
                      <span>
                        {EnvIndexToText(
                          modules?.find((m) => m.module_name == e.airwall_name)
                            ?.env_index
                        )}
                      </span>
                    </div>
                    <hr />
                    <div
                      className={styles.text}
                      title={`Index: ${e.health_index}`}
                    >
                      <span>건강상태:</span>
                      <span>{healthIndexToText(e.health_index)}</span>
                    </div>
                  </div>
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

export default WorkloadModal;
