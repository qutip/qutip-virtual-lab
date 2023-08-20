import './App.css';

import { useState } from 'react';

import {
  FullScreen,
  useFullScreenHandle,
} from 'react-full-screen';

import Demos from './Demo/Demos';
import Details from './Details';
import Help from './Help';
import Laboratory from './Laboratory';
import Results from './Results';
import TabHeaders, { Tab } from './Tabs';

function App() {
  const fullScreenHandle = useFullScreenHandle()
  const [fullScreen, setFullScreen] = useState(false)
  const [walkThroughVisible, setWalkThroughVisible] = useState(false)
  const [demosVisible, setDemosVisible] = useState(false)

  const handleToggleFullScreen = () => {
    if (fullScreen) {
      fullScreenHandle.exit()
      setFullScreen(false)
    } else {
      fullScreenHandle.enter()
      setFullScreen(true)
    }
  }

  const tabs = ["laboratory", "details", "results", "help"];
  const [activeTab, setActiveTab] = useState("laboratory");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <FullScreen handle={fullScreenHandle} className="fullscreen-class">
        <div style={{height: '100%'}}>
          <div className="tab-body">
            <Tab active={activeTab === "laboratory"}>
              <Laboratory />
            </Tab>
            <Tab active={activeTab === "details"}>
              <Details />
            </Tab>
            <Tab active={activeTab === "results"}>
              <Results />
            </Tab>
            <Tab active={activeTab === 'help'}>
              <Help />
            </Tab>
          </div>
          <TabHeaders
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={handleTabClick}
            onShowWalkThrough={() => setWalkThroughVisible(true)}
            onToggleDemos={() => setDemosVisible(v => !v)}
            onToggleFullScreen={handleToggleFullScreen}
          />
        </div>
        {demosVisible && <Demos onClose={() => setDemosVisible(false)}/>}
    </FullScreen>
  );
}

export default App;
