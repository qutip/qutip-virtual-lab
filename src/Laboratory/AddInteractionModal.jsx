import './Modal.css';

export default function AddInteractionModal ({ onCancel }) {
    return (
        <div className="modal">
          Tap another qubit to set an interaction or{" "}
          <button
            style={{ display: "inline !important", fontSize: 18 }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
    )
}