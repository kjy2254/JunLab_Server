import React from "react";
import { useParams } from "react-router-dom";
import "../css/Finedust.css";

function Finedust(props) {
  const { factoryId } = useParams();
  return <div className="finedust">{factoryId} 번 Finedust</div>;
}

export default Finedust;
