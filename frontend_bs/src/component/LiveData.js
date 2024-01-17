import React from "react";
import { useParams } from "react-router-dom";
import "../css/LiveData.css";

function LiveData(props) {
  const { factoryId } = useParams();
  return <div className="livedata">{factoryId} 번 실시간 데이터</div>;
}

export default LiveData;
