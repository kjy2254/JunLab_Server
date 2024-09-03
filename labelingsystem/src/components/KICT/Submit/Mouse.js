import axios from "axios";
import { throttle } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import styles from "../Labeling.module.css";
import { LabelingContext } from "../LabelingContext";

function Mouse() {
  const {
    blockSize,
    metaData,
    currentBlock,
    setIsSubmitting,
    setFragments,
    imageSize,
    autoClick,
    setAutoClick,
    radioRefs,
    fragments,
  } = useContext(LabelingContext);

  const [overwriteMode, setOverwriteMode] = useState(false);

  useEffect(() => {
    handleSubmitClass();
  }, [currentBlock]);

  const handleKeyDown = (event) => {
    switch (event.key) {
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
      case "Q":
      case "q":
        setAutoClick((prev) => !prev);
        break;
      default:
        console.log(event);
        break;
    }
  };

  useEffect(() => {
    const throttledHandleKeyDown = throttle(handleKeyDown, 85);
    window.addEventListener("keydown", throttledHandleKeyDown);
    return () => {
      window.removeEventListener("keydown", throttledHandleKeyDown);
    };
  }, [imageSize]);

  const handleSubmitClass = () => {
    setIsSubmitting(true);

    // 삭제모드
    if (radioRefs[5].current.checked) {
      axios
        .delete(
          `http://junlab.postech.ac.kr:880/api/labeling/KICT/fragment?originId=${metaData.id}&x=${currentBlock.x}&y=${currentBlock.y}&size=${blockSize}`
        )
        .then((response) => {
          setFragments((prevFragments) => {
            // 기존 fragment 중 동일한 키값을 가진 항목을 제거하고 새로운 fragment를 추가
            const updatedFragments = prevFragments.filter(
              (fragment) =>
                !(
                  fragment.x === currentBlock.x && fragment.y === currentBlock.y
                )
            );
            return updatedFragments;
          });
        })
        .catch((error) => {
          console.error("There was an error!", error);
        })
        .finally(() => {
          setIsSubmitting(false); // 요청 완료
        });
      return;
    }

    let classInfo = [
      radioRefs[0].current.checked,
      radioRefs[1].current.checked,
      radioRefs[2].current.checked,
      radioRefs[3].current.checked,
      radioRefs[4].current.checked,
      false,
    ];

    if (!overwriteMode) {
      // 추가하기 모드일 때, 기존 fragment의 클래스 정보를 합칩니다.
      const existingFragment = fragments.find(
        (fragment) =>
          fragment.x === currentBlock.x &&
          fragment.y === currentBlock.y &&
          fragment.size === blockSize
      );

      if (existingFragment) {
        classInfo = classInfo.map(
          (checked, index) =>
            checked || existingFragment[`class${index + 1}`] === 1
        );
      }
    }

    if (classInfo.every((checked) => !checked)) {
      setIsSubmitting(false);
      return;
    }

    const newFragment = {
      originId: metaData.id,
      x: currentBlock.x,
      y: currentBlock.y,
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
        originId: metaData.id,
        x: currentBlock.x,
        y: currentBlock.y,
        size: blockSize,
        class: classInfo,
      })
      .then((response) => {
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
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setIsSubmitting(false); // 요청 완료
      });
  };

  return (
    <div className={styles.mouse}>
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
          <label className={styles.radioLabel}>
            <input
              type="checkbox"
              name="class"
              value="6"
              ref={radioRefs[5]}
              className={styles.radioInput}
            />
            삭제
          </label>
        </div>
      </div>
      <div className={styles.enter}>
        <label className={styles.radioLabel}>
          <input
            type="checkbox"
            className={styles.radioInput}
            checked={autoClick}
            onChange={() => setAutoClick((prev) => !prev)}
          />
          클릭 상태 유지(Q)
        </label>
        <label className={styles.radioLabel}>
          <input
            type="checkbox"
            className={styles.radioInput}
            checked={overwriteMode}
            onChange={() => setOverwriteMode((prev) => !prev)}
          />
          덮어씌우기 모드
        </label>
      </div>
    </div>
  );
}

export default Mouse;
