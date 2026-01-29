import React, { useMemo } from "react";
import { getUUIDv7Fields } from "../utils/uuidUtils";

/** Segment colors: same as UUID highlight, ≥4.5:1 with #1e293b (WCAG 2.1 AA). Random segments use softer tints. Order: timestamp, version, rand12, variant, random62. */
const FIELD_COLORS = [
  "#BFDBFE",  // timestamp – blue
  "#DDD6FE",  // version – purple
  "#FEF9C3",  // rand 12 – soft yellow
  "#FED7AA",  // variant – orange
  "#CCFBF1",  // random 62 – soft teal
];

const styles = {
  panel: {
    marginTop: 12,
    padding: 16,
    background: "#f8f9fa",
    border: "1px solid #e9ecef",
    borderRadius: 8,
    fontFamily: "Inter, sans-serif",
  } as React.CSSProperties,
  fieldList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  } as React.CSSProperties,
  fieldRow: (_color: string) =>
    ({
      display: "flex",
      flexDirection: "column" as const,
      gap: 4,
      padding: "10px 12px",
      borderRadius: 6,
      backgroundColor: "#fff",
      border: "1px solid #e9ecef",
    }) as React.CSSProperties,
  fieldName: {
    fontWeight: 600,
    fontSize: 13,
    color: "#212529",
    display: "flex",
    alignItems: "center",
    gap: 6,
  } as React.CSSProperties,
  fieldMeta: {
    fontSize: 12,
    color: "#6c757d",
    fontFamily: "monospace",
  } as React.CSSProperties,
  fieldBinary: {
    fontSize: 11,
    color: "#495057",
    fontFamily: "monospace",
    wordBreak: "break-all" as const,
    width: "100%",
    marginTop: 2,
  } as React.CSSProperties,
};

interface UUIDInspectorProps {
  uuid: string;
  onFieldMouseEnter?: (fieldIndex: number) => void;
  onFieldMouseLeave?: () => void;
}

export default function UUIDInspector({ uuid, onFieldMouseEnter, onFieldMouseLeave }: UUIDInspectorProps) {
  const fields = useMemo(() => getUUIDv7Fields(uuid), [uuid]);

  if (!fields || fields.length === 0) {
    return (
      <div style={styles.panel}>
        <div style={{ ...styles.fieldMeta, color: "#6c757d" }}>
          Not a valid UUID v7. Inspector available when a UUID v7 is displayed.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      <style>
        {`.uuid-field-row:hover { background-color: #f8f9fa !important; }`}
      </style>
      <div style={{ fontSize: 12, color: "#6c757d", marginBottom: 12, fontStyle: "italic" }}>
        Field colors match the segments in the UUID above.
      </div>
      <div style={styles.fieldList}>
        {fields.map((f, idx) => {
          const color: string = FIELD_COLORS[idx % FIELD_COLORS.length] ?? "#BFDBFE";
          return (
            <div
              key={f.id}
              className="uuid-field-row"
              style={styles.fieldRow(color)}
              onMouseEnter={() => onFieldMouseEnter?.(idx)}
              onMouseLeave={onFieldMouseLeave}
            >
              <div style={styles.fieldName}>
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: color,
                  flexShrink: 0
                }} />
                <span>{f.name}</span>
              </div>
              <div style={styles.fieldMeta}>
                {f.bits} bits · hex: {f.hex}
              </div>
              <div style={styles.fieldBinary}>binary: {f.binary}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
