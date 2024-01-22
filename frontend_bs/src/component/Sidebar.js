import React from "react";
import { Nav } from "react-bootstrap";
import "../css/Sidebar.css";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
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
      custom-sidebar 
      ${props.show ? "expanded" : "collapsed"} 
      ${props.showInSmall ? "sv-expanded" : ""}
      `}
    >
      <Nav className="flex-column">
        <div className="header">{factoryName}</div>
        <ul className="item">
          <Link
            className="link-unstyled"
            to={`/factoryManagement/factory/${factoryId}/dashboard`}
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
                  통합상황판
                </div>
              </div>
            </li>
          </Link>
          <li onClick={() => setToggleLog(!toggleLog)}>
            <div className="wrapper">
              <div className="menu-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <g clipPath="url(#clip0_152_998)">
                    <path
                      d="M18.6856 3.62688L15.1856 0.126882C15.1447 0.0863342 15.0963 0.0542544 15.043 0.0324824C14.9897 0.0107104 14.9326 -0.000325578 14.875 7.3125e-06H3.5C3.1519 7.3125e-06 2.81806 0.138288 2.57192 0.38443C2.32578 0.630571 2.1875 0.964411 2.1875 1.31251V19.6875C2.1875 20.0356 2.32578 20.3694 2.57192 20.6156C2.81806 20.8617 3.1519 21 3.5 21H17.5C17.8481 21 18.1819 20.8617 18.4281 20.6156C18.6742 20.3694 18.8125 20.0356 18.8125 19.6875V3.93751C18.8128 3.87993 18.8018 3.82285 18.78 3.76955C18.7583 3.71624 18.7262 3.66776 18.6856 3.62688ZM15.3125 1.49188L17.3206 3.50001H15.75C15.634 3.50001 15.5227 3.45391 15.4406 3.37187C15.3586 3.28982 15.3125 3.17854 15.3125 3.06251V1.49188ZM17.9375 19.6875C17.9375 19.8035 17.8914 19.9148 17.8094 19.9969C17.7273 20.0789 17.616 20.125 17.5 20.125H3.5C3.38397 20.125 3.27269 20.0789 3.19064 19.9969C3.10859 19.9148 3.0625 19.8035 3.0625 19.6875V1.31251C3.0625 1.19648 3.10859 1.0852 3.19064 1.00315C3.27269 0.921101 3.38397 0.875007 3.5 0.875007H14.4375V3.06251C14.4375 3.4106 14.5758 3.74444 14.8219 3.99059C15.0681 4.23673 15.4019 4.37501 15.75 4.37501H17.9375V19.6875Z"
                      fill="white"
                    />
                    <path d="M15.75 7.875H7V8.75H15.75V7.875Z" fill="white" />
                    <path
                      d="M15.75 10.5H5.25V11.375H15.75V10.5Z"
                      fill="white"
                    />
                    <path
                      d="M15.75 13.125H5.25V14H15.75V13.125Z"
                      fill="white"
                    />
                    <path
                      d="M12.25 15.75H5.25V16.625H12.25V15.75Z"
                      fill="white"
                    />
                    <path
                      d="M15.75 15.75H14.875V16.625H15.75V15.75Z"
                      fill="white"
                    />
                    <path d="M14 15.75H13.125V16.625H14V15.75Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_152_998">
                      <rect width="21" height="21" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className={`menu-text ${props.show ? "" : "d-none"}`}>
                로그
              </div>
            </div>
            <div className={`log-toggle ${props.show ? "" : "d-none"}`}>
              {toggleLog ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                  />
                </svg>
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
      </Nav>
    </div>
  );
}

export default Sidebar;
