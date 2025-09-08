// src/components/chat/CallModal.jsx
import React from "react";
import { Phone, PhoneOff } from "lucide-react";
import "./call.css";

const CallModal = ({ show, callerName, onAccept, onReject, callType }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">
          {callType === "video" ? "📹 Video" : "🎤 Audio"} Call from{" "}
          <span className="text-blue-600">{callerName}</span>
        </h2>
        <div className="modal-actions">
          <button onClick={onAccept} className="btn btn-green">
            <Phone size={20} /> Accept
          </button>
          <button onClick={onReject} className="btn btn-red">
            <PhoneOff size={20} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
