import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Node } from "../components/Node";
import { Arrow } from "../components/Arrow";
import { Packet } from "../components/Packet";

export const LoadBalancerScene: React.FC = () => {
  const frame = useCurrentFrame();

  const clientOpacity = Math.min(frame / 15, 1);

  const serverOpacity = Math.max(
    0,
    Math.min((frame - 20) / 15, 1),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Node
        label="Client"
        sublabel="User"
        x={540}
        y={220}
        variant="client"
        opacity={clientOpacity}
      />

      <Node
        label="Load Balancer"
        sublabel="Traffic Router"
        x={540}
        y={500}
        variant="server"
        opacity={serverOpacity}
      />

      <Node
        label="Server 1"
        x={280}
        y={800}
        variant="service"
        opacity={serverOpacity}
      />

      <Node
        label="Server 2"
        x={540}
        y={800}
        variant="service"
        opacity={serverOpacity}
      />

      <Node
        label="Server 3"
        x={800}
        y={800}
        variant="service"
        opacity={serverOpacity}
      />

      <Arrow
        x1={540}
        y1={270}
        x2={540}
        y2={450}
        opacity={serverOpacity}
      />

      <Arrow
        x1={500}
        y1={550}
        x2={280}
        y2={740}
        opacity={serverOpacity}
      />

      <Arrow
        x1={540}
        y1={550}
        x2={540}
        y2={740}
        opacity={serverOpacity}
      />

      <Arrow
        x1={580}
        y1={550}
        x2={800}
        y2={740}
        opacity={serverOpacity}
      />

      <Packet
        from={{ x: 540, y: 270 }}
        to={{ x: 540, y: 450 }}
        startFrame={30}
        durationInFrames={30}
      />
    </AbsoluteFill>
  );
};