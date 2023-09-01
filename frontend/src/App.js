import React from 'react';
import './App.css';
import Dashboard from './component/Dashboard'; // 대시보드 컴포넌트를 불러옴

function App() {
    return (
        <div className="App">
            <Dashboard /> {/* 대시보드 컴포넌트를 렌더링 */}
        </div>
    );
}

export default App;