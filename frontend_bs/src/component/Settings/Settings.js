import React, { useEffect } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "../../css/Settings.css";
import AirWallSetting from "./AirWallSetting";
import WorkerAndAirWatch from "./WorkerAndAirWatch";

function Settings(props) {
  useEffect(() => {
    props.setHeaderText("설정");
  }, []);

  return (
    <div className="settings">
      <div className="settings-wrapper layer2">
        <Tabs>
          <TabList>
            <Tab>공기질 측정기</Tab>
            {/* <Tab>작업자</Tab> */}
          </TabList>
          <TabPanel>
            <AirWallSetting />
          </TabPanel>
          <TabPanel>
            <WorkerAndAirWatch />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default Settings;
