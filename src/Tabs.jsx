import './Tabs.css';

import { useContext } from 'react';

import { SimulationContext } from './Simulation';
import SubmitButton from './SubmitButton';

export default function TabHeaders({ tabs, activeTab, onTabClick, onToggleFullScreen }) {
  const { toggleDemo } = useContext(SimulationContext)
  return (
    <div className="tab-header-container">
      <div className="tab-headers">
        {tabs.map((tab) => (
          <div
            className={`tab-header ${tab === activeTab ? "active" : ""}`}
            onClick={() => onTabClick(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div style={{height: 40, display: 'flex', flexDirection: 'row'}}>
      <button className="tab-button" onClick={onToggleFullScreen}>
          ⤢
        </button>
        <button className="tab-button" onClick={toggleDemo}>
          ?
        </button>
        <SubmitButton />
      </div>
    </div>
  );
}

export const Tab = ({ active, children }) => (
  <div style={{ display: active ? "unset" : "none" }}>{children}</div>
);
