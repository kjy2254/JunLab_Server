import axios from "axios";
import React, { useEffect, useRef } from "react";
import styles from "./Labeling.module.css";

function Submit({
  setCurrentBlock,
  blockSize,
  imageSize,
  originId,
  currentBlock,
}) {
  const numBlocks = {
    x: imageSize.width / blockSize,
    y: imageSize.height / blockSize,
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          handleBlock("up");
          break;
        case "ArrowDown":
          handleBlock("down");
          break;
        case "ArrowLeft":
          handleBlock("left");
          break;
        case "ArrowRight":
          handleBlock("right");
          break;
        case "0":
          radioRefs[0].current.checked = true;
          handleSubmitClass(0);
          break;
        case "1":
          radioRefs[1].current.checked = true;
          handleSubmitClass(1);
          break;
        case "2":
          radioRefs[2].current.checked = true;
          handleSubmitClass(2);
          break;
        case "3":
          radioRefs[3].current.checked = true;
          handleSubmitClass(3);
          break;
        case "4":
          radioRefs[4].current.checked = true;
          handleSubmitClass(4);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentBlock, imageSize]);

  const upButtonRef = useRef(null);
  const downButtonRef = useRef(null);
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);

  const radioRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleBlock = (direction) => {
    setCurrentBlock((prev) => {
      let newX = prev.x;
      let newY = prev.y;
      switch (direction) {
        case "right":
          newX += 1;
          if (newX >= numBlocks.x) {
            newX = 0;
            newY += 1;
          }
          if (newY >= numBlocks.y) {
            newX = 0;
            newY = 0;
          }
          break;
        case "left":
          newX -= 1;
          if (newX < 0) {
            newX = numBlocks.x - 1;
            newY -= 1;
          }
          if (newY < 0) {
            newX = numBlocks.x - 1;
            newY = numBlocks.y - 1;
          }
          break;
        case "down":
          newY += 1;
          if (newY >= numBlocks.y) {
            newY = 0;
          }
          break;
        case "up":
          newY -= 1;
          if (newY < 0) {
            newY = numBlocks.y - 1;
          }
          break;
        default:
          break;
      }

      return { x: newX, y: newY };
    });
  };

  const handleSubmitClass = (classInfo) => {
    axios
      .post("http://junlab.postech.ac.kr:880/api/labeling/KICT/fragment", {
        originId: originId,
        x: currentBlock.x,
        y: currentBlock.y,
        size: blockSize,
        class: classInfo,
      })
      .then((response) => {
        handleBlock("right");

        // 라디오 버튼 초기화
        radioRefs.forEach((ref) => {
          if (ref.current) {
            ref.current.checked = false;
          }
        });
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <div className={`${styles.submit} layer2`}>
      <span className={"bar"} />
      <span className={styles.title}>제출</span>
      <div className={styles.body}>
        <div className={styles.col}>
          <span>'현재사진'에 해당하는 라벨을 선택하세요.</span>
        </div>

        <div className={styles.control}>
          <div className={styles.radios}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="class"
                value="0"
                ref={radioRefs[0]}
                className={styles.radioInput}
                onChange={() => handleSubmitClass(0)}
              />
              Class 0
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="class"
                value="1"
                ref={radioRefs[1]}
                className={styles.radioInput}
                onChange={() => handleSubmitClass(1)}
              />
              Class 1
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="class"
                value="2"
                ref={radioRefs[2]}
                className={styles.radioInput}
                onChange={() => handleSubmitClass(2)}
              />
              Class 2
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="class"
                value="3"
                ref={radioRefs[3]}
                className={styles.radioInput}
                onChange={() => handleSubmitClass(3)}
              />
              Class 3
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="class"
                value="4"
                ref={radioRefs[4]}
                className={styles.radioInput}
                onChange={() => handleSubmitClass(4)}
              />
              Class 4
            </label>
          </div>
          <div className={`${styles.col} ${styles.arrows}`}>
            <button
              ref={upButtonRef}
              className={`${styles["arrow-button"]} ${styles["up"]}`}
              onClick={() => handleBlock("up")}
            />
            <div className={styles.row}>
              <button
                ref={leftButtonRef}
                className={`${styles["arrow-button"]} ${styles["left"]}`}
                onClick={() => handleBlock("left")}
              />
              <button
                ref={downButtonRef}
                className={`${styles["arrow-button"]} ${styles["down"]}`}
                onClick={() => handleBlock("down")}
              />
              <button
                ref={rightButtonRef}
                className={`${styles["arrow-button"]} ${styles["right"]}`}
                onClick={() => handleBlock("right")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Submit;
