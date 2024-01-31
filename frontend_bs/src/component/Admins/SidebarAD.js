import React from "react";
import { Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndustry, faFileLines } from "@fortawesome/free-solid-svg-icons";

function SidebarAD(props) {
  return (
    <div
      className={`
      custom-sidebar layerSB
      ${props.show ? "expanded" : "collapsed"} 
      ${props.showInSmall ? "sv-expanded" : ""}
      `}
    >
      <Nav className="flex-column">
        <div className="header">{props.factoryName}</div>
        <ul className="item">
          <Link
            className="link-unstyled"
            to={`/factoryManagement/admin/factory`}
          >
            <li>
              <div className="wrapper">
                <div className="menu-icon">
                  <FontAwesomeIcon
                    icon={faIndustry}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className={`menu-text ${props.show ? "" : "d-none"}`}>
                  공장관리
                </div>
              </div>
            </li>
          </Link>
          <Link className="link-unstyled" to={`/factoryManagement/admin/logs`}>
            <li>
              <div className="wrapper">
                <div className="menu-icon">
                  <FontAwesomeIcon
                    icon={faFileLines}
                    style={{ width: "80%", height: "100%" }}
                  />
                </div>
                <div className={`menu-text ${props.show ? "" : "d-none"}`}>
                  로그
                </div>
              </div>
            </li>
          </Link>
        </ul>
      </Nav>
    </div>
  );
}

export default SidebarAD;
