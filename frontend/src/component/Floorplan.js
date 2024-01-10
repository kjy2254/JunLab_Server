import React, { useState, useEffect } from "react";
import "../css/Floorplan.css";
import module1 from "../image/module1.svg";
import module2 from "../image/module2.svg";
import module3 from "../image/module3.svg";
import worker1 from "../image/worker1.svg";
import worker2 from "../image/worker2.svg";
import worker3 from "../image/worker3.svg";
import workerOff from "../image/worker_off.svg";
import moduleOff from "../image/module_off.svg";
import Tooltip from "./Tooltip";
import axios from "axios";

function Floorplan(props) {
  const [image, setImage] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    name: null,
  });
  const [statistic, setStatistic] = useState({});

  useEffect(() => {
    const current = { green: 0, yellow: 0, red: 0 };
    if (props.data) {
      setImage(
        `http://junlab.postech.ac.kr:880/api/image/${props.data.imageName}`
      );
      setDimensions({ width: props.data.width, height: props.data.height });

      props.data.workers.forEach((worker) => {
        switch (worker.level.work_level) {
          case 1:
          case 2:
            current.green += 1;
            break;
          case 3:
          case 4:
            current.yellow += 1;
            break;
          case 5:
            current.red += 1;
            break;
          default:
            break;
        }
      });
    } else {
      setImage("");
      setDimensions({ width: 0, height: 0 });

      axios
        .get(
          `http://junlab.postech.ac.kr:880/api/factory/statistic/${props.factoryId}`
        )
        .then((response) => {
          setStatistic(response.data);
        })
        .catch((error) => {
          console.error("API 요청 실패:", error);
        });
    }
    props.setCurrent(current);
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
            const lastUpdateDate = new Date(module.lastUpdate);
            const isOnline = Date.now() - lastUpdateDate.getTime() < 60000;

            let dotImage;

            switch (module.level.env_level) {
              case 1:
              case 2:
                dotImage = <img src={module1} />;
                break;
              case 3:
              case 4:
                dotImage = <img src={module2} />;
                break;
              case 5:
                dotImage = <img src={module3} />;
                break;
              default:
                break;
            }

            dotImage = isOnline ? dotImage : <img src={moduleOff} />;

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
                      level={module.level.env_level}
                      description={module.description}
                      lastUpdate={module.lastUpdate}
                      isOnline={isOnline}
                    />
                  )}
              </div>
            );
          })}
        {props.data &&
          props.data.workers.map((worker, index) => {
            const lastUpdateDate = new Date(worker.lastUpdate);
            const isOnline = Date.now() - lastUpdateDate.getTime() < 60000;

            let dotImage;
            switch (worker.level.work_level) {
              case 1:
              case 2:
                dotImage = <img src={worker1} />;
                break;
              case 3:
              case 4:
                dotImage = <img src={worker2} />;
                break;
              case 5:
                dotImage = <img src={worker3} />;
                break;
              default:
                break;
            }

            dotImage = isOnline ? dotImage : <img src={workerOff} />;

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
                      level={worker.level.work_level}
                      type={"worker"}
                      description={worker.description}
                      isOnline={isOnline}
                    />
                  )}
              </div>
            );
          })}
        {!props.data && statistic.users && statistic.users[0].name}
      </div>
    </div>
  );
}

export default Floorplan;
