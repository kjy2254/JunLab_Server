import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import SidebarAD from "./component/Admins/SidebarAD";
import Login from "./component/Login";
import Factory from "./component/Admins/Factory";
import Logs from "./component/Admins/Logs";
import Dashboard from "./component/Dashboard";
import AirWall from "./component/AirWall";
import AirWatch from "./component/AirWatch";
import Settings from "./component/Settings/Settings";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./component/Signup";
import { authcheck } from "./util";

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

  const [authData, setAuthData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   setAuthData({
  //     isLogin: false,
  //     name: "JunLab",
  //     userId: 10,
  //     authority: 4,
  //     manageOf: -1,
  //   });
  //   setIsLoading(false);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const authData = await authcheck();
      setAuthData({
        isLogin: authData.isLogin,
        name: authData.name,
        userId: authData.userId,
        authority: authData.authority,
        manageOf: authData.manageOf,
      });
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <Router>
      <div className="App layer1">
        <Routes>
          <Route path="/factoryManagement/login" />
          <Route path="/factoryManagement/signup" />
          <Route
            path="/factoryManagement/*"
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
              path="/factoryManagement/admin/*"
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
            <Route
              path="/factorymanagement/login"
              element={
                <RestrictRoute
                  element={<Login />}
                  isAllow={!authData.isLogin}
                />
              }
            />
            <Route
              path="/factorymanagement/signup"
              element={
                <RestrictRoute
                  element={<Signup />}
                  isAllow={!authData.isLogin}
                />
              }
            />
            <Route
              path="/factorymanagement/admin/factory"
              element={
                <RestrictRoute
                  element={
                    <CustomComponent
                      Component={Factory}
                      toggleSide={toggleSide}
                      setHeaderText={setHeaderText}
                      closeSmallSidebar={closeSmallSidebar}
                    />
                  }
                  isAllow={authData.authority >= 4}
                />
              }
            />
            <Route
              path="/factorymanagement/admin/logs"
              element={
                <RestrictRoute
                  element={
                    <CustomComponent
                      Component={Logs}
                      toggleSide={toggleSide}
                      setHeaderText={setHeaderText}
                      closeSmallSidebar={closeSmallSidebar}
                    />
                  }
                  isAllow={authData.authority >= 4}
                />
              }
            />
            <Route
              path="/factorymanagement/factory/:factoryId/dashboard"
              element={
                <RestrictRoute
                  element={
                    <CustomComponent
                      Component={Dashboard}
                      toggleSide={toggleSide}
                      setHeaderText={setHeaderText}
                      closeSmallSidebar={closeSmallSidebar}
                    />
                  }
                  isAllow={authData.authority >= 3}
                  manageOf={authData.manageOf}
                />
              }
            />
            <Route
              path="/factorymanagement/factory/:factoryId/airwall"
              element={
                <RestrictRoute
                  element={
                    <CustomComponent
                      Component={AirWall}
                      toggleSide={toggleSide}
                      setHeaderText={setHeaderText}
                      closeSmallSidebar={closeSmallSidebar}
                    />
                  }
                  isAllow={authData.authority >= 3}
                  manageOf={authData.manageOf}
                />
              }
            />
            <Route
              path="/factorymanagement/factory/:factoryId/airwatch"
              element={
                <RestrictRoute
                  element={
                    <CustomComponent
                      Component={AirWatch}
                      toggleSide={toggleSide}
                      setHeaderText={setHeaderText}
                      closeSmallSidebar={closeSmallSidebar}
                    />
                  }
                  isAllow={authData.authority >= 3}
                  manageOf={authData.manageOf}
                />
              }
            />
            <Route
              path="/factorymanagement/factory/:factoryId/settings"
              element={
                <RestrictRoute
                  element={
                    <CustomComponent
                      Component={Settings}
                      toggleSide={toggleSide}
                      setHeaderText={setHeaderText}
                      closeSmallSidebar={closeSmallSidebar}
                    />
                  }
                  isAllow={authData.authority >= 3}
                  manageOf={authData.manageOf}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function RestrictRoute({ element, isAllow, manageOf }) {
  const { factoryId } = useParams();

  return isAllow && (manageOf == factoryId || manageOf < 0) ? (
    element
  ) : (
    <Navigate to="/factorymanagement" replace />
  );
}

function CustomComponent({
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
