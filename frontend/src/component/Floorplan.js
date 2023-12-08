import React, { useState } from "react";
import "../css/Floorplan.css";
import module1 from "../image/module1.svg";
import module2 from "../image/module2.svg";
import module3 from "../image/module3.svg";
import worker1 from "../image/worker1.svg";
import worker2 from "../image/worker2.svg";
import worker3 from "../image/worker3.svg";
import Tooltip from "./Tooltip";

function Floorplan(props) {
  const dots = [
    {
      x: 40,
      y: 50,
      type: "worker",
      level: "2",
      description: {
        name: "worker1",
        heartrate: "100",
        temperature: "36.8",
        oxygen: "97",
      },
    },
    {
      x: 35,
      y: 40,
      type: "worker",
      level: "1",
      description: {
        name: "worker2",
        heartrate: "100",
        temperature: "36.8",
        oxygen: "97",
      },
    },
    {
      x: 15,
      y: 60,
      type: "module",
      level: "3",
      description: {
        name: "module1",
        tvoc: "377",
        co2: "428",
        temperature: "36.8",
        finedust: "36",
      },
    },
    {
      x: 83,
      y: 53,
      type: "worker",
      level: "2",
      description: {
        name: "worker3",
        heartrate: "100",
        temperature: "36.8",
        oxygen: "97",
      },
    },
    {
      x: 28,
      y: 72,
      type: "worker",
      level: "3",
      description: {
        name: "worker4",
        heartrate: "100",
        temperature: "36.8",
        oxygen: "97",
      },
    },
    {
      x: 67,
      y: 52,
      type: "worker",
      level: "1",
      description: {
        name: "worker5",
        heartrate: "100",
        temperature: "36.8",
        oxygen: "97",
      },
    },
    {
      x: 62,
      y: 30,
      type: "worker",
      level: "2",
      description: {
        name: "worker6",
        heartrate: "100",
        temperature: "36.8",
        oxygen: "97",
      },
    },
    {
      x: 55,
      y: 60,
      type: "module",
      level: "1",
      description: {
        name: "module2",
        tvoc: "377",
        co2: "428",
        temperature: "36.8",
        finedust: "36",
      },
    },
  ];

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleDotHover = (event, dot) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left; // 마우스 X 좌표
    const y = event.clientY - rect.top; // 마우스 Y 좌표

    setTooltip({ visible: true, x, y, content: dot.description });
    console.log(dot.description);
  };

  return (
    <div className="floor-wrapper">
      <div className="floor-plan">
        {dots.map((dot, index) => {
          let dotImage;

          switch (dot.type) {
            case "worker":
              switch (dot.level) {
                case "1":
                  dotImage = <img src={worker1} />;
                  break;
                case "2":
                  dotImage = <img src={worker2} />;
                  break;
                case "3":
                  dotImage = <img src={worker3} />;
                  break;
                default:
                  dotImage = null;
              }
              break;
            case "module":
              switch (dot.level) {
                case "1":
                  dotImage = <img src={module1} />;
                  break;
                case "2":
                  dotImage = <img src={module2} />;
                  break;
                case "3":
                  dotImage = <img src={module3} />;
                  break;
                default:
                  dotImage = null;
              }
              break;
            default:
              dotImage = null;
          }

          return (
            <div
              key={index}
              className={`dot`}
              style={{ top: `${dot.y}%`, left: `${dot.x}%` }}
              onMouseMove={(e) => handleDotHover(e, dot)}
              onMouseLeave={() => setTooltip({ visible: false })}
            >
              {dotImage}
              {tooltip.visible &&
                JSON.stringify(tooltip.content) ===
                  JSON.stringify(dot.description) && (
                  <Tooltip
                    x={tooltip.x}
                    y={tooltip.y}
                    level={dot.level}
                    type={dot.type}
                    description={dot.description}
                  />
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Floorplan;
