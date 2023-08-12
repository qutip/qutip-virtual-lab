import './App.css';

import { useState } from 'react';

import Details from './Details';
import Laboratory from './Laboratory';
import Results from './Results';
import TabHeaders, { Tab } from './Tabs';

function App() {
  const tabs = ["laboratory", "details", "results"];
  const [activeTab, setActiveTab] = useState("laboratory");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
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
          </div>
          <TabHeaders
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={handleTabClick}
          />
        </div>
    </>
  );
}

export default App;
