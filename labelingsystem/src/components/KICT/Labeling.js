import axios from "axios";
import React, { useEffect, useState } from "react";
import Current from "./Current";
import styles from "./Labeling.module.css";
import Origin from "./Origin";
import Sidebar from "./Sidebar";
import Submit from "./Submit";

function Labeling() {
  const [originalImage, setOriginalImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [currentBlock, setCurrentBlock] = useState({ x: 0, y: 0 });
  const [metaData, setMetaData] = useState({});
  const [progress, setProgress] = useState({});

  const [isLoaded, setIsLoaded] = useState(false);

  const blockSize = 16;

  const userId = "postech2";

  // 1. 진행도 불러오기
  useEffect(() => {
    if (!isLoaded) {
      setCurrentBlock({ x: 0, y: 0 });
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api/labeling/KICT/progress?userId=${userId}`
        )
        .then((response) => {
          setProgress(response.data);
          // setIsLoaded(true);
        });
    }
  }, [isLoaded, userId]);

  // 2. 라벨링 할 원본 이미지 정보 불러오기(마지막 진행중이던 origin)
  useEffect(() => {
    axios
      .get(
        `http://junlab.postech.ac.kr:880/api/labeling/KICT/origin?originId=${progress.last_origin_id}`
      )
      .then((response) => {
        setMetaData(response.data);
      });
  }, [progress]);

  // 다음 이미지 불러오기
  const handleNextImg = () => {
    axios
      .post(
        `http://junlab.postech.ac.kr:880/api/labeling/KICT/origin?userId=${userId}`
      )
      .then((response) => {
        if (response.data.originId) {
          alert(`${response.data.originId} 이미지의 라벨링을 시작합니다.`);
        }
        if (response.data.message) {
          alert(`${response.data.message}`);
        }
        setIsLoaded(false);
      });
  };

  // 4. 이미지 설정
  useEffect(() => {
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
    };
    img.src = `http://junlab.postech.ac.kr:880/api/labeling/image/KICT/${metaData.file_name}`;
  }, [metaData.file_name]);

  useEffect(() => {
    setIsLoaded(true);
  }, [originalImage]);

  return (
    <section className={`${styles.section} layer1`}>
      <Sidebar
        originList={progress.labeled_origins}
        setIsLoaded={setIsLoaded}
        userId={userId}
        currentOriginId={metaData.id}
      />
      <div className={styles.main}>
        <Origin
          originalImage={originalImage}
          metaData={metaData}
          currentBlock={currentBlock}
          blockSize={blockSize}
          imageSize={imageSize}
          isLoaded={isLoaded}
        />
        <div className={styles.col}>
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
          />
          <button className={`${styles.next}`} onClick={handleNextImg}>
            새 이미지 가져오기
          </button>
        </div>
      </div>
    </section>
  );
}

export default Labeling;
