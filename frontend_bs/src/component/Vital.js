import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";

function Vital(props) {
  return <div className="vital">내 생체정보 페이지</div>;
}

export default Vital;
