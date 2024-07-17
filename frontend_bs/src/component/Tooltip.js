import React, { useState } from "react";
import "../css/Tooltip.css"; // CSS 파일을 별도로 작성

function Tooltip({ children, content, directionX, directionY }) {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && (
        <div className={`tooltip-box ${directionY}${directionX}`}>
          {content.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
