import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import "../css/Header.css";

function Header(props) {
  return (
    <Navbar className="custom-navbar" expand={true}>
      <Navbar.Brand href="/factorymanagement/factory" className="logo">
        Logo
      </Navbar.Brand>
      <Navbar.Collapse
        id="basic-navbar-nav"
        className="d-flex justify-content-between"
      >
        {props.smallView ? (
          <Button
            variant="outline-secondary"
            onClick={props.toggleSmallSidebar}
            className="toggle"
          >
            ☰
          </Button>
        ) : (
          <Button
            variant="outline-secondary"
            onClick={props.toggleSidebar}
            className="toggle"
          >
            ☰
          </Button>
        )}

        <Nav className="ml-auto">
          <Button
            variant="outline-secondary"
            className="login"
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
