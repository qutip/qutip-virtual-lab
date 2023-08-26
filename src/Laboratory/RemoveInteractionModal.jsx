import './Modal.css';

export default function RemoveInteractionModal ({ onCancel }) {
    return (
        <div className="modal">
          Tap an interaction line to remove an interaction or{" "}
          <button
            style={{ display: "inline !important", fontSize: 18 }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
    )
}