import React, {useState} from "react";
import {Link, Navigate} from "react-router-dom";
import '../css/Login.css';

function Login(props) {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    const [su_id, setSu_id] = useState("");
    const [su_password, setSu_password] = useState("");
    const [su_password2, setSu_password2] = useState("");
    const [su_email, setSu_email] = useState("");
    const [activeTab, setActiveTab] = useState("sign-in");

    const updateId = (e) => setId(e.target.value);
    const updatePassword = (e) => setPassword(e.target.value);
    const updateSu_id = (e) => setSu_id(e.target.value);
    const updateSu_pw = (e) => setSu_password(e.target.value);
    const updateSu_pw2 = (e) => setSu_password2(e.target.value);
    const updateSu_email = (e) => setSu_email(e.target.value);

    const handleTabChange = (tab) => {
        setActiveTab(tab); // 클릭한 탭을 활성 탭으로 설정
    };

    function postLogin() {
        const userData = {
            userId: id,
            userPassword: password,
        };
        fetch("http://junlab.postech.ac.kr:880/login/login", { //auth 주소에서 받을 예정
            method: "post", // method :통신방법
            headers: {      // headers: API 응답에 대한 정보를 담음
                "content-type": "application/json",
            },
            body: JSON.stringify(userData), //userData라는 객체를 보냄
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.isLogin === true) {
                    window.location.href = `/iitp/factoryManagement/`;
                } else {
                    alert(json.isLogin)
                }
            });
    }
    function postSignUp() {
        const userData = {
            userId: id,
            userPassword: su_password,
            userPassword2: su_password2,
            userEmail: su_email,
        };
        fetch("http://junlab.postech.ac.kr:880/login/signup", { //signin 주소에서 받을 예정
            method: "post", // method :통신방법
            headers: {      // headers: API 응답에 대한 정보를 담음
                "content-type": "application/json",
            },
            body: JSON.stringify(userData), //userData라는 객체를 보냄
        })
            .then((res) => res.json())
            .then((json) => {
                if(json.isSuccess){
                    alert('회원가입이 완료되었습니다!');
                    window.location.href = `/iitp/factoryManagement/`;
                }
                else{
                    alert(json.isSuccess)
                }
            });
    }

    const handleOnKeyPress = e => {
        if (e.key === 'Enter') {
            postLogin(); // Enter 입력이 되면 클릭 이벤트 실행
        }
    };

    if (props.isLogin) {
        return <Navigate to="/iitp/factoryManagement/"/>;
    }

    return <div className="login-wrap">
        <Link to={`/iitp/factoryManagement`} className="back-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 15 15" fill="none">
                <path d="M7.03127 14.0626C5.64062 14.0626 4.28119 13.6502 3.12491 12.8776C1.96862 12.105 1.0674 11.0068 0.535223 9.72197C0.00304598 8.43722 -0.136196 7.02347 0.135108 5.65954C0.406412 4.2956 1.07607 3.04275 2.05942 2.05941C3.37803 0.740796 5.16646 0 7.03127 0C8.89608 0 10.6845 0.740796 12.0032 2.05941C13.3218 3.37803 14.0626 5.16646 14.0626 7.03127C14.0626 8.89608 13.3218 10.6845 12.0032 12.0032C11.3518 12.6581 10.5769 13.1774 9.72347 13.5309C8.87006 13.8844 7.955 14.0651 7.03127 14.0626ZM7.03127 0.937516C3.67118 0.937516 0.937523 3.67118 0.937523 7.03127C0.937523 10.3914 3.67118 13.1251 7.03127 13.1251C10.3914 13.1251 13.1251 10.3914 13.1251 7.03127C13.1251 3.67118 10.3914 0.937516 7.03127 0.937516Z" fill="#6A6F8C"/>
                <path d="M7.87171 10.644L4.25899 7.03127L7.87171 3.41858L8.53458 4.08146L5.58482 7.03127L8.53458 9.98107L7.87171 10.644Z" fill="#6A6F8C"/>
            </svg>
            Return home
        </Link>
        <div className="login-html">

            <input
                id="tab-1"
                type="radio"
                name="tab"
                className="sign-in"
                checked={activeTab === "sign-in"} // 활성 탭 상태에 따라 checked 설정
            />
            <label
                htmlFor="tab-1"
                className="tab"
                onClick={() => handleTabChange("sign-in")} // 클릭 시 활성 탭 변경
            >
                Sign In
            </label>
            <input
                id="tab-2"
                type="radio"
                name="tab"
                className="sign-up"
                checked={activeTab === "sign-up"} // 활성 탭 상태에 따라 checked 설정
            />
            <label
                htmlFor="tab-2"
                className="tab"
                onClick={() => handleTabChange("sign-up")} // 클릭 시 활성 탭 변경
            >
                Sign Up
            </label>


            <div className="login-form">
                <div className="sign-in-htm">
                    <div className="group">
                        <label htmlFor="user" className="label">Username</label>
                        <input id="user" type="text" className="input" value={id} onChange={updateId}/>
                    </div>
                    <div className="group">
                        <label htmlFor="pass" className="label">Password</label>
                        <input id="pass" type="password" className="input" datatype="password" value={password} onChange={updatePassword} onKeyDown={handleOnKeyPress}/>
                    </div>
                    <div className="group">
                        <button type="submit" className="button" onClick={postLogin}> Sign In</button>
                    </div>
                    <div className="hr"></div>
                    <div className="foot-lnk">
                        <a href="#forgot">Forgot Password?</a>
                    </div>
                </div>
                <div className="sign-up-htm">
                    <div className="group">
                        <label htmlFor="su_user" className="label">Username</label>
                        <input id="su_user" type="text" className="input" value={su_id} onChange={updateSu_id}/>
                    </div>
                    <div className="group">
                        <label htmlFor="su_pass" className="label">Password</label>
                        <input id="su_pass" type="password" className="input" datatype="password" value={su_password} onChange={updateSu_pw}/>
                    </div>
                    <div className="group">
                        <label htmlFor="su_pass2" className="label">Repeat Password</label>
                        <input id="su_pass2" type="password" className="input" datatype="password" value={su_password2} onChange={updateSu_pw2}/>
                    </div>
                    <div className="group">
                        <label htmlFor="su_email" className="label">Email Address</label>
                        <input id="su_email" type="text" className="input" value={su_email} onChange={updateSu_email}/>
                    </div>
                    <div className="group">
                        <button type="submit" className="button" onClick={postSignUp}> Sign Up</button>
                    </div>
                    <div className="hr"></div>
                    <div className="foot-lnk">
                        <label htmlFor="tab-1">Already Member?</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Login;
