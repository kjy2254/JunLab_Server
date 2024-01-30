import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import "../css/Header.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

function ThemeToggleButton() {
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    const isLightMode = localStorage.getItem("lightMode") === "true";
    setLightMode(isLightMode);
    document.body.classList.toggle("light-mode", isLightMode);
  }, []);

  const toggleTheme = () => {
    const newLightMode = !lightMode;
    setLightMode(newLightMode);
    localStorage.setItem("lightMode", newLightMode ? "true" : "false");
    document.body.classList.toggle("light-mode", newLightMode);
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
  return (
    <Navbar className="custom-navbar layerHD" expand={true}>
      <Navbar.Brand
        href="/factorymanagement/admin/factory"
        className="logo layerHD"
      >
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
          <ThemeToggleButton />
          <Button
            variant="outline-secondary"
            className="login-btn"
            href="/factorymanagement/login"
          >
            로그인
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
