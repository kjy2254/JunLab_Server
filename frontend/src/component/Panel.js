import "../css/Panel.css";
import "../css/Theme.css";

function Panel(props) {
  const currentCount = Object.values(props.current).reduce(
    (acc, cur) => acc + (isNaN(cur) ? 0 : Number(cur)),
    0
  );

  return (
    <div>
      <div className="panel-wrapper">
        <h2 className=" text-color">
          {props.current.type === "all" ? "총원: " : "현재 구역: "}
          {currentCount}명
        </h2>
        <div className="count text-green">
          <p>정상</p> <p>{props.current.green}명</p>
        </div>
        <div
          className="score green"
          style={{
            width: `${
              currentCount == 0 ? 0 : (props.current.green / currentCount) * 100
            }%`,
          }}
        />
        <div className="count text-yellow">
          <p>경고</p> <p>{props.current.yellow}명</p>
        </div>
        <div
          className="score yellow"
          style={{
            width: `${
              currentCount == 0
                ? 0
                : (props.current.yellow / currentCount) * 100
            }%`,
          }}
        />
        <div className="count text-red">
          <p>위험</p> <p>{props.current.red}명</p>
        </div>
        <div
          className="score red"
          style={{
            width: `${
              currentCount == 0 ? 0 : (props.current.red / currentCount) * 100
            }%`,
          }}
        />
      </div>
    </div>
  );
}

export default Panel;
