import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Alert.module.css";

function Alert({ setAlertModalData, setModalOpen, update }) {
  const textRef = useRef(null);

  const { factoryId } = useParams();

  const [count, setCount] = useState(0);
  const [lastAlert, setLastAlert] = useState("");

  // 흐르는 애니메이션 설정
  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.offsetWidth;
      const containerWidth = textRef.current.parentElement.offsetWidth;
      const duration = textWidth / 25; // 속도를 조절하는 계산식

      textRef.current.style.animationDuration = `${duration}s`;
      textRef.current.style.transform = `translateX(${containerWidth}px)`;

      // 동적으로 @keyframes 생성
      const styleSheet = document.styleSheets[0];
      const keyframesName = "dynamicMarquee";
      const keyframes = `
            @keyframes ${keyframesName} {
              0% {
                transform: translateX(${containerWidth}px);
              }
              100% {
                transform: translateX(-${textWidth}px);
              }
            }
          `;

      // 기존의 keyframes rule을 삭제하고 새로운 keyframes 추가
      if (styleSheet.cssRules) {
        for (let i = 0; i < styleSheet.cssRules.length; i++) {
          if (styleSheet.cssRules[i].name === keyframesName) {
            styleSheet.deleteRule(i);
          }
        }
      }
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

      // 동적으로 생성한 keyframes를 사용하도록 애니메이션 설정
      textRef.current.style.animationName = keyframesName;

      textRef.current.addEventListener("animationiteration", () => {
        textRef.current.style.transform = `translateX(${containerWidth}px)`;
      });
    }
  }, [lastAlert]);

  useEffect(() => {
    axios
      .get(`http://junlab.postech.ac.kr:880/api2/actionlogs/${factoryId}`)
      .then((response) => {
        const count = response.data.data?.filter((d) => !d.read).length;
        setAlertModalData(response.data);
        setCount(count);

        // 최신 로그 찾기
        if (response.data.data?.length > 0) {
          const latestLog = response.data.data?.reduce((latest, current) => {
            return new Date(current.create_time) > new Date(latest.create_time)
              ? current
              : latest;
          });
          setLastAlert(latestLog.log);
        }
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  }, [update]);

  return (
    <div className={`${styles.alert} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div
        className={styles.header}
        onClick={() => {
          setModalOpen(2);
        }}
      >
        <FontAwesomeIcon icon={faBullhorn} />
        &nbsp;&nbsp;알림
        {count > 0 && <div className={styles.unread}>{count}</div>}
      </div>
      <hr className="vertical" />
      <div className={styles.body}>
        <span className={styles.text} ref={textRef}>
          {lastAlert}
        </span>
      </div>
    </div>
  );
}

export default Alert;
