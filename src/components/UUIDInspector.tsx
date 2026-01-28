import React, { useMemo } from "react";
import { getUUIDv7Fields } from "../utils/uuidUtils";

/** Match colors used in UUID highlight (timestamp, version, rand12, variant, random62) */
const FIELD_COLORS = [
  "rgba(11, 99, 233, 0.25)",   // timestamp – blue
  "rgba(168, 85, 247, 0.25)",  // version – purple
  "rgba(234, 179, 8, 0.3)",    // rand 12 – yellow
  "rgba(249, 115, 22, 0.3)",   // variant – orange
  "rgba(20, 184, 166, 0.25)",  // random 62 – teal
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
}

export default function UUIDInspector({ uuid }: UUIDInspectorProps) {
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
      <div style={{ fontSize: 12, color: "#6c757d", marginBottom: 12, fontStyle: "italic" }}>
        Field colors match the segments in the UUID above.
      </div>
      <div style={styles.fieldList}>
        {fields.map((f, idx) => {
          const color: string = FIELD_COLORS[idx % FIELD_COLORS.length] ?? "rgba(11, 99, 233, 0.25)";
          return (
            <div key={f.id} style={styles.fieldRow(color)}>
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
