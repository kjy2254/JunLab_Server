import React, { useEffect, useState } from 'react';
import './App.css';
import {authcheck} from "./util";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './component/Dashboard';
import NotFound from "./component/NotFound";
import Factories from "./component/Factories";
import Details from "./component/Details";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Home from "./component/Home";
import Console from "./component/Console";

function App() {
    const [isLogin, setIsLogin] = useState(false);
    const [role, setRole] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const authData = await authcheck();
            setIsLogin(authData.isLogin);
            setRole(authData.role);
            setName(authData.name);
        };
        fetchData();
    }, []);

    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/iitp/console" element={<Console />} />
                    <Route path="/iitp/factoryManagement" element={<Home isLogin={isLogin} role={role} name={name}/>} />
                    <Route path="/iitp/factoryManagement/login" element={<Login isLogin={isLogin} role={role} name={name}/>} />
                    <Route path="/iitp/factoryManagement/signup" element={<Signup isLogin={isLogin} role={role} name={name}/>} />
                    <Route path="/iitp/factoryManagement/factory" element={<Factories isLogin={isLogin} role={role} name={name}/>} />
                    <Route path="/iitp/factoryManagement/factory/:factoryId" element={<Dashboard isLogin={isLogin} role={role} name={name}/>} />
                    <Route path="/iitp/factoryManagement/factory/:factoryId/:data" element={<Details isLogin={isLogin} role={role} name={name}/>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
