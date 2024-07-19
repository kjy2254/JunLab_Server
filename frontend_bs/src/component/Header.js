import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import "../css/Header.css";
import { setTheme1, setTheme2, setTheme3, setTheme4 } from "../toggletheme";
import { authcheck } from "../util";

function toggleTheme(theme) {
  if (theme == 1) {
    setTheme1();
  } else if (theme == 2) {
    setTheme2();
  } else if (theme == 3) {
    setTheme3();
  } else if (theme == 4) {
    setTheme4();
  }
  localStorage.setItem("theme", theme);
}

// function ThemeToggleButton({ setDarkMode, darkMode }) {
//   return (
//     <div
//       className="theme-toggle-button"
//       onClick={() => toggleTheme(darkMode, setDarkMode)}
//     >
//       <div className={`toggle-switch ${darkMode ? "active" : ""}`}>
//         <FontAwesomeIcon icon={faMoon} className="icon moon-icon" />
//         <FontAwesomeIcon icon={faSun} className="icon sun-icon" />
//         <div className="toggle-handle"></div>
//       </div>
//     </div>
//   );
// }

function ProfileDropDown({ profile }) {
  return (
    <div className="header-dropdown layer4">
      <div className="profile-card">
        <img
          src={`http://junlab.postech.ac.kr:880/api2/image/${profile.profile_image_path}`}
          alt=""
        />
        <div className="profile-text">
          <span className="name">{profile.name}</span>
          <span className="mail">{profile.email || "-"}</span>
        </div>
      </div>
      <div
        className="profile-box"
        onClick={() =>
          (window.location.href = `/factorymanagement/user/${profile.user_id}/mypage`)
        }
      >
        내 정보
      </div>
      <div
        className="profile-box"
        onClick={() =>
          (window.location.href = `/factorymanagement/user/${profile.user_id}/password`)
        }
      >
        비밀번호 변경
      </div>
      <div
        className="profile-box"
        onClick={() =>
          (window.location.href = `http://junlab.postech.ac.kr:880/login/logout2`)
        }
      >
        로그아웃
      </div>
      <div className="theme-box">
        <div className="theme theme1" onClick={() => toggleTheme(1)} />
        <div className="theme theme2" onClick={() => toggleTheme(2)} />
        <div className="theme theme3" onClick={() => toggleTheme(3)} />
        <div className="theme theme4" onClick={() => toggleTheme(4)} />
      </div>
    </div>
  );
}

function Header(props) {
  const [show, setShow] = useState(false);
  const [img, setImg] = useState();
  const [profile, setProfile] = useState({});
  const [authData, setAuthData] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      const authData = await authcheck();
      setAuthData({
        isLogin: authData.isLogin,
        name: authData.name,
        userId: authData.userId,
        authority: authData.authority,
        manageOf: authData.manageOf,
      });
    };

    fetchAuthData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    }

    function handleEscKey(event) {
      if (event.key === "Escape") {
        setShow(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (authData.userId) {
      axios
        .get(
          `http://junlab.postech.ac.kr:880/api2/user/${authData.userId}/profile`
        )
        .then((response) => {
          setProfile(response.data);
          setImg(response.data.profile_image_path);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
    }
  }, [authData]);

  return (
    <Navbar className="custom-navbar layerHD" expand={true}>
      <Navbar.Brand href="/factorymanagement/" className="logo layerHD">
        Logo
      </Navbar.Brand>
      <Navbar.Collapse
        id="basic-navbar-nav"
        className="d-flex justify-content-between"
      >
        <div className="route">
          <Button
            variant="outline-secondary"
            onClick={
              props.smallView ? props.toggleSmallSidebar : props.toggleSidebar
            }
            className="toggle"
          >
            ☰
          </Button>
          <span className="header-text">{props.headerText}</span>
        </div>
        <Nav className="buttons">
          {/* <ThemeToggleButton 
            setDarkMode={props.setDarkMode}
            darkMode={props.darkMode}
          /> */}
          {/* <ZoomControl /> */}
          <div className="header-profile">
            <img
              src={`http://junlab.postech.ac.kr:880/api2/image/${img}`}
              alt=""
              onClick={() => setShow((prev) => !prev)}
            />
          </div>
          {show && (
            <div ref={dropdownRef}>
              <ProfileDropDown profile={profile} />
            </div>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
