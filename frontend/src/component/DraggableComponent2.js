import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";

const DraggableComponent2 = (props) => {
  const handleClick = (e) => {
    // 클릭 이벤트 핸들러
    const parentElement = e.currentTarget.parentElement;

    // 부모 요소의 크기 가져오기
    const parentRect = parentElement.getBoundingClientRect();

    // 드래그 가능한 요소의 위치 가져오기
    const elementRect = e.currentTarget.getBoundingClientRect();

    // 위치 계산
    const positionPercentage = {
      top: ((elementRect.top - parentRect.top) / parentRect.height) * 100,
      left: ((elementRect.left - parentRect.left) / parentRect.width) * 100,
    };

    if (props.type === "worker") {
      props.setWorkers((prevWorkers) =>
        prevWorkers.map((worker) =>
          worker.id === props.id
            ? {
                ...worker,
                x: positionPercentage.left,
                y: positionPercentage.top,
              }
            : worker
        )
      );

      // console.log(props.workers);
    } else {
      props.setModules((prevModules) =>
        prevModules.map((module) =>
          module.id === props.id
            ? {
                ...module,
                x: positionPercentage.left,
                y: positionPercentage.top,
              }
            : module
        )
      );
    }

    console.log(positionPercentage);
  };

  return (
    <Draggable bounds={"parent"}>
      <div
        className="draggable-element"
        style={{
          position: "absolute",
          top: `${props.y}%`,
          left: `${props.x}%`,
        }}
        onClick={handleClick}
      >
        {props.name}
        <br />
        {props.x},{props.y}
      </div>
    </Draggable>
  );
};

export default DraggableComponent2;
