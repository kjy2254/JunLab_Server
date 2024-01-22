import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "../css/Factory.css";

function Factory(props) {
  const [factories, setFactories] = useState([]);
  const [detail, setDetail] = useState({});

  useEffect(() => {
    axios
      .get("http://junlab.postech.ac.kr:880/api2/factories")
      .then((response) => {
        const data = response.data;
        setFactories(data);
        setDetail(data[0]);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  }, []);

  const handleCardClick = (factory) => {
    setDetail(factory);
  };

  return (
    <div className="factory">
      <div className="factory-wrapper">
        <div className="filter-zone">
          <button className="add-factory">공장 추가</button>
          <div className="filter">
            <span>Filter</span>
            <li>All</li>
            <li>Starred</li>
          </div>
          <div className="filter">
            <span>Filter By Categories</span>
            <li>주조</li>
            <li>소성</li>
            <li>용접</li>
            <li>금형</li>
          </div>
          <div className="filter">
            <span>Filter By Location</span>
            <li>경북</li>
            <li>전남</li>
            <li>충남</li>
          </div>
        </div>
        <div className="list-zone">
          <div className="search">
            <input placeholder="Search Factory..." />
          </div>
          {factories.map((f) => (
            <FactoryCard
              name={f.factory_name}
              industry={f.industry}
              factoryId={f.factory_id}
              onClick={() => handleCardClick(f)}
            />
          ))}
        </div>
        <div className="detail-zone">
          <div className="header">
            <div className="text">
              <span className="name">{detail.factory_name}</span>
              <span className="industry">ID: {detail.factory_id}</span>
            </div>
          </div>
          <FactoryDetail detail={detail} />
          <div className="buttons">
            <button className="edit">수정</button>
            <button
              className="move"
              onClick={() =>
                (window.location.href = `/factorymanagement/factory/${detail.factory_id}/dashboard`)
              }
            >
              이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FactoryCard(props) {
  return (
    <div className="factory-card" onClick={props.onClick}>
      <div className="text">
        <span className="name">{props.name}</span>
        <span className="industry">{props.industry}</span>
      </div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
        </svg>
      </div>
    </div>
  );
}

function FactoryDetail({ detail }) {
  return (
    <div className="detail">
      <img
        src={`http://junlab.postech.ac.kr:880/api/image/factory_${detail.factory_id}.png`}
      />
      <table>
        <thead />
        <tbody>
          <tr>
            <td className="td1">Name</td>
            <td>: {detail.factory_name}</td>
          </tr>
          <tr>
            <td className="td1">Industry</td>
            <td>: {detail.industry}</td>
          </tr>
          <tr>
            <td className="td1">Manager</td>
            <td>: {detail.manager}</td>
          </tr>
          <tr>
            <td className="td1">Contact</td>
            <td>: {detail.contact_number}</td>
          </tr>
          <tr>
            <td className="td1">Location</td>
            <td>: {detail.location}</td>
          </tr>
          <tr>
            <td className="td1">Join Date</td>
            <td>: {new Date(detail.join_date).toLocaleDateString("ko-KR")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Factory;
