import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Factory from "./component/Admins/Factory";
import Logs from "./component/Admins/Logs";
import SidebarAD from "./component/Admins/SidebarAD";
import Login from "./component/Authentication/Login";
import Signup from "./component/Authentication/Signup";
import AirWall from "./component/Factorys/AirWall";
import AirWatch from "./component/Factorys/AirWatch";
import Confirm from "./component/Factorys/Confirm";
import Dashboard from "./component/Factorys/Dashboard/Dashboard";
import Header from "./component/Header";
import Settings from "./component/Settings/Settings";
import Sidebar from "./component/Sidebar";
import UserInit from "./component/Users/MyPage";
import SidebarUser from "./component/Users/SidebarUser";
import Vital from "./component/Users/Vital";
import Labeling from "./component/labeling/Labeling";
import { authcheck } from "./util";

function App() {
  const [toggleSide, setToggleSide] = useState(true);
  const [toggleSmallSide, setToggleSmallSide] = useState(false);
  const [smallView, setSmallView] = useState(window.innerWidth < 800);
  const [headerText, setHeaderText] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

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
    if (darkMode) {
      // 다크모드에서의 색상
      document.documentElement.style.setProperty(
        "--layer1-bg-color",
        "rgb(48, 58, 69)"
      );
      document.documentElement.style.setProperty(
        "--layer2-bg-color",
        "rgb(25, 36, 48)"
      );
      document.documentElement.style.setProperty(
        "--layerSB-bg-color",
        "rgb(25, 36, 48)"
      );
      document.documentElement.style.setProperty(
        "--layerHD-bg-color",
        "rgb(25, 36, 48)"
      );
      document.documentElement.style.setProperty(
        "--layerModal-bg-color",
        "rgb(48, 58, 69)"
      );
      document.documentElement.style.setProperty(
        "--border-color",
        "rgba(255, 255, 255, 0.2)"
      );
      document.documentElement.style.setProperty("--select-color", "#303a45");
      document.documentElement.style.setProperty("--text-color", "white");
      document.documentElement.style.setProperty(
        "--spinner-color",
        "rgba(255, 255, 255, 0.3)"
      );
      document.documentElement.style.setProperty(
        "--spinner-top-color",
        "white"
      );
      document.documentElement.style.setProperty(
        "--graph-lable-color",
        "rgb(230, 233, 236)"
      );
      document.documentElement.style.setProperty("--drag-over-color", "#ccc");
      document.documentElement.style.setProperty("--dot-color", "white");
    }
  }, []);

  const [authData, setAuthData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const debug = 0;

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
      setIsLoading(false);
    };
    const fetchDebug = () => {
      setAuthData({
        isLogin: true,
        name: "JunLab",
        userId: 10,
        authority: 4,
        manageOf: -1,
      });
      setIsLoading(false);
    };
    const fetchDebug2 = () => {
      setAuthData({
        isLogin: true,
        name: "JunLab",
        userId: 41,
        authority: 1,
      });
      setIsLoading(false);
    };
    if (debug) {
      fetchDebug();
    } else {
      fetchData();
    }
  }, []);

  if (isLoading) {
    return <div id="spinner" />;
  }

  return (
    <Router>
      <div className="App layer1">
        <Routes>
          <Route path="/factorymanagement/login" />
          <Route path="/factorymanagement/signup" />
          <Route path="/labeling" />
          <Route
            path="/factorymanagement/*"
            element={
              <Header
                toggleSidebar={toggleSidebar}
                smallView={smallView}
                toggleSmallSidebar={toggleSmallSidebar}
                headerText={headerText}
                isLogin={authData.isLogin}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
        </Routes>
        <div className="content">
          <Routes>
            <Route
              path="/factorymanagement/factory/:factoryId/*"
              element={
                <Sidebar show={toggleSide} showInSmall={toggleSmallSide} />
              }
            />
            <Route
              path="/factorymanagement/admin/*"
              element={
                <SidebarAD
                  show={toggleSide}
                  showInSmall={toggleSmallSide}
                  headerText={"관리자"}
                />
              }
            />
            <Route
              path="/factorymanagement/user/:userId/*"
              element={
                <SidebarUser
                  show={toggleSide}
                  showInSmall={toggleSmallSide}
                  headerText={"사용자"}
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
              path="/labeling"
              element={
                <RestrictRoute
                  element={
                    <Labeling darkMode={darkMode} setDarkMode={setDarkMode} />
                  }
                  isAllow={true}
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
                  isAllow={authData.isLogin && authData.authority >= 4}
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
                  isAllow={true}
                  // isAllow={authData.isLogin && authData.authority >= 4}
                  manageOf={-1}
                  // manageOf={authData.manageOf}
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
                  isAllow={authData.isLogin && authData.authority >= 3}
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
                  isAllow={authData.isLogin && authData.authority >= 3}
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
                  isAllow={authData.isLogin && authData.authority >= 3}
                  manageOf={authData.manageOf}
                />
              }
            />
            <Route
              path="/factorymanagement/factory/:factoryId/confirm"
              element={
                <RestrictRoute
                  element={
                    <CustomComponent
                      Component={Confirm}
                      toggleSide={toggleSide}
                      setHeaderText={setHeaderText}
                      closeSmallSidebar={closeSmallSidebar}
                    />
                  }
                  isAllow={authData.isLogin && authData.authority >= 3}
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
                  isAllow={authData.isLogin && authData.authority >= 3}
                  manageOf={authData.manageOf}
                />
              }
            />
            <Route
              path="/factorymanagement/user/:userId/mypage"
              element={
                <RestrictRoute
                  element={
                    <CustomComponent
                      Component={UserInit}
                      toggleSide={toggleSide}
                      setHeaderText={setHeaderText}
                      closeSmallSidebar={closeSmallSidebar}
                    />
                  }
                  isAllow={authData.isLogin}
                  loginUserId={authData.userId}
                />
              }
            />
            <Route
              path="/factorymanagement/user/:userId/vital"
              element={
                <RestrictRoute
                  element={
                    <CustomComponent
                      Component={Vital}
                      toggleSide={toggleSide}
                      setHeaderText={setHeaderText}
                      closeSmallSidebar={closeSmallSidebar}
                    />
                  }
                  isAllow={authData.isLogin}
                  loginUserId={authData.userId}
                />
              }
            />
            <Route
              path="/factorymanagement/*"
              element={<HomeRedirector authData={authData} />}
            />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </Router>
  );
}

function RestrictRoute({ element, isAllow, manageOf, loginUserId }) {
  const { factoryId, userId } = useParams();
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);

  let isAllowed;

  if (manageOf) {
    isAllowed = isAllow && (manageOf == factoryId || manageOf < 0);
  } else if (loginUserId) {
    isAllowed = isAllow && userId == loginUserId;
    console.log(isAllow, isAllowed);
  } else {
    isAllowed = isAllow;
  }

  useEffect(() => {
    if (!isAllowed && redirect) {
      alert("권한이 없습니다.");
      navigate("/factorymanagement", { replace: true });
    }
  }, [redirect, isAllowed, navigate]);

  if (!isAllowed && !redirect) {
    setRedirect(true);
  }

  return isAllowed ? element : null;
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
    // 권한이 1이하인 가입 대기자
    else if (authData.authority <= 1) {
      return `/factorymanagement/user/${authData.userId}/mypage`;
    }
    // 권한이 2인 일반 사용자
    else if (authData.authority === 2) {
      return `/factorymanagement/user/${authData.userId}/vital`;
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
