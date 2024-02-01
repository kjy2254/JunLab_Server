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
import UserInit from "./component/UserInit";
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

  useEffect(() => {
    const isLightMode = localStorage.getItem("lightMode") === "true";
    document.body.classList.toggle("light-mode", isLightMode);
  }, []);

  const [authData, setAuthData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAuthData({
      isLogin: true,
      name: "JunLab",
      userId: 10,
      authority: 4,
      manageOf: -1,
    });
    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const authData = await authcheck();
  //     setAuthData({
  //       isLogin: authData.isLogin,
  //       name: authData.name,
  //       userId: authData.userId,
  //       authority: authData.authority,
  //       manageOf: authData.manageOf,
  //     });
  //     setIsLoading(false);
  //   };
  //   fetchData();
  // }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <Router>
      <div className="App layer1">
        <Routes>
          <Route path="/factorymanagement/login" />
          <Route path="/factorymanagement/signup" />
          <Route
            path="/factorymanagement/*"
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
                  manageOf={authData.manageOf}
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
                  manageOf={authData.manageOf}
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
            <Route
              path="/factorymanagement/user/init"
              element={
                <RestrictRoute
                  element={<UserInit />}
                  isAllow={authData.authority == 0}
                />
              }
            />
            <Route
              path="/factorymanagement/*"
              element={<HomeRedirector authData={authData} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function RestrictRoute({ element, isAllow, manageOf }) {
  const { factoryId } = useParams();

  // manageOf가 정의되지 않았거나, manageOf가 factoryId와 일치하거나, manageOf가 -1 이하인 경우
  const isAllowed =
    isAllow &&
    (manageOf === undefined || manageOf == factoryId || manageOf < 0);

  return isAllowed ? element : <Navigate to="/factorymanagement" replace />;
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

function HomeRedirector({ authData }) {
  const determineRedirectPath = () => {
    // 로그인이 안된 경우
    if (!authData.isLogin) {
      return "/factorymanagement/login";
    }
    // 권한이 0인 가입 대기자
    else if (authData.authority === 0) {
      return "/factorymanagement/user/init";
    }
    // 권한이 4인 관리자
    else if (authData.authority === 4) {
      return "/factorymanagement/admin/factory";
    }
    // 특정 공장의 관리자
    else if (authData.manageOf >= 0) {
      return `/factorymanagement/factory/${authData.manageOf}/dashboard`;
    }
    // 기본 리다이렉션 경로
    else {
      return "/factorymanagement/defaultPath";
    }
  };

  return <Navigate to={determineRedirectPath()} replace />;
}

export default App;
