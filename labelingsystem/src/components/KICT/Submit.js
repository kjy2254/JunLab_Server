import axios from "axios";
import { throttle } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Labeling.module.css";

function Submit({
  setCurrentBlock,
  blockSize,
  imageSize,
  originId,
  currentBlock,
  isSubmitting,
  setIsSubmitting,
  fragments,
  setFragments,
}) {
  const numBlocks = useMemo(
    () => ({
      x: imageSize.width / blockSize,
      y: imageSize.height / blockSize,
    }),
    [imageSize, blockSize]
  );

  const [autoSubmit, setAutoSubmit] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const isSubmittingRef = useRef(isSubmitting);
  const autoSubmitRef = useRef(autoSubmit);
  const autoNextRef = useRef(autoNext);
  const currentBlockRef = useRef(currentBlock);

  const radioRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  useEffect(() => {
    autoSubmitRef.current = autoSubmit;
  }, [autoSubmit]);

  useEffect(() => {
    autoNextRef.current = autoNext;
  }, [autoNext]);

  useEffect(() => {
    currentBlockRef.current = currentBlock;
  }, [currentBlock]);

  const handleKeyDown = (event) => {
    if (isSubmittingRef.current) return;
    // console.log(event.key);
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
      case "1":
        radioRefs[0].current.checked = !radioRefs[0].current.checked;
        break;
      case "2":
        radioRefs[1].current.checked = !radioRefs[1].current.checked;
        break;
      case "3":
        radioRefs[2].current.checked = !radioRefs[2].current.checked;
        break;
      case "4":
        radioRefs[3].current.checked = !radioRefs[3].current.checked;
        break;
      case "5":
        radioRefs[4].current.checked = !radioRefs[4].current.checked;
        break;
      case "Enter":
        handleSubmitClass();
        break;
      case " ":
        setAutoSubmit((prev) => !prev);
      case "Control":
        setAutoNext((prev) => !prev);
        break;
      default:
        break;
    }

    if (
      autoSubmitRef.current &&
      radioRefs.some((ref) => ref.current && ref.current.checked)
    ) {
      handleSubmitClass();
    }
  };

  useEffect(() => {
    const throttledHandleKeyDown = throttle(handleKeyDown, 85);
    // console.log("keyEvent Regeist");
    window.addEventListener("keydown", throttledHandleKeyDown);
    return () => {
      window.removeEventListener("keydown", throttledHandleKeyDown);
    };
  }, [imageSize]);

  const spaceButtonRef = useRef(null);

  const handleBlock = (direction) => {
    setCurrentBlock((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      const moveBlock = (dirX, dirY) => {
        do {
          newX += dirX;
          newY += dirY;

          if (newX >= numBlocks.x) {
            newX = 0;
            newY += 1;
          } else if (newX < 0) {
            newX = numBlocks.x - 1;
            newY -= 1;
          }

          if (newY >= numBlocks.y) {
            newY = 0;
          } else if (newY < 0) {
            newY = numBlocks.y - 1;
          }
        } while (isClass0(newX, newY));
      };

      const isClass0 = (x, y) => {
        return fragments.some(
          (fragment) => fragment.x === x && fragment.y === y && fragment.class0
        );
      };

      switch (direction) {
        case "right":
          moveBlock(1, 0);
          break;
        case "left":
          moveBlock(-1, 0);
          break;
        case "down":
          moveBlock(0, 1);
          break;
        case "up":
          moveBlock(0, -1);
          break;
        default:
          break;
      }

      return { x: newX, y: newY };
    });
  };

  const handleSubmitClass = () => {
    setIsSubmitting(true);

    const classInfo = [
      radioRefs[0].current.checked,
      radioRefs[1].current.checked,
      radioRefs[2].current.checked,
      radioRefs[3].current.checked,
      radioRefs[4].current.checked,
      false,
    ];

    if (classInfo.every((checked) => !checked)) {
      alert("최소 1개의 라벨을 선택하세요.");
      setIsSubmitting(false);
      return;
    }

    if (
      currentBlockRef.current.x < 0 ||
      currentBlockRef.current.x >= numBlocks.x ||
      currentBlockRef.current.y < 0 ||
      currentBlockRef.current.y >= numBlocks.y
    ) {
      radioRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.checked = false;
        }
      });
      setIsSubmitting(false);
      handleBlock("right");
      return;
    }

    const newFragment = {
      originId: originId,
      x: currentBlockRef.current.x,
      y: currentBlockRef.current.y,
      size: blockSize,
      class1: classInfo[0] ? 1 : 0,
      class2: classInfo[1] ? 1 : 0,
      class3: classInfo[2] ? 1 : 0,
      class4: classInfo[3] ? 1 : 0,
      class5: classInfo[4] ? 1 : 0,
      class0: classInfo[5] ? 1 : 0,
    };

    axios
      .post("http://junlab.postech.ac.kr:880/api/labeling/KICT/fragment", {
        originId: originId,
        x: currentBlockRef.current.x,
        y: currentBlockRef.current.y,
        size: blockSize,
        class: classInfo,
      })
      .then((response) => {
        // 라디오 버튼 초기화
        radioRefs.forEach((ref) => {
          if (ref.current) {
            ref.current.checked = false;
          }
        });
        setFragments((prevFragments) => {
          // 기존 fragment 중 동일한 키값을 가진 항목을 제거하고 새로운 fragment를 추가
          const updatedFragments = prevFragments.filter(
            (fragment) =>
              !(
                fragment.x === newFragment.x &&
                fragment.y === newFragment.y &&
                fragment.size === newFragment.size
              )
          );
          return [...updatedFragments, newFragment];
        });

        if (autoNextRef.current) {
          handleBlock("right");
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setIsSubmitting(false); // 요청 완료
      });
  };

  return (
    <div className={`${styles.submit} layer2`}>
      <span className={"bar"} />
      <span className={styles.title}>제출</span>
      <div className={styles.body}>
        <div className={styles.col}>
          <span>'현재사진'에 해당하는 라벨을 모두 선택하세요.</span>
          <span>(단, Class1은 하나만 선택)</span>
        </div>

        <div className={styles.control}>
          <div className={styles.radios}>
            <label className={`${styles.radioLabel}`}>
              <input
                type="checkbox"
                name="class"
                value="1"
                ref={radioRefs[0]}
                className={styles.radioInput}
              />
              Class 1
            </label>
            <label className={styles.radioLabel}>
              <input
                type="checkbox"
                name="class"
                value="2"
                ref={radioRefs[1]}
                className={styles.radioInput}
              />
              Class 2
            </label>
            <label className={styles.radioLabel}>
              <input
                type="checkbox"
                name="class"
                value="3"
                ref={radioRefs[2]}
                className={styles.radioInput}
              />
              Class 3
            </label>
            <label className={styles.radioLabel}>
              <input
                type="checkbox"
                name="class"
                value="4"
                ref={radioRefs[3]}
                className={styles.radioInput}
              />
              Class 4
            </label>
            <label className={styles.radioLabel}>
              <input
                type="checkbox"
                name="class"
                value="5"
                ref={radioRefs[4]}
                className={styles.radioInput}
              />
              Class 5
            </label>
          </div>
          <div className={`${styles.col} ${styles.arrows}`}>
            <button
              className={`${styles["arrow-button"]} ${styles["up"]}`}
              onClick={() => handleBlock("up")}
            />
            <div className={styles.row}>
              <button
                className={`${styles["arrow-button"]} ${styles["left"]}`}
                onClick={() => handleBlock("left")}
              />
              <button
                className={`${styles["arrow-button"]} ${styles["down"]}`}
                onClick={() => handleBlock("down")}
              />
              <button
                className={`${styles["arrow-button"]} ${styles["right"]}`}
                onClick={() => handleBlock("right")}
              />
            </div>
          </div>
        </div>
        <div className={styles.enter}>
          <label>
            <input
              type="checkbox"
              id="autosubmit"
              checked={autoSubmit}
              onChange={() => setAutoSubmit((prev) => !prev)}
            />
            자동 제출(Space)
          </label>
          <label>
            <input
              type="checkbox"
              id="autonext"
              checked={autoNext}
              onChange={() => setAutoNext((prev) => !prev)}
            />
            자동 다음(CTL)
          </label>
          <button ref={spaceButtonRef} onClick={() => handleSubmitClass()}>
            &#8617; Enter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Submit;
