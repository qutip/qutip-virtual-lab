import './Tabs.css';

import { useContext } from 'react';

import { SimulationContext } from './Simulation';
import SubmitButton from './SubmitButton';

export default function TabHeaders({ tabs, activeTab, onTabClick }) {
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
      <div>
        <button
          style={{
            display: "inline",
            borderRadius: 30,
            border: "1px solid grey",
            margin: "0 10px",
            padding: "6px 10px",
            cursor: 'pointer',
            background: 'none',
            color: 'grey'
          }}
          onClick={toggleDemo}
        >
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
