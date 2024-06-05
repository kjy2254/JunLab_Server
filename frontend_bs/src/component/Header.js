import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import "../css/Header.css";

export function toggleTheme(darkMode, setDarkMode) {
  if (darkMode) {
    // 토글 전에 다크 모드일 경우 라이트 모드로 변경
    // 라이트 모드 색상
    document.documentElement.style.setProperty(
      "--layer1-bg-color",
      "rgb(244, 246, 249)"
    );
    document.documentElement.style.setProperty(
      "--layer2-bg-color",
      "rgb(255, 255, 255)"
    );
    document.documentElement.style.setProperty(
      "--layerSB-bg-color",
      "rgb(36, 42, 51)"
    );
    document.documentElement.style.setProperty(
      "--layerHD-bg-color",
      "rgb(255, 255, 255)"
    );
    document.documentElement.style.setProperty(
      "--layerModal-bg-color",
      "rgb(244, 246, 249)"
    );
    document.documentElement.style.setProperty(
      "--border-color",
      "rgb(228, 231, 234)"
    );
    document.documentElement.style.setProperty("--select-color", "#ececec");
    document.documentElement.style.setProperty("--text-color", "black");
    document.documentElement.style.setProperty(
      "--spinner-color",
      "rgb(228, 231, 234)"
    );
    document.documentElement.style.setProperty("--spinner-top-color", "gray");
    document.documentElement.style.setProperty("--graph-lable-color", "black");
    document.documentElement.style.setProperty("--drag-over-color", "#555");
    document.documentElement.style.setProperty("--dot-color", "black");
  } else {
    // 다크 모드 색상
    document.documentElement.style.setProperty(
      "--layer1-bg-color",
      "rgb(48, 58, 69)"
    );
    document.documentElement.style.setProperty(
      "--layer2-bg-color",
      "rgb(25, 36, 48)"
    );
    document.documentElement.style.setProperty(
      "--layerSB-bg-color",
      "rgb(25, 36, 48)"
    );
    document.documentElement.style.setProperty(
      "--layerHD-bg-color",
      "rgb(25, 36, 48)"
    );
    document.documentElement.style.setProperty(
      "--layerModal-bg-color",
      "rgb(48, 58, 69)"
    );
    document.documentElement.style.setProperty(
      "--border-color",
      "rgba(255, 255, 255, 0.2)"
    );
    document.documentElement.style.setProperty("--select-color", "#303a45");
    document.documentElement.style.setProperty("--text-color", "white");
    document.documentElement.style.setProperty(
      "--spinner-color",
      "rgba(255, 255, 255, 0.3)"
    );
    document.documentElement.style.setProperty("--spinner-top-color", "white");
    document.documentElement.style.setProperty(
      "--graph-lable-color",
      "rgb(230, 233, 236)"
    );
    document.documentElement.style.setProperty("--drag-over-color", "#ccc");
    document.documentElement.style.setProperty("--dot-color", "white");
  }
  localStorage.setItem("darkMode", darkMode ? "false" : "true");
  setDarkMode((prev) => !prev);
}

function ThemeToggleButton({ setDarkMode, darkMode }) {
  return (
    <div
      className="theme-toggle-button"
      onClick={() => toggleTheme(darkMode, setDarkMode)}
    >
      <div className={`toggle-switch ${darkMode ? "active" : ""}`}>
        <FontAwesomeIcon icon={faMoon} className="icon moon-icon" />
        <FontAwesomeIcon icon={faSun} className="icon sun-icon" />
        <div className="toggle-handle"></div>
      </div>
    </div>
  );
}

function Header(props) {
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
          <ThemeToggleButton
            setDarkMode={props.setDarkMode}
            darkMode={props.darkMode}
          />
          <Button
            variant="outline-secondary"
            className="login-btn"
            href="http://junlab.postech.ac.kr:880/login/logout2"
          >
            {props.isLogin ? "로그아웃" : "로그인"}
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
