import React from "react";
import "../../../css/Dashboard2.css";
import co2 from "../../../image/co2.svg";
import finedust from "../../../image/finedust.svg";
import humid from "../../../image/humid.svg";
import temperature from "../../../image/temperature.svg";
import tvoc from "../../../image/tvoc.svg";
import ultrafinedust from "../../../image/ultrafinedust.svg";
import EnvCard from "./EnvCard";

function EnvList({
  data,
  setSelectedEnvCard,
  setEnvModalOpen,
  setImg,
  isOnline,
}) {
  return (
    <div className="envList">
      <div className="row">
        <EnvCard
          img={tvoc}
          title={"총휘발성유기화합물"}
          unit={"ppb"}
          value={data && data[0]}
          setSelectedEnvCard={setSelectedEnvCard}
          setEnvModalOpen={setEnvModalOpen}
          setImg={setImg}
          endpoint={"tvoc"}
        />
        <EnvCard
          img={co2}
          title={"이산화탄소"}
          unit={"ppm"}
          value={data && data[1]}
          setSelectedEnvCard={setSelectedEnvCard}
          setEnvModalOpen={setEnvModalOpen}
          setImg={setImg}
          endpoint={"co2"}
        />
      </div>
      <hr />
      <div className="row">
        <EnvCard
          img={finedust}
          title={"미세먼지(PM10)"}
          unit={"㎍/㎥"}
          value={data && data[2]}
          setSelectedEnvCard={setSelectedEnvCard}
          setEnvModalOpen={setEnvModalOpen}
          setImg={setImg}
          endpoint={"pm10"}
        />
        <EnvCard
          img={ultrafinedust}
          title={"초미세먼지(PM2.5)"}
          unit={"㎍/㎥"}
          value={data && data[3]}
          setSelectedEnvCard={setSelectedEnvCard}
          setEnvModalOpen={setEnvModalOpen}
          setImg={setImg}
          endpoint={"pm2_5"}
        />
      </div>
      <hr />
      <div className="row">
        <EnvCard
          img={temperature}
          title={"온도"}
          unit={"°C"}
          value={data && data[4]}
          setSelectedEnvCard={setSelectedEnvCard}
          setEnvModalOpen={setEnvModalOpen}
          setImg={setImg}
          endpoint={"temperature"}
        />
        <EnvCard
          img={humid}
          title={"습도"}
          unit={"%"}
          value={data && data[5]}
          setSelectedEnvCard={setSelectedEnvCard}
          setEnvModalOpen={setEnvModalOpen}
          setImg={setImg}
          endpoint={"humid"}
        />
      </div>
    </div>
  );
}
export default EnvList;
