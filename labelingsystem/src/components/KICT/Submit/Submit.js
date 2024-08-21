import { faComputerMouse, faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import styles from "../Labeling.module.css";
import { LabelingContext } from "../LabelingContext";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";

function Submit() {
  const { type, setType } = useContext(LabelingContext);

  return (
    <div className={`${styles.submit} layer2`}>
      <span className={"bar"} />
      <div className={styles.title}>
        <span>제출</span>
        <button
          className={type === "mouse" ? styles.selected : ""}
          onClick={() => setType("mouse")}
        >
          <FontAwesomeIcon icon={faComputerMouse} />
        </button>
        <button
          className={type === "keyboard" ? styles.selected : ""}
          onClick={() => setType("keyboard")}
        >
          <FontAwesomeIcon icon={faKeyboard} />
        </button>
      </div>
      {type === "keyboard" ? <Keyboard /> : <Mouse />}
    </div>
  );
}

export default Submit;
