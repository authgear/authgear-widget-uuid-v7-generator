import React, { useState, useMemo } from "react";
import { parseUUIDv7Timestamp, isValidUUIDv7 } from "../utils/uuidUtils";

const styles = {
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #dee2e6",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
    color: "#495057",
    backgroundColor: "#fff",
  } as React.CSSProperties,
  label: {
    fontWeight: 600,
    color: "#495057",
    fontSize: "14px",
    marginBottom: "6px",
    display: "block" as const,
    fontFamily: "Inter, sans-serif",
  } as React.CSSProperties,
  error: {
    color: "#721c24",
    marginTop: 12,
    padding: "12px",
    background: "#f8d7da",
    border: "1px solid #f5c6cb",
    borderRadius: 4,
    fontSize: 14,
    fontFamily: "Inter, sans-serif",
  } as React.CSSProperties,
  outputSection: {
    marginTop: 20,
    padding: 16,
    border: "1px solid #e9ecef",
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  } as React.CSSProperties,
  outputRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap" as const,
  } as React.CSSProperties,
  outputLabel: {
    fontSize: 12,
    color: "#6c757d",
    minWidth: 140,
    fontFamily: "Inter, sans-serif",
  } as React.CSSProperties,
  outputValue: {
    flex: 1,
    fontFamily: "monospace",
    fontSize: 14,
    color: "#495057",
    wordBreak: "break-all" as const,
  } as React.CSSProperties,
  copyBtn: {
    background: "#fff",
    color: "#000",
    border: "1px solid #dee2e6",
    borderRadius: 4,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  } as React.CSSProperties,
  copyBtnSuccess: {
    background: "#0B63E9",
    color: "#fff",
    border: "1px solid #0B63E9",
  } as React.CSSProperties,
  statusPill: (valid: boolean) =>
    ({
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 9999,
      fontSize: 12,
      fontWeight: 500,
      fontFamily: "Inter, sans-serif",
      ...(valid
        ? { backgroundColor: "#d4edda", color: "#155724" }
        : { backgroundColor: "#f8d7da", color: "#721c24" }),
    }) as React.CSSProperties,
};

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
  </svg>
);

const InvalidIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor" />
  </svg>
);

const TimestampExtractionTool: React.FC = () => {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<"iso" | "unix-ms" | "unix-s" | null>(null);

  const trimmed = input.trim();
  const isValid = trimmed.length === 0 ? null : isValidUUIDv7(trimmed);
  const timestampMs = useMemo(
    () => (isValid ? parseUUIDv7Timestamp(trimmed) : null),
    [isValid, trimmed]
  );

  const isoDatetime = timestampMs !== null ? new Date(timestampMs).toISOString() : null;
  const unixSec = timestampMs !== null ? Math.floor(timestampMs / 1000) : null;

  const copy = async (id: "iso" | "unix-ms" | "unix-s", text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const hasOutput = isValid && timestampMs !== null && isoDatetime !== null && unixSec !== null;

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        color: "#495057",
        padding: 0,
        width: "100%",
        height: "100%",
        minHeight: 0,
        maxHeight: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: "1 1 0",
          minHeight: 0,
          overflow: "auto",
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignContent: "flex-start",
          alignItems: "stretch",
        }}
      >
      {/* Left column: UUID string input */}
      <div
        style={{
          flex: "1 1 400px",
          minWidth: "280px",
          padding: 20,
          border: "1px solid #dee2e6",
          borderRadius: 8,
          backgroundColor: "#fff",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <label style={styles.label}>UUID string</label>
          {trimmed.length > 0 && (
            <span style={styles.statusPill(isValid === true)}>
              {isValid ? <CheckIcon /> : <InvalidIcon />}
              {isValid ? "Valid UUID v7" : "Invalid UUID v7"}
            </span>
          )}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 019bfda4-d2a7-7fe8-8b42-4768a7042960"
          style={styles.input}
        />

        {trimmed.length > 0 && !isValid && (
          <div style={{ ...styles.error, marginTop: 12 }}>
            <strong>Not a valid UUID v7.</strong> Input must be a UUID with version 7 (format:{" "}
            <code style={{ fontSize: 12 }}>xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx</code>). Check that
            the third group starts with <code style={{ fontSize: 12 }}>7</code> and the string has
            no extra spaces or invalid characters.
          </div>
        )}
      </div>

      {/* Right column: Extracted timestamp */}
      <div
        style={{
          flex: "1 1 400px",
          minWidth: "280px",
          padding: 20,
          border: "1px solid #dee2e6",
          borderRadius: 8,
          backgroundColor: "#fff",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ ...styles.label, marginBottom: 12 }}>Extracted timestamp</div>

        {hasOutput ? (
          <>
            <div style={styles.outputRow}>
              <span style={styles.outputLabel}>ISO datetime (UTC)</span>
              <code style={styles.outputValue}>{isoDatetime}</code>
              <button
                type="button"
                style={{
                  ...styles.copyBtn,
                  ...(copiedId === "iso" ? styles.copyBtnSuccess : {}),
                }}
                onClick={() => copy("iso", isoDatetime!)}
                title={copiedId === "iso" ? "Copied!" : "Copy"}
              >
                {copiedId === "iso" ? <CheckIcon /> : <CopyIcon />}
                {copiedId === "iso" ? "Copied" : "Copy"}
              </button>
            </div>

            <div style={styles.outputRow}>
              <span style={styles.outputLabel}>Unix time (milliseconds)</span>
              <code style={styles.outputValue}>{String(timestampMs)}</code>
              <button
                type="button"
                style={{
                  ...styles.copyBtn,
                  ...(copiedId === "unix-ms" ? styles.copyBtnSuccess : {}),
                }}
                onClick={() => copy("unix-ms", String(timestampMs))}
                title={copiedId === "unix-ms" ? "Copied!" : "Copy"}
              >
                {copiedId === "unix-ms" ? <CheckIcon /> : <CopyIcon />}
                {copiedId === "unix-ms" ? "Copied" : "Copy"}
              </button>
            </div>

            <div style={{ ...styles.outputRow, marginBottom: 0 }}>
              <span style={styles.outputLabel}>Unix time (seconds)</span>
              <code style={styles.outputValue}>{String(unixSec)}</code>
              <button
                type="button"
                style={{
                  ...styles.copyBtn,
                  ...(copiedId === "unix-s" ? styles.copyBtnSuccess : {}),
                }}
                onClick={() => copy("unix-s", String(unixSec))}
                title={copiedId === "unix-s" ? "Copied!" : "Copy"}
              >
                {copiedId === "unix-s" ? <CheckIcon /> : <CopyIcon />}
                {copiedId === "unix-s" ? "Copied" : "Copy"}
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              padding: "24px 16px",
              border: "1px dashed #dee2e6",
              borderRadius: 4,
              backgroundColor: "#f8f9fa",
              textAlign: "center",
              color: "#6c757d",
              fontSize: 14,
            }}
          >
            Enter a valid UUID v7 in the left column to see the extracted timestamp here.
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default TimestampExtractionTool;
