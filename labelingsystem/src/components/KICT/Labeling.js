import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Current from "./Current";
import styles from "./Labeling.module.css";
import Origin from "./Origin";
import Sidebar from "./Sidebar";
import Submit from "./Submit";

function Labeling({ authData, show, showInSmall, smallView }) {
  const [originalImage, setOriginalImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [currentBlock, setCurrentBlock] = useState({ x: -1, y: 0 });
  const [metaData, setMetaData] = useState({});
  const [progress, setProgress] = useState({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [fragments, setFragments] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const blockSize = 32;
  const prevOriginIdRef = useRef(null);
  const intervalRef = useRef(null);

  // 1. 진행도 불러오기
  useEffect(() => {
    if (!isLoaded) {
      setCurrentBlock({ x: -1, y: 0 });
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api/labeling/KICT/progress?userId=${authData.user.id}&role=${authData.user.role}`
        )
        .then((response) => {
          setProgress(response.data);
        });
    }
  }, [isLoaded, authData.user.id, authData.user.role]);

  // 2. 라벨링 할 원본 이미지 정보 불러오기(마지막 진행중이던 origin)
  useEffect(() => {
    if (progress.last_origin_id) {
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api/labeling/KICT/origin?originId=${progress.last_origin_id}`
        )
        .then((response) => {
          setMetaData(response.data);
        });
    }
  }, [progress]);

  // 이전 originId를 추적하고 변경될 때마다 서버로 elapsedTime 전송
  useEffect(() => {
    const sendElapsedTime = () => {
      if (prevOriginIdRef.current && prevOriginIdRef.current !== metaData.id) {
        axios
          .post(
            "http://junlab.postech.ac.kr:880/api/labeling/KICT/elapsedTime",
            {
              originId: prevOriginIdRef.current,
              elapsedTime: elapsedTime,
            }
          )
          .catch((error) => {
            console.error("Error sending elapsed time:", error);
          });
      }
    };

    sendElapsedTime();
    if (metaData.id) {
      setElapsedTime(metaData.elapsed_time || 0);
      prevOriginIdRef.current = metaData.id;
    }

    return () => {
      sendElapsedTime();
    };
  }, [metaData]);

  // 4. 이미지 설정
  useEffect(() => {
    if (metaData.file_name) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // 16으로 나눠떨어지지 않으면 흰색 패딩 추가
        const paddedWidth = Math.ceil(width / blockSize) * blockSize;
        const paddedHeight = Math.ceil(height / blockSize) * blockSize;

        // 캔버스에 이미지를 그리고 흰색 패딩 추가
        const canvas = document.createElement("canvas");
        canvas.width = paddedWidth;
        canvas.height = paddedHeight;
        const ctx = canvas.getContext("2d");

        // 흰색 배경
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, paddedWidth, paddedHeight);

        // 원본 이미지 그리기
        ctx.drawImage(img, 0, 0);

        // 새로운 이미지 데이터 URL 생성
        const paddedImageUrl = canvas.toDataURL();

        setImageSize({ width: paddedWidth, height: paddedHeight });
        setOriginalImage(paddedImageUrl);
        setIsLoaded(true);
      };
      img.src = `http://junlab.postech.ac.kr:880/api/labeling/image/KICT/${metaData.file_name}`;
    }
  }, [metaData.file_name]);

  // 5. fragment 리스트를 받아오는 로직
  useEffect(() => {
    if (metaData.id) {
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api/labeling/KICT/fragments?originId=${metaData.id}`
        )
        .then((response) => {
          setFragments(response.data);
        });
    }
  }, [metaData.id]);

  // 6. 경과 시간 업데이트
  useEffect(() => {
    setElapsedTime(metaData.elapsed_time || 0);
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [metaData.id]);

  const handleNextImg = () => {
    axios
      .post(
        `http://junlab.postech.ac.kr:880/api/labeling/KICT/origin?userId=${authData.user.id}`
      )
      .then((response) => {
        if (response.data.originId) {
          alert(`${response.data.originId}번 이미지의 라벨링을 시작합니다.`);
          setIsLoaded(false);
        }
        if (response.data.message) {
          alert(`${response.data.message}`);
          setIsLoaded(true);
        }
      })
      .finally(() => window.location.reload());
  };

  return (
    <section className={`${styles.section} layer1`}>
      <Sidebar
        originList={progress.labeled_origins}
        setIsLoaded={setIsLoaded}
        authData={authData}
        currentOriginId={metaData.id}
        show={show}
        showInSmall={showInSmall}
        blockSize={blockSize}
      />
      <div
        className={`${styles.main} ${show ? "" : styles.expanded} ${
          smallView ? styles.smallView : ""
        }`}
      >
        <Origin
          originalImage={originalImage}
          metaData={metaData}
          currentBlock={currentBlock}
          setCurrentBlock={setCurrentBlock}
          blockSize={blockSize}
          imageSize={imageSize}
          isLoaded={isLoaded}
          elapsedTime={elapsedTime}
          fragments={fragments}
        />
        <div className={styles.section2}>
          <Current
            originalImage={originalImage}
            currentBlock={currentBlock}
            blockSize={blockSize}
            isLoaded={isLoaded}
          />
          <Submit
            setCurrentBlock={setCurrentBlock}
            currentBlock={currentBlock}
            blockSize={blockSize}
            imageSize={imageSize}
            originId={metaData.id}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            fragments={fragments}
            setFragments={setFragments}
          />
          {authData.user.role === "user" && (
            <button className={`${styles.next}`} onClick={handleNextImg}>
              새 이미지 가져오기
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Labeling;
