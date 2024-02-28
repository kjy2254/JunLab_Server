import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GraphCard from "../Factorys/GraphCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "../../css/Vital.css";

function Vital(props) {
  useEffect(() => {
    props.setHeaderText("생체정보");
  }, []);

  const { userId } = useParams();

  return (
    <div className="vital">
      <GraphCard
        header={"심박수(bpm)"}
        selectedWorker={userId}
        endpoint={"heartrate"}
      />
      <GraphCard
        header={"체온(°C)"}
        selectedWorker={userId}
        endpoint={"temperature"}
      />
      <GraphCard
        header={"산소포화도(%)"}
        selectedWorker={userId}
        endpoint={"oxygen"}
      />
    </div>
  );
}

export default Vital;
