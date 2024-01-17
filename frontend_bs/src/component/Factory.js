import React from "react";
import { Link, useParams } from "react-router-dom";
import "../css/Factory.css";

function Factory(props) {
  return (
    <div className="factory">
      <div className="factory-wrapper">
        <div className="filter-zone">
          <button>공장 추가</button>
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
          <FactoryCard name={"한금"} industry={"steel"} />
          <FactoryCard name={"한금"} industry={"steel"} />
          <FactoryCard name={"한금"} industry={"steel"} />
        </div>
        <div className="detail-zone">
          <div className="factory-card">
            <div className="text">
              <span className="name">한금</span>
              <span className="industry">steel</span>
            </div>
          </div>
          <FactoryDetail />
        </div>
      </div>
    </div>
  );
}

function FactoryCard(props) {
  return (
    <div className="factory-card">
      <div className="text">
        <span className="name">{props.name}</span>
        <span className="industry">{props.industry}</span>
      </div>
      <div>1 2</div>
    </div>
  );
}

function FactoryDetail(props) {
  return (
    <div className="detail">
      <img src={`http://junlab.postech.ac.kr:880/api/image/d`} />
      <table>
        <tr>
          <td className="td1">Name</td>
          <td>:한금</td>
        </tr>
        <tr>
          <td className="td1">Industry</td>
          <td>:주조</td>
        </tr>
        <tr>
          <td className="td1">Contact</td>
          <td>:010-1234-5678</td>
        </tr>
        <tr>
          <td className="td1">Location</td>
          <td>:경북 포항시</td>
        </tr>
        <tr>
          <td className="td1">Join Date</td>
          <td>:2023/07/14</td>
        </tr>
      </table>
    </div>
  );
}

export default Factory;
