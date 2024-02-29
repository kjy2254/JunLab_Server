import { faFileLines, faIndustry } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

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
        <div className="header">{props.headerText}</div>
        <ul className="item">
          <Link
            className="link-unstyled"
            to={`/factorymanagement/admin/factory`}
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
          <Link className="link-unstyled" to={`/factorymanagement/admin/logs`}>
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
