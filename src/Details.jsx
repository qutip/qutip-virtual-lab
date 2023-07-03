import './Details.css';
import 'katex/dist/katex.min.css';

import React, {
  useContext,
  useState,
} from 'react';

import { BlockMath } from 'react-katex';

import { SimulationContext } from './Simulation';

export default function Details() {
  const { state, reset, submit, setConfig } = useContext(SimulationContext);

  const tabs = {
    LARMOR: "LARMOR",
    DEPHASING: "DEPHASING",
  };

  const [activeTab, setActiveTab] = useState(tabs.LARMOR);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    reset();
    setConfig(() => ({ name: tab }));
  };

  return (
    <div id="details">
      <div>
        <details>
          <summary>Demos</summary>
          <ul className="details-tabs">
            <li
              onClick={() => handleTabClick(tabs.LARMOR)}
              className={`details-tab ${
                activeTab === tabs.LARMOR ? "active" : ""
              }`}
            >
              Larmor Precession
            </li>
            <li
              onClick={() => handleTabClick(tabs.DEPHASING)}
              className={`details-tab ${
                activeTab === tabs.DEPHASING ? "active" : ""
              }`}
            >
              Qubit Dephasing
            </li>
          </ul>
          <div className="details-tab--content">
            {activeTab === tabs.LARMOR && (
              <>
                <BlockMath>
                  {"\\mathcal{H} = \\lambda_1 \\sigma_x^{(1)}"}
                </BlockMath>
                <BlockMath>{"|\\psi(0)\\rangle = |0\\rangle"}</BlockMath>
              </>
            )}
            {activeTab === tabs.DEPHASING && (
              <>
                <BlockMath>
                  {
                    "\\mathcal{H} = \\Delta(\\cos(\\theta) \\sigma_z^{(1)} + \\sin(\\theta)\\sigma_x^{(1)})"
                  }
                </BlockMath>
                <BlockMath>
                  {"C = \\sqrt{\\gamma_p}\\,\\sigma_z^{(1)}"}
                </BlockMath>
                <BlockMath>{"|\\psi(0)\\rangle = |0\\rangle"}</BlockMath>
              </>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}
