import { faMars, faPencil, faVenus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/MyPage.css";
function UserInit(props) {
  useEffect(() => {
    props.setHeaderText("내 정보");
  }, []);

  const [data, setData] = useState({});
  const [edit, setEdit] = useState(false);
  const [profileImg, setProfileImg] = useState();
  const [profileImgFile, setProfileImgFile] = useState();
  const [edit_bk, setEdit_bk] = useState({});
  const { userId } = useParams();

  const fetchData = () => {
    setProfileImgFile();
    setProfileImg();
    axios
      .get(`http://junlab.postech.ac.kr:880/api2/user/${userId}/profile`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.includes("image")) {
        alert(`해당 파일은 이미지 파일이 아닙니다.`);
        return;
      }
      setProfileImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const save = () => {
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    if (profileImgFile) {
      formData.append("image", profileImgFile);
    }

    axios
      .put(
        `http://junlab.postech.ac.kr:880/api2/user/${userId}/profile`,
        formData
      )
      .then(() => {
        alert("저장되었습니다.");
        setEdit(false);
        fetchData();
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  };

  return (
    <div className="mypage">
      <div className="mypage-wrapper layer2">
        <span className="header">기본 프로필</span>
        <hr />
        <div className="profile-img">
          {edit && (
            <label>
              <FontAwesomeIcon icon={faPencil} />
              <input
                className="hidden"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          )}
          <img
            src={
              profileImg ||
              `http://junlab.postech.ac.kr:880/api2/image/${data.profile_image_path}`
            }
            alt="프로필 이미지"
          />
        </div>
        <div className="name">
          {edit ? (
            <select
              value={data.gender}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }));
              }}
            >
              <option value="Male">♂ 남</option>
              <option value="Female">♀ 여</option>
            </select>
          ) : (
            <FontAwesomeIcon
              icon={data.gender == "male" ? faMars : faVenus}
              className={data.gender == "Male" ? "male" : "female"}
            />
          )}

          <span>
            {edit ? (
              <input
                className={`layer2`}
                type="text"
                value={data.name}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            ) : (
              data.name || "-"
            )}
          </span>
        </div>
        <hr />
        <InputField
          label="이메일"
          type="text"
          value={data.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          edit={edit}
        />
        <InputField
          label="주소"
          type="text"
          value={data.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          edit={edit}
        />
        <InputField
          label="HP"
          type="text"
          value={data.phone_number}
          onChange={(e) => handleInputChange("phone_number", e.target.value)}
          edit={edit}
        />
        <InputField
          label="생년월일"
          type="date"
          value={data.date_of_birth}
          onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
          edit={edit}
        />
        <div className="info-wrapper">
          <div className="key">소속:</div>
          <span> {data.factory_name || "-"} </span>
        </div>
        <div className="bottom">
          <span>가입일: {data.join_date || "-"}</span>
          <span>
            권한:{" "}
            {data.authority === 4
              ? "[시스템] 관리자"
              : data.authority === 3
              ? `[${data.manager_of}] 관리자`
              : data.authority === 2
              ? "일반 사용자"
              : data.authority === 1
              ? "가입 제한"
              : "가입 대기자"}
          </span>
        </div>
      </div>

      <div className="mypage-wrapper layer2">
        <span className="header">건강 프로필</span>
        <hr />
        <InputField
          label="키"
          type="number"
          value={data.height}
          onChange={(e) => handleInputChange("height", e.target.value)}
          edit={edit}
          unit={"cm"}
        />
        <InputField
          label="몸무게"
          type="number"
          value={data.weight}
          onChange={(e) => handleInputChange("weight", e.target.value)}
          edit={edit}
          unit={"kg"}
        />
        <InputField
          label="흡연"
          type="number"
          value={data.smoke_per_day}
          onChange={(e) => handleInputChange("smoke_per_day", e.target.value)}
          edit={edit}
          unit={"개비/일"}
        />
        <InputField
          label="음주"
          type="number"
          value={data.drink_per_week}
          onChange={(e) => handleInputChange("drink_per_week", e.target.value)}
          edit={edit}
          unit={"병/주"}
        />
        <InputField
          label="직종"
          type="text"
          value={data.job}
          onChange={(e) => handleInputChange("job", e.target.value)}
          edit={edit}
        />
        <InputField
          label="근속년수"
          type="number"
          value={data.employment_period}
          onChange={(e) =>
            handleInputChange("employment_period", e.target.value)
          }
          edit={edit}
          unit={"년"}
        />
        <InputField
          label="질환"
          type="text"
          value={data.illness}
          onChange={(e) => handleInputChange("illness", e.target.value)}
          edit={edit}
        />
        <div className="bottom buttons">
          <button className={edit ? "save" : "hidden"} onClick={save}>
            저장
          </button>
          <button
            className="edit"
            onClick={() => {
              if (!edit) {
                setEdit_bk(data);
              } else {
                setData(edit_bk);
                setProfileImg();
              }
              setEdit((prev) => !prev);
            }}
          >
            {edit ? "취소" : "수정"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, type, value, onChange, unit, edit }) {
  return (
    <div className="info-wrapper">
      <div className="key">{label}:</div>
      {edit ? (
        <span>
          <input
            className={`layer2`}
            type={type}
            value={value}
            onChange={onChange}
          />
          {unit}
        </span>
      ) : (
        <span>
          {value || "-"} {unit}
        </span>
      )}
    </div>
  );
}

export default UserInit;
