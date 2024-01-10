import "../css/Panel.css";
import "../css/Theme.css";

function Panel(props) {
  const totalCount = Object.values(props.total).reduce(
    (acc, cur) => acc + cur,
    0
  );
  const currentCount = Object.values(props.current).reduce(
    (acc, cur) => acc + cur,
    0
  );

  return (
    <div>
      <div className="panel-wrapper ">
        <h2 className="text-color">
          총 작업자:&nbsp;
          {totalCount}명
        </h2>
        <div className="count text-green">
          <p>정상</p> <p>{props.total.green}명</p>
        </div>
        <div
          className="score green"
          style={{
            width: `${
              totalCount == 0 ? 0 : (props.total.green / totalCount) * 100
            }%`,
          }}
        />
        <div className="count text-yellow">
          <p>경고</p> <p>{props.total.yellow}명</p>
        </div>
        <div
          className="score yellow"
          style={{
            width: `${
              totalCount == 0 ? 0 : (props.total.yellow / totalCount) * 100
            }%`,
          }}
        />
        <div className="count text-red">
          <p>위험</p> <p>{props.total.red}명</p>
        </div>
        <div
          className="score red"
          style={{
            width: `${
              totalCount == 0 ? 0 : (props.total.red / totalCount) * 100
            }%`,
          }}
        />
      </div>
      <div className="panel-wrapper">
        <h2 className=" text-color">
          현재 구역: &nbsp;
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
