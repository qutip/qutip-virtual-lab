import './Tabs.css';

import SubmitButton from './SubmitButton';

export default function TabHeaders({ tabs, activeTab, onTabClick, onToggleFullScreen, onToggleDemos }) {
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
        <button className="tab-button" onClick={onToggleDemos}>
        ⚛
        </button>
      <button className="tab-button" onClick={onToggleFullScreen}>
          ⤢
        </button>
        <SubmitButton />
      </div>
    </div>
  );
}

export const Tab = ({ active, children }) => (
  <div style={{ display: active ? "unset" : "none", width: '100%', height: '100%' }}>{children}</div>
);
