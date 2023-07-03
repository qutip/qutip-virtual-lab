import './index.css';

import React from 'react';

import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import Simulation from './Simulation.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Simulation>
      <App />
    </Simulation>
  </React.StrictMode>
);
