import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import "../css/Header.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

function ThemeToggleButton({ setLightMode, lightMode }) {
  // const [lightMode, setLightMode] = useState(
  //   localStorage.getItem("lightMode") === "true"
  // );

  const toggleTheme = () => {
    // const newLightMode = !lightMode;
    // setLightMode(newLightMode);
    setLightMode((prev) => {
      localStorage.setItem("lightMode", !prev ? "true" : "false");
      document.body.classList.toggle("light-mode", !prev);
      return !prev;
    });
    // localStorage.setItem("lightMode", newLightMode ? "true" : "false");
    // document.body.classList.toggle("light-mode", newLightMode);
  };

  return (
    <div className="theme-toggle-button" onClick={toggleTheme}>
      <div className={`toggle-switch ${lightMode ? "" : "active"}`}>
        <FontAwesomeIcon icon={faMoon} className="icon moon-icon" />
        <FontAwesomeIcon icon={faSun} className="icon sun-icon" />
        <div className="toggle-handle"></div>
      </div>
    </div>
  );
}

function Header(props) {
  const test = () => {
    // 새로운 색상 값으로 CSS 변수를 설정
    document.documentElement.style.setProperty("--layer1-color", "red");
  };

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
          <span className="color-test" onClick={test}>
            색상테스트
          </span>
        </div>
        <Nav className="buttons">
          <ThemeToggleButton
            setLightMode={props.setLightMode}
            lightMode={props.lightMode}
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
