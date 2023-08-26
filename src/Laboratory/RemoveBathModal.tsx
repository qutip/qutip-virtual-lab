import './Modal.css';

import React, { useState } from 'react';

// @ts-ignore
import { InlineMath } from 'react-katex';

import {
  PauliMinus,
  PauliPlus,
} from '../simulationUtils';

export default function RemoveBathModal({ onCancel, onSubmit, disabledOptions }) {
  const operatorSelectOptions = {
    Sp: PauliPlus,
    Sm: PauliMinus
  }
  const [operatorSelected, setOperatorSelected] = useState<'Sp' | 'Sm' | undefined>();
  return (
    <div className="modal">
      Operator:{" "}
      {Object.entries(operatorSelectOptions).map(([key, operator]) => (
        <label key={key}>
          <input
            type="radio"
            value={key}
            onChange={(e) => setOperatorSelected(e.target.value as 'Sm' | 'Sp')}
            checked={operatorSelected === key}
            disabled={disabledOptions.includes(key)}
          />
          <InlineMath>{operator.label}</InlineMath>
        </label>
      ))}
      <div className="button-group">
        <button
          
          disabled={operatorSelected === undefined}
          onClick={() => onSubmit({
            operatorKey: operatorSelected,
          })}
        >
          OK
        </button>
        <button  onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
