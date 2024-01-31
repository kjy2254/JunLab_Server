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
        <img src={path} alt={"path"} />
        &nbsp;{finalroute}
      </div>
    </div>
  );
}

export default Route;
