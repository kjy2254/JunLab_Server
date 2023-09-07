import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from './component/Dashboard';
import NotFound from "./component/NotFound";
import Factories from "./component/Factories"; // 대시보드 컴포넌트를 불러옴
export default App;


function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/iitp/factoryManagement/factory/:factoryId" element={<Dashboard/>}/>
                    <Route path="/iitp/factoryManagement/factory" element={<Factories/>}/>
                    <Route element={<NotFound/>}/>
                </Routes>
            </Router>
        </div>
        // <Dashboard/>
    );
}
