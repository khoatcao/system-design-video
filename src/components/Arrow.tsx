import React from "react";

export type ArrowProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity?: number;
  strokeWidth?: number;
  color?: string;
  animated?: boolean;
};

export const Arrow: React.FC<ArrowProps> = ({
  x1,
  y1,
  x2,
  y2,
  opacity = 1,
  strokeWidth = 5,
  color = "#475569",
  animated = false,
}) => {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const angle = Math.atan2(dy, dx);

  const arrowSize = 14;

  const arrowX1 = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
  const arrowY1 = y2 - arrowSize * Math.sin(angle - Math.PI / 6);

  const arrowX2 = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
  const arrowY2 = y2 - arrowSize * Math.sin(angle + Math.PI / 6);

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
        opacity,
      }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={animated ? "12 12" : undefined}
      />

      <polygon
        points={`${x2},${y2} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
        fill={color}
      />
    </svg>
  );
};