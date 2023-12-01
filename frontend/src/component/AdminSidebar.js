import React, { useEffect, useState } from "react";
import "../css/Sidebar.css";
import { Link, useParams } from "react-router-dom";

function Sidebar(props) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const { data } = useParams();

  const toggleDetails = () => {
    setDetailsOpen(!detailsOpen);
  };

  useEffect(() => {
    let hoverTimeout;

    if (isHovering) {
      hoverTimeout = setTimeout(() => {
        setExpanded(true);
      }, 500);

      return () => {
        clearTimeout(hoverTimeout);
      };
    } else {
      setExpanded(false);
    }
  }, [isHovering]);

  return (
    <div
      className={`sidebar ${expanded ? "expanded" : ""} ${
        isHovering ? "expanding" : ""
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link to={`/iitp/factoryManagement`} className="logo">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 24.5348C0 28.6304 3.32014 31.9505 7.41573 31.9505H32L0 1.79499V24.5348Z"
            fill="url(#paint0_linear_139_725)"
          />
          <g opacity="0.983161" filter="url(#filter0_b_139_725)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 7.40946C0 3.31387 3.32014 2.56463e-09 7.41573 2.56463e-09H32C32 2.56463e-09 3.73034 25.7671 1.2263 28.2342C0 29.9414 1.43276 31.8648 1.43276 31.8648C1.43276 31.8648 0 31.1225 0 29.5198C0 28.7041 0 15.8841 0 7.40946Z"
              fill="url(#paint1_linear_139_725)"
            />
          </g>
          <defs>
            <filter
              id="filter0_b_139_725"
              x="-20.158"
              y="-20.158"
              width="72.3161"
              height="72.1808"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="10.079" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_139_725"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_139_725"
                result="shape"
              />
            </filter>
            <linearGradient
              id="paint0_linear_139_725"
              x1="7.98937"
              y1="10.3822"
              x2="37.8245"
              y2="18.6459"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0043FF" />
              <stop offset="1" stopColor="#A370F1" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_139_725"
              x1="22.0813"
              y1="-15.8615"
              x2="-5.37804"
              y2="2.33241"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4BF2E6" />
              <stop offset="1" stopColor="#0065FF" />
            </linearGradient>
          </defs>
        </svg>
        <span>JUNLAB</span>
      </Link>
      <hr className="separator" />
      <div className="head-text">{props.header}</div>
      <div className="menu">
        <div
          className={`menu-item ${props.selected === "1" ? "selected" : ""}`}
        >
          <div className="menu-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g opacity={`${props.selected === "1" ? "0.95" : "0.6"}`}>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.2324 0.409237L19.3558 6.86596C19.7229 7.15779 20 7.73667 20 8.21199V9.08815C20 9.64977 19.5529 10.1069 19.0031 10.1069H17.6098C17.4502 10.1069 17.3204 10.2396 17.3204 10.4024V16.4478C17.3204 17.855 16.2 19 14.8229 19H12.1113V14.3756C12.1113 12.9996 11.5043 11.8806 10 11.8806C8.49566 11.8806 7.88867 12.9996 7.88867 14.3756V19H5.17689C3.8 19 2.67956 17.855 2.67956 16.4478V10.4024C2.67956 10.2396 2.54978 10.1069 2.39022 10.1069H0.996889C0.447111 10.1069 0 9.65 0 9.08815V8.21199C0 7.73667 0.277111 7.15779 0.644222 6.86596L8.76756 0.409237C9.09956 0.145572 9.53689 0 10 0C10.4627 0 10.9007 0.145572 11.2324 0.409237Z"
                  fill="white"
                />
              </g>
            </svg>
          </div>
          <div className="menu-name">Factories</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
