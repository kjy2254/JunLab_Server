import React from "react";
import { Nav } from "react-bootstrap";
import "../css/SidebarAD.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function Sidebar(props) {
  const [toggleLog, setToggleLog] = useState(true);

  return (
    <div
      className={`
      custom-sidebar 
      ${props.show ? "expanded" : "collapsed"} 
      ${props.showInSmall ? "sv-expanded" : ""}
      `}
    >
      <Nav className="flex-column">
        <div className="header">{props.factoryName}</div>
        <ul className="item">
          <Link
            className="link-unstyled"
            // to={`/factoryManagement/factory/${props.factoryId}/dashboard`}
          >
            <li>
              <div className="wrapper">
                <div className="menu-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <g>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.2324 0.409237L19.3558 6.86596C19.7229 7.15779 20 7.73667 20 8.21199V9.08815C20 9.64977 19.5529 10.1069 19.0031 10.1069H17.6098C17.4502 10.1069 17.3204 10.2396 17.3204 10.4024V16.4478C17.3204 17.855 16.2 19 14.8229 19H12.1113V14.3756C12.1113 12.9996 11.5043 11.8806 10 11.8806C8.49566 11.8806 7.88867 12.9996 7.88867 14.3756V19H5.17689C3.8 19 2.67956 17.855 2.67956 16.4478V10.4024C2.67956 10.2396 2.54978 10.1069 2.39022 10.1069H0.996889C0.447111 10.1069 0 9.65 0 9.08815V8.21199C0 7.73667 0.277111 7.15779 0.644222 6.86596L8.76756 0.409237C9.09956 0.145572 9.53689 0 10 0C10.4627 0 10.9007 0.145572 11.2324 0.409237Z"
                        fill="white"
                      />
                    </g>
                  </svg>
                </div>
                <div className={`menu-text ${props.show ? "" : "d-none"}`}>
                  공장관리
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
