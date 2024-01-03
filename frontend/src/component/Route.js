import path from "../image/path.svg";
import "../css/Route.css";

function Route(props) {
  const routelist = props.routelist;
  const finalroute = props.finalroute;

  return (
    <div className="path-section">
      {routelist.map((e, index) => (
        <div className="path" key={index}>
          <img src={path} alt={"path"} />
          &nbsp;{e}
        </div>
      ))}
      <div className="path-selected">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 0V8H0L8 0Z"
            fill="url(#paint0_linear_104_907)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_104_907"
              x1="13.1265"
              y1="6.66481"
              x2="3.15937"
              y2="12.9836"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0043FF" />
              <stop offset="1" stopColor="#A370F1" />
            </linearGradient>
          </defs>
        </svg>
        &nbsp;{finalroute}
      </div>
    </div>
  );
}

export default Route;
