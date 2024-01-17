import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/Dashboard.css";

function Dashboard(props) {
  const { factoryId } = useParams();

  return <div className="dashboard">{factoryId} 번 대시보드</div>;
}

export default Dashboard;
