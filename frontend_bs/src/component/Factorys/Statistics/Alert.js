import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";
import styles from "./Statistic.module.css";

function Alert() {
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.offsetWidth;
      const containerWidth = textRef.current.parentElement.offsetWidth;
      const duration = textWidth / 50; // 속도를 조절하는 계산식

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
  }, []);
  return (
    <div className={`${styles.alert} ${styles.layer} layer2`}>
      <span className={styles.bar} />
      <div className={styles.header}>
        <FontAwesomeIcon icon={faBullhorn} />
        &nbsp;&nbsp;알림
      </div>
      <hr className="vertical" />
      <div className={styles.body}>
        <span className={styles.text} ref={textRef}>
          1-1 작업장의 공기질이 "나쁨"입니다. 환기 조치가 필요합니다.
        </span>
      </div>
    </div>
  );
}

export default Alert;
