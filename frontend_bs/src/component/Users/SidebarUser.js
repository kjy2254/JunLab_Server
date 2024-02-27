import React from "react";
import { Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faUser } from "@fortawesome/free-solid-svg-icons";

function SidebarUser(props) {
  const { userId } = useParams();

  return (
    <div
      className={`
      custom-sidebar layerSB
      ${props.show ? "expanded" : "collapsed"} 
      ${props.showInSmall ? "sv-expanded" : ""}
      `}
    >
      <Nav className="flex-column">
        <div className="header">{props.headerText}</div>
        <ul className="item">
          <Link
            className="link-unstyled"
            to={`/factorymanagement/user/${userId}/vital`}
          >
            <li>
              <div className="wrapper">
                <div className="menu-icon">
                  <FontAwesomeIcon
                    icon={faFileLines}
                    style={{ width: "80%", height: "100%" }}
                  />
                </div>
                <div className={`menu-text ${props.show ? "" : "d-none"}`}>
                  측정 기록
                </div>
              </div>
            </li>
          </Link>
          <Link
            className="link-unstyled"
            to={`/factorymanagement/user/${userId}/mypage`}
          >
            <li>
              <div className="wrapper">
                <div className="menu-icon">
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{ width: "80%", height: "100%" }}
                  />
                </div>
                <div className={`menu-text ${props.show ? "" : "d-none"}`}>
                  내 정보
                </div>
              </div>
            </li>
          </Link>
        </ul>
      </Nav>
    </div>
  );
}

export default SidebarUser;
