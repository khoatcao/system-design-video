import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BG =
  "radial-gradient(circle at 50% 10%, #145A43 0%, #0B3D2E 45%, #06281E 100%)";

const COLORS = {
  green: "#1FD1A5",
  blue: "#4DB8FF",
  purple: "#9B7CFF",
  mint: "#76F7D4",
  orange: "#FFB86C",
  pink: "#FF6B9D",
  white: "#F4FFFB",
  muted: "#A8CFC2",
  panel: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.14)",
};

type BoxProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  subtitle?: string;
  color: string;
  frame: number;
  delay: number;
};

const Box: React.FC<BoxProps> = ({
  x,
  y,
  width,
  height,
  title,
  subtitle,
  color,
  frame,
  delay,
}) => {
  const progress = interpolate(
    frame,
    [delay, delay + 15],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const opacity = progress;
  const scale = interpolate(progress, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        opacity,
        transform: `scale(${scale})`,
        borderRadius: 24,
        border: `2px solid ${color}`,
        background: "rgba(5, 35, 27, 0.92)",
        boxShadow: `0 0 35px ${color}30`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 18px ${color}`,
          marginBottom: 14,
        }}
      />

      <div
        style={{
          color: COLORS.white,
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        {title}
      </div>

      {subtitle && (
        <div
          style={{
            color: COLORS.muted,
            fontSize: 18,
            marginTop: 8,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};

type ArrowProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  frame: number;
  delay: number;
};

const Arrow: React.FC<ArrowProps> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  frame,
  delay,
}) => {
  const progress = interpolate(
    frame,
    [delay, delay + 15],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const currentX = x1 + (x2 - x1) * progress;
  const currentY = y1 + (y2 - y1) * progress;

  const angle = Math.atan2(y2 - y1, x2 - x1);

  return (
    <>
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        <line
          x1={x1}
          y1={y1}
          x2={currentX}
          y2={currentY}
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.8}
        />
      </svg>

      {progress > 0.8 && (
        <div
          style={{
            position: "absolute",
            left: currentX - 10,
            top: currentY - 10,
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderLeft: `18px solid ${color}`,
            transform: `rotate(${angle}rad)`,
            transformOrigin: "center",
          }}
        />
      )}
    </>
  );
};

const Packet: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startFrame: number;
  color: string;
}> = ({ startX, startY, endX, endY, startFrame, color }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + 35],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const x = startX + (endX - startX) * progress;
  const y = startY + (endY - startY) * progress;

  return (
    <div
      style={{
        position: "absolute",
        left: x - 10,
        top: y - 10,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 25px ${color}`,
        opacity:
          progress > 0 && progress < 1 ? 1 : 0,
      }}
    />
  );
};

export const SystemDesignScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const titleOpacity = interpolate(
    frame,
    [0, 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const subtitleOpacity = interpolate(
    frame,
    [20, 35],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const traffic = interpolate(
    frame,
    [300, 900],
    [1000, 1000000],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        background: BG,
        color: COLORS.white,
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          position: "absolute",
          top: 90,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontSize: 62,
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          What is System Design?
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 25,
            color: COLORS.mint,
            opacity: subtitleOpacity,
          }}
        >
          Turning a simple application into a system that can scale.
        </div>
      </div>

      {/* SECTION 1 — CLIENT */}

      <div
        style={{
          position: "absolute",
          top: 350,
          left: 0,
          width,
          height: 300,
        }}
      >
        <Box
          x={390}
          y={0}
          width={300}
          height={150}
          title="Users"
          subtitle="1 request"
          color={COLORS.green}
          frame={frame}
          delay={60}
        />

        <div
          style={{
            position: "absolute",
            top: 175,
            width: "100%",
            textAlign: "center",
            fontSize: 24,
            color: COLORS.muted,
            opacity: interpolate(
              frame,
              [70, 90],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            ),
          }}
        >
          A simple app works...
        </div>
      </div>

      {/* SECTION 2 — SINGLE SERVER */}

      <Box
        x={390}
        y={680}
        width={300}
        height={160}
        title="Application"
        subtitle="Single Server"
        color={COLORS.orange}
        frame={frame}
        delay={120}
      />

      <Arrow
        x1={540}
        y1={650}
        x2={540}
        y2={680}
        color={COLORS.green}
        frame={frame}
        delay={110}
      />

      {/* LOAD INCREASE */}

      <div
        style={{
          position: "absolute",
          top: 880,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: interpolate(
            frame,
            [220, 240],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          ),
        }}
      >
        <div
          style={{
            fontSize: 27,
            color: COLORS.pink,
            fontWeight: 700,
          }}
        >
          Traffic keeps growing
        </div>

        <div
          style={{
            marginTop: 15,
            fontSize: 38,
            fontWeight: 800,
            color: COLORS.white,
          }}
        >
          {Math.round(traffic).toLocaleString()} requests
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 21,
            color: COLORS.muted,
          }}
        >
          One server is no longer enough.
        </div>
      </div>

      {/* SECTION 3 — SCALING */}

      <Box
        x={100}
        y={1080}
        width={280}
        height={145}
        title="Load Balancer"
        subtitle="Distribute traffic"
        color={COLORS.blue}
        frame={frame}
        delay={300}
      />

      <Box
        x={450}
        y={1080}
        width={220}
        height={145}
        title="API"
        subtitle="Server 1"
        color={COLORS.green}
        frame={frame}
        delay={340}
      />

      <Box
        x={730}
        y={1080}
        width={220}
        height={145}
        title="API"
        subtitle="Server 2"
        color={COLORS.green}
        frame={frame}
        delay={370}
      />

      <Arrow
        x1={540}
        y1={1035}
        x2={240}
        y2={1080}
        color={COLORS.blue}
        frame={frame}
        delay={285}
      />

      <Arrow
        x1={380}
        y1={1152}
        x2={450}
        y2={1152}
        color={COLORS.blue}
        frame={frame}
        delay={330}
      />

      <Arrow
        x1={670}
        y1={1152}
        x2={730}
        y2={1152}
        color={COLORS.blue}
        frame={frame}
        delay={350}
      />

      {/* PACKETS */}

      <Packet
        startX={250}
        startY={1160}
        endX={450}
        endY={1152}
        startFrame={430}
        color={COLORS.mint}
      />

      <Packet
        startX={250}
        startY={1170}
        endX={730}
        endY={1152}
        startFrame={455}
        color={COLORS.purple}
      />

      {/* SECTION 4 — DATA LAYER */}

      <Box
        x={150}
        y={1350}
        width={240}
        height={145}
        title="Cache"
        subtitle="Fast data"
        color={COLORS.purple}
        frame={frame}
        delay={600}
      />

      <Box
        x={610}
        y={1350}
        width={300}
        height={145}
        title="Database"
        subtitle="Persistent data"
        color={COLORS.orange}
        frame={frame}
        delay={640}
      />

      <Arrow
        x1={590}
        y1={1225}
        x2={270}
        y2={1350}
        color={COLORS.purple}
        frame={frame}
        delay={570}
      />

      <Arrow
        x1={670}
        y1={1225}
        x2={760}
        y2={1350}
        color={COLORS.orange}
        frame={frame}
        delay={610}
      />

      {/* FINAL MESSAGE */}

      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: interpolate(
            frame,
            [850, 880],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          ),
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          Scalability • Reliability • Performance
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 23,
            color: COLORS.mint,
          }}
        >
          That’s System Design.
        </div>
      </div>
    </AbsoluteFill>
  );
};