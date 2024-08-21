import axios from "axios";
import React, { useContext, useEffect, useRef } from "react";
import Current from "./Current";
import styles from "./Labeling.module.css";
import { LabelingContext } from "./LabelingContext";
import Origin from "./Origin";
import Sidebar from "./Sidebar";
import Submit from "./Submit/Submit";

function Labeling({ authData, show, showInSmall, smallView }) {
  const {
    setOriginalImage,
    setImageSize,
    setCurrentBlock,
    metaData,
    setMetaData,
    progress,
    setProgress,
    elapsedTime,
    setElapsedTime,
    setFragments,
    isLoaded,
    setIsLoaded,
    blockSize,
  } = useContext(LabelingContext);

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
  }, [progress, setMetaData]);

  // 이전 originId를 추적하고 변경될 때마다 서버로 elapsedTime 전송
  useEffect(() => {
    if (metaData.id) {
      setElapsedTime(metaData.elapsed_time || 0);
    }
  }, [metaData]);

  useEffect(() => {
    const sendElapsedTime = () => {
      if (elapsedTime != 0 && elapsedTime % 10 == 0) {
        axios
          .post(
            "http://junlab.postech.ac.kr:880/api/labeling/KICT/elapsedTime",
            {
              originId: metaData.id,
              elapsedTime: elapsedTime,
            }
          )
          .catch((error) => {
            console.error("Error sending elapsed time:", error);
          });
      }
    };

    sendElapsedTime();

    return () => {
      sendElapsedTime();
    };
  }, [elapsedTime]);

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
        ctx.fillStyle = "white";
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

  useEffect(() => {
    if (!isLoaded) {
      setOriginalImage(null);
    }
  }, [isLoaded]);

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

  const handleReset = () => {
    if (
      window.confirm(
        "정말로 초기화 하시겠습니까?\n현재 이미지의 라벨링한 모든 데이터가 삭제됩니다."
      )
    ) {
      axios
        .post(
          `http://junlab.postech.ac.kr:880/api/labeling/KICT/fragment/reset`,
          {
            originId: metaData.id,
          }
        )
        .then((response) => {
          alert("초기화가 완료되었습니다.");
        })
        .finally(() => window.location.reload());
    }
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
      />
      <div
        className={`${styles.main} ${show ? "" : styles.expanded} ${
          smallView ? styles.smallView : ""
        }`}
      >
        <Origin />
        <div className={styles.section2}>
          <Current />
          <Submit authData={authData} />
          <div className={styles.buttons}>
            {authData.user.role === "user" && (
              <button className={`${styles.next}`} onClick={handleNextImg}>
                새 이미지 가져오기
              </button>
            )}
            <button className={`${styles.next}`} onClick={handleReset}>
              초기화
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Labeling;
