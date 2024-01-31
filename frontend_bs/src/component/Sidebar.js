import React from "react";
import { Nav } from "react-bootstrap";
import "../css/Sidebar.css";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faHouse,
  faFileLines,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
function Sidebar(props) {
  const [toggleLog, setToggleLog] = useState(true);
  const [factoryName, setFactoryName] = useState("");
  const { factoryId } = useParams();

  useEffect(() => {
    axios
      .get(`http://junlab.postech.ac.kr:880/api2/factory/${factoryId}/name`)
      .then((response) => {
        const data = response.data;
        setFactoryName(data.factory_name);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  }, []);

  return (
    <div
      className={`
      custom-sidebar layerSB
      ${props.show ? "expanded" : "collapsed"} 
      ${props.showInSmall ? "sv-expanded" : ""}
      `}
    >
      <Nav className="item-wrapper">
        <div>
          <div className="header">{factoryName}</div>
          <ul className="item">
            <Link
              className="link-unstyled"
              to={`/factoryManagement/factory/${factoryId}/dashboard`}
            >
              <li>
                <div className="wrapper">
                  <div className="menu-icon">
                    <FontAwesomeIcon
                      icon={faHouse}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <div className={`menu-text ${props.show ? "" : "d-none"}`}>
                    통합상황판
                  </div>
                </div>
              </li>
            </Link>
            <li onClick={() => setToggleLog(!toggleLog)}>
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
              <div className={`log-toggle ${props.show ? "" : "d-none"}`}>
                {toggleLog ? (
                  <FontAwesomeIcon icon={faAngleDown} />
                ) : (
                  <FontAwesomeIcon icon={faAngleRight} />
                )}
              </div>
            </li>
            <ul className={`sub ${toggleLog ? "" : "collapsed"}`}>
              <Link
                className="link-unstyled"
                to={`/factorymanagement/factory/${factoryId}/airwall`}
              >
                <li className={`menu-text ${props.show ? "" : "d-none"}`}>
                  고정식
                </li>
              </Link>
              <Link
                className="link-unstyled"
                to={`/factorymanagement/factory/${factoryId}/airwatch`}
              >
                <li className={`menu-text ${props.show ? "" : "d-none"}`}>
                  이동식
                </li>
              </Link>
            </ul>
          </ul>
        </div>
        <ul className="bottom-item">
          <Link
            className="link-unstyled"
            to={`/factoryManagement/factory/${factoryId}/settings`}
          >
            <li>
              <div className="wrapper">
                <div className="menu-icon">
                  <FontAwesomeIcon
                    icon={faGear}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className={`menu-text ${props.show ? "" : "d-none"}`}>
                  설정
                </div>
              </div>
            </li>
          </Link>
        </ul>
      </Nav>
    </div>
  );
}

export default Sidebar;
