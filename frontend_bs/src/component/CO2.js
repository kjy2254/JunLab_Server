import React from "react";
import { useParams } from "react-router-dom";
import "../css/CO2.css";

function CO2(props) {
  const { factoryId } = useParams();
  return <div className="co2">{factoryId} 번 CO2</div>;
}

export default CO2;
