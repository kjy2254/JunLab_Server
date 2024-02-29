import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../css/Vital.css";
import HealthGraphCard from "../Factorys/HealthGraphCard";

function Vital(props) {
  useEffect(() => {
    props.setHeaderText("생체정보");
  }, []);

  const { userId } = useParams();

  return (
    <div className="vital">
      <HealthGraphCard
        header={"심박수(bpm)"}
        selectedWorker={userId}
        endpoint={"heartrate"}
      />
      <HealthGraphCard
        header={"체온(°C)"}
        selectedWorker={userId}
        endpoint={"temperature"}
      />
      <HealthGraphCard
        header={"산소포화도(%)"}
        selectedWorker={userId}
        endpoint={"oxygen"}
      />
    </div>
  );
}

export default Vital;
