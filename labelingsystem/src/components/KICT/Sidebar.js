import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { createFuzzyMatcher } from "../../util";
import styles from "./Sidebar.module.css";

function Sidebar({
  originList,
  authData,
  setIsLoaded,
  currentOriginId,
  show,
  showInSmall,
}) {
  const [filter, setFilter] = useState("");

  const handleClickList = (originId) => {
    if (currentOriginId !== originId) {
      axios
        .put(
          `http://junlab.postech.ac.kr:880/api/labeling/KICT/progress?userId=${authData.user.id}&originId=${originId}`
        )
        .then((response) => {
          setIsLoaded(false);
        });
    }
  };

  return (
    <aside
      className={`${styles.sidebar} layerSidebar ${
        show ? styles.expanded : styles.collapsed
      } ${showInSmall ? styles["sv-expanded"] : ""}`}
    >
      <div className={`${styles.header}`}>
        <span className={`${styles.text}`}>
          진행중 이미지:{" "}
          {
            originList?.filter((v) =>
              createFuzzyMatcher(filter).test(v.labeler?.toLowerCase())
            ).length
          }
          건
        </span>
        {authData.user.role === "admin" && (
          <input
            type="text"
            placeholder="ID를 입력하세요."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        )}

        <hr />
      </div>
      <ul>
        {originList
          ?.filter((v) =>
            createFuzzyMatcher(filter).test(v.labeler?.toLowerCase())
          )
          .map((e) => (
            <li
              className={`${
                currentOriginId === e.origin_id ? styles.selected : ""
              }`}
              key={e.origin_id}
              onClick={() => handleClickList(e.origin_id)}
            >
              <div className={styles.item}>
                <span className={`${styles.name}`} title={e.file_name}>
                  <FontAwesomeIcon icon={faImage} /> &nbsp;
                  {e.file_name} ({parseFloat(e.progress_percentage).toFixed(1)}
                  %)
                </span>
                <span className={styles.labeler}>{e.labeler}</span>
              </div>
            </li>
          ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
