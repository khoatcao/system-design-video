import React from "react";

export type NodeVariant =
  | "client"
  | "server"
  | "database"
  | "cache"
  | "queue"
  | "service";

export type NodeProps = {
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  variant?: NodeVariant;
  opacity?: number;
  scale?: number;
};

const variantStyles: Record<
  NodeVariant,
  {
    border: string;
    background: string;
  }
> = {
  client: {
    border: "#64748b",
    background: "#f8fafc",
  },
  server: {
    border: "#2563eb",
    background: "#eff6ff",
  },
  database: {
    border: "#7c3aed",
    background: "#f5f3ff",
  },
  cache: {
    border: "#059669",
    background: "#ecfdf5",
  },
  queue: {
    border: "#d97706",
    background: "#fffbeb",
  },
  service: {
    border: "#475569",
    background: "#f8fafc",
  },
};

export const Node: React.FC<NodeProps> = ({
  label,
  sublabel,
  x,
  y,
  width = 240,
  height = 100,
  variant = "service",
  opacity = 1,
  scale = 1,
}) => {
  const style = variantStyles[variant];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        border: `3px solid ${style.border}`,
        borderRadius: 18,
        backgroundColor: style.background,

        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",

        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        {label}
      </div>

      {sublabel && (
        <div
          style={{
            marginTop: 8,
            fontSize: 18,
            color: "#64748b",
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
};