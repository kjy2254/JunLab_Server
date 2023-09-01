import React, {useEffect, useState} from 'react';
import '../css/Sidebar.css';
import {Link, useParams} from "react-router-dom";

function Sidebar(props) {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const { data } = useParams();

    const toggleDetails = () => {
        setDetailsOpen(!detailsOpen);
    };

    useEffect(() => {
        let hoverTimeout;

        if (isHovering) {
            hoverTimeout = setTimeout(() => {
                setExpanded(true);
            }, 500);

            return () => {
                clearTimeout(hoverTimeout);
            };
        } else {
            setExpanded(false);
        }
    }, [isHovering]);

    return (
        <div className={`sidebar ${expanded ? 'expanded' : ''} ${isHovering ? 'expanding' : ''}`}
             onMouseEnter={() => setIsHovering(true)}
             onMouseLeave={() => setIsHovering(false)}>
            <Link to={`/iitp/factoryManagement/factory`} className="logo">
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
            <hr className="separator" />
            <div className="head-text">{props.header}</div>
            <div className="menu">
                <Link className="submenu-item" to={props.mode === 'admin' ? `` : `/iitp/factoryManagement/factory/${props.factoryId}`}>
                <div className={`menu-item ${props.selected === "1" ? "selected" : ""}`}>
                    <div className="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20" fill="none">
                            <g opacity={`${props.selected === "1" ? "0.95" : "0.6"}`}>
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.2324 0.409237L19.3558 6.86596C19.7229 7.15779 20 7.73667 20 8.21199V9.08815C20 9.64977 19.5529 10.1069 19.0031 10.1069H17.6098C17.4502 10.1069 17.3204 10.2396 17.3204 10.4024V16.4478C17.3204 17.855 16.2 19 14.8229 19H12.1113V14.3756C12.1113 12.9996 11.5043 11.8806 10 11.8806C8.49566 11.8806 7.88867 12.9996 7.88867 14.3756V19H5.17689C3.8 19 2.67956 17.855 2.67956 16.4478V10.4024C2.67956 10.2396 2.54978 10.1069 2.39022 10.1069H0.996889C0.447111 10.1069 0 9.65 0 9.08815V8.21199C0 7.73667 0.277111 7.15779 0.644222 6.86596L8.76756 0.409237C9.09956 0.145572 9.53689 0 10 0C10.4627 0 10.9007 0.145572 11.2324 0.409237Z" fill="white"/>
                            </g>
                        </svg>
                    </div>
                    <div className="menu-name">
                         {props.mode === 'admin' ? 'Factories' : 'Dashboard'}
                    </div>
                </div>
                </Link>
                {props.mode !== 'admin' && (
                <div className={`menu-item ${props.selected === "2" ? "selected" : ""}`} onClick={toggleDetails}>
                    <div className="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 21 21" fill="none">
                            <g clipPath="url(#clip0_152_998)" >
                                <path d="M18.6856 3.62688L15.1856 0.126882C15.1447 0.0863342 15.0963 0.0542544 15.043 0.0324824C14.9897 0.0107104 14.9326 -0.000325578 14.875 7.3125e-06H3.5C3.1519 7.3125e-06 2.81806 0.138288 2.57192 0.38443C2.32578 0.630571 2.1875 0.964411 2.1875 1.31251V19.6875C2.1875 20.0356 2.32578 20.3694 2.57192 20.6156C2.81806 20.8617 3.1519 21 3.5 21H17.5C17.8481 21 18.1819 20.8617 18.4281 20.6156C18.6742 20.3694 18.8125 20.0356 18.8125 19.6875V3.93751C18.8128 3.87993 18.8018 3.82285 18.78 3.76955C18.7583 3.71624 18.7262 3.66776 18.6856 3.62688ZM15.3125 1.49188L17.3206 3.50001H15.75C15.634 3.50001 15.5227 3.45391 15.4406 3.37187C15.3586 3.28982 15.3125 3.17854 15.3125 3.06251V1.49188ZM17.9375 19.6875C17.9375 19.8035 17.8914 19.9148 17.8094 19.9969C17.7273 20.0789 17.616 20.125 17.5 20.125H3.5C3.38397 20.125 3.27269 20.0789 3.19064 19.9969C3.10859 19.9148 3.0625 19.8035 3.0625 19.6875V1.31251C3.0625 1.19648 3.10859 1.0852 3.19064 1.00315C3.27269 0.921101 3.38397 0.875007 3.5 0.875007H14.4375V3.06251C14.4375 3.4106 14.5758 3.74444 14.8219 3.99059C15.0681 4.23673 15.4019 4.37501 15.75 4.37501H17.9375V19.6875Z" fill="#979797"/>
                                <path d="M15.75 7.875H7V8.75H15.75V7.875Z" fill="#979797"/>
                                <path d="M15.75 10.5H5.25V11.375H15.75V10.5Z" fill="#979797"/>
                                <path d="M15.75 13.125H5.25V14H15.75V13.125Z" fill="#979797"/>
                                <path d="M12.25 15.75H5.25V16.625H12.25V15.75Z" fill="#979797"/>
                                <path d="M15.75 15.75H14.875V16.625H15.75V15.75Z" fill="#979797"/>
                                <path d="M14 15.75H13.125V16.625H14V15.75Z" fill="#979797"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_152_998">
                                    <rect width="21" height="21" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className="menu-name">
                        Details
                    </div>
                    {detailsOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
                </div> )}
                {detailsOpen && (
                    <ul className="submenu">
                        <Link className={"submenu-item" + (data === "TVOC" ? "-selected" : "")} to={`/iitp/factoryManagement/factory/${props.factoryId}/TVOC`}><li> TVOC </li></Link>
                        <Link className={"submenu-item" + (data === "CO2" ? "-selected" : "")} to={`/iitp/factoryManagement/factory/${props.factoryId}/CO2`}><li> CO2 </li></Link>
                        <Link className={"submenu-item" + (data === "Temperature" ? "-selected" : "")} to={`/iitp/factoryManagement/factory/${props.factoryId}/Temperature`}><li> Temperature </li></Link>
                        <Link className={"submenu-item" + (data === "FineDust" ? "-selected" : "")} to={`/iitp/factoryManagement/factory/${props.factoryId}/FineDust`}><li> Fine Dust </li></Link>
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
