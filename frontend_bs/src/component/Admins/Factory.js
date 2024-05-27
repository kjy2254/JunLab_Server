import { faStar as fS1 } from "@fortawesome/free-regular-svg-icons";
import {
  faStar as fS2,
  faClose,
  faFilter,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../css/Factory.css";
import { createFuzzyMatcher } from "../../util";
import FactoryAddModal from "./FactoryAddModal";

function Factory({ setHeaderText }) {
  const [factories, setFactories] = useState([]);
  const [detail, setDetail] = useState({});
  const [filterZone, setFilterZone] = useState({
    smallview: window.innerWidth < 1300,
    overlay: false,
  });
  const [detailZone, setDetailZone] = useState({
    smallview: window.innerWidth < 1100,
    overlay: false,
  });
  const [filter, setFilter] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    setHeaderText("공장관리");
  }, []);

  const fetchData = () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setFilterZone((prevState) => ({
        ...prevState,
        smallview: window.innerWidth < 1300,
      }));
      setDetailZone((prevState) => ({
        ...prevState,
        smallview: window.innerWidth < 1100,
      }));
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (factory) => {
    setDetail(factory);
    setDetailZone({ ...detailZone, overlay: true });
  };

  return (
    <div className="factory">
      <div className="factory-wrapper layer2">
        <div
          className={
            "filter-zone " +
            (filterZone.smallview && filterZone.overlay ? "overlay" : "")
          }
        >
          <div className="buttons">
            <button
              className="add-factory"
              onClick={() => setAddModalOpen(true)}
            >
              공장 추가
            </button>
            {filterZone.smallview ? (
              <button
                className="close"
                onClick={() =>
                  setFilterZone({ ...filterZone, overlay: !filterZone.overlay })
                }
              >
                <FontAwesomeIcon icon={faClose} />
              </button>
            ) : (
              <></>
            )}
          </div>
          <div className="filter">
            <span>필터링</span>
            <li>전체</li>
            <li>별</li>
          </div>
          <div className="filter">
            <span>카테고리</span>
            <li>주조</li>
            <li>소성</li>
            <li>용접</li>
            <li>금형</li>
          </div>
          <div className="filter">
            <span>지역</span>
            <li>경북</li>
            <li>전남</li>
            <li>충남</li>
          </div>
        </div>
        <div
          className={
            "list-zone " +
            (detailZone.overlay && detailZone.smallview ? "hide" : "")
          }
        >
          <div className="search">
            {filterZone.smallview ? (
              <button
                onClick={() =>
                  setFilterZone({ ...filterZone, overlay: !filterZone.overlay })
                }
              >
                <FontAwesomeIcon icon={faFilter} />
              </button>
            ) : (
              <></>
            )}
            <input
              placeholder="Search Factory..."
              className="layer2"
              type="text"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          {factories
            .filter((v) =>
              createFuzzyMatcher(filter).test(v.factory_name.toLowerCase())
            )
            .map((f) => (
              <FactoryCard
                name={f.factory_name}
                industry={f.industry}
                factoryId={f.factory_id}
                detail={detail}
                onClick={() => handleCardClick(f)}
                key={f.factory_id}
              />
            ))}
        </div>
        <div
          className={
            "detail-zone " +
            (detailZone.overlay && detailZone.smallview ? "view" : "")
          }
        >
          <div className="header">
            <div className="text">
              <span className="name">{detail?.factory_name}</span>
              <span className="industry">
                ID: {detail?.factory_id} / Code: {detail?.code}{" "}
              </span>
            </div>
            {detailZone.smallview ? (
              <FontAwesomeIcon
                icon={faRightToBracket}
                onClick={() => setDetailZone({ ...detailZone, overlay: false })}
              />
            ) : (
              <></>
            )}
          </div>
          <FactoryDetail detail={detail} />
          <div className="buttons">
            <button className="edit">수정</button>
            <button
              className="move"
              onClick={() =>
                (window.location.href = `/factorymanagement/factory/${detail?.factory_id}/dashboard`)
              }
            >
              이동
            </button>
          </div>
        </div>
      </div>
      <FactoryAddModal
        modalOpen={addModalOpen}
        setModalOpen={setAddModalOpen}
        fetchData={fetchData}
      />
    </div>
  );
}

function FactoryCard(props) {
  const [stared, setStared] = useState(false);

  return (
    <div
      className={
        "factory-card" +
        (props.detail.factory_id == props.factoryId ? " selected" : "")
      }
      onClick={props.onClick}
    >
      <div className="text">
        <span className="name">{props.name}</span>
        <span className="industry">{props.industry}</span>
      </div>
      <div onClick={() => setStared(!stared)}>
        {stared ? (
          <FontAwesomeIcon icon={fS2} style={{ color: "yellow" }} />
        ) : (
          <FontAwesomeIcon icon={fS1} />
        )}
      </div>
    </div>
  );
}

function FactoryDetail({ detail }) {
  return (
    <div className="detail">
      <img
        src={`http://junlab.postech.ac.kr:880/api2/image/${detail?.factory_image_url}`}
      />
      <div className="text">
        <div className="wrapper">
          <div className="key">Name</div>
          <span>: {detail?.factory_name}</span>
        </div>
        <div className="wrapper">
          <div className="key">Industry</div>
          <span>: {detail?.industry}</span>
        </div>
        <div className="wrapper">
          <div className="key">Manager</div>
          <span>: {detail?.manager}</span>
        </div>
        <div className="wrapper">
          <div className="key">Contact</div>
          <span>: {detail?.contact_number}</span>
        </div>
        <div className="wrapper">
          <div className="key">Location</div>
          <span>: {detail?.location}</span>
        </div>
        <div className="wrapper">
          <div className="key">Join Date</div>
          <span>
            : {new Date(detail?.join_date).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Factory;
