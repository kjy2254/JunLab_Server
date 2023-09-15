import HomeHeader from "./HomeHeader";
import '../css/Home.css';

import React from "react";

function Home(props) {

    return (
        <div className="home-container">
            <div className="home-content">
                <HomeHeader
                    isLogin={props.isLogin}
                    name={props.name}
                    role={props.role}
                />
                <div className="home-main">
                    {props.isLogin ?
                        <div>
                            {props.role === "Admin" ?
                                <button className="home-button" onClick={() => {window.location.href = '/iitp/factoryManagement/factory'}}> 공장 관리 </button>
                            :
                                <div>
                                    {props.role.includes('Factory') ?
                                        <button className="home-button" onClick={() => {window.location.href = `/iitp/factoryManagement/factory/${props.role.replace('Factory_', '')}`}}> 내 공장 </button>
                                        :
                                        <div className="milky"> 권한 등록 필요 </div>
                                    }
                                </div>
                            }
                        </div>
                        :
                        <div className={"milky"}>
                            Under development...
                        </div>}
                </div>
            </div>
        </div>
    );
}

export default Home;