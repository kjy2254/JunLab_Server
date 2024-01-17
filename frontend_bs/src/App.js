import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import SidebarAD from "./component/SidebarAD";
import Login from "./component/Login";
import Factory from "./component/Factory";
import Dashboard from "./component/Dashboard";
import LiveData from "./component/LiveData";
import TVOC from "./component/TVOC";
import CO2 from "./component/CO2";
import Finedust from "./component/Finedust";
import Temperature from "./component/Temperature";
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

  const toggleSidebar = () => {
    setToggleSide(!toggleSide);
  };

  const toggleSmallSidebar = () => {
    setToggleSmallSide(!toggleSmallSide);
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
              />
            }
          />
        </Routes>
        <div className="content">
          <Routes>
            <Route
              path="/factoryManagement/factory/*"
              element={
                <Sidebar
                  show={toggleSide}
                  showInSmall={toggleSmallSide}
                  factoryId={5}
                  factoryName={"한금"}
                />
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
            <Route path="/factoryManagement/login" element={<Login />} />
            <Route path="/factoryManagement/signup" element={<Signup />} />
            <Route
              path="/factoryManagement/factory"
              element={
                <CustomRoute Component={Factory} toggleSide={toggleSide} />
              }
            />
            <Route
              path="/factoryManagement/factory/:factoryId/dashboard"
              element={
                <CustomRoute Component={Dashboard} toggleSide={toggleSide} />
              }
            />
            <Route
              path="/factoryManagement/factory/:factoryId/livedata"
              element={
                <CustomRoute Component={LiveData} toggleSide={toggleSide} />
              }
            />
            <Route
              path="/factoryManagement/factory/:factoryId/tvoc"
              element={<CustomRoute Component={TVOC} toggleSide={toggleSide} />}
            />
            <Route
              path="/factoryManagement/factory/:factoryId/co2"
              element={<CustomRoute Component={CO2} toggleSide={toggleSide} />}
            />
            <Route
              path="/factoryManagement/factory/:factoryId/temperature"
              element={
                <CustomRoute Component={Temperature} toggleSide={toggleSide} />
              }
            />
            <Route
              path="/factoryManagement/factory/:factoryId/finedust"
              element={
                <CustomRoute Component={Finedust} toggleSide={toggleSide} />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function CustomRoute({ Component, toggleSide }) {
  return (
    <div className={`main ${toggleSide ? "collapsed" : "expanded"}`}>
      <Component />
    </div>
  );
}

export default App;
