import React from "react";
import UUIDGenerator from "./UUIDGenerator";

const UUIDWidget: React.FC = () => {
  return (
    <div className="uuid-widget" style={{ 
      width: "100%",
      height: "100%",
      margin: 0,
      padding: 0,
      background: "transparent",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box"
    }}>
      <div style={{ 
        flex: 1, 
        height: "100%",
        minHeight: "100%",
        overflow: "auto",
        padding: "16px",
        boxSizing: "border-box"
      }}>
        <UUIDGenerator />
      </div>
    </div>
  );
};

export default UUIDWidget;
