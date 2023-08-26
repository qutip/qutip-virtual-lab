import './Modal.css';

import React, { useState } from 'react';

// @ts-ignore
import { InlineMath } from 'react-katex';

import {
  PauliOperatorKey,
  PauliX,
  PauliY,
  PauliZ,
} from '../simulationUtils';

export default function InteractionModal({ onCancel, onSubmit, disabledOptions }) {
  const operatorSelectOptions = {
    Sx: PauliX,
    Sy: PauliY,
    Sz: PauliZ,
  }
  const [operatorSelected, setOperatorSelected] = useState<PauliOperatorKey | undefined>();
  const [scalar, setScalar] = useState<number>(0);
  return (
    <div className="modal">
      Operator:{" "}
      {Object.entries(operatorSelectOptions).map(([key, operator]) => (
        <label key={key}>
          <input
            type="radio"
            value={key}
            onChange={(e) => setOperatorSelected(e.target.value as PauliOperatorKey)}
            checked={operatorSelected === key}
            disabled={disabledOptions.includes(key)}
          />
          <InlineMath>{operator.label}</InlineMath>
        </label>
      ))}
      <br />
      Strength:{" "}
      <input
        style={{ height: 35, width: "100%" }}
        type="number"
        value={scalar || 0}
        onChange={(e) => setScalar(Number.parseFloat(e.target.value))}
      />
      <br />
      <div className="button-group">
        <button
          disabled={operatorSelected === undefined || scalar === 0}
          onClick={() => onSubmit({
            operatorKey: operatorSelected,
            operator: operatorSelected ? operatorSelectOptions[operatorSelected] : undefined,
            scalar,
          })}
        >
          OK
        </button>
        <button onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
