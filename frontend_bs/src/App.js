import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import SidebarAD from "./component/SidebarAD";
import Login from "./component/Login";
import Factory from "./component/Factory";
import Dashboard from "./component/Dashboard";
import AirWall from "./component/AirWall";
import AirWatch from "./component/AirWatch";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./component/Signup";

function App() {
  const [toggleSide, setToggleSide] = useState(true);
  const [toggleSmallSide, setToggleSmallSide] = useState(false);
  const [smallView, setSmallView] = useState(window.innerWidth < 800);
  const [headerText, setHeaderText] = useState("");

  const toggleSidebar = () => {
    setToggleSide(!toggleSide);
  };

  const toggleSmallSidebar = () => {
    setToggleSmallSide(!toggleSmallSide);
  };

  const closeSmallSidebar = () => {
    setToggleSmallSide(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setSmallView(window.innerWidth < 800);
      setToggleSmallSide(false);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/factoryManagement/factory/*"
            element={
              <Header
                toggleSidebar={toggleSidebar}
                smallView={smallView}
                toggleSmallSidebar={toggleSmallSidebar}
                headerText={headerText}
              />
            }
          />
        </Routes>
        <div className="content">
          <Routes>
            <Route
              path="/factoryManagement/factory/:factoryId/*"
              element={
                <Sidebar show={toggleSide} showInSmall={toggleSmallSide} />
              }
            />
            <Route
              path="/factoryManagement/factory"
              element={
                <SidebarAD
                  show={toggleSide}
                  showInSmall={toggleSmallSide}
                  factoryName={"관리자"}
                />
              }
            />
          </Routes>

          <Routes>
            <Route path="/factorymanagement/login" element={<Login />} />
            <Route path="/factorymanagement/signup" element={<Signup />} />
            <Route
              path="/factorymanagement/factory"
              element={
                <CustomRoute
                  Component={Factory}
                  toggleSide={toggleSide}
                  setHeaderText={setHeaderText}
                  closeSmallSidebar={closeSmallSidebar}
                />
              }
            />
            <Route
              path="/factorymanagement/factory/:factoryId/dashboard"
              element={
                <CustomRoute
                  Component={Dashboard}
                  toggleSide={toggleSide}
                  setHeaderText={setHeaderText}
                  closeSmallSidebar={closeSmallSidebar}
                />
              }
            />
            <Route
              path="/factorymanagement/factory/:factoryId/airwall"
              element={
                <CustomRoute
                  Component={AirWall}
                  toggleSide={toggleSide}
                  setHeaderText={setHeaderText}
                  closeSmallSidebar={closeSmallSidebar}
                />
              }
            />
            <Route
              path="/factorymanagement/factory/:factoryId/airwatch"
              element={
                <CustomRoute
                  Component={AirWatch}
                  toggleSide={toggleSide}
                  setHeaderText={setHeaderText}
                  closeSmallSidebar={closeSmallSidebar}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function CustomRoute({
  Component,
  toggleSide,
  setHeaderText,
  closeSmallSidebar,
}) {
  return (
    <div
      className={`main ${toggleSide ? "collapsed" : "expanded"}`}
      onClick={closeSmallSidebar}
    >
      <Component setHeaderText={setHeaderText} />
    </div>
  );
}

export default App;
