import React, { useState } from "react";

const DraggableComponent = (props) => {
  const [position, setPosition] = useState({ top: props.x, left: props.y });
  const [isDragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    const parentElement = e.currentTarget.parentElement;
    const parentRect = parentElement.getBoundingClientRect();

    setDragging(true);
    setStartPosition({
      x:
        ((e.clientX - parentRect.left) / parentRect.width) * 100 -
        position.left,
      y:
        ((e.clientY - parentRect.top) / parentRect.height) * 100 - position.top,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const parentElement = e.currentTarget.parentElement;
      const parentRect = parentElement.getBoundingClientRect();

      const newPosition = {
        left:
          ((e.clientX - parentRect.left) / parentRect.width) * 100 -
          startPosition.x,
        top:
          ((e.clientY - parentRect.top) / parentRect.height) * 100 -
          startPosition.y,
      };

      // 드래그 요소의 크기 고려하여 한계치 설정
      const maxX = (parentRect.width / parentElement.clientWidth) * 100 - 5;
      const maxY = (parentRect.height / parentElement.clientHeight) * 100 - 5;

      // 새로운 위치가 부모 요소 내에 있는지 확인 및 한계치 설정
      setPosition({
        left: Math.min(Math.max(newPosition.left, 0), maxX),
        top: Math.min(Math.max(newPosition.top, 0), maxY),
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      className="draggable-element"
      style={{
        position: "absolute",
        top: `${position.top}%`,
        left: `${position.left}%`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      top:{position.top.toFixed(2)}
      <br></br>
      left:{position.left.toFixed(2)}
    </div>
  );
};

export default DraggableComponent;
