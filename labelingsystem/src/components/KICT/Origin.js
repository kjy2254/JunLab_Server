import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./Labeling.module.css";

function Origin({
  originalImage,
  metaData,
  currentBlock,
  blockSize,
  imageSize,
  isLoaded,
}) {
  const [redBoxScale, setRedBoxScale] = useState(1);
  const [fragments, setfragments] = useState([]);

  useEffect(() => {
    // 이미지의 현재 크기와 원본 크기의 비율 계산
    const imgElement = document.querySelector(`.${styles["img-wrapper"]}`);
    if (imgElement) {
      const { width: displayWidth, height: displayHeight } =
        imgElement.getBoundingClientRect();
      const scale = {
        x: displayWidth / imageSize.width,
        y: displayHeight / imageSize.height,
      };
      setRedBoxScale(Math.min(scale.x, scale.y));
    }
  }, [imageSize]);

  useEffect(() => {
    // fragment 리스트를 받아오는 로직
    if (metaData.id) {
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api/labeling/KICT/fragments?originId=${metaData.id}`
        )
        .then((response) => {
          setfragments(response.data);
        });
    }
  }, [currentBlock, metaData]);

  const numBlocks = {
    x: imageSize.width / blockSize,
    y: imageSize.height / blockSize,
  };
  const totalBlocks = numBlocks.x * numBlocks.y;

  return (
    <div className={`${styles.origin} layer2`}>
      <span className={"bar"} />
      <span className={styles.title}>원본 사진</span>
      <div className={styles.body}>
        <div className={styles.header}>
          <span>파일명: {metaData.file_name}</span>
          <span>
            시작시간: {new Date(metaData.start_time).toLocaleString()}
          </span>
          <span>경과시간: 00시간 00분 00초</span>
          <span>
            진행도({fragments.length}/{totalBlocks})
          </span>
        </div>
        <div
          className={`${styles["img-wrapper"]}`}
          style={{ backgroundImage: `url(${isLoaded && originalImage})` }}
        >
          <div id={isLoaded ? `` : `spinner`} />
          <div
            className={styles.selectedArea}
            style={{
              left: `${currentBlock?.x * blockSize * redBoxScale - 1}px`,
              top: `${currentBlock?.y * blockSize * redBoxScale - 1}px`,
              width: `${blockSize * redBoxScale}px`,
              height: `${blockSize * redBoxScale}px`,
            }}
          />
          {isLoaded &&
            fragments.map((e, index) => (
              <div
                key={index}
                className={`${styles["labeled-area"]} ${
                  styles[`class${e.class}`]
                }`}
                style={{
                  left: `${e.x * e.size * redBoxScale}px`,
                  top: `${e.y * e.size * redBoxScale}px`,
                  width: `${e.size * redBoxScale}px`,
                  height: `${e.size * redBoxScale}px`,
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Origin;
