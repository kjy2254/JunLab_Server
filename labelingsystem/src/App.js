import React, { useContext, useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { AppContext } from "./AppContext"; // AppContext와 AppProvider import
import Login from "./components/Authentication/Login";
import Header from "./components/Header";
import Labeling from "./components/KICT/Labeling";
import { LabelingProvider } from "./components/KICT/LabelingContext";
import { authcheck } from "./util";

function App() {
  const {
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
  } = useContext(AppContext); // Context에서 상태와 setter 가져오기

  const toggleSidebar = () => {
    setToggleSide(!toggleSide);
  };

  const toggleSmallSidebar = () => {
    setToggleSmallSide(!toggleSmallSide);
  };

  useEffect(() => {
    const handleResize = () => {
      setSmallView(window.innerWidth < 1250);
      setToggleSmallSide(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSmallView]);

  let debug = false;

  if (process.env.REACT_APP_ENV === "development") {
    console.log("Development mode: This code runs only during npm start");
    debug = true;
  }

  useEffect(() => {
    const fetchData = async () => {
      const authData = await authcheck();
      console.log(authData);
      setAuthData(authData);
      setLoading(false);
    };

    const fetchDebug = () => {
      setAuthData({
        isLogin: true,
        user: { id: "postech1", name: "준영", role: "user" },
      });
      setLoading(false);
    };

    if (debug) {
      fetchDebug();
    } else {
      fetchData();
    }
  }, [debug, setAuthData, setLoading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/KICT/login" />
          <Route
            path="/KICT/*"
            element={
              <Header
                authData={authData}
                smallView={smallView}
                toggleSmallSidebar={toggleSmallSidebar}
                toggleSidebar={toggleSidebar}
              />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route
            path="/KICT/login"
            element={
              <RestrictRoute
                element={<Login />}
                authData={authData}
                role={""}
              />
            }
          ></Route>
          <Route
            path="/KICT/labeling"
            element={
              <RestrictRoute
                element={
                  <LabelingProvider>
                    <Labeling
                      authData={authData}
                      show={toggleSide}
                      showInSmall={toggleSmallSide}
                      smallView={smallView}
                    />
                  </LabelingProvider>
                }
                authData={authData}
                role={["user", "admin"]}
              />
            }
          ></Route>
          <Route
            path="/KICT/*"
            element={<HomeRedirector authData={authData} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

function RestrictRoute({ element, authData, role }) {
  const navigate = useNavigate();

  const isAllowed = role.includes(authData.user.role);

  useEffect(() => {
    if (!isAllowed) {
      alert("권한이 없습니다.");
      navigate("/KICT", { replace: true });
    }
  }, [authData, isAllowed, navigate]);

  return isAllowed ? element : null;
}

function HomeRedirector({ authData }) {
  console.log(authData);
  const determineRedirectPath = () => {
    // 로그인이 안된 경우
    if (!authData.isLogin) {
      return "/KICT/login";
    }
    // 일반유저
    else if (authData.user.role === "user") {
      return `/KICT/labeling`;
    }
    // 관리자
    else if (authData.user.role === "admin") {
      return `/KICT/labeling`;
    }
    // 기본 리다이렉션 경로
    else {
      return "/KICT/defaultPath";
    }
  };

  return <Navigate to={determineRedirectPath()} replace />;
}

export default App;
