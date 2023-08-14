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
    <div
      style={{
        position: "absolute",
        color: "white",
        fontFamily: "monospace",
        fontSize: 20,
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#252525",
        padding: "10px 12px",
        border: "1px solid white",
      }}
    >
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          margin: "20px 0 10px 0",
        }}
      >
        <button
          style={{ padding: "10px 30px" }}
          disabled={operatorSelected === undefined}
          onClick={() => onSubmit({
            operatorKey: operatorSelected,
          })}
        >
          OK
        </button>
        <button style={{ padding: "10px 30px" }} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
