import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

function ZoomControl() {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => {
    const newZoomLevel = Math.min(zoomLevel + 5, 200); // 최대 500%
    setZoomLevel(newZoomLevel);
    document.body.style.zoom = `${newZoomLevel}%`;
  };

  const handleZoomOut = () => {
    const newZoomLevel = Math.max(zoomLevel - 5, 50); // 최소 50%
    setZoomLevel(newZoomLevel);
    document.body.style.zoom = `${newZoomLevel}%`;
  };

  return (
    <div style={{ position: "fixed", bottom: 10, right: 10, zIndex: 1000 }}>
      <button
        onClick={handleZoomOut}
        style={{ fontSize: "1.5rem", margin: "0 5px" }}
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <button
        onClick={handleZoomIn}
        style={{ fontSize: "1.5rem", margin: "0 5px" }}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}

export default ZoomControl;
