import React, { useState } from "react";
import UUIDGenerator from "./UUIDGenerator";
import TimestampExtractionTool from "./TimestampExtractionTool";

type TabId = "uuid-v7" | "timestamp-extraction";

const tabStyles = {
  tabBar: {
    display: "flex",
    flexShrink: 0,
    borderBottom: "1px solid #e9ecef",
    backgroundColor: "#fff",
    paddingLeft: "16px",
    paddingRight: "16px",
    gap: "0",
  } as React.CSSProperties,
  tab: (active: boolean) =>
    ({
      padding: "18px 20px",
      fontSize: "14px",
      fontWeight: 500,
      color: active ? "#0B63E9" : "#6c757d",
      border: "none",
      borderBottom: active ? "2px solid #0B63E9" : "2px solid transparent",
      backgroundColor: "transparent",
      cursor: "pointer",
      fontFamily: "Inter, sans-serif",
      marginBottom: "-1px",
      transition: "color 0.2s, border-color 0.2s, background-color 0.2s",
    }) as React.CSSProperties,
  content: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    padding: "16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,
  contentInner: {
    flex: 1,
    minHeight: 0,
    overflow: "auto",
  } as React.CSSProperties,
};

const TABS: { id: TabId; label: string }[] = [
  { id: "uuid-v7", label: "UUID V7 Generator" },
  { id: "timestamp-extraction", label: "Timestamp extraction tool" },
];

const UUIDWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("uuid-v7");

  return (
    <div
      className="uuid-widget"
      style={{
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <style>
        {`.uuid-widget-tab:not(.uuid-widget-tab--active):hover { background-color: #e9ecef !important; }`}
      </style>
      <div style={tabStyles.tabBar}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`uuid-widget-tab${activeTab === id ? " uuid-widget-tab--active" : ""}`}
            style={tabStyles.tab(activeTab === id)}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={tabStyles.content}>
        <div style={tabStyles.contentInner}>
          {activeTab === "uuid-v7" && <UUIDGenerator />}
          {activeTab === "timestamp-extraction" && <TimestampExtractionTool />}
        </div>
      </div>
    </div>
  );
};

export default UUIDWidget;
