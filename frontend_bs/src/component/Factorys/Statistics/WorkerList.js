import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createFuzzyMatcher, levelToText } from "../../../util";
import styles from "./WorkerList.module.css";

function WorkerList({
  doUpdate,
  update,
  setModalOpen,
  setPreviousModal,
  setWorkerModalData,
}) {
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
  const [modules, setModules] = useState([]);
  const [sortOption, setSortOption] = useState(null);
  const [filter, setFilter] = useState("");

  // 정렬 옵션
  const sortWorkers = (workers, option) => {
    if (option === "workshop") {
      return [...workers].sort((a, b) => {
        const airwallComparison = (a.airwall_name || "\uffff").localeCompare(
          b.airwall_name || "\uffff"
        );
        if (airwallComparison !== 0) return airwallComparison;
        return (a.name || "").localeCompare(b.name || "");
      });
    } else if (option === "workload") {
      return [...workers]
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        .sort(
          (a, b) =>
            b.online - a.online ||
            (b.workload ?? Infinity) - (a.workload ?? Infinity)
        );
    } else if (option === "health") {
      return [...workers]
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        .sort(
          (a, b) =>
            b.online - a.online ||
            (b.health_index ?? Infinity) - (a.health_index ?? Infinity)
        );
    } else {
      // option === "name", default(null)
      return [...workers].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    }
  };

  const { factoryId } = useParams();

  const fetchWorkers = () => {
    return axios
      .get(`http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/workers`)
      .then((response) => {
        setWorkers(sortWorkers(response.data, sortOption));
      })
      .catch((error) => {
        console.error("Error fetching workers:", error);
      });
  };

  const fetchModules = () => {
    return axios
      .get(`http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/airwalls`)
      .then((response) => {
        setModules(response.data);
      })
      .catch((error) => {
        console.error("Error fetching modules:", error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchModules();
        await fetchWorkers();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [update, sortOption]);

  // useEffect(() => {
  //   console.log(
  //     "sortedworker:",
  //     workers.map((e) => {
  //       return { workshop: e.airwall_name, id: e.name };
  //     })
  //   );
  // }, [workers]);

  return (
    <div className={`${styles["workerlist"]} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div className={styles.header}>작업자 현황</div>
      <hr />
      <div className={styles.search}>
        <input
          type="text"
          placeholder="작업자 이름을 입력하세요."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select onChange={(e) => setSortOption(e.target.value)}>
          <option value={null}>정렬</option>
          <option value={"name"}>이름</option>
          <option value={"workshop"}>작업장</option>
          <option value={"workload"}>작업 강도</option>
          <option value={"health"}>건강 지수</option>
        </select>
      </div>
      <hr />
      <div className={styles.body}>
        {workers
          .filter((v) => createFuzzyMatcher(filter).test(v.name.toLowerCase()))
          .map((w) => (
            <div
              className={`${styles["workerlist-card"]} layer3`}
              key={w.user_id}
            >
              <div className={styles.profile}>
                <img
                  className={
                    w.online && w.last_wear == 1
                      ? styles[`level${w.workload}`]
                      : styles.offline
                  }
                  src={`http://junlab.postech.ac.kr:880/api2/image/${w.profile_image_path}`}
                  width={55}
                  height={55}
                  onClick={() => {
                    setModalOpen(3);
                    setPreviousModal(0);
                    setWorkerModalData({ selectedWorker: w.user_id });
                  }}
                />
                <div
                  className={`${styles["workload-index"]} ${
                    w.online && w.last_wear == 1
                      ? styles[`level${w.workload}`]
                      : ""
                  }`}
                >
                  {w.online && w.last_wear == 1 ? w.workload || "" : ""}
                </div>
                <span>{w.name}</span>
              </div>
              <div className={styles.index}>
                <div className={styles.label}>
                  <span className={styles.value}>
                    {w.online && w.last_wear
                      ? Math.max(Math.round(w.health_index * 100) / 100, 0)
                      : ""}
                  </span>
                  <div className={styles.text}>
                    <span className={styles.t1}>
                      {w.online && w.last_wear
                        ? levelToText(w.health_level)
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
                        Math.max(w.health_index, 0) * 100,
                        95
                      )}%`,
                      display: `${w.online && w.last_wear ? "" : "none"}`,
                    }}
                  />
                </div>
              </div>
              <select
                onChange={(s) => {
                  axios
                    .put(
                      `http://junlab.postech.ac.kr:880/api2/user/${w.user_id}/airwall?id=${s.target.value}`
                    )
                    .then(() => doUpdate());
                }}
                value={w.airwall_id || "null"}
              >
                <option value={"null"}>선택</option>
                {modules?.map((m) => (
                  <option
                    // selected={m.module_id === w.airwall_id}
                    value={m.module_id}
                    key={m.module_id}
                  >
                    {m.module_name}
                  </option>
                ))}
              </select>
            </div>
          ))}
      </div>
    </div>
  );
}

export default WorkerList;
