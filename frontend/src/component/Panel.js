import "../css/Panel.css";

function Panel(props) {
  return (
    <>
      <div className="panel-wrapper">
        <h2 className="total-count">총 작업자: 6명</h2>
        <div className="count text-green">
          <p>정상</p> <p>2명</p>
        </div>
        <div className="score green" style={{ width: `${(2 / 6) * 100}%` }} />
        <div className="count text-yellow">
          <p>경고</p> <p>3명</p>
        </div>
        <div className="score yellow" style={{ width: `${(3 / 6) * 100}%` }} />
        <div className="count text-red">
          <p>위험</p> <p>1명</p>
        </div>
        <div className="score red" style={{ width: `${(1 / 6) * 100}%` }} />
      </div>
      <div className="panel-wrapper">
        <h2 className="total-count">현재 구역: 6명</h2>
        <div className="count text-green">
          <p>정상</p> <p>2명</p>
        </div>
        <div className="score green" style={{ width: `${(2 / 6) * 100}%` }} />
        <div className="count text-yellow">
          <p>경고</p> <p>3명</p>
        </div>
        <div className="score yellow" style={{ width: `${(3 / 6) * 100}%` }} />
        <div className="count text-red">
          <p>위험</p> <p>1명</p>
        </div>
        <div className="score red" style={{ width: `${(1 / 6) * 100}%` }} />
      </div>
    </>
  );
}

export default Panel;
