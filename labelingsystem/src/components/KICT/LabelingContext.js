import React, { createContext, useRef, useState } from "react";

export const LabelingContext = createContext();

export const LabelingProvider = ({ children }) => {
  const [originalImage, setOriginalImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [currentBlock, setCurrentBlock] = useState({ x: -1, y: 0 });
  const [metaData, setMetaData] = useState({});
  const [progress, setProgress] = useState({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [fragments, setFragments] = useState([]);
  const [autoClick, setAutoClick] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showClass, setShowClass] = useState(-1);
  const [type, setType] = useState("mouse");
  const blockSize = 32;

  const numBlocks = {
    x: imageSize.width / blockSize,
    y: imageSize.height / blockSize,
  };

  const radioRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  return (
    <LabelingContext.Provider
      value={{
        originalImage,
        setOriginalImage,
        imageSize,
        setImageSize,
        currentBlock,
        setCurrentBlock,
        metaData,
        setMetaData,
        progress,
        setProgress,
        elapsedTime,
        setElapsedTime,
        fragments,
        setFragments,
        autoClick,
        setAutoClick,
        isLoaded,
        setIsLoaded,
        isSubmitting,
        setIsSubmitting,
        showClass,
        setShowClass,
        blockSize,
        type,
        setType,
        numBlocks,
        radioRefs,
      }}
    >
      {children}
    </LabelingContext.Provider>
  );
};
