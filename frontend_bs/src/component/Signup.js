import React, { useState } from "react";
import "../css/Signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function Signup() {
  // const [id, setId] = useState("");
  // const [password, setPassword] = useState("");
  // const [password2, setPassword2] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    password: "",
    password2: "",
    name: "",
    gender: "남성",
    birth: "",
    code: "",
    email: "",
    phone: "",
    address: "",
  });

  function postSignUp() {
    axios
      .post("http://junlab.postech.ac.kr:880/login/signup2", formData)
      .then((response) => {
        const data = response.data;
        if (data.isSuccess === true) {
          alert("회원가입이 완료되었습니다!");
          window.location.href = `/factorymanagement/`;
        } else {
          alert(data.isSuccess);
        }
      });
  }

  function test() {
    // ID 조건 검사: 4글자 이상의 소문자 영어와 숫자 조합
    const idRegex = /^[a-z0-9]{4,}$/;
    if (!idRegex.test(formData.id)) {
      alert("ID는 4글자 이상의 소문자 영어와 숫자 조합이어야 합니다.");
      return; // 함수 종료
    }

    // 비밀번호 조건 검사: 6자 이상
    if (formData.password.length < 6) {
      alert("비밀번호는 6자 이상이어야 합니다.");
      return; // 함수 종료
    }

    // 두 비밀번호 입력이 동일한지 검사
    if (formData.password !== formData.password2) {
      alert("입력한 두 비밀번호가 일치하지 않습니다.");
      return; // 함수 종료
    }

    // 모든 조건을 통과한 경우
    console.log("모든 조건을 만족합니다.");
    console.log(formData);
    postSignUp();
  }

  const fillcheck = () => {
    return !(
      formData.id &&
      formData.password &&
      formData.password2 &&
      formData.gender &&
      formData.birth &&
      formData.code &&
      formData.name
    );
  };

  const settings = {
    spaceBetween: 20,
    slidesPerView: 1,
    pagination: {
      clickable: true,
    },
    pagination: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    modules: [Pagination, Navigation],

    // 슬라이더의 인터랙티브 기능 비활성화
    allowTouchMove: false, // 터치 슬라이드 기능 비활성화
    simulateTouch: false, // 마우스 드래그 슬라이드 기능 비활성화
    mousewheel: false, // 마우스 휠 슬라이드 기능 비활성화
    keyboard: {
      enabled: false, // 키보드 컨트롤 슬라이드 기능 비활성화
    },
  };

  return (
    <div className="signup layer1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="376"
        height="317"
        fill="none"
        className="bottom"
      >
        <path
          fill="#2B87F3"
          d="M98 59.596c-28-61.6-77-63.667-98-57v314l375-1c2.4-80.8-78-135.333-118-150-41.333-9.667-131-44.4-159-106Z"
        ></path>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="235"
        height="255"
        fill="none"
        className="top"
      >
        <path
          fill="#62CFF1"
          fill-opacity="0.5"
          d="M68.1 80.835C29.568 58.825 50.747 26.4 66.154 12.937L221.33 57.304l-47.588 170.031c-54.155 25.255-83.028 7.944-90.695-3.868-5.774-13.59 7.306-40.363 14.567-52.051 19.963-22.85 22.57-48.563 21.379-58.563-6.44-19.763-36.613-29.58-50.894-32.018Z"
        ></path>
        <path
          fill="#62CFF1"
          d="M88 72C43.2 60 55.333 19 67 0l168 1v196c-47.2 43.2-81 33.333-92 23-9.6-12.8-4-45.333 0-60 13.6-30.4 9-58.667 5-69-12-19.2-45-20.667-60-19Z"
        ></path>
      </svg>
      <div className="login-wrapper">
        <h1 className="logo">Logo</h1>
        <div className="form layer2">
          <div>
            <h5>회원가입</h5>
            <h7>
              이미 계정이 있나요? &nbsp;{" "}
              <Link to={`/factorymanagement/login`}>로그인</Link>
            </h7>
          </div>
          <Swiper {...settings}>
            <SwiperSlide className="form-wrapper">
              <div className="input-wrapper">
                <span>
                  <span className="essential">*</span>아이디
                </span>
                <input
                  id="id"
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                />
              </div>
              <div className="input-wrapper">
                <span>
                  <span className="essential">*</span>패스워드
                </span>
                <input
                  id="password"
                  type="password"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="input-wrapper">
                <span>
                  <span className="essential">*</span>패스워드 확인
                </span>
                <input
                  id="password2"
                  type="password"
                  onChange={(e) =>
                    setFormData({ ...formData, password2: e.target.value })
                  }
                />
              </div>
            </SwiperSlide>
            <SwiperSlide className="form-wrapper">
              <div className="input-wrapper">
                <span>
                  <span className="essential">*</span>이름
                </span>
                <input
                  id="name"
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="gender-birth">
                <div className="input-wrapper">
                  <span>
                    <span className="essential">*</span>성별
                  </span>
                  <select
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option>남성</option>
                    <option>여성</option>
                  </select>
                </div>
                <div className="input-wrapper">
                  <span>
                    <span className="essential">*</span>생년월일
                  </span>
                  <input
                    id="birth"
                    type="date"
                    value={formData.birth}
                    onChange={(e) =>
                      setFormData({ ...formData, birth: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="input-wrapper">
                <span>
                  <span className="essential">*</span>가입코드
                </span>
                <input
                  id="code"
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
            </SwiperSlide>
            <SwiperSlide className="form-wrapper">
              <div className="input-wrapper">
                <span>이메일</span>
                <input
                  id="email"
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="input-wrapper">
                <span>전화번호</span>
                <input
                  id="phone-number"
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="input-wrapper">
                <span>주소</span>
                <input
                  id="address"
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </SwiperSlide>
            <button className="swiper-button-prev">이전</button>
            <button className="swiper-button-next">다음</button>
          </Swiper>

          <div className="button-wrapper">
            <button onClick={test} disabled={fillcheck()}>
              가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
