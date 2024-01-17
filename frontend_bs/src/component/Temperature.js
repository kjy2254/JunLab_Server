import React from "react";
import { useParams } from "react-router-dom";
import "../css/Temperature.css";

function Temperature(props) {
  const { factoryId } = useParams();
  return <div className="temperature">{factoryId} 번 Temperature</div>;
}

export default Temperature;
