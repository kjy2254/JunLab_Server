import React, { useContext, useEffect, useState } from "react";
import styles from "./Labeling.module.css";
import { LabelingContext } from "./LabelingContext";

function Current() {
  const {
    originalImage,
    currentBlock,
    blockSize,
    isLoaded,
    showClass,
    setShowClass,
  } = useContext(LabelingContext);

  const [currentScale, setCurrentScale] = useState(1);

  useEffect(() => {
    const currentImgElement = document.querySelector(
      `.${styles["current-img-wrapper"]}`
    );
    if (currentImgElement) {
      const { width: displayWidth } = currentImgElement.getBoundingClientRect();
      const scale = displayWidth / blockSize;
      setCurrentScale(scale);
    }
  }, [blockSize]);

  const toggleClassVisibility = (classKey) => {
    if (classKey === showClass) {
      setShowClass(-1);
    } else {
      setShowClass(classKey);
    }
  };

  return (
    <div className={`${styles.current} layer2`}>
      <span className={"bar"} />
      <span className={styles.title}>현재 사진</span>
      <div className={styles.body}>
        <div className={`${styles["current-img-wrapper"]}`}>
          {isLoaded ? (
            <img
              alt=""
              src={originalImage}
              style={{
                transform: `scale(${currentScale})`,
                top: `-${currentBlock.y * blockSize * currentScale}px`,
                left: `-${currentBlock.x * blockSize * currentScale}px`,
              }}
            />
          ) : (
            <div id={`spinner`} />
          )}
        </div>
        <div className={styles.class}>
          <span
            className={`${styles.class0} ${
              showClass == 0 ? styles.selected : ""
            }`}
            onClick={() => toggleClassVisibility(0)}
          >
            Class 0: 사전 라벨링
          </span>
          <span
            className={`${styles.class1} ${
              showClass == 1 ? styles.selected : ""
            }`}
            onClick={() => toggleClassVisibility(1)}
          >
            Class 1: 흰색 배경(정보 없음)
          </span>
          <span
            className={`${styles.class2} ${
              showClass == 2 ? styles.selected : ""
            }`}
            onClick={() => toggleClassVisibility(2)}
          >
            Class 2: 프린트 된 선 또는 그림
          </span>
          <span
            className={`${styles.class3} ${
              showClass == 3 ? styles.selected : ""
            }`}
            onClick={() => toggleClassVisibility(3)}
          >
            Class 3: 프린트 된 글씨
          </span>
          <span
            className={`${styles.class4} ${
              showClass == 4 ? styles.selected : ""
            }`}
            onClick={() => toggleClassVisibility(4)}
          >
            Class 4: 손글씨
          </span>
          <span
            className={`${styles.class5} ${
              showClass == 5 ? styles.selected : ""
            }`}
            onClick={() => toggleClassVisibility(5)}
          >
            Class 5: 손그림
          </span>
        </div>
      </div>
    </div>
  );
}

export default Current;
