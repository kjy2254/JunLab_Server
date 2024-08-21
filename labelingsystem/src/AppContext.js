import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [authData, setAuthData] = useState({});

  const [loading, setLoading] = useState(true);
  const [toggleSmallSide, setToggleSmallSide] = useState(false);
  const [toggleSide, setToggleSide] = useState(true);
  const [smallView, setSmallView] = useState(window.innerWidth < 1250);

  return (
    <AppContext.Provider
      value={{
        authData,
        setAuthData,
        loading,
        setLoading,
        toggleSmallSide,
        setToggleSmallSide,
        toggleSide,
        setToggleSide,
        smallView,
        setSmallView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
