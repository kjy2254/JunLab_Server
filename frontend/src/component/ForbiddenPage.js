import { Link } from "react-router-dom";
import HomeHeader from "./HomeHeader";
import React from "react";

function ForbiddenPage(props) {
  return (
    <div className="home-container">
      <div className="home-content">
        <HomeHeader
          isLogin={props.isLogin}
          name={props.name}
          role={props.role}
        />
        <div className="milky"> 권한 없음 </div>
      </div>
    </div>
  );
}

export default ForbiddenPage;
