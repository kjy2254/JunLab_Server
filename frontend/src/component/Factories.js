import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "../css/Factories.css";
import { Link } from "react-router-dom";
import Header from "./Header";
import { createFuzzyMatcher } from "../util";
import ForbiddenPage from "./ForbiddenPage";

function Factories(props) {
  const [factories, setFactories] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // API 요청을 보내고 데이터를 가져옵니다.
    axios
      .get("http://junlab.postech.ac.kr:880/api/factories")
      .then((response) => {
        // API 응답에서 데이터를 추출합니다.
        const data = response.data;
        // 데이터를 상태에 설정합니다.
        setFactories(data);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  }, []);

  if (!props.isLogin || props.role !== "Admin") {
    return (
      <ForbiddenPage
        isLogin={props.isLogin}
        role={props.role}
        name={props.name}
      />
    );
  } else {
    return (
      <div className="factory-container">
        <AdminSidebar header="관리자 페이지" mode="admin" selected="1" />
        <div className="factory-content">
          <Header
            placeholder="Type any factories..."
            setData={setFilter}
            data={filter}
            isLogin={props.isLogin}
            name={props.name}
            role={props.role}
          />
          <div className="path-section">
            <div className="path-selected">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 0V8H0L8 0Z"
                  fill="url(#paint0_linear_104_907)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_104_907"
                    x1="13.1265"
                    y1="6.66481"
                    x2="3.15937"
                    y2="12.9836"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#0043FF" />
                    <stop offset="1" stopColor="#A370F1" />
                  </linearGradient>
                </defs>
              </svg>
              &nbsp;Factory
            </div>
          </div>
          <div className="factory-card-area">
            {factories
              .filter((v) =>
                createFuzzyMatcher(filter).test(v.factory_name.toLowerCase())
              )
              .map((factory) => (
                <Link
                  className="factory-card"
                  key={factory.factory_id}
                  to={`/iitp/factoryManagement/factory/${factory.factory_id}`}
                >
                  <div className="factory-image">
                    <img
                      src={`http://junlab.postech.ac.kr:880/api/image/factory_${factory.factory_id}`}
                      alt="factory"
                    />
                    <div className="factory-name">
                      {factory.factory_name}&nbsp;
                    </div>
                  </div>
                  <div className="factory-details">
                    <div className="factory-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="22"
                        viewBox="0 0 156 223"
                        fill="none"
                      >
                        <path
                          d="M77.875 0C34.8769 0 0 34.8769 0 77.875C0 136.281 77.875 222.5 77.875 222.5C77.875 222.5 155.75 136.281 155.75 77.875C155.75 34.8769 120.873 0 77.875 0ZM77.875 105.688C62.5225 105.688 50.0625 93.2275 50.0625 77.875C50.0625 62.5225 62.5225 50.0625 77.875 50.0625C93.2275 50.0625 105.688 62.5225 105.688 77.875C105.688 93.2275 93.2275 105.688 77.875 105.688Z"
                          fill="#C90000"
                        />
                      </svg>
                      &nbsp;&nbsp;
                      {factory.location}
                    </div>
                    <div className="factory-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 512 449"
                        fill="none"
                      >
                        <path
                          d="M512 121V416.1C512 433.77 497.67 448.1 480 448.1H32C14.33 448.1 0 433.77 0 416.1V32.1C0 14.43 14.33 0.0999756 32 0.0999756H128C145.67 0.0999756 160 14.43 160 32.1V192.1L299.1 99.86C315.1 90.6 336 102.1 336 121V192.1L475.1 99.86C491.1 90.6 512 102.1 512 121Z"
                          fill="black"
                        />
                      </svg>
                      &nbsp;&nbsp;
                      {factory.industry}
                    </div>
                    <div className="factory-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 294 294"
                        fill="none"
                      >
                        <path
                          d="M294 232.193C294 235.952 293.304 240.859 291.912 246.914C290.52 252.969 289.058 257.737 287.527 261.217C284.604 268.178 276.112 275.555 262.053 283.351C248.967 290.45 236.021 294 223.214 294C219.456 294 215.802 293.756 212.252 293.269C208.702 292.782 204.7 291.912 200.246 290.659C195.791 289.406 192.485 288.397 190.327 287.631C188.17 286.866 184.307 285.439 178.739 283.351C173.17 281.263 169.76 280.01 168.507 279.592C154.865 274.72 142.685 268.943 131.966 262.261C114.148 251.264 95.7379 236.265 76.7365 217.263C57.7351 198.262 42.7358 179.852 31.7386 162.034C25.0568 151.315 19.2798 139.135 14.4077 125.493C13.9901 124.24 12.7372 120.83 10.6491 115.261C8.56108 109.693 7.13423 105.83 6.36861 103.673C5.60298 101.515 4.59375 98.2088 3.34091 93.7543C2.08807 89.2997 1.21804 85.2976 0.730824 81.7479C0.243608 78.1982 0 74.544 0 70.7855C0 57.9787 3.54972 45.0327 10.6491 31.9474C18.4446 17.8878 25.8224 9.39631 32.7827 6.47301C36.2628 4.94176 41.0305 3.48011 47.0859 2.08807C53.1413 0.696023 58.0483 0 61.8068 0C63.7557 0 65.2173 0.208807 66.1918 0.62642C68.6974 1.46165 72.3864 6.75142 77.2585 16.4957C78.7898 19.1406 80.8778 22.8991 83.5227 27.7713C86.1676 32.6435 88.6037 37.0632 90.831 41.0305C93.0582 44.9979 95.2159 48.7216 97.304 52.2017C97.7216 52.7585 98.9396 54.4986 100.958 57.4219C102.977 60.3452 104.473 62.816 105.447 64.8345C106.422 66.853 106.909 68.8366 106.909 70.7855C106.909 73.5696 104.925 77.0497 100.958 81.2259C96.9908 85.402 92.6754 89.2301 88.0121 92.7102C83.3487 96.1903 79.0334 99.8793 75.066 103.777C71.0987 107.675 69.1151 110.876 69.1151 113.382C69.1151 114.635 69.4631 116.201 70.1591 118.08C70.8551 119.96 71.4467 121.386 71.9339 122.361C72.4212 123.335 73.3956 125.006 74.8572 127.372C76.3189 129.739 77.1193 131.061 77.2585 131.339C87.8381 150.411 99.9489 166.767 113.591 180.409C127.233 194.051 143.589 206.162 162.661 216.741C162.939 216.881 164.261 217.681 166.628 219.143C168.994 220.604 170.665 221.579 171.639 222.066C172.614 222.553 174.04 223.145 175.92 223.841C177.799 224.537 179.365 224.885 180.618 224.885C183.124 224.885 186.325 222.901 190.223 218.934C194.121 214.967 197.81 210.651 201.29 205.988C204.77 201.325 208.598 197.009 212.774 193.042C216.95 189.075 220.43 187.091 223.214 187.091C225.163 187.091 227.147 187.578 229.165 188.553C231.184 189.527 233.655 191.023 236.578 193.042C239.501 195.06 241.241 196.278 241.798 196.696C245.278 198.784 249.002 200.942 252.969 203.169C256.937 205.396 261.357 207.832 266.229 210.477C271.101 213.122 274.859 215.21 277.504 216.741C287.249 221.614 292.538 225.303 293.374 227.808C293.791 228.783 294 230.244 294 232.193Z"
                          fill="black"
                        />
                      </svg>
                      &nbsp;&nbsp;
                      {factory.contact_number}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Factories;
