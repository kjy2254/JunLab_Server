import "../css/Tooltip.css";

function Tooltip(props) {
  if (!props.isOnline) {
    props.description.heartrate = "-";
    props.description.temperature = "-";
    props.description.oxygen = "-";
    props.description.tvoc = "-";
    props.description.co2 = "-";
    props.description.finedust = "-";
  }

  return (
    <div
      className="tooltip"
      style={{ top: `${props.y}px`, left: `${props.x}px` }}
    >
      <div className="tooltip-header">
        <span>{props.description.name}</span>
        <span>{props.isOnline ? props.level : "Offline"}</span>
      </div>
      <hr />
      {props.type === "worker" ? (
        <div className="tooltip-body">
          <div className="tooltip-body-line">
            <span>Temperature:</span>
            <span>{props.description.temperature}°C</span>
          </div>
          <div className="tooltip-body-line">
            <span>heartrate:</span>
            <span>{props.description.heartrate}bpm</span>
          </div>
          <div className="tooltip-body-line">
            <span>oxygen:</span>
            <span>
              {props.isOnline ? parseInt(props.description.oxygen) : "-"}%
            </span>
          </div>
        </div>
      ) : (
        <div className="tooltip-body">
          <div className="tooltip-body-line">
            <span>Tvoc:</span>
            <span>{props.description.tvoc}ppb</span>
          </div>
          <div className="tooltip-body-line">
            <span>Co2:</span>
            <span>{props.description.co2}ppm</span>
          </div>
          <div className="tooltip-body-line">
            <span>Temperature:</span>
            <span>{props.description.temperature}°C</span>
          </div>
          <div className="tooltip-body-line">
            <span>Finedust:</span>
            <span>{props.description.finedust}㎍/㎥</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tooltip;
