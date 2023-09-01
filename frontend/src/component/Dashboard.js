import Sidebar from './Sidebar';
import '../css/Dashboard.css';
import Chart from "./Chart";
import React from "react";
import WorkerSummary from "./WorkerSummary";

function Dashboard() {

    return (
        <div className="dashboard-container">
            <Sidebar/>
            <div className="dashboard-content">
                <div className="main-section">
                    <header className="dashboard-header">
                        {/*<h1>대시보드</h1>*/}
                    </header>
                    <div className="path-section">
                        <div className="path">
                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0V8H0L8 0Z" fill="#1F263E"/>
                            </svg>
                            &nbsp;Factory
                        </div>
                        <div className="path-selected">
                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0V8H0L8 0Z"
                                      fill="url(#paint0_linear_104_907)"/>
                                <defs>
                                    <linearGradient id="paint0_linear_104_907" x1="13.1265" y1="6.66481" x2="3.15937"
                                                    y2="12.9836" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#0043FF"/>
                                        <stop offset="1" stop-color="#A370F1"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            &nbsp;포항공과대학교
                        </div>
                    </div>
                    <div className="chart-section">
                        <Chart
                            chartIcon={<svg width="30" height="30" viewBox="0 0 22 22" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M21.9066 11.0543C21.9066 17.0993 17.0062 21.9996 10.9613 21.9996C4.91632 21.9996 0.0160065 17.0993 0.0160065 11.0543C0.0160065 5.00938 4.91632 0.10907 10.9613 0.10907C17.0062 0.10907 21.9066 5.00938 21.9066 11.0543Z"
                                      fill="#FFC246"/>
                                <path
                                    d="M14.1361 13.7155C14.7263 15.8766 13.1437 18 11 18C8.84719 18 7.27521 15.8648 7.86417 13.7155L6.49495 10.8568C5.1553 9.85105 5.18577 7.78442 6.55741 6.82267C6.9593 4.62725 8.80254 3.00001 11 3.00001C11.8834 3.00124 12.7472 3.26996 13.4845 3.77297C14.2218 4.27598 14.8004 4.99124 15.1487 5.83036C15.1615 5.86048 15.1684 5.89291 15.169 5.92578C15.1696 5.95866 15.1639 5.99133 15.1522 6.02193C15.1406 6.05253 15.1232 6.08044 15.101 6.10406C15.0789 6.12768 15.0525 6.14655 15.0233 6.15958C14.9941 6.17261 14.9627 6.17955 14.9308 6.17998C14.899 6.18042 14.8674 6.17435 14.8379 6.16213C14.8084 6.14991 14.7815 6.13178 14.7587 6.10877C14.736 6.08577 14.7179 6.05834 14.7055 6.02808C14.3779 5.23555 13.8205 4.56754 13.1102 4.11608C12.3999 3.66461 11.5717 3.45192 10.7396 3.5073C9.90745 3.56268 9.11242 3.88341 8.46403 4.42529C7.81563 4.96718 7.34578 5.70356 7.11922 6.53296C7.36791 6.4443 7.62916 6.39908 7.89223 6.39918C7.95625 6.39918 8.01765 6.42546 8.06292 6.47225C8.10818 6.51904 8.13361 6.58249 8.13361 6.64866C8.13361 6.71483 8.10818 6.77828 8.06292 6.82507C8.01765 6.87186 7.95625 6.89814 7.89223 6.89814C7.44469 6.89812 7.01149 7.06132 6.66892 7.359C6.32636 7.65667 6.0964 8.06972 6.01955 8.52542C5.94269 8.98112 6.02387 9.45023 6.24879 9.85014C6.4737 10.25 6.82793 10.5551 7.24909 10.7116C7.67024 10.8681 8.13132 10.866 8.55111 10.7056C8.97091 10.5453 9.3225 10.237 9.54397 9.83502C9.76544 9.43306 9.84259 8.96322 9.76182 8.50825C9.68106 8.05327 9.44756 7.64234 9.10245 7.34783C9.07802 7.32694 9.05782 7.30129 9.04298 7.27233C9.02815 7.24337 9.01897 7.21168 9.01599 7.17906C9.01301 7.14644 9.01627 7.11353 9.02559 7.08221C9.03491 7.05089 9.05011 7.02178 9.07032 6.99653C9.09052 6.97128 9.11535 6.9504 9.14336 6.93506C9.17138 6.91973 9.20205 6.91025 9.23361 6.90717C9.26517 6.90408 9.29701 6.90745 9.32731 6.91709C9.35761 6.92672 9.38578 6.94243 9.41021 6.96332C9.68131 7.19417 9.89955 7.48424 10.0492 7.81268C10.1989 8.14111 10.2763 8.49975 10.2759 8.8628C10.2759 10.5081 8.73706 11.6963 7.20883 11.2226L8.10344 13.0902C9.08917 11.12 11.5992 10.6578 13.179 12.1279C13.2035 12.1495 13.2234 12.176 13.2378 12.2058C13.2521 12.2355 13.2606 12.2679 13.2627 12.3011C13.2647 12.3343 13.2604 12.3676 13.2498 12.399C13.2393 12.4304 13.2227 12.4593 13.2012 12.484C13.1797 12.5087 13.1536 12.5288 13.1245 12.5429C13.0954 12.5571 13.0638 12.565 13.0317 12.5664C12.9995 12.5678 12.9675 12.5625 12.9373 12.5508C12.9072 12.5392 12.8796 12.5215 12.8562 12.4987C12.5214 12.1875 12.1184 11.9652 11.6819 11.8509C11.2454 11.7366 10.7886 11.7337 10.3508 11.8426C9.91307 11.9515 9.50749 12.1687 9.16908 12.4757C8.83067 12.7827 8.56959 13.1702 8.40836 13.6047C8.24713 14.0392 8.19058 14.5077 8.2436 14.9699C8.29662 15.432 8.45761 15.8739 8.71268 16.2574C8.96776 16.6408 9.30927 16.9545 9.70775 17.1711C10.1062 17.3878 10.5497 17.501 11 17.5011C12.8692 17.5011 14.2125 15.6165 13.6476 13.7673C13.6309 13.7126 13.633 13.6537 13.6534 13.6004C13.66 13.583 14.2502 12.353 14.2583 12.3356C14.2867 12.2763 14.3368 12.2311 14.3974 12.2099C14.4581 12.1887 14.5244 12.1933 14.5818 12.2227C14.6391 12.252 14.6829 12.3038 14.7034 12.3664C14.7238 12.4291 14.7194 12.4977 14.691 12.557L14.1361 13.7155ZM11.7241 8.8628C11.7241 10.7423 13.689 11.927 15.2688 11.0146C15.3248 10.9823 15.3661 10.9283 15.3836 10.8645C15.4011 10.8007 15.3934 10.7324 15.3622 10.6745C15.3309 10.6166 15.2787 10.5739 15.217 10.5558C15.1553 10.5377 15.0892 10.5457 15.0331 10.578C13.7759 11.3055 12.2069 10.3634 12.2069 8.8628C12.2074 8.34191 12.4079 7.84253 12.7643 7.47421C13.1206 7.10589 13.6038 6.89872 14.1078 6.89814C15.5506 6.89814 16.4642 8.50199 15.7775 9.8024C15.7468 9.8605 15.7398 9.92881 15.7579 9.99229C15.7759 10.0558 15.8177 10.1092 15.8739 10.1409C15.9301 10.1726 15.9962 10.1799 16.0576 10.1612C16.119 10.1425 16.1708 10.0994 16.2014 10.0413C17.0628 8.40968 15.9181 6.39918 14.1078 6.39918C13.4758 6.39992 12.8699 6.65972 12.4231 7.12158C11.9762 7.58343 11.7249 8.20963 11.7241 8.8628ZM7.31896 14.632C7.31896 14.6982 7.29353 14.7617 7.24826 14.8084C7.20299 14.8552 7.1416 14.8815 7.07758 14.8815H6.53448V16.1601C6.53448 16.4248 6.43275 16.6786 6.25168 16.8657C6.07061 17.0529 5.82503 17.158 5.56896 17.158H4.96551C4.70944 17.158 4.46386 17.0529 4.28279 16.8657C4.10172 16.6786 3.99999 16.4248 3.99999 16.1601V13.104C3.99999 12.8393 4.10172 12.5855 4.28279 12.3983C4.46386 12.2112 4.70944 12.106 4.96551 12.106H5.56896C5.82503 12.106 6.07061 12.2112 6.25168 12.3983C6.43275 12.5855 6.53448 12.8393 6.53448 13.104V14.3825H7.07758C7.1416 14.3825 7.20299 14.4088 7.24826 14.4556C7.29353 14.5024 7.31896 14.5659 7.31896 14.632ZM6.05172 13.104C6.05172 12.9716 6.00086 12.8447 5.91032 12.7511C5.81979 12.6576 5.69699 12.605 5.56896 12.605H4.96551C4.83748 12.605 4.71468 12.6576 4.62415 12.7511C4.53361 12.8447 4.48275 12.9716 4.48275 13.104V16.1601C4.48275 16.2924 4.53361 16.4193 4.62415 16.5129C4.71468 16.6065 4.83748 16.6591 4.96551 16.6591H5.56896C5.69699 16.6591 5.81979 16.6065 5.91032 16.5129C6.00086 16.4193 6.05172 16.2924 6.05172 16.1601V13.104ZM17.0345 12.106H16.431C16.175 12.106 15.9294 12.2112 15.7483 12.3983C15.5672 12.5855 15.4655 12.8393 15.4655 13.104V14.3825H14.9224C14.8584 14.3825 14.797 14.4088 14.7517 14.4556C14.7065 14.5024 14.681 14.5659 14.681 14.632C14.681 14.6982 14.7065 14.7617 14.7517 14.8084C14.797 14.8552 14.8584 14.8815 14.9224 14.8815H15.7069C15.7709 14.8815 15.8323 14.8552 15.8776 14.8084C15.9228 14.7617 15.9483 14.6982 15.9483 14.632V13.104C15.9483 12.9716 15.9991 12.8447 16.0897 12.7511C16.1802 12.6576 16.303 12.605 16.431 12.605H17.0345C17.1625 12.605 17.2853 12.6576 17.3758 12.7511C17.4664 12.8447 17.5172 12.9716 17.5172 13.104V16.1601C17.5172 16.2924 17.4664 16.4193 17.3758 16.5129C17.2853 16.6065 17.1625 16.6591 17.0345 16.6591H16.431C16.303 16.6591 16.1802 16.6065 16.0897 16.5129C15.9991 16.4193 15.9483 16.2924 15.9483 16.1601V15.6714C15.9483 15.6053 15.9228 15.5418 15.8776 15.495C15.8323 15.4482 15.7709 15.4219 15.7069 15.4219C15.6429 15.4219 15.5815 15.4482 15.5362 15.495C15.4909 15.5418 15.4655 15.6053 15.4655 15.6714V16.1601C15.4655 16.4248 15.5672 16.6786 15.7483 16.8657C15.9294 17.0529 16.175 17.158 16.431 17.158H17.0345C17.2905 17.158 17.5361 17.0529 17.7172 16.8657C17.8983 16.6786 18 16.4248 18 16.1601V13.104C18 12.8393 17.8983 12.5855 17.7172 12.3983C17.5361 12.2112 17.2905 12.106 17.0345 12.106ZM11.2414 13.3846C11.2414 13.3185 11.2159 13.255 11.1707 13.2082C11.1254 13.1614 11.064 13.1351 11 13.1351C10.936 13.1351 10.8746 13.1614 10.8293 13.2082C10.784 13.255 10.7586 13.3185 10.7586 13.3846V13.6965C10.7586 13.7626 10.784 13.8261 10.8293 13.8729C10.8746 13.9197 10.936 13.946 11 13.946C11.064 13.946 11.1254 13.9197 11.1707 13.8729C11.2159 13.8261 11.2414 13.7626 11.2414 13.6965V13.3846ZM11 15.3181C10.936 15.3181 10.8746 15.3444 10.8293 15.3912C10.784 15.438 10.7586 15.5014 10.7586 15.5676V15.8794C10.7586 15.9456 10.784 16.0091 10.8293 16.0558C10.8746 16.1026 10.936 16.1289 11 16.1289C11.064 16.1289 11.1254 16.1026 11.1707 16.0558C11.2159 16.0091 11.2414 15.9456 11.2414 15.8794V15.5676C11.2414 15.5014 11.2159 15.438 11.1707 15.3912C11.1254 15.3444 11.064 15.3181 11 15.3181ZM11.9052 14.3825C11.8411 14.3825 11.7798 14.4088 11.7345 14.4556C11.6892 14.5024 11.6638 14.5659 11.6638 14.632C11.6638 14.6982 11.6892 14.7617 11.7345 14.8084C11.7798 14.8552 11.8411 14.8815 11.9052 14.8815H12.2069C12.2709 14.8815 12.3323 14.8552 12.3776 14.8084C12.4228 14.7617 12.4483 14.6982 12.4483 14.632C12.4483 14.5659 12.4228 14.5024 12.3776 14.4556C12.3323 14.4088 12.2709 14.3825 12.2069 14.3825H11.9052ZM9.7931 14.3825C9.72908 14.3825 9.66768 14.4088 9.62242 14.4556C9.57715 14.5024 9.55172 14.5659 9.55172 14.632C9.55172 14.6982 9.57715 14.7617 9.62242 14.8084C9.66768 14.8552 9.72908 14.8815 9.7931 14.8815H10.0948C10.1588 14.8815 10.2202 14.8552 10.2655 14.8084C10.3108 14.7617 10.3362 14.6982 10.3362 14.632C10.3362 14.5659 10.3108 14.5024 10.2655 14.4556C10.2202 14.4088 10.1588 14.3825 10.0948 14.3825H9.7931Z"
                                    fill="white"/>
                            </svg>}
                            chartName="휘발성유기화합물"
                            chartSubname="TVOC"
                            chartValue="377"
                            chartUnit="ppb"
                            chartDiff="-4.66"
                            data={[
                            { name: "Point 1", y: 40000 },
                            { name: "Point 2", y: 50000 },
                            { name: "Point 3", y: 60000 },
                            { name: "Point 4", y: 70000 },
                            { name: "Point 5", y: 80000 },
                            { name: "Point 6", y: 100000 },
                            { name: "Point 7", y: 120000 },
                            { name: "Point 8", y: 150000 }
                                ]}
                            chartColor="#FFC246"
                        />
                        <Chart
                            chartIcon={<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 22 22" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.9066 11.0543C21.9066 17.0993 17.0063 21.9996 10.9613 21.9996C4.91632 21.9996 0.0160141 17.0993 0.0160141 11.0543C0.0160141 5.00938 4.91632 0.10907 10.9613 0.10907C17.0063 0.10907 21.9066 5.00938 21.9066 11.0543Z" fill="#5470DE"/>
                                <path d="M7.53797 15.6428H10.2563C10.354 15.6428 10.4507 15.662 10.5409 15.6994C10.6311 15.7367 10.7131 15.7915 10.7822 15.8606C10.8512 15.9296 10.906 16.0116 10.9434 16.1018C10.9808 16.1921 11 16.2888 11 16.3865V16.4712C11 16.6685 10.9216 16.8576 10.7822 16.9971C10.6427 17.1366 10.4535 17.2149 10.2563 17.2149H7.53797C7.34073 17.2149 7.15157 17.1366 7.0121 16.9971C6.87263 16.8576 6.79428 16.6685 6.79428 16.4712V16.3864C6.79428 16.2888 6.81351 16.1921 6.85089 16.1018C6.88826 16.0116 6.94304 15.9296 7.0121 15.8606C7.08116 15.7915 7.16314 15.7367 7.25337 15.6994C7.3436 15.662 7.44031 15.6428 7.53797 15.6428Z" fill="white"/>
                                <path d="M11.2987 8.32849C11.1161 8.3287 10.941 8.40133 10.8119 8.53046C10.6827 8.65959 10.6101 8.83466 10.6099 9.01727V9.78623C10.6099 9.87668 10.6277 9.96624 10.6623 10.0498C10.697 10.1334 10.7477 10.2093 10.8116 10.2733C10.8756 10.3372 10.9515 10.388 11.0351 10.4226C11.1187 10.4572 11.2082 10.475 11.2987 10.475C11.3891 10.475 11.4787 10.4572 11.5623 10.4226C11.6458 10.388 11.7218 10.3372 11.7857 10.2733C11.8497 10.2093 11.9004 10.1334 11.935 10.0498C11.9696 9.96624 11.9874 9.87668 11.9874 9.78623V9.01727C11.9872 8.83465 11.9146 8.65958 11.7855 8.53045C11.6564 8.40133 11.4813 8.3287 11.2987 8.32849Z" fill="white"/>
                                <path d="M16.6928 11.5887C16.6671 11.5887 16.642 11.5816 16.62 11.5683C16.598 11.555 16.5801 11.5359 16.5682 11.5132C16.5562 11.4905 16.5507 11.4649 16.5522 11.4393C16.5537 11.4136 16.5621 11.3889 16.5767 11.3677C16.9581 10.8002 17.1613 10.1317 17.1603 9.44796C17.1603 8.99517 17.0711 8.54681 16.8978 8.12849C16.7245 7.71016 16.4705 7.33006 16.1504 7.00989C15.8302 6.68972 15.4501 6.43575 15.0318 6.26247C14.6135 6.08919 14.1651 6.00001 13.7123 6.00001H7.44794C6.53349 6.00002 5.65649 6.36329 5.00988 7.0099C4.36326 7.65652 4 8.53352 4 9.44797C4 10.3624 4.36327 11.2394 5.00989 11.8861C5.6565 12.5327 6.53351 12.8959 7.44796 12.8959H9.92835C9.99672 12.8961 10.0629 12.9202 10.1153 12.9641C10.1678 13.0079 10.2032 13.0687 10.2154 13.136L10.2166 13.142C10.2244 13.1841 10.2228 13.2274 10.2119 13.2687C10.2011 13.3101 10.1812 13.3486 10.1538 13.3814C10.1264 13.4143 10.0921 13.4407 10.0533 13.4587C10.0145 13.4768 9.97223 13.4861 9.92945 13.486H9.52089C9.4064 13.4857 9.293 13.5081 9.18716 13.5517C9.08132 13.5954 8.98513 13.6594 8.90409 13.7403C8.82306 13.8212 8.75877 13.9172 8.7149 14.023C8.67103 14.1287 8.64845 14.2421 8.64845 14.3566C8.64845 14.4711 8.67103 14.5844 8.7149 14.6902C8.75877 14.7959 8.82306 14.892 8.90409 14.9729C8.98513 15.0537 9.08132 15.1178 9.18716 15.1615C9.293 15.2051 9.4064 15.2275 9.52089 15.2272H11.6394C11.7537 15.2272 11.8669 15.2047 11.9726 15.1609C12.0782 15.1172 12.1742 15.0531 12.255 14.9722C12.3359 14.8914 12.4 14.7954 12.4437 14.6898C12.4875 14.5841 12.51 14.4709 12.51 14.3566V14.3517C12.5101 14.3123 12.5257 14.2746 12.5535 14.2467C12.5814 14.2189 12.6191 14.2032 12.6584 14.2031H16.6928C17.0395 14.2031 17.372 14.0654 17.6171 13.8203C17.8623 13.5751 18 13.2426 18 12.8959C18 12.7243 17.9662 12.5543 17.9005 12.3957C17.8348 12.2371 17.7385 12.093 17.6172 11.9716C17.4958 11.8502 17.3517 11.7539 17.1931 11.6882C17.0345 11.6225 16.8645 11.5887 16.6928 11.5887ZM9.29988 10.7411C9.17417 10.8917 9.01691 11.0127 8.83923 11.0957C8.66156 11.1787 8.4678 11.2217 8.27169 11.2215H8.0825C7.72706 11.2211 7.38629 11.0797 7.13495 10.8284C6.88361 10.577 6.74224 10.2362 6.74184 9.8808V8.92263C6.74224 8.5672 6.88362 8.22643 7.13496 7.9751C7.3863 7.72377 7.72706 7.5824 8.0825 7.58201H8.27169C8.44783 7.58152 8.62231 7.61598 8.78504 7.68338C8.94776 7.75079 9.0955 7.84981 9.21969 7.97471C9.25447 8.00934 9.28208 8.0505 9.30094 8.09582C9.31979 8.14114 9.32952 8.18973 9.32957 8.23881C9.32962 8.2879 9.31999 8.33651 9.30123 8.38187C9.28246 8.42722 9.25494 8.46843 9.22023 8.50314C9.18552 8.53784 9.1443 8.56536 9.09894 8.58411C9.05358 8.60287 9.00496 8.61249 8.95588 8.61243C8.90679 8.61237 8.8582 8.60263 8.81289 8.58376C8.76758 8.5649 8.72643 8.53728 8.6918 8.50249C8.63676 8.44714 8.57129 8.40326 8.49918 8.37339C8.42707 8.34353 8.34975 8.32826 8.27169 8.32848H8.0825C7.92497 8.32866 7.77395 8.39131 7.66255 8.5027C7.55116 8.61408 7.4885 8.76511 7.48831 8.92263V9.8808C7.48849 10.0383 7.55115 10.1894 7.66254 10.3008C7.77393 10.4122 7.92497 10.4748 8.0825 10.475H8.27169C8.35865 10.4751 8.44456 10.456 8.52334 10.4192C8.60211 10.3824 8.67183 10.3287 8.72756 10.2619C8.7912 10.1863 8.88222 10.1391 8.98066 10.1305C9.07911 10.1219 9.17693 10.1527 9.2527 10.2161C9.32846 10.2796 9.37597 10.3705 9.38482 10.4689C9.39366 10.5673 9.36312 10.6652 9.29988 10.7411ZM12.7339 9.78622C12.7339 10.1669 12.5827 10.5319 12.3135 10.8011C12.0444 11.0702 11.6793 11.2215 11.2987 11.2215C10.918 11.2215 10.553 11.0702 10.2838 10.8011C10.0146 10.5319 9.86343 10.1669 9.86343 9.78622V9.01726C9.86343 8.63661 10.0146 8.27155 10.2838 8.00239C10.553 7.73323 10.918 7.58202 11.2987 7.58202C11.6793 7.58202 12.0444 7.73323 12.3135 8.00239C12.5827 8.27155 12.7339 8.63661 12.7339 9.01726V9.78622ZM14.8476 11.8609C14.9466 11.8609 15.0415 11.9002 15.1115 11.9702C15.1815 12.0402 15.2208 12.1351 15.2208 12.2341C15.2208 12.3331 15.1815 12.428 15.1115 12.498C15.0415 12.568 14.9466 12.6073 14.8476 12.6073H13.6197C13.549 12.6073 13.4799 12.5873 13.4202 12.5495C13.3605 12.5118 13.3127 12.4579 13.2825 12.3941C13.2522 12.3303 13.2406 12.2592 13.2491 12.1891C13.2577 12.119 13.2859 12.0528 13.3305 11.998L14.3868 10.7044C14.3917 10.6985 14.3967 10.6927 14.4019 10.6871C14.4379 10.6482 14.4617 10.5996 14.4706 10.5474C14.4794 10.4951 14.4728 10.4414 14.4516 10.3929C14.4303 10.3443 14.3954 10.303 14.3511 10.274C14.3067 10.245 14.2549 10.2295 14.2019 10.2295H14.1251C14.0528 10.2296 13.9836 10.2584 13.9325 10.3094C13.8814 10.3605 13.8527 10.4298 13.8526 10.502V10.5842C13.8526 10.6832 13.8132 10.7782 13.7433 10.8482C13.6733 10.9182 13.5783 10.9575 13.4793 10.9575C13.3803 10.9575 13.2854 10.9182 13.2154 10.8482C13.1454 10.7782 13.1061 10.6832 13.1061 10.5842V10.502C13.1064 10.2319 13.2139 9.97287 13.4049 9.78185C13.5959 9.59083 13.8549 9.48338 14.1251 9.48308H14.2019C14.399 9.48308 14.5918 9.54023 14.757 9.64759C14.9223 9.75495 15.0528 9.90792 15.1329 10.088C15.213 10.268 15.2391 10.4674 15.2082 10.6621C15.1772 10.8567 15.0905 11.0381 14.9586 11.1845L14.4063 11.8609H14.8476Z" fill="white"/>
                            </svg>}
                            chartName="이산화탄소"
                            chartSubname="CO2"
                            chartValue="428"
                            chartUnit="ppb"
                            chartDiff="+0.45"
                            data={[
                                { name: "Point 1", y: 40000 },
                                { name: "Point 2", y: 50000 },
                                { name: "Point 3", y: 60000 },
                                { name: "Point 4", y: 70000 },
                                { name: "Point 5", y: 80000 },
                                { name: "Point 6", y: 100000 },
                                { name: "Point 7", y: 120000 },
                                { name: "Point 8", y: 150000 }
                            ]}
                            chartColor="#5470DE"
                        />
                        <Chart
                            chartIcon={<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 22 22" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8905 10.9453C21.8905 16.9902 16.9902 21.8905 10.9453 21.8905C4.90031 21.8905 0 16.9902 0 10.9453C0 4.90031 4.90031 0 10.9453 0C16.9902 0 21.8905 4.90031 21.8905 10.9453Z" fill="#07BEAA"/>
                                <path d="M13.9731 11.5178C13.9381 11.4936 13.9094 11.4614 13.8894 11.4239C13.8695 11.3864 13.8588 11.3446 13.8582 11.3021V5.98947C13.8582 5.46183 13.6484 4.9558 13.2749 4.5827C12.9013 4.2096 12.3947 4 11.8664 4C11.3382 4 10.8316 4.2096 10.458 4.5827C10.0845 4.9558 9.87465 5.46183 9.87465 5.98947V11.3021C9.87526 11.342 9.86638 11.3815 9.84872 11.4173C9.83107 11.4531 9.80515 11.4842 9.77311 11.5081C9.16217 11.9489 8.70561 12.5705 8.46814 13.2849C8.23066 13.9994 8.22431 14.7703 8.44998 15.4885C8.67566 16.2068 9.12191 16.8358 9.7255 17.2866C10.3291 17.7374 11.0594 17.9869 11.8129 18H11.8664C12.3375 17.9999 12.8039 17.9072 13.239 17.7271C13.6742 17.5471 14.0696 17.2831 14.4026 16.9504C14.7356 16.6177 14.9998 16.2227 15.18 15.788C15.3602 15.3534 15.4529 14.8875 15.4529 14.417C15.4518 13.8516 15.3172 13.2944 15.0601 12.7907C14.803 12.2869 14.4306 11.8509 13.9731 11.5178ZM13.8903 16.4693C13.6072 16.7484 13.2693 16.9659 12.898 17.1083C12.5266 17.2507 12.1298 17.3149 11.7325 17.2967C11.3351 17.2786 10.9458 17.1785 10.589 17.0029C10.2322 16.8272 9.91571 16.5797 9.65929 16.276C9.40288 15.9722 9.21214 15.6188 9.09905 15.2379C8.98597 14.857 8.953 14.4568 9.0022 14.0626C9.0514 13.6683 9.18172 13.2885 9.38495 12.947C9.58819 12.6054 9.85996 12.3096 10.1832 12.078C10.3055 11.989 10.405 11.8722 10.4734 11.7373C10.5418 11.6025 10.5773 11.4533 10.5769 11.3021V5.98947C10.5769 5.82042 10.6102 5.65302 10.675 5.49684C10.7397 5.34066 10.8347 5.19874 10.9543 5.07921C11.074 4.95967 11.2161 4.86485 11.3725 4.80015C11.5288 4.73546 11.6964 4.70217 11.8657 4.70217C12.0349 4.70217 12.2025 4.73546 12.3589 4.80015C12.5152 4.86485 12.6573 4.95967 12.777 5.07921C12.8967 5.19874 12.9916 5.34066 13.0564 5.49684C13.1211 5.65302 13.1545 5.82042 13.1545 5.98947V11.3021C13.1556 11.4553 13.1927 11.6061 13.263 11.7423C13.3333 11.8784 13.4348 11.9961 13.5591 12.0858C13.927 12.3537 14.2264 12.7044 14.4332 13.1095C14.6399 13.5146 14.7482 13.9627 14.7491 14.4174C14.7504 14.7994 14.6751 15.1777 14.5276 15.5302C14.3801 15.8826 14.1634 16.2019 13.8903 16.4693Z" fill="white"/>
                                <path d="M12.3347 12.6093V8.52545H11.3974V12.6093C10.9543 12.7233 10.5681 12.9948 10.3111 13.3729C10.0542 13.751 9.94411 14.2097 10.0016 14.6631C10.0591 15.1164 10.2802 15.5333 10.6235 15.8354C10.9667 16.1376 11.4085 16.3043 11.866 16.3043C12.3236 16.3043 12.7654 16.1376 13.1086 15.8354C13.4518 15.5333 13.6729 15.1164 13.7305 14.6631C13.788 14.2097 13.6779 13.751 13.4209 13.3729C13.164 12.9948 12.7778 12.7233 12.3347 12.6093Z" fill="white"/>
                                <path d="M16.8596 4.7326H14.9979V5.35675H16.8596V4.7326Z" fill="white"/>
                                <path d="M18 6.35419H14.9979V6.97833H18V6.35419Z" fill="white"/>
                                <path d="M16.8596 7.9758H14.9979V8.59995H16.8596V7.9758Z" fill="white"/>
                                <path d="M18 9.59705H14.9979V10.2212H18V9.59705Z" fill="white"/>
                                <path d="M8.82562 8.28789C8.82562 7.99064 8.34837 7.79052 8.2398 7.53189C8.12849 7.2639 8.31791 6.78643 8.11794 6.58475C7.91798 6.38307 7.43761 6.57383 7.1693 6.46304C6.91076 6.35577 6.71002 5.8779 6.41281 5.8779C6.1156 5.8779 5.91486 6.3546 5.65593 6.46304C5.38801 6.57383 4.90959 6.38268 4.70767 6.58475C4.50576 6.78682 4.69674 7.2639 4.58582 7.53189C4.47842 7.79052 4 7.99064 4 8.28789C4 8.58514 4.47725 8.78526 4.58582 9.0435C4.6983 9.31149 4.50693 9.78857 4.70924 9.99064C4.91154 10.1927 5.38957 10.0016 5.65749 10.1123C5.91642 10.2196 6.11677 10.6975 6.41437 10.6975C6.71197 10.6975 6.91232 10.2208 7.17086 10.1123C7.43917 10.0016 7.9172 10.1927 8.11951 9.99064C8.32181 9.78857 8.13005 9.31149 8.24136 9.0435C8.34837 8.78526 8.82562 8.58475 8.82562 8.28789ZM6.41437 9.28769C6.2163 9.28769 6.02268 9.22902 5.858 9.1191C5.69332 9.00918 5.56497 8.85295 5.48919 8.67017C5.41341 8.48738 5.3936 8.28626 5.43227 8.09223C5.47094 7.8982 5.56635 7.71998 5.70644 7.58012C5.84652 7.44025 6.02498 7.34502 6.21925 7.30648C6.41353 7.26793 6.61488 7.28779 6.79785 7.36355C6.98082 7.43931 7.13718 7.56757 7.24717 7.73211C7.35715 7.89664 7.41581 8.09005 7.41574 8.28789C7.41574 8.41922 7.38983 8.54926 7.33951 8.67059C7.28918 8.79192 7.21541 8.90215 7.12242 8.995C7.02943 9.08784 6.91904 9.16148 6.79755 9.2117C6.67606 9.26192 6.54585 9.28775 6.41437 9.28769Z" fill="white"/>
                            </svg>}
                            chartName="온도"
                            chartSubname="Temperature"
                            chartValue="27.6"
                            chartUnit="°C"
                            chartDiff="-1.07"
                            data={[
                                { name: "Point 1", y: 40000 },
                                { name: "Point 2", y: 50000 },
                                { name: "Point 3", y: 60000 },
                                { name: "Point 4", y: 70000 },
                                { name: "Point 5", y: 80000 },
                                { name: "Point 6", y: 100000 },
                                { name: "Point 7", y: 120000 },
                                { name: "Point 8", y: 150000 }
                            ]}
                            chartColor="#07BEAA"
                        />
                        <Chart
                            chartIcon={<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 22 22" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11 22C4.92481 22 0 17.0752 0 11C0 4.92481 4.92481 0 11 0C17.0752 0 22 4.92481 22 11C22 17.0752 17.0752 22 11 22Z" fill="#1786C4"/>
                                <path d="M14.7772 13.1434C15.3142 13.0868 15.8109 12.8377 16.1717 12.4441C16.5326 12.0505 16.7322 11.5402 16.7322 11.0112C16.7322 10.4822 16.5326 9.9718 16.1717 9.57821C15.8109 9.18462 15.3142 8.93555 14.7772 8.87888C14.8881 8.60752 14.9156 8.31034 14.8564 8.02386C14.7972 7.73738 14.6539 7.47407 14.444 7.2663L14.3824 7.21145C14.6624 7.10449 14.8304 7.01399 14.8528 6.80282C14.8752 6.59165 14.6736 6.43807 14.3684 6.25432C13.9506 5.9947 13.6295 5.60997 13.4528 5.15733C13.3212 4.82823 13.2344 4.60883 12.9908 4.58689C12.7472 4.56495 12.6184 4.76241 12.4308 5.06134C12.3172 5.23288 12.1806 5.38875 12.0248 5.52482C11.7153 5.27069 11.3399 5.1055 10.9404 5.04755C10.5408 4.98959 10.1327 5.04116 9.76126 5.19651C9.38982 5.35186 9.06955 5.60494 8.83598 5.92769C8.60241 6.25043 8.46466 6.63022 8.438 7.02496C8.17667 6.95113 7.8999 6.94731 7.63655 7.0139C7.3732 7.08049 7.13291 7.21506 6.94073 7.40357C6.74855 7.59208 6.61152 7.82764 6.54392 8.08568C6.47632 8.34372 6.48063 8.6148 6.5564 8.87065C6.04011 8.90628 5.55339 9.11989 5.1826 9.47359C4.81181 9.82729 4.58094 10.2982 4.53093 10.8028C4.48093 11.3073 4.61503 11.813 4.90944 12.2299C5.20385 12.6468 5.63954 12.9481 6.1392 13.0804C6.02615 13.1661 5.90523 13.2414 5.778 13.3053C5.456 13.4643 5.2432 13.5795 5.2432 13.8099C5.2432 14.0402 5.456 14.1582 5.778 14.3172C6.2189 14.5344 6.5771 14.8842 6.8 15.3155C6.9624 15.6336 7.08 15.842 7.3152 15.842C7.5504 15.842 7.6708 15.6336 7.8332 15.3155C7.8528 15.2744 7.8836 15.236 7.9088 15.1948C8.09436 15.1917 8.27768 15.1545 8.4492 15.0851C8.50706 15.6111 8.76135 16.0976 9.1632 16.451C9.56505 16.8045 10.0861 17 10.6262 17C11.1663 17 11.6874 16.8045 12.0892 16.451C12.4911 16.0976 12.7453 15.6111 12.8032 15.0851C13.0801 15.197 13.3847 15.2261 13.6785 15.1687C13.9723 15.1114 14.2422 14.9701 14.4542 14.7628C14.6661 14.5554 14.8107 14.2913 14.8697 14.0036C14.9287 13.7159 14.8994 13.4176 14.7856 13.1462L14.7772 13.1434ZM12.8984 5.35753L12.918 5.32736C12.918 5.32736 12.918 5.3493 12.918 5.36027C13.1472 5.92139 13.5546 6.39542 14.08 6.71232L14.108 6.73151H14.0772C13.4994 6.95101 13.0094 7.34729 12.68 7.86142C12.6744 7.87118 12.6679 7.88037 12.6604 7.88884C12.6604 7.88884 12.6604 7.8669 12.6604 7.85868C12.4365 7.29951 12.0363 6.8249 11.518 6.50389L11.49 6.48469H11.5208C12.0904 6.26157 12.5729 5.86684 12.8984 5.35753ZM7.2984 15.1016V15.0714C7.0215 14.5355 6.57712 14.1003 6.03 13.8291L5.9992 13.8126L6.03 13.7989C6.57483 13.5246 7.01836 13.0902 7.2984 12.5566V12.5264L7.3152 12.5566C7.5962 13.0896 8.04348 13.521 8.592 13.7879L8.6228 13.8016L8.592 13.8181C8.04431 14.0885 7.5997 14.524 7.3236 15.0604L7.2984 15.1016ZM14.0408 14.3721C13.8605 14.5438 13.6189 14.6399 13.3674 14.6399C13.1159 14.6399 12.8743 14.5438 12.694 14.3721C12.6514 14.3357 12.5985 14.3129 12.5424 14.3065C12.4863 14.3001 12.4295 14.3105 12.3795 14.3363C12.3295 14.3621 12.2887 14.4021 12.2624 14.4511C12.236 14.5001 12.2255 14.5557 12.232 14.6107C12.2431 14.6879 12.2487 14.7658 12.2488 14.8438C12.2488 15.2671 12.0771 15.6731 11.7715 15.9724C11.4659 16.2717 11.0514 16.4399 10.6192 16.4399C10.187 16.4399 9.77251 16.2717 9.4669 15.9724C9.16129 15.6731 8.9896 15.2671 8.9896 14.8438C8.98972 14.7658 8.99533 14.6879 9.0064 14.6107C9.01285 14.5556 9.00212 14.5 8.97563 14.451C8.94913 14.4021 8.90813 14.3621 8.858 14.3364H8.8272H8.8412C9.166 14.1774 9.3788 14.0622 9.3788 13.8291C9.3788 13.596 9.166 13.4835 8.8412 13.3244C8.4018 13.1072 8.04544 12.7572 7.8248 12.3262C7.6624 12.0108 7.5448 11.8024 7.3068 11.8024C7.0688 11.8024 6.954 12.0108 6.7916 12.3262C6.73862 12.4284 6.67778 12.5265 6.6096 12.6196C6.38729 12.6097 6.16941 12.5553 5.96939 12.4597C5.76937 12.3642 5.59146 12.2295 5.44661 12.064C5.30177 11.8985 5.19306 11.7058 5.1272 11.4975C5.06133 11.2893 5.03971 11.0701 5.06365 10.8534C5.0876 10.6367 5.1566 10.4271 5.26642 10.2375C5.37624 10.0479 5.52454 9.8824 5.70218 9.7511C5.87982 9.6198 6.08303 9.52553 6.29929 9.4741C6.51555 9.42267 6.74027 9.41517 6.9596 9.45206C7.01481 9.46261 7.07199 9.45663 7.12367 9.4349C7.17536 9.41317 7.21917 9.37669 7.24939 9.33022C7.27961 9.28375 7.29484 9.22945 7.29309 9.17438C7.29135 9.11931 7.27271 9.06603 7.2396 9.02149C7.10949 8.84005 7.049 8.61942 7.0688 8.39854C7.0886 8.17766 7.18743 7.97074 7.34784 7.81428C7.50824 7.65782 7.71992 7.5619 7.94551 7.54342C8.1711 7.52495 8.3961 7.58513 8.5808 7.71332C8.62682 7.74339 8.68089 7.75944 8.7362 7.75944C8.79152 7.75944 8.84559 7.74339 8.8916 7.71332C8.93811 7.68496 8.9751 7.64387 8.99799 7.59512C9.02089 7.54637 9.02868 7.49212 9.0204 7.43908C8.96991 7.13186 9.01236 6.81689 9.14252 6.53303C9.27268 6.24918 9.48485 6.00886 9.75284 5.84174C10.0208 5.67463 10.3329 5.58802 10.6506 5.59263C10.9682 5.59723 11.2776 5.69283 11.5404 5.86763C11.4677 5.90623 11.3929 5.94102 11.3164 5.97185C10.9804 6.10074 10.7564 6.18576 10.734 6.4271C10.7116 6.66844 10.9132 6.79185 11.2184 6.9756C11.6362 7.23522 11.9573 7.61994 12.134 8.07259C12.2656 8.40169 12.3524 8.62109 12.5988 8.64303H12.6352C12.8564 8.64303 12.9796 8.45105 13.1616 8.16583C13.3345 7.90516 13.5592 7.6813 13.8224 7.50764C13.9066 7.54916 13.984 7.60278 14.052 7.6667C14.2273 7.84332 14.3254 8.07994 14.3254 8.32627C14.3254 8.5726 14.2273 8.80922 14.052 8.98584C14.0117 9.02716 13.9856 9.0798 13.9773 9.13638C13.969 9.19296 13.979 9.25066 14.0058 9.30142C14.0326 9.35218 14.075 9.39345 14.127 9.41948C14.1789 9.4455 14.2379 9.45498 14.2956 9.44657C14.5171 9.41518 14.7428 9.42881 14.9586 9.4866C15.1745 9.54439 15.3759 9.64511 15.5503 9.78247C15.7247 9.91984 15.8683 10.0909 15.9722 10.285C16.0761 10.4792 16.1381 10.6922 16.1543 10.9108C16.1705 11.1294 16.1406 11.3489 16.0663 11.5557C15.9921 11.7625 15.8752 11.9521 15.7229 12.1126C15.5705 12.2732 15.3861 12.4013 15.181 12.489C14.9759 12.5767 14.7546 12.6221 14.5308 12.6224C14.4521 12.6225 14.3735 12.617 14.2956 12.6059C14.2394 12.5996 14.1826 12.6101 14.1326 12.6361C14.0826 12.662 14.0418 12.7022 14.0156 12.7513C13.989 12.8021 13.9793 12.8599 13.9878 12.9164C13.9963 12.973 14.0227 13.0255 14.0632 13.0667C14.2325 13.2444 14.3255 13.4791 14.3229 13.7221C14.3203 13.9652 14.2223 14.1979 14.0492 14.3721H14.0408Z" fill="white"/>
                                <path d="M7.0128 5.88134C7.01058 5.62166 6.92983 5.36844 6.78074 5.15369C6.63166 4.93894 6.42093 4.77228 6.17518 4.67478C5.92943 4.57729 5.6597 4.55332 5.40005 4.60591C5.1404 4.6585 4.90249 4.78529 4.71638 4.97025C4.53027 5.15522 4.40431 5.39007 4.35441 5.64513C4.30452 5.90018 4.33292 6.164 4.43604 6.40325C4.53916 6.6425 4.71237 6.84644 4.93378 6.98932C5.15519 7.13219 5.41487 7.20758 5.68 7.20596C5.85637 7.20489 6.03079 7.16975 6.19327 7.10257C6.35576 7.03538 6.50312 6.93746 6.62692 6.81443C6.75072 6.69139 6.84853 6.54564 6.91474 6.38553C6.98096 6.22542 7.01428 6.05409 7.0128 5.88134ZM4.8932 5.88134C4.89541 5.73073 4.94296 5.58411 5.02988 5.45985C5.11681 5.33559 5.23924 5.23923 5.38185 5.18283C5.52445 5.12644 5.68087 5.11252 5.83151 5.14283C5.98216 5.17314 6.12031 5.24632 6.22867 5.35321C6.33703 5.4601 6.41076 5.59593 6.44064 5.74369C6.47052 5.89145 6.4552 6.04456 6.39661 6.18383C6.33803 6.3231 6.23877 6.44233 6.1113 6.52659C5.98382 6.61084 5.83379 6.65637 5.68 6.65747C5.576 6.65821 5.47288 6.6386 5.37672 6.59979C5.28055 6.56098 5.19326 6.50375 5.11998 6.43146C5.04669 6.35917 4.98888 6.27327 4.94994 6.1788C4.911 6.08434 4.89171 5.98321 4.8932 5.88134Z" fill="white"/>
                                <path d="M17.3336 5.09699C17.3336 4.88003 17.2679 4.66794 17.1448 4.48754C17.0218 4.30714 16.8469 4.16653 16.6422 4.0835C16.4376 4.00048 16.2124 3.97875 15.9951 4.02108C15.7778 4.06341 15.5783 4.16789 15.4216 4.3213C15.265 4.47472 15.1583 4.67019 15.1151 4.88298C15.0719 5.09578 15.0941 5.31635 15.1789 5.5168C15.2636 5.71724 15.4072 5.88857 15.5914 6.00911C15.7755 6.12965 15.9921 6.19399 16.2136 6.19399C16.3607 6.19399 16.5063 6.16561 16.6422 6.11048C16.7781 6.05536 16.9016 5.97455 17.0056 5.87269C17.1096 5.77082 17.1921 5.64989 17.2483 5.5168C17.3046 5.3837 17.3336 5.24105 17.3336 5.09699ZM15.6536 5.09699C15.6536 4.98851 15.6864 4.88247 15.748 4.79227C15.8095 4.70207 15.897 4.63176 15.9993 4.59025C16.1016 4.54873 16.2142 4.53787 16.3229 4.55904C16.4315 4.5802 16.5313 4.63244 16.6096 4.70915C16.6879 4.78586 16.7412 4.88359 16.7628 4.98999C16.7844 5.09639 16.7734 5.20667 16.731 5.30689C16.6886 5.40712 16.6168 5.49278 16.5247 5.55305C16.4326 5.61332 16.3244 5.64549 16.2136 5.64549C16.1396 5.64622 16.0662 5.63256 15.9976 5.60532C15.929 5.57808 15.8666 5.5378 15.814 5.48679C15.7614 5.43579 15.7196 5.37508 15.6912 5.30817C15.6627 5.24126 15.648 5.16949 15.648 5.09699H15.6536Z" fill="white"/>
                                <path d="M18 15.3923C18 15.1753 17.9343 14.9632 17.8112 14.7828C17.6882 14.6024 17.5133 14.4618 17.3086 14.3788C17.104 14.2958 16.8788 14.274 16.6615 14.3164C16.4442 14.3587 16.2447 14.4632 16.088 14.6166C15.9314 14.77 15.8247 14.9655 15.7815 15.1783C15.7383 15.3911 15.7605 15.6116 15.8453 15.8121C15.93 16.0125 16.0736 16.1839 16.2578 16.3044C16.4419 16.4249 16.6585 16.4893 16.88 16.4893C17.177 16.4893 17.4619 16.3737 17.672 16.168C17.882 15.9622 18 15.6832 18 15.3923ZM16.32 15.3923C16.32 15.2838 16.3528 15.1778 16.4144 15.0876C16.4759 14.9974 16.5634 14.927 16.6657 14.8855C16.768 14.844 16.8806 14.8332 16.9893 14.8543C17.0979 14.8755 17.1977 14.9277 17.276 15.0044C17.3543 15.0811 17.4076 15.1789 17.4292 15.2853C17.4508 15.3917 17.4398 15.502 17.3974 15.6022C17.355 15.7024 17.2832 15.7881 17.1911 15.8483C17.099 15.9086 16.9908 15.9408 16.88 15.9408C16.7315 15.9408 16.589 15.883 16.484 15.7801C16.379 15.6773 16.32 15.5378 16.32 15.3923Z" fill="white"/>
                                <path d="M4.9716 16.8924C5.16377 16.8924 5.35162 16.8366 5.5114 16.732C5.67117 16.6275 5.79571 16.4788 5.86924 16.305C5.94278 16.1311 5.96202 15.9397 5.92453 15.7551C5.88705 15.5705 5.79451 15.401 5.65863 15.2679C5.52275 15.1348 5.34963 15.0441 5.16115 15.0074C4.97268 14.9707 4.77733 14.9895 4.59979 15.0616C4.42225 15.1336 4.27051 15.2556 4.16375 15.4121C4.05699 15.5686 4 15.7526 4 15.9408C3.99963 16.0658 4.02451 16.1898 4.07321 16.3054C4.12191 16.421 4.19346 16.5261 4.28375 16.6145C4.37405 16.7029 4.48131 16.773 4.59935 16.8207C4.7174 16.8684 4.84391 16.8928 4.9716 16.8924ZM4.9716 15.5404C5.05313 15.5404 5.13282 15.5641 5.20056 15.6085C5.26831 15.6529 5.32106 15.7161 5.35213 15.7899C5.3832 15.8637 5.39119 15.9449 5.37508 16.0232C5.35897 16.1015 5.31949 16.1733 5.26164 16.2296C5.2038 16.2858 5.1302 16.324 5.05017 16.3392C4.97015 16.3545 4.8873 16.3461 4.81214 16.3152C4.73698 16.2842 4.67289 16.2322 4.62801 16.1655C4.58312 16.0988 4.55945 16.0206 4.56 15.9408C4.56074 15.8343 4.60443 15.7325 4.68154 15.6575C4.75865 15.5825 4.86292 15.5404 4.9716 15.5404Z" fill="white"/>
                            </svg>}
                            chartName="미세먼지"
                            chartSubname="Fine Dust"
                            chartValue="36"
                            chartUnit="㎍/㎥"
                            chartDiff="+0.66"
                            data={[
                                { name: "Point 1", y: 40000 },
                                { name: "Point 2", y: 50000 },
                                { name: "Point 3", y: 60000 },
                                { name: "Point 4", y: 70000 },
                                { name: "Point 5", y: 80000 },
                                { name: "Point 6", y: 100000 },
                                { name: "Point 7", y: 120000 },
                                { name: "Point 8", y: 150000 }
                            ]}
                            chartColor="#1786C4"
                        />
                    </div>
                    <div className="summary-header">
                        작업자 상태 요약
                    </div>
                    <div className="summary-card-area">
                        <WorkerSummary
                            workerName={"김준영"}
                            ID={"0001"}
                            bpm={80}
                            temperature={37.6}
                            spo2={97}
                            online={"Online"}
                            batt={42}
                            />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
