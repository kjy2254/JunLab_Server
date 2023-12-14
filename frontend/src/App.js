import React, { useEffect, useState } from "react";
import "./App.css";
import { authcheck } from "./util";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./component/Dashboard";
import NotFound from "./component/NotFound";
import Factories from "./component/Factories";
import Details from "./component/Details";
import Login from "./component/Login";
// import Signup from "./component/Signup";
import Home from "./component/Home";
import Settings from "./component/Settings";
import RealtimeData from "./component/RealtimeData";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const authData = await authcheck();
  //     setIsLogin(authData.isLogin);
  //     setRole(authData.role);
  //     setName(authData.name);
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      //const authData = await authcheck();
      setIsLogin(true);
      setRole("Admin");
      setName("JunLab");
    };
    fetchData();
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/iitp/factoryManagement"
            element={
              isLogin ? (
                role == "Admin" ? (
                  <Factories isLogin={isLogin} role={role} name={name} />
                ) : role.includes("Factory") ? (
                  <Navigate
                    to={`/iitp/factoryManagement/factory/${role.split("_")[1]}`}
                  />
                ) : (
                  <Home isLogin={isLogin} role={role} name={name} />
                )
              ) : (
                <Login isLogin={isLogin} role={role} name={name} />
              )
            }
          />
          <Route
            path="/iitp/factoryManagement/factory"
            element={<Factories isLogin={isLogin} role={role} name={name} />}
          />
          <Route
            path="/iitp/factoryManagement/factory/:factoryId"
            element={<Dashboard isLogin={isLogin} role={role} name={name} />}
          />
          <Route
            path="/iitp/factoryManagement/factory/:factoryId/realtimedata"
            element={<RealtimeData isLogin={isLogin} role={role} name={name} />}
          />
          <Route
            path="/iitp/factoryManagement/factory/:factoryId/:data"
            element={<Details isLogin={isLogin} role={role} name={name} />}
          />
          <Route
            path="/iitp/factoryManagement/factory/:factoryId/settings"
            element={<Settings isLogin={isLogin} role={role} name={name} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
