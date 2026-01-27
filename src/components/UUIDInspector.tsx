import React, { useMemo } from "react";
import { getUUIDv7Fields } from "../utils/uuidUtils";

const styles = {
  panel: {
    marginTop: 12,
    padding: 16,
    background: "#f8f9fa",
    border: "1px solid #e9ecef",
    borderRadius: 8,
    fontFamily: "Inter, sans-serif",
  } as React.CSSProperties,
  heading: {
    fontWeight: 600,
    fontSize: 14,
    color: "#495057",
    marginBottom: 12,
  } as React.CSSProperties,
  uuidLine: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#495057",
    marginBottom: 16,
    lineHeight: 1.6,
    wordBreak: "break-all" as const,
  } as React.CSSProperties,
  segment: (active: boolean) =>
    ({
      padding: "1px 0",
      backgroundColor: active ? "rgba(11, 99, 233, 0.2)" : "transparent",
      color: active ? "#0B63E9" : "inherit",
      transition: "background-color 0.15s, color 0.15s",
    }) as React.CSSProperties,
  fieldList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  } as React.CSSProperties,
  fieldRow: (active: boolean) =>
    ({
      display: "flex",
      flexWrap: "wrap" as const,
      gap: 8,
      alignItems: "center",
      padding: "10px 12px",
      borderRadius: 6,
      border: `1px solid ${active ? "rgba(11, 99, 233, 0.35)" : "#e9ecef"}`,
      backgroundColor: active ? "rgba(11, 99, 233, 0.04)" : "#fff",
      cursor: "pointer",
      transition: "all 0.15s",
    }) as React.CSSProperties,
  fieldName: {
    fontWeight: 600,
    fontSize: 13,
    color: "#212529",
    flex: "1 1 100%",
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
    marginTop: 4,
  } as React.CSSProperties,
};

interface UUIDInspectorProps {
  uuid: string;
  activeFieldId: string | null;
  onFieldClick: (id: string | null) => void;
}

export default function UUIDInspector({
  uuid,
  activeFieldId,
  onFieldClick,
}: UUIDInspectorProps) {
  const fields = useMemo(() => getUUIDv7Fields(uuid), [uuid]);
  const activeField = useMemo(
    () => fields?.find((f) => f.id === activeFieldId) ?? null,
    [fields, activeFieldId]
  );

  if (!fields || fields.length === 0) {
    return (
      <div style={styles.panel}>
        <div style={styles.heading}>UUID v7 Inspector</div>
        <div style={{ ...styles.fieldMeta, color: "#6c757d" }}>
          Not a valid UUID v7. Inspector available when a UUID v7 is displayed.
        </div>
      </div>
    );
  }

  const highlightedRanges = new Set<string>();
  if (activeField) {
    for (const [a, b] of activeField.ranges) {
      for (let i = a; i < b; i++) highlightedRanges.add(String(i));
    }
  }

  const uuidWithHighlights = (() => {
    const out: React.ReactNode[] = [];
    for (let i = 0; i < uuid.length; i++) {
      const active = highlightedRanges.has(String(i));
      out.push(
        <span key={i} style={styles.segment(active)}>
          {uuid[i]}
        </span>
      );
    }
    return out;
  })();

  return (
    <div style={styles.panel}>
      <div style={styles.heading}>UUID v7 Inspector</div>
      <div style={{ fontSize: 12, color: "#6c757d", marginBottom: 12, fontStyle: "italic" }}>
        Click a field to highlight it in the UUID and see bit-level details.
      </div>
      <div style={styles.uuidLine}>{uuidWithHighlights}</div>
      <div style={styles.fieldList}>
        {fields.map((f) => {
          const active = f.id === activeFieldId;
          return (
            <div
              key={f.id}
              style={styles.fieldRow(active)}
              onClick={() => onFieldClick(active ? null : f.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onFieldClick(active ? null : f.id);
                }
              }}
            >
              <div style={styles.fieldName}>{f.name}</div>
              <div style={styles.fieldMeta}>
                {f.bits} bits · hex: {f.hex}
              </div>
              {active && <div style={styles.fieldBinary}>binary: {f.binary}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
