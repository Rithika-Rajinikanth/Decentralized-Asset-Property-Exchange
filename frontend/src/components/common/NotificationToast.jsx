// src/components/common/NotificationToast.jsx
import React from "react";

const NotificationToast = ({ message, type = "info", onClose }) => {
  if (!message) return null;

  const bgColor = type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3";

  return (
    <div style={{
      position: "fixed",
      bottom: "1rem",
      right: "1rem",
      padding: "1rem",
      backgroundColor: bgColor,
      color: "white",
      borderRadius: "5px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
      zIndex: 1000,
      cursor: "pointer"
    }} onClick={onClose}>
      {message}
    </div>
  );
};

export default NotificationToast;
