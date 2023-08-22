import './Details.css';
import 'katex/dist/katex.min.css';

import React from 'react';

import CollapseOperators from './CollapseOperators';
import Hamiltonian from './Hamiltonian';
import InitialState from './InitialState';
import Parameters from './Parameters';
import TimeParameters from './TimeParameters';

export default function Details() {
  return (
    <div id="details">
      <div className="details-tab--content">
        <div className="details-field-cols">
          <Hamiltonian />
          <InitialState />
          <CollapseOperators />
        </div>
        <div className="details-field-cols">
          <Parameters />
          <TimeParameters />
        </div>
      </div>
    </div>
  );
}

