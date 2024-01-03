import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Floorplan.css";
import module1 from "../image/module1.svg";
import module2 from "../image/module2.svg";
import module3 from "../image/module3.svg";
import worker1 from "../image/worker1.svg";
import worker2 from "../image/worker2.svg";
import worker3 from "../image/worker3.svg";
import Tooltip from "./Tooltip";

function Floorplan(props) {
  const [image, setImage] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    name: null,
  });

  useEffect(() => {
    if (props.data) {
      // console.log(props.data);
      setImage(
        `http://junlab.postech.ac.kr:880/api/image/${props.data.imageName}`
      );
      setDimensions({ width: props.data.width, height: props.data.height });
      // console.log(props.data);
    }
  }, [props.data]);

  const handleDotHover = (event, dot) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left; // 마우스 X 좌표
    const y = event.clientY - rect.top; // 마우스 Y 좌표

    setTooltip({ visible: true, x, y, name: dot.description.name });
  };

  const handleDotLeave = () => {
    setTooltip((prevTooltip) => ({
      ...prevTooltip,
      visible: false,
    }));
  };

  return (
    <div className="floor-wrapper">
      <div
        className="floor-plan"
        style={{
          backgroundImage: `url(${image})`,
          aspectRatio: `${dimensions.width / dimensions.height}`,
        }}
      >
        {props.data &&
          props.data.modules.map((module, index) => {
            let dotImage;
            switch (module.level) {
              case 1:
                dotImage = <img src={module1} />;
                break;
              case 2:
                dotImage = <img src={module2} />;
                break;
              case 3:
                dotImage = <img src={module3} />;
                break;
              default:
                dotImage = null;
            }

            return (
              <div
                key={index}
                className={`dot`}
                style={{ top: `${module.y}%`, left: `${module.x}%` }}
                onMouseMove={(e) => handleDotHover(e, module)}
                onMouseLeave={handleDotLeave}
              >
                {dotImage}
                {tooltip.visible &&
                  JSON.stringify(tooltip.name) ===
                    JSON.stringify(module.description.name) && (
                    <Tooltip
                      x={tooltip.x}
                      y={tooltip.y}
                      level={module.level}
                      description={module.description}
                    />
                  )}
              </div>
            );
          })}
        {props.data &&
          props.data.workers.map((worker, index) => {
            let dotImage;
            switch (worker.level) {
              case 1:
                dotImage = <img src={worker1} />;
                break;
              case 2:
                dotImage = <img src={worker2} />;
                break;
              case 3:
                dotImage = <img src={worker3} />;
                break;
              default:
                dotImage = null;
            }

            return (
              <div
                key={index}
                className={`dot`}
                style={{ top: `${worker.y}%`, left: `${worker.x}%` }}
                onMouseMove={(e) => handleDotHover(e, worker)}
                onMouseLeave={handleDotLeave}
              >
                {dotImage}
                {tooltip.visible &&
                  JSON.stringify(tooltip.name) ===
                    JSON.stringify(worker.description.name) && (
                    <Tooltip
                      x={tooltip.x}
                      y={tooltip.y}
                      level={worker.level}
                      type={"worker"}
                      description={worker.description}
                    />
                  )}
              </div>
            );
          })}
      </div>
      <span>1d</span>
    </div>
  );
}

export default Floorplan;
