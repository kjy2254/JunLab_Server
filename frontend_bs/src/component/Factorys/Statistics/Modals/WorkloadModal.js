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
import { levelToText } from "../../../../util";
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
  setPreviousModal,
  setWorkerModalData,
  doUpdate,
  update,
}) {
  const { factoryId } = useParams();
  const [modules, setModules] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = () => {
    axios
      .get(`http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/airwalls`)
      .then((response) => {
        setModules(response.data);
        console.log("modules: ", response.data);
      });
  };

  const fetchWorkers = () => {
    axios
      .get(`http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/workers`)
      .then((response) => {
        const filteredData = response.data
          .filter((d) => {
            switch (data.filter) {
              case "All":
                return true;
              case "Wearing":
                return d.last_wear && d.online;
              case "Not worn":
                return !d.last_wear || !d.online;
              case 5:
                return d.online && d.last_wear === 1 && d.workload === 5;
              case 4:
                return d.online && d.last_wear === 1 && d.workload == 4;
              case 3:
                return d.online && d.last_wear === 1 && d.workload == 3;
              case 2:
                return d.online && d.last_wear === 1 && d.workload == 2;
              case 1:
                return d.online && d.last_wear === 1 && d.workload == 1;
              case "Workshop":
                return d.airwall_id === data.id;
              case "매우 나쁨":
                return d.online && d.last_wear === 1 && d.health_index >= 0.9;
              case "나쁨":
                return (
                  d.online &&
                  d.last_wear === 1 &&
                  d.health_index < 0.9 &&
                  d.health_index >= 0.6
                );
              case "보통":
                return (
                  d.online &&
                  d.last_wear === 1 &&
                  d.health_index < 0.6 &&
                  d.health_index >= 0.3
                );
              case "좋음":
                return (
                  d.online &&
                  d.last_wear === 1 &&
                  d.health_index < 0.3 &&
                  d.health_index >= 0.1
                );
              case "매우 좋음":
                return d.online && d.last_wear === 1 && d.health_index < 0.1;
            }
          })
          .map((worker) => ({ ...worker, overlay: false }));

        const sortedData = filteredData.sort((a, b) => {
          if (a.online === b.online) {
            if (a.online) {
              if (a.workload === b.workload) {
                return a.name.localeCompare(b.name, "ko-KR");
              }
              return b.workload - a.workload;
            } else {
              return a.name.localeCompare(b.name, "ko-KR");
            }
          }
          return b.online - a.online;
        });

        console.log(sortedData);

        setWorkers(sortedData);
        setLoading(false);
      });
  };

  const handleActionClick = (index, open) => {
    setWorkers((prevWorkers) => {
      const newWorkers = [...prevWorkers];
      newWorkers[index].overlay = open;
      return newWorkers;
    });
  };

  useEffect(() => {
    if (modalOpen) {
      fetchModules();
      fetchWorkers();
    } else {
      setLoading(true);
      setWorkers([]);
      setModules([]);
    }
  }, [modalOpen, data, update]);

  const actionRule = (healthLevel, envLevel) => {
    if (healthLevel === 1 && envLevel === 1) {
      return "관리가 잘 되고 있습니다. 별도의 조치가 필요하지 않습니다.";
    } else if (healthLevel >= 3 || envLevel >= 3) {
      return "일부 주의가 필요합니다. 적절한 조치를 취하세요.";
    } else if (healthLevel >= 5 || envLevel >= 5) {
      return "상태가 좋지 않습니다. 즉시 조치가 필요합니다.";
    } else {
      return "";
    }
  };

  return (
    <Modal
      isOpen={modalOpen}
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
      {/* <div className={styles.header}>
        <div className={`${styles["title"]}`}>{headerText}</div>
      </div> */}
      <div className={`${styles.body} layer2`}>
        <div className={`${styles["card-wrapper"]}`}>
          {loading ? (
            <div className={styles.loading} id="spinner" />
          ) : workers.length > 0 ? (
            workers?.map((e, index) => (
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
                  <div className={styles.workshop}>
                    {/* <span>작업장:</span> */}
                    <select
                      onChange={(s) => {
                        axios
                          .put(
                            `http://junlab.postech.ac.kr:880/api2/user/${e.user_id}/airwall?id=${s.target.value}`
                          )
                          .then(() => doUpdate());
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
                </div>
                <div className={styles.cardbody}>
                  <div className={styles.profile}>
                    <img
                      className={
                        e.online && e.last_wear == 1
                          ? styles[`level${e.workload}`]
                          : styles.offline
                      }
                      src={`http://junlab.postech.ac.kr:880/api2/image/${e.profile_image_path}`}
                      width={120}
                      height={120}
                      onClick={() => {
                        setModalOpen(3);
                        setPreviousModal(1);
                        setWorkerModalData({ selectedWorker: e.user_id });
                      }}
                    />
                    <div
                      className={`${styles["workload-index"]} ${
                        e.online && e.last_wear == 1
                          ? styles[`level${e.workload}`]
                          : ""
                      }`}
                    >
                      {e.online && e.last_wear == 1 ? e.workload || "" : ""}
                    </div>
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
                  <hr />
                  <div className={styles.info}>
                    <div className={styles.index}>
                      <div className={styles.header}>
                        <span className={styles.value}>
                          {modules?.find((m) => m.module_name == e.airwall_name)
                            ?.isOnline
                            ? Math.round(
                                modules?.find(
                                  (m) => m.module_name == e.airwall_name
                                )?.env_index * 100
                              ) / 100 || 0
                            : ""}
                        </span>
                        <div className={styles.text}>
                          <span className={styles.t1}>
                            {modules?.find(
                              (m) => m.module_name == e.airwall_name
                            )?.isOnline
                              ? levelToText(
                                  modules?.find(
                                    (m) => m.module_name == e.airwall_name
                                  )?.env_level
                                )
                              : "오프라인(측정기)"}
                          </span>
                          <span className={styles.t2}>공기질 지수</span>
                        </div>
                      </div>
                      <div className={styles.gauge}>
                        <div
                          className={styles.circle}
                          style={{
                            left: `${Math.min(
                              Math.max(
                                modules?.find(
                                  (m) => m.module_name == e.airwall_name
                                )?.env_index || 0,
                                0
                              ) * 15,
                              95
                            )}%`,
                            display: `${e.online && e.last_wear ? "" : "none"}`,
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles.index}>
                      <div className={styles.header}>
                        <span className={styles.value}>
                          {e.online && e.last_wear
                            ? Math.max(
                                Math.round(e.health_index * 100) / 100,
                                0
                              )
                            : ""}
                        </span>
                        <div className={styles.text}>
                          <span className={styles.t1}>
                            {e.online && e.last_wear
                              ? levelToText(e.health_level)
                              : ""}
                          </span>
                          <span className={styles.t2}>건강 지수</span>
                        </div>
                      </div>
                      <div className={styles.gauge}>
                        <div
                          className={styles.circle}
                          style={{
                            left: `${Math.min(
                              (Math.max(e.health_index, 0) * 100) / 1.2,
                              95
                            )}%`,
                            display: `${e.online && e.last_wear ? "" : "none"}`,
                          }}
                        />
                      </div>
                    </div>
                    {/* <span
                      className={styles.action}
                      onClick={() => {
                        handleActionClick(index, true);
                      }}
                    >
                      조치사항
                    </span>
                    {e.overlay ? (
                      <div className={`${styles["action-overlay"]}`}>
                        <FontAwesomeIcon
                          icon={faClose}
                          onClick={() => {
                            handleActionClick(index, false);
                          }}
                        />
                      </div>
                    ) : (
                      <></>
                    )} */}
                  </div>
                  <hr />
                  <div className={styles.footer}>
                    <span className={styles.key}>조치사항</span>
                    <span className={styles.value}>
                      {actionRule(
                        e.health_level,
                        modules?.find((m) => m.module_name == e.airwall_name)
                          ?.env_level
                      )}
                    </span>
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
