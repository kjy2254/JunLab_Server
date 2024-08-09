import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Labeling.module.css";

function Origin({
  originalImage,
  metaData,
  currentBlock,
  setCurrentBlock,
  blockSize,
  imageSize,
  isLoaded,
  elapsedTime,
  fragments,
  autoClick,
  showClass,
}) {
  const [redBoxScale, setRedBoxScale] = useState(1);
  const [hoverBlock, setHoverBlock] = useState({ x: -1, y: -1 });

  const isDraggingRef = useRef(false); // 드래그 상태를 추적하기 위한 ref

  const updateScale = () => {
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
  };

  useEffect(() => {
    window.addEventListener("resize", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, [imageSize]);

  useEffect(() => {
    updateScale();
  }, [imageSize]);

  const handleImgWrapperClick = (event) => {
    const imgElement = document.querySelector(`.${styles["img-wrapper"]}`);
    const rect = imgElement.getBoundingClientRect();
    const x = Math.floor(
      (event.clientX - rect.left) / (blockSize * redBoxScale)
    );
    const y = Math.floor(
      (event.clientY - rect.top) / (blockSize * redBoxScale)
    );

    if (x >= 0 && x < numBlocks.x && y >= 0 && y < numBlocks.y) {
      const isClass0 = fragments.some(
        (fragment) => fragment.x === x && fragment.y === y && fragment.class0
      );

      if (!isClass0) {
        setCurrentBlock({ x, y });
      }
    }
  };

  const handleMouseMove = (event) => {
    const imgElement = document.querySelector(`.${styles["img-wrapper"]}`);
    const rect = imgElement.getBoundingClientRect();

    if (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    ) {
      const x = Math.floor(
        (event.clientX - rect.left) / (blockSize * redBoxScale)
      );
      const y = Math.floor(
        (event.clientY - rect.top) / (blockSize * redBoxScale)
      );

      if (x >= 0 && x < numBlocks.x && y >= 0 && y < numBlocks.y) {
        setHoverBlock({ x, y });
        if ((isDraggingRef.current || autoClick) && !isClass0(x, y)) {
          setCurrentBlock({ x, y });
        }
      }
    } else {
      setHoverBlock({ x: -1, y: -1 }); // 마우스가 img-wrapper 영역을 벗어났을 때
    }
  };

  const isClass0 = (x, y) => {
    return fragments.some(
      (fragment) => fragment.x === x && fragment.y === y && fragment.class0
    );
  };

  const handleMouseDown = (event) => {
    isDraggingRef.current = true;
    handleImgWrapperClick(event); // 클릭 시에도 블록을 설정
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleResetElapsed = () => {
    axios
      .post("http://junlab.postech.ac.kr:880/api/labeling/KICT/elapsedTime", {
        originId: metaData.id,
        elapsedTime: 0,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error sending elapsed time:", error);
      });
  };

  const formatElapsedTime = (seconds) => {
    if (!seconds) return "-";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}시간 ${minutes
      .toString()
      .padStart(2, "0")}분 ${(seconds % 60).toString().padStart(2, "0")}초`;
  };

  const classToClassName = (classes) => {
    let classNames = [];

    if (classes.class0) classNames.push(styles.class0);
    if (classes.class1) classNames.push(styles.class1);
    if (classes.class2) classNames.push(styles.class2);
    if (classes.class3) classNames.push(styles.class3);
    if (classes.class4) classNames.push(styles.class4);
    if (classes.class5) classNames.push(styles.class5);

    return classNames.join(" ");
  };

  const numBlocks = {
    x: imageSize.width / blockSize,
    y: imageSize.height / blockSize,
  };
  const totalBlocks = numBlocks.x * numBlocks.y;
  const shouldShowFragment = (fragment) => {
    // showClass가 -1이 아니고, fragment의 해당 클래스 속성이 true인 경우
    if (showClass === -1) return true;

    const classKey = `class${showClass}`;
    return fragment[classKey];
  };
  return (
    <div className={`${styles.origin} layer2`}>
      <span className={"bar"} />
      <span className={styles.title}>원본 사진</span>
      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.sub}>
            <span>파일명: {metaData.file_name}</span>
            <span>
              이미지 크기: {imageSize.width} X {imageSize.height}
            </span>
            <span>
              진행도({fragments.length}/{totalBlocks})
            </span>
          </div>
          <div className={styles.sub}>
            <span>
              시작시간:{" "}
              {metaData.start_time
                ? new Date(metaData.start_time).toLocaleString()
                : "-"}
            </span>
            <span>
              경과시간: {formatElapsedTime(elapsedTime)} &nbsp;
              <FontAwesomeIcon icon={faRotate} onClick={handleResetElapsed} />
            </span>
            <span>
              현재 클래스:{" "}
              {fragments
                .filter(
                  (fragment) =>
                    fragment.x === currentBlock.x &&
                    fragment.y === currentBlock.y
                )
                .map((fragment) =>
                  Object.keys(fragment)
                    .filter((key) => key.startsWith("class") && fragment[key])
                    .map((key) => key.replace("class", ""))
                    .join(", ")
                ) || "[]"}
            </span>
          </div>
        </div>
        <div
          className={`${styles["img-wrapper"]}`}
          style={{ backgroundImage: `url(${isLoaded && originalImage})` }}
          onMouseDown={handleMouseDown} // 마우스 누름 이벤트 핸들러
          onMouseMove={handleMouseMove} // 마우스 이동 이벤트 핸들러
          onMouseUp={handleMouseUp} // 마우스 뗌 이벤트 핸들러
          onMouseLeave={handleMouseUp} // 마우스가 img-wrapper를 벗어났을 때
        >
          <div id={isLoaded ? `` : `spinner`} />
          <div
            className={styles.selectedArea}
            style={{
              left: `${currentBlock?.x * blockSize * redBoxScale - 1}px`,
              top: `${currentBlock?.y * blockSize * redBoxScale - 1}px`,
              width: `${blockSize * redBoxScale}px`,
              height: `${blockSize * redBoxScale}px`,
              userSelect: "none",
            }}
          />
          {isLoaded &&
            fragments
              .filter((fragment) => shouldShowFragment(fragment))
              .map((e, index) => (
                <div
                  key={index}
                  className={`${styles["labeled-area"]} ${classToClassName(
                    e
                  )} ${showClass !== -1 ? styles.selected : ""}`}
                  style={{
                    left: `${e.x * e.size * redBoxScale}px`,
                    top: `${e.y * e.size * redBoxScale}px`,
                    width: `${e.size * redBoxScale}px`,
                    height: `${e.size * redBoxScale}px`,
                  }}
                />
              ))}
          {hoverBlock.x !== -1 && hoverBlock.y !== -1 && (
            <div
              className={styles.hoverArea}
              style={{
                left: `${hoverBlock.x * blockSize * redBoxScale}px`,
                top: `${hoverBlock.y * blockSize * redBoxScale}px`,
                width: `${blockSize * redBoxScale}px`,
                height: `${blockSize * redBoxScale}px`,
                userSelect: "none",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Origin;