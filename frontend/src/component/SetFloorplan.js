import React, { useState, useEffect } from "react";
import "../css/SetFloorplan.css";
import axios from "axios";

function SetFloorplan(props) {
  const factoryId = props.factoryId;
  const [image, setImage] = useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [originalImageName, setOriginalImageName] = useState("");
  const [aspectRatio, setAspectRatio] = useState();

  const handleImageChange = (e) => {
    console.log("test");
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          setAspectRatio(img.width / img.height);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);

      setImage(URL.createObjectURL(file));
      setRawImage(file);
      setOriginalImageName(file.name);
    }
  };

  const saveImage = () => {
    // 프론트엔드에서 백엔드로 이미지 정보 전송

    const formData = new FormData();
    const data = {
      factoryId: factoryId,
      page: page,
      dimensions: imageDimensions,
      originalImageName: originalImageName,
    };
    formData.append("image", rawImage);
    formData.append("data", JSON.stringify(data));

    axios
      .post(`http://junlab.postech.ac.kr:880/api/saveImage2`, formData)
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  };

  useEffect(() => {
    // API 요청을 보내고 데이터를 가져옵니다.
    axios
      .get(`http://junlab.postech.ac.kr:880/api/factory/${factoryId}/schemes`)
      .then((response) => {
        setData(response.data.images);
        // console.log(data);
        setImage(
          `http://junlab.postech.ac.kr:880/api/image/${
            response.data.images[page - 1].imageName
          }`
        );
        setImageDimensions({
          width: response.data.images[page - 1].width,
          height: response.data.images[page - 1].height,
        });
        setAspectRatio(
          response.data.images[page - 1].width /
            response.data.images[page - 1].height
        );
        setOriginalImageName(response.data.originalImageName);
        console.log("dimension:", imageDimensions);
        console.log("ratio:", aspectRatio);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  }, [page]);

  return (
    <div className="set-floor-wrapper">
      <div className="set-top">
        {data && data.length > 0 && (
          <select
            onChange={(e) => {
              setPage(parseInt(e.target.value));
              setImageDimensions({
                width: data[e.target.value - 1].width,
                height: data[e.target.value - 1].height,
              });
              document.getElementById("imageInput").value = "";
            }}
          >
            {data.map((e) => (
              <option key={e.page} value={`${e.page}`}>
                {e.schemeName}
              </option>
            ))}
          </select>
        )}
        <label
          className="upload"
          htmlFor="imageInput"
          style={{ cursor: "pointer" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 403 403"
            fill="cornflowerblue"
          >
            <path
              d="M270.3 337.69H132C128.022 337.69 124.206 336.11 121.393 333.297C118.58 330.484 117 326.668 117 322.69V185.8H60.81C57.9083 185.801 55.0685 184.96 52.635 183.38C50.2015 181.799 48.2787 179.547 47.0996 176.895C45.9205 174.244 45.5357 171.307 45.992 168.442C46.4482 165.576 47.7258 162.904 49.67 160.75L190 5.10003C191.407 3.53859 193.125 2.29013 195.045 1.43556C196.965 0.580997 199.043 0.139404 201.145 0.139404C203.247 0.139404 205.325 0.580997 207.245 1.43556C209.165 2.29013 210.883 3.53859 212.29 5.10003L352.6 160.75C354.544 162.904 355.822 165.576 356.278 168.442C356.734 171.307 356.35 174.244 355.17 176.895C353.991 179.547 352.068 181.799 349.635 183.38C347.201 184.96 344.362 185.801 341.46 185.8H285.3V322.69C285.3 326.668 283.72 330.484 280.907 333.297C278.094 336.11 274.278 337.69 270.3 337.69ZM147 307.69H255.3V170.8C255.3 166.822 256.88 163.006 259.693 160.193C262.506 157.38 266.322 155.8 270.3 155.8H307.74L201.13 37.55L94.53 155.8H132C135.978 155.8 139.794 157.38 142.607 160.193C145.42 163.006 147 166.822 147 170.8V307.69Z"
              fill="cornflowerblue"
            />
            <path
              d="M336.84 402.15H65.43C48.1171 402.131 31.5185 395.246 19.2764 383.004C7.03428 370.762 0.148534 354.163 0.130005 336.85V298.68C0.130005 294.702 1.71036 290.886 4.5234 288.073C7.33645 285.26 11.1518 283.68 15.13 283.68C19.1082 283.68 22.9236 285.26 25.7366 288.073C28.5497 290.886 30.13 294.702 30.13 298.68V336.85C30.1406 346.209 33.8631 355.181 40.4808 361.799C47.0986 368.417 56.0711 372.139 65.43 372.15H336.84C346.198 372.139 355.169 368.417 361.786 361.799C368.402 355.181 372.122 346.208 372.13 336.85V298.68C372.13 294.702 373.71 290.886 376.523 288.073C379.336 285.26 383.152 283.68 387.13 283.68C391.108 283.68 394.924 285.26 397.737 288.073C400.55 290.886 402.13 294.702 402.13 298.68V336.85C402.111 354.161 395.227 370.758 382.987 383C370.747 395.242 354.151 402.129 336.84 402.15Z"
              fill="cornflowerblue"
            />
          </svg>
          &nbsp;Upload Image
        </label>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </div>
      <div
        className="set-floor-plan"
        style={{
          backgroundImage: `url(${image})`,
          aspectRatio: aspectRatio,
        }}
      />
      <div className="set-bottom">
        <button className="button-save" onClick={saveImage}>
          저장
        </button>
      </div>
    </div>
  );
}

export default SetFloorplan;
