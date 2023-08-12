import './Tabs.css';

import SubmitButton from './SubmitButton';

export default function TabHeaders({ tabs, activeTab, onTabClick }) {
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
      <SubmitButton />
    </div>
  );
}

export const Tab = ({ active, children }) => (
  <div style={{ display: active ? "unset" : "none" }}>{children}</div>
);
