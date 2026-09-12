import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type PacketProps = {
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
  startFrame: number;
  durationInFrames: number;
  color?: string;
  size?: number;
};

export const Packet: React.FC<PacketProps> = ({
  from,
  to,
  startFrame,
  durationInFrames,
  color = "#2563eb",
  size = 18,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const x = from.x + (to.x - from.x) * progress;
  const y = from.y + (to.y - from.y) * progress;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,

        width: size,
        height: size,

        transform: "translate(-50%, -50%)",

        borderRadius: "50%",
        backgroundColor: color,

        boxShadow: `0 0 0 6px ${color}22`,
      }}
    />
  );
};