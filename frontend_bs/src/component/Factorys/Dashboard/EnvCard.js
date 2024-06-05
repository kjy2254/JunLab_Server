import React from "react";
import "../../../css/Dashboard2.css";

function EnvCard({
  title,
  unit,
  value,
  img,
  endpoint,
  setSelectedEnvCard,
  setEnvModalOpen,
  setImg,
}) {
  return (
    <div
      className="env-card"
      onClick={() => {
        setEnvModalOpen(true);
        setSelectedEnvCard(endpoint);
        setImg(img);
      }}
    >
      <div className="title">
        <img title="그래프 보기" src={img} alt={title} />
        <span>{title}</span>
      </div>
      <div className="value">
        {value || "-"}
        {unit}
      </div>
    </div>
  );
}
export default EnvCard;
