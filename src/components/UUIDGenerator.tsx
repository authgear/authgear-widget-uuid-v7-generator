import React, { useState, useEffect } from "react";

import { generateUUIDv7, parseUUIDv7Timestamp, formatUUID } from "../utils/uuidUtils";
import DateTimePicker from "./DateTimePicker";

// Styles
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
    backgroundColor: "#fff"
  },
  label: {
    fontWeight: 600,
    color: "#495057",
    fontSize: "14px",
    marginBottom: "6px",
    display: "block" as const,
    fontFamily: "Inter, sans-serif"
  },
  button: {
    background: "#0B63E9",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "10px 20px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    transition: "background-color 0.2s",
    width: "100%"
  },
  buttonSecondary: {
    background: "#fff",
    color: "#000",
    border: "1px solid #000",
    borderRadius: 4,
    padding: "10px 20px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    transition: "all 0.2s"
  },
  buttonDisabled: {
    background: "#6c757d",
    cursor: "not-allowed"
  },
  error: {
    color: "#721c24",
    marginTop: 16,
    padding: "12px",
    background: "#f8d7da",
    border: "1px solid #f5c6cb",
    borderRadius: 4,
    fontSize: 14,
    fontFamily: "Inter, sans-serif"
  },
  output: {
    background: "#f8f9fa",
    padding: 16,
    borderRadius: 4,
    fontSize: 14,
    marginTop: 6,
    border: "1px solid #e9ecef",
    fontFamily: "monospace",
    lineHeight: 1.5,
    color: "#495057",
    minHeight: "60px",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-all" as const,
    textAlign: "left" as const,
    overflow: "auto"
  },
  outputContainer: {
    position: "relative" as const
  },
  copyButton: {
    position: "absolute" as const,
    top: "10px",
    right: "10px",
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    padding: "4px",
    width: "28px",
    height: "28px",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    transition: "all 0.2s",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  copyButtonSuccess: {
    background: "#0B63E9",
    color: "#fff",
    border: "none"
  }
};

type TimestampMode = 'now' | 'custom';

const UUIDGenerator: React.FC = () => {
  const [count, setCount] = useState<number>(1);
  const [generatedUUIDs, setGeneratedUUIDs] = useState<string[]>([]);
  const [timestampMode, setTimestampMode] = useState<TimestampMode>('now');
  const [inputMethod, setInputMethod] = useState<'datetime-picker' | 'iso' | 'unix'>('datetime-picker');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isoDatetime, setIsoDatetime] = useState<string>("");
  const [unixTimestamp, setUnixTimestamp] = useState<string>("");
  const format = 'standard'; // Always use standard format (lowercase with hyphens)
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [copiedUUIDIndex, setCopiedUUIDIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  // Generate 1 UUID on component mount
  useEffect(() => {
    const uuid = generateUUIDv7();
    setGeneratedUUIDs([formatUUID(uuid, format)]);
  }, []);

  // Helper function to parse timestamp from different formats
  const parseTimestamp = (value: string, format: 'iso' | 'unix' | 'datetime-local'): number | null => {
    if (!value.trim()) return null;
    
    try {
      if (format === 'unix') {
        const parsed = parseInt(value.trim(), 10);
        if (isNaN(parsed) || parsed < 0) return null;
        return parsed;
      } else if (format === 'iso') {
        const date = new Date(value.trim());
        if (isNaN(date.getTime())) return null;
        return date.getTime();
      } else if (format === 'datetime-local') {
        const date = new Date(value.trim());
        if (isNaN(date.getTime())) return null;
        return date.getTime();
      }
      return null;
    } catch {
      return null;
    }
  };

  // Update timestamp from date picker
  const updateTimestampFromDatePicker = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const timestamp = date.getTime();
      setUnixTimestamp(timestamp.toString());
      setIsoDatetime(date.toISOString());
    } else {
      setUnixTimestamp("");
      setIsoDatetime("");
    }
  };

  // Update timestamp from ISO datetime
  const updateTimestampFromISO = (value: string) => {
    setIsoDatetime(value);
    const timestamp = parseTimestamp(value, 'iso');
    if (timestamp !== null) {
      setUnixTimestamp(timestamp.toString());
      setSelectedDate(new Date(timestamp));
    } else if (!value.trim()) {
      setUnixTimestamp("");
      setSelectedDate(null);
    }
  };

  // Update timestamp from Unix timestamp
  const updateTimestampFromUnix = (value: string) => {
    setUnixTimestamp(value);
    const timestamp = parseTimestamp(value, 'unix');
    if (timestamp !== null) {
      setIsoDatetime(new Date(timestamp).toISOString());
      setSelectedDate(new Date(timestamp));
    } else if (!value.trim()) {
      setIsoDatetime("");
      setSelectedDate(null);
    }
  };

  const handleGenerate = () => {
    setError("");
    setCopySuccess(false);
    setCopiedUUIDIndex(null);

    let timestamp: number | undefined = undefined;

    if (timestampMode === 'custom') {
      if (inputMethod === 'datetime-picker' && selectedDate) {
        timestamp = selectedDate.getTime();
      } else if (inputMethod === 'iso' && isoDatetime) {
        const parsed = parseTimestamp(isoDatetime, 'iso');
        if (parsed === null) {
          setError("Please enter a valid timestamp in one of the formats (Unix timestamp, ISO datetime, or datetime picker).");
          setGeneratedUUIDs([]);
          return;
        }
        timestamp = parsed;
      } else if (inputMethod === 'unix' && unixTimestamp) {
        const parsed = parseTimestamp(unixTimestamp, 'unix');
        if (parsed === null) {
          setError("Please enter a valid timestamp in one of the formats (Unix timestamp, ISO datetime, or datetime picker).");
          setGeneratedUUIDs([]);
          return;
        }
        timestamp = parsed;
      } else {
        setError("Please enter a valid timestamp in one of the formats (Unix timestamp, ISO datetime, or datetime picker).");
        setGeneratedUUIDs([]);
        return;
      }
    }

    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
      const uuid = generateUUIDv7(timestamp);
      uuids.push(formatUUID(uuid, format));
    }
    setGeneratedUUIDs(uuids);
  };

  const handleCopy = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedUUIDIndex(index);
      setTimeout(() => setCopiedUUIDIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy UUID to clipboard:", err);
    }
  };

  const [copySuccessISO, setCopySuccessISO] = useState<boolean>(false);
  const [copySuccessUnix, setCopySuccessUnix] = useState<boolean>(false);

  const handleCopyISO = async () => {
    if (isoDatetime) {
      try {
        await navigator.clipboard.writeText(isoDatetime);
        setCopySuccessISO(true);
        setTimeout(() => setCopySuccessISO(false), 2000);
      } catch (err) {
        console.error("Failed to copy ISO datetime to clipboard:", err);
      }
    }
  };

  const handleCopyUnix = async () => {
    if (unixTimestamp) {
      try {
        await navigator.clipboard.writeText(unixTimestamp);
        setCopySuccessUnix(true);
        setTimeout(() => setCopySuccessUnix(false), 2000);
      } catch (err) {
        console.error("Failed to copy Unix timestamp to clipboard:", err);
      }
    }
  };

  const handleCopyAll = async () => {
    if (generatedUUIDs.length === 0) return;
    
    try {
      const textToCopy = generatedUUIDs.join('\n');
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy UUIDs to clipboard:", err);
    }
  };

  const getTimestampInfo = (uuid: string): string | null => {
    // Remove hyphens for parsing
    const uuidForParsing = uuid.replace(/-/g, '');
    const timestamp = parseUUIDv7Timestamp(uuidForParsing);
    if (timestamp === null) return null;
    
    const date = new Date(timestamp);
    return `${date.toISOString()} (${timestamp} ms)`;
  };

  return (
    <div style={{ 
      fontFamily: "Inter, sans-serif", 
      color: "#495057", 
      padding: "16px", 
      width: "100%", 
      height: "100%", 
      boxSizing: "border-box", 
      overflow: "auto" 
    }}>
      <div style={{ 
        display: "flex", 
        gap: "16px", 
        alignItems: "stretch",
        flexWrap: "wrap" as const
      }}>
        {/* Left Column: Controls */}
        <div style={{ 
          flex: "1 1 400px",
          minWidth: "280px",
          width: "100%",
          padding: "20px",
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          boxSizing: "border-box" as const,
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Number of UUIDs to generate</label>
            <select
              value={count}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value >= 1 && value <= 10) {
                  setCount(value);
                }
              }}
              style={styles.input}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <div style={{ 
              marginTop: 4, 
              fontSize: "12px", 
              color: "#6c757d",
              fontStyle: "italic"
            }}>
              Generate between 1 and 10 UUIDs at once
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Timestamp Mode</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <label style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                border: `1px solid ${timestampMode === 'now' ? '#0B63E9' : '#dee2e6'}`,
                borderRadius: "4px",
                backgroundColor: timestampMode === 'now' ? 'rgba(11, 99, 233, 0.1)' : '#fff',
                cursor: "pointer",
                fontSize: "13px",
                transition: "all 0.2s"
              }}>
                <input
                  type="radio"
                  name="timestampMode"
                  value="now"
                  checked={timestampMode === "now"}
                  onChange={(e) => setTimestampMode(e.target.value as TimestampMode)}
                  style={{ 
                    width: "14px", 
                    height: "14px", 
                    cursor: "pointer",
                    accentColor: "#0B63E9"
                  }}
                />
                <span>Now</span>
              </label>
              <label style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                border: `1px solid ${timestampMode === 'custom' ? '#0B63E9' : '#dee2e6'}`,
                borderRadius: "4px",
                backgroundColor: timestampMode === 'custom' ? 'rgba(11, 99, 233, 0.1)' : '#fff',
                cursor: "pointer",
                fontSize: "13px",
                transition: "all 0.2s"
              }}>
                <input
                  type="radio"
                  name="timestampMode"
                  value="custom"
                  checked={timestampMode === "custom"}
                  onChange={(e) => setTimestampMode(e.target.value as TimestampMode)}
                  style={{ 
                    width: "14px", 
                    height: "14px", 
                    cursor: "pointer",
                    accentColor: "#0B63E9"
                  }}
                />
                <span>Set a time</span>
              </label>
            </div>
            
            {timestampMode === 'custom' && (
              <div style={{ 
                marginTop: 16,
                padding: "16px",
                border: "1px solid #e9ecef",
                borderRadius: "4px",
                backgroundColor: "#f8f9fa"
              }}>
                {/* Input method selector */}
                <div style={{ marginBottom: 16 }}>
                  <label style={styles.label}>Input Method</label>
                  <div style={{ 
                    display: "flex", 
                    gap: "8px",
                    flexWrap: "wrap" as const
                  }}>
                    <label style={{
                      flex: "1 1 0",
                      minWidth: "120px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      minHeight: "40px",
                      border: `1px solid ${inputMethod === 'datetime-picker' ? '#0B63E9' : '#dee2e6'}`,
                      borderRadius: "4px",
                      backgroundColor: inputMethod === 'datetime-picker' ? 'rgba(11, 99, 233, 0.1)' : '#fff',
                      cursor: "pointer",
                      fontSize: "13px",
                      transition: "all 0.2s"
                    }}>
                      <input
                        type="radio"
                        name="inputMethod"
                        value="datetime-picker"
                        checked={inputMethod === 'datetime-picker'}
                        onChange={(e) => setInputMethod(e.target.value as 'datetime-picker' | 'iso' | 'unix')}
                        style={{ 
                          width: "14px", 
                          height: "14px", 
                          cursor: "pointer",
                          accentColor: "#0B63E9"
                        }}
                      />
                      <span>Datetime Picker</span>
                    </label>
                    <label style={{
                      flex: "1 1 0",
                      minWidth: "120px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      minHeight: "40px",
                      border: `1px solid ${inputMethod === 'iso' ? '#0B63E9' : '#dee2e6'}`,
                      borderRadius: "4px",
                      backgroundColor: inputMethod === 'iso' ? 'rgba(11, 99, 233, 0.1)' : '#fff',
                      cursor: "pointer",
                      fontSize: "13px",
                      transition: "all 0.2s"
                    }}>
                      <input
                        type="radio"
                        name="inputMethod"
                        value="iso"
                        checked={inputMethod === 'iso'}
                        onChange={(e) => setInputMethod(e.target.value as 'datetime-picker' | 'iso' | 'unix')}
                        style={{ 
                          width: "14px", 
                          height: "14px", 
                          cursor: "pointer",
                          accentColor: "#0B63E9"
                        }}
                      />
                      <span>ISO Datetime</span>
                    </label>
                    <label style={{
                      flex: "1 1 0",
                      minWidth: "120px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      minHeight: "40px",
                      border: `1px solid ${inputMethod === 'unix' ? '#0B63E9' : '#dee2e6'}`,
                      borderRadius: "4px",
                      backgroundColor: inputMethod === 'unix' ? 'rgba(11, 99, 233, 0.1)' : '#fff',
                      cursor: "pointer",
                      fontSize: "13px",
                      transition: "all 0.2s"
                    }}>
                      <input
                        type="radio"
                        name="inputMethod"
                        value="unix"
                        checked={inputMethod === 'unix'}
                        onChange={(e) => setInputMethod(e.target.value as 'datetime-picker' | 'iso' | 'unix')}
                        style={{ 
                          width: "14px", 
                          height: "14px", 
                          cursor: "pointer",
                          accentColor: "#0B63E9"
                        }}
                      />
                      <span>Unix Time</span>
                    </label>
                  </div>
                </div>

                {/* Show only selected input method */}
                {inputMethod === 'datetime-picker' && (
                  <div>
                    <label style={styles.label}>Datetime Picker</label>
                    <DateTimePicker
                      value={selectedDate}
                      onChange={updateTimestampFromDatePicker}
                    />
                    <div style={{ 
                      marginTop: 8, 
                      fontSize: "12px", 
                      color: "#6c757d",
                      fontStyle: "italic"
                    }}>
                      Select date and time (local timezone)
                    </div>
                  </div>
                )}

                {inputMethod === 'iso' && (
                  <div>
                    <label style={styles.label}>ISO Datetime</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        value={isoDatetime}
                        onChange={(e) => updateTimestampFromISO(e.target.value)}
                        placeholder="e.g., 2024-01-01T00:00:00.000Z"
                        style={{
                          ...styles.input,
                          padding: "10px 12px"
                        }}
                      />
                      {isoDatetime && (
                        <button
                          onClick={handleCopyISO}
                          style={{
                            ...styles.copyButton,
                            ...(copySuccessISO ? { background: "#f8f9fa", color: "#000" } : {}),
                            background: copySuccessISO ? "#f8f9fa" : "#f8f9fa",
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)"
                          }}
                          title={copySuccessISO ? "Copied!" : "Copy"}
                        >
                          {copySuccessISO ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                    <div style={{ 
                      marginTop: 4, 
                      fontSize: "12px", 
                      color: "#6c757d",
                      fontStyle: "italic"
                    }}>
                      ISO 8601 format (UTC)
                    </div>
                  </div>
                )}

                {inputMethod === 'unix' && (
                  <div>
                    <label style={styles.label}>Unix Timestamp (milliseconds)</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        value={unixTimestamp}
                        onChange={(e) => updateTimestampFromUnix(e.target.value)}
                        placeholder="e.g., 1704067200000"
                        style={{
                          ...styles.input,
                          padding: "10px 12px"
                        }}
                      />
                      {unixTimestamp && (
                        <button
                          onClick={handleCopyUnix}
                          style={{
                            ...styles.copyButton,
                            ...(copySuccessUnix ? { background: "#f8f9fa", color: "#000" } : {}),
                            background: copySuccessUnix ? "#f8f9fa" : "#f8f9fa",
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)"
                          }}
                          title={copySuccessUnix ? "Copied!" : "Copy"}
                        >
                          {copySuccessUnix ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                    <div style={{ 
                      marginTop: 4, 
                      fontSize: "12px", 
                      color: "#6c757d",
                      fontStyle: "italic"
                    }}>
                      Milliseconds since Unix epoch (January 1, 1970)
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div style={{ 
              marginTop: 8, 
              fontSize: "12px", 
              color: "#6c757d",
              fontStyle: "italic"
            }}>
              {timestampMode === 'now' 
                ? "UUIDs will use the current timestamp"
                : "All generated UUIDs will use the specified timestamp"}
            </div>
          </div>

          {/* Generate Button */}
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={handleGenerate}
              style={styles.button}
            >
              Generate UUIDs
            </button>
          </div>

          {error && (
            <div style={styles.error}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Right Column: Generated UUIDs Output */}
        <div style={{ 
          flex: "1 1 400px",
          minWidth: "280px",
          width: "100%",
          padding: "20px",
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          boxSizing: "border-box" as const,
          display: "flex",
          flexDirection: "column"
        }}>
          {generatedUUIDs.length > 0 ? (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <label style={styles.label}>
                  Generated UUIDs ({generatedUUIDs.length})
                </label>
                {generatedUUIDs.length > 1 && (
                  <button
                    onClick={handleCopyAll}
                    style={{
                      ...styles.buttonSecondary,
                      ...(copySuccess ? styles.copyButtonSuccess : {}),
                      padding: "6px 12px",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      minWidth: "95px",
                      height: "29px",
                      justifyContent: "center",
                      boxSizing: "border-box" as const
                    }}
                  >
                    {copySuccess ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                        </svg>
                        Copy All
                      </>
                    )}
                  </button>
                )}
              </div>
              <div style={styles.outputContainer}>
                <div style={{
                  ...styles.output,
                  border: "none",
                  padding: 0,
                  backgroundColor: "transparent"
                }}>
                  {generatedUUIDs.map((uuid, index) => {
                    const timestampInfo = getTimestampInfo(uuid);
                    return (
                      <div 
                        key={index} 
                        style={{ 
                          marginBottom: index < generatedUUIDs.length - 1 ? "12px" : 0
                        }}
                      >
                      <div style={{
                        padding: "12px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: "4px"
                      }}>
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "8px",
                          marginBottom: timestampInfo ? "8px" : "0"
                        }}>
                          <code style={{ 
                            fontSize: "14px",
                            color: "#495057",
                            fontFamily: "monospace",
                            flex: 1,
                            wordBreak: "break-all" as const
                          }}>
                            {uuid}
                          </code>
                          <button
                            onClick={() => handleCopy(uuid, index)}
                            style={{
                              ...styles.copyButton,
                              ...(copiedUUIDIndex === index ? styles.copyButtonSuccess : {}),
                              position: "static" as const,
                              flexShrink: 0
                            }}
                            title={copiedUUIDIndex === index ? "Copied!" : "Copy"}
                          >
                            {copiedUUIDIndex === index ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                              </svg>
                            )}
                          </button>
                        </div>
                        {timestampInfo && (
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#6c757d",
                            paddingTop: "8px",
                            borderTop: "1px solid #e9ecef"
                          }}>
                            {timestampInfo}
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <label style={styles.label}>Generated UUIDs</label>
              <div style={{
                marginTop: "12px",
                padding: "40px 16px",
                border: "1px dashed #dee2e6",
                borderRadius: "4px",
                backgroundColor: "#f8f9fa",
                textAlign: "center" as const,
                color: "#6c757d",
                fontSize: "14px"
              }}>
                No UUIDs generated yet
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UUIDGenerator;
