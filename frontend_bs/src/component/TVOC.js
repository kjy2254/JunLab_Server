import React from "react";
import { useParams } from "react-router-dom";
import "../css/TVOC.css";

function TVOC(props) {
  const { factoryId } = useParams();
  return <div className="tvoc">{factoryId} 번 TVOC</div>;
}

export default TVOC;
