import '../css/HomeHeader.css';
import {Link} from "react-router-dom";
import React from "react";
import axios from "axios";
import profile_default from "../image/profile_default.png"

function HomeHeader(props) {
    console.log(props);

    const logout = () => {
        axios.get(`http://localhost:880/login/logout`)
            .then(window.location.href = `/iitp/factoryManagement/`);
    }

    return (
        <header className="home-header">
            <Link to={`/iitp/factoryManagement/`} className="home-logo">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 24.5348C0 28.6304 3.32014 31.9505 7.41573 31.9505H32L0 1.79499V24.5348Z" fill="url(#paint0_linear_139_725)"/>
                    <g opacity="0.983161" filter="url(#filter0_b_139_725)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 7.40946C0 3.31387 3.32014 2.56463e-09 7.41573 2.56463e-09H32C32 2.56463e-09 3.73034 25.7671 1.2263 28.2342C0 29.9414 1.43276 31.8648 1.43276 31.8648C1.43276 31.8648 0 31.1225 0 29.5198C0 28.7041 0 15.8841 0 7.40946Z" fill="url(#paint1_linear_139_725)"/>
                    </g>
                    <defs>
                        <filter id="filter0_b_139_725" x="-20.158" y="-20.158" width="72.3161" height="72.1808" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feGaussianBlur in="BackgroundImageFix" stdDeviation="10.079"/>
                            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_139_725"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_139_725" result="shape"/>
                        </filter>
                        <linearGradient id="paint0_linear_139_725" x1="7.98937" y1="10.3822" x2="37.8245" y2="18.6459" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#0043FF"/>
                            <stop offset="1" stopColor="#A370F1"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_139_725" x1="22.0813" y1="-15.8615" x2="-5.37804" y2="2.33241" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#4BF2E6"/>
                            <stop offset="1" stopColor="#0065FF"/>
                        </linearGradient>
                    </defs>
                </svg>
                <span>
                    JUNLAB
                </span>
            </Link>

            <div>
                {props.isLogin ?
                    <div className="user-dropdown">
                        <button className="profile-button">
                            <img src={profile_default} alt="프로필 사진"/>
                        </button>
                        <div className="dropdown-content">
                            <div className="dropdown-info">
                                <img src={profile_default} alt="프로필 사진"/>
                                <div className="profile-info">
                                    <div className="header-profile-name">
                                        {props.name}
                                    </div>
                                    <div className="header-profile-role">
                                        {props.role}
                                    </div>
                                </div>
                            </div>
                            <hr width={`80%`} />
                            <a href="#">Account</a>
                            <button onClick={logout}>Log Out</button>
                        </div>
                    </div>
                     :
                    <div className="login-area">
                        <button onClick={() => {window.location.href = '/iitp/factoryManagement/login'}}> Log in </button>
                    </div>}
            </div>
        </header>
    );
}

export default HomeHeader;