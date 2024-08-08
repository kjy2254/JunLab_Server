import React, { useEffect, useState } from "react";
import styles from "./Labeling.module.css";

function Current({ originalImage, currentBlock, blockSize, isLoaded }) {
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
  }, []);

  return (
    <div className={`${styles.current} layer2`}>
      <span className={"bar"} />
      <span className={styles.title}>현재 사진</span>
      <div className={styles.body}>
        <div className={`${styles["current-img-wrapper"]}`}>
          {isLoaded ? (
            <img
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
          <span className={`${styles.class1}`}>
            Class 1: 흰색 배경(정보 없음)
          </span>
          <span className={`${styles.class2}`}>
            Class 2: 프린트 된 선 또는 그림
          </span>
          <span className={`${styles.class3}`}>Class 3: 프린트 된 글씨</span>
          <span className={`${styles.class4}`}>Class 4: 손글씨</span>
          <span className={`${styles.class5}`}>Class 5: 손그림</span>
        </div>
      </div>
    </div>
  );
}

export default Current;
