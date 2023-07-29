export default function AddInteractionModal ({ onCancel }) {
    return (
        <div
          style={{
            position: "absolute",
            color: "white",
            fontFamily: "monospace",
            fontSize: 20,
            bottom: 140,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#252525",
            padding: "10px 12px",
            border: "1px solid white",
          }}
        >
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