import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BG =
  "radial-gradient(circle at 50% 15%, #162B45 0%, #0B1626 45%, #060B12 100%)";

const GRID =
  "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), " +
  "linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)";

const COLORS = {
  green: "#1FD1A5",
  blue: "#4DB8FF",
  purple: "#9B7CFF",
  mint: "#76F7D4",
  orange: "#FFB86C",
  pink: "#FF6B9D",
  red: "#FF5268",
  white: "#F4FFFB",
  muted: "#D0A9B1",
  panel: "rgba(255,255,255,0.07)",
};

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

/* ============================================================
   VISUAL ICONS
   ============================================================ */

type IconType =
  | "server"
  | "servers"
  | "users"
  | "database"
  | "databases"
  | "load-balancer"
  | "cache"
  | "shard"
  | "shield"
  | "chart"
  | "target"
  | "contract"
  | "replication"
  | "queue"
  | "event"
  | "api"
  | "network"
  | "lock"
  | "logs"
  | "metrics"
  | "traces"
  | "latency"
  | "throughput"
  | "cap";

const VisualIcon: React.FC<{
  type: IconType;
  color: string;
  size?: number;
}> = ({ type, color, size = 72 }) => {
  const stroke = color;
  const sw = 3.5;

  const common = {
    fill: "none",
    stroke,
    strokeWidth: sw,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        overflow: "visible",
        filter: `drop-shadow(0 0 10px ${color}45)`,
      }}
    >
      {/* SERVER */}
      {type === "server" && (
        <>
          <rect x="22" y="15" width="56" height="70" rx="7" {...common} />
          <line x1="30" y1="35" x2="70" y2="35" {...common} />
          <line x1="30" y1="58" x2="70" y2="58" {...common} />
          <circle cx="35" cy="26" r="3" fill={color} />
          <circle cx="35" cy="49" r="3" fill={color} />
          <circle cx="35" cy="72" r="3" fill={color} />
          <line x1="45" y1="26" x2="65" y2="26" {...common} />
          <line x1="45" y1="49" x2="65" y2="49" {...common} />
          <line x1="45" y1="72" x2="65" y2="72" {...common} />
        </>
      )}

      {/* MULTIPLE SERVERS */}
      {type === "servers" && (
        <>
          <rect x="12" y="25" width="42" height="52" rx="6" {...common} />
          <rect x="46" y="17" width="42" height="52" rx="6" {...common} />
          <circle cx="23" cy="38" r="3" fill={color} />
          <circle cx="57" cy="30" r="3" fill={color} />
          <line x1="31" y1="38" x2="45" y2="38" {...common} />
          <line x1="65" y1="30" x2="79" y2="30" {...common} />
          <line x1="22" y1="52" x2="45" y2="52" {...common} />
          <line x1="56" y1="44" x2="79" y2="44" {...common} />
        </>
      )}

      {/* USERS */}
      {type === "users" && (
        <>
          <circle cx="50" cy="27" r="12" {...common} />
          <path d="M28 72c2-15 12-23 22-23s20 8 22 23" {...common} />
          <circle cx="20" cy="38" r="8" {...common} opacity={0.75} />
          <path d="M8 68c1-10 7-15 14-15" {...common} opacity={0.75} />
          <circle cx="80" cy="38" r="8" {...common} opacity={0.75} />
          <path d="M92 68c-1-10-7-15-14-15" {...common} opacity={0.75} />
        </>
      )}

      {/* DATABASE */}
      {(type === "database" || type === "databases") && (
        <>
          {type === "database" ? (
            <>
              <ellipse cx="50" cy="25" rx="30" ry="11" {...common} />
              <path d="M20 25v43c0 7 13 12 30 12s30-5 30-12V25" {...common} />
              <path d="M20 47c0 7 13 12 30 12s30-5 30-12" {...common} />
              <path d="M20 25c0 7 13 12 30 12s30-5 30-12" {...common} />
            </>
          ) : (
            <>
              <ellipse cx="30" cy="28" rx="20" ry="8" {...common} />
              <path d="M10 28v32c0 5 9 8 20 8s20-3 20-8V28" {...common} />
              <ellipse cx="70" cy="28" rx="20" ry="8" {...common} />
              <path d="M50 28v32c0 5 9 8 20 8s20-3 20-8V28" {...common} />
              <line x1="30" y1="68" x2="50" y2="68" {...common} />
            </>
          )}
        </>
      )}

      {/* LOAD BALANCER */}
      {type === "load-balancer" && (
        <>
          <rect x="25" y="35" width="50" height="30" rx="7" {...common} />
          <path d="M50 18v17" {...common} />
          <path d="M50 65v17" {...common} />
          <path d="M50 18l-7 8" {...common} />
          <path d="M50 18l7 8" {...common} />
          <path d="M50 82l-7-8" {...common} />
          <path d="M50 82l7-8" {...common} />
          <line x1="35" y1="45" x2="65" y2="45" {...common} />
          <line x1="35" y1="55" x2="65" y2="55" {...common} />
        </>
      )}

      {/* CACHE */}
      {type === "cache" && (
        <>
          <path
            d="M20 32h60v45H20z"
            {...common}
          />
          <path d="M20 32l10-12h60L80 32" {...common} />
          <path d="M80 32v45L90 65V20" {...common} />
          <path d="M34 45h32M34 57h20" {...common} />
        </>
      )}

      {/* SHARD */}
      {type === "shard" && (
        <>
          <rect x="12" y="18" width="22" height="64" rx="5" {...common} />
          <rect x="39" y="18" width="22" height="64" rx="5" {...common} />
          <rect x="66" y="18" width="22" height="64" rx="5" {...common} />
          <path d="M23 35v28M50 35v28M77 35v28" {...common} />
        </>
      )}

      {/* SHIELD */}
      {type === "shield" && (
        <>
          <path
            d="M50 12L78 23v23c0 20-12 31-28 41C34 77 22 66 22 46V23z"
            {...common}
          />
          <path d="M35 49l10 10 20-23" {...common} />
        </>
      )}

      {/* CHART */}
      {type === "chart" && (
        <>
          <line x1="18" y1="82" x2="18" y2="18" {...common} />
          <line x1="18" y1="82" x2="88" y2="82" {...common} />
          <polyline points="25,68 42,54 53,61 72,35 86,43" {...common} />
          <circle cx="25" cy="68" r="3" fill={color} />
          <circle cx="42" cy="54" r="3" fill={color} />
          <circle cx="53" cy="61" r="3" fill={color} />
          <circle cx="72" cy="35" r="3" fill={color} />
        </>
      )}

      {/* TARGET */}
      {type === "target" && (
        <>
          <circle cx="50" cy="50" r="32" {...common} />
          <circle cx="50" cy="50" r="20" {...common} />
          <circle cx="50" cy="50" r="7" fill={color} />
          <line x1="50" y1="10" x2="50" y2="25" {...common} />
        </>
      )}

      {/* CONTRACT */}
      {type === "contract" && (
        <>
          <rect x="25" y="12" width="50" height="76" rx="5" {...common} />
          <line x1="36" y1="30" x2="64" y2="30" {...common} />
          <line x1="36" y1="42" x2="64" y2="42" {...common} />
          <line x1="36" y1="54" x2="58" y2="54" {...common} />
          <path d="M36 69l8 7 18-18" {...common} />
        </>
      )}

      {/* REPLICATION */}
      {type === "replication" && (
        <>
          <circle cx="50" cy="25" r="14" {...common} />
          <circle cx="24" cy="72" r="14" {...common} />
          <circle cx="76" cy="72" r="14" {...common} />
          <path d="M42 37L29 60M58 37l13 23" {...common} />
          <path d="M30 50l-4 10 10-4" {...common} />
          <path d="M70 50l4 10-10-4" {...common} />
        </>
      )}

      {/* QUEUE */}
      {type === "queue" && (
        <>
          <rect x="12" y="25" width="76" height="50" rx="8" {...common} />
          <rect x="20" y="37" width="13" height="25" rx="3" fill={color} />
          <rect x="40" y="37" width="13" height="25" rx="3" fill={color} opacity={0.8} />
          <rect x="60" y="37" width="13" height="25" rx="3" fill={color} opacity={0.6} />
        </>
      )}

      {/* EVENT */}
      {type === "event" && (
        <>
          <circle cx="50" cy="50" r="23" {...common} />
          <path d="M43 35l22 15-22 15z" fill={color} />
          <path d="M17 50h10M73 50h10" {...common} />
        </>
      )}

      {/* API */}
      {type === "api" && (
        <>
          <rect x="18" y="27" width="64" height="46" rx="7" {...common} />
          <path d="M30 42l10 8-10 8M47 58h22" {...common} />
          <circle cx="27" cy="20" r="3" fill={color} />
          <circle cx="38" cy="20" r="3" fill={color} />
          <circle cx="49" cy="20" r="3" fill={color} />
        </>
      )}

      {/* NETWORK */}
      {type === "network" && (
        <>
          <circle cx="50" cy="18" r="9" {...common} />
          <circle cx="22" cy="70" r="9" {...common} />
          <circle cx="78" cy="70" r="9" {...common} />
          <circle cx="50" cy="52" r="9" {...common} />
          <line x1="44" y1="25" x2="42" y2="44" {...common} />
          <line x1="56" y1="25" x2="58" y2="44" {...common} />
          <line x1="43" y1="58" x2="29" y2="65" {...common} />
          <line x1="57" y1="58" x2="71" y2="65" {...common} />
        </>
      )}

      {/* LOCK */}
      {type === "lock" && (
        <>
          <rect x="24" y="42" width="52" height="42" rx="7" {...common} />
          <path d="M34 42V29c0-11 7-17 16-17s16 6 16 17v13" {...common} />
          <circle cx="50" cy="61" r="5" fill={color} />
          <line x1="50" y1="66" x2="50" y2="75" {...common} />
        </>
      )}

      {/* LOGS */}
      {type === "logs" && (
        <>
          <rect x="18" y="18" width="64" height="64" rx="6" {...common} />
          <line x1="30" y1="34" x2="70" y2="34" {...common} />
          <line x1="30" y1="47" x2="62" y2="47" {...common} />
          <line x1="30" y1="60" x2="68" y2="60" {...common} />
          <circle cx="26" cy="34" r="2" fill={color} />
          <circle cx="26" cy="47" r="2" fill={color} />
          <circle cx="26" cy="60" r="2" fill={color} />
        </>
      )}

      {/* METRICS */}
      {type === "metrics" && (
        <>
          <line x1="18" y1="82" x2="18" y2="18" {...common} />
          <line x1="18" y1="82" x2="88" y2="82" {...common} />
          <rect x="28" y="57" width="10" height="25" fill={color} />
          <rect x="46" y="42" width="10" height="40" fill={color} opacity={0.8} />
          <rect x="64" y="27" width="10" height="55" fill={color} opacity={0.6} />
        </>
      )}

      {/* TRACES */}
      {type === "traces" && (
        <>
          <circle cx="20" cy="50" r="7" fill={color} />
          <circle cx="50" cy="30" r="7" fill={color} />
          <circle cx="80" cy="50" r="7" fill={color} />
          <circle cx="50" cy="70" r="7" fill={color} />
          <line x1="27" y1="47" x2="43" y2="34" {...common} />
          <line x1="57" y1="34" x2="73" y2="47" {...common} />
          <line x1="73" y1="53" x2="57" y2="66" {...common} />
          <line x1="43" y1="66" x2="27" y2="53" {...common} />
        </>
      )}

      {/* LATENCY */}
      {type === "latency" && (
        <>
          <circle cx="50" cy="50" r="31" {...common} />
          <line x1="50" y1="50" x2="50" y2="30" {...common} />
          <line x1="50" y1="50" x2="67" y2="60" {...common} />
          <circle cx="50" cy="50" r="4" fill={color} />
        </>
      )}

      {/* THROUGHPUT */}
      {type === "throughput" && (
        <>
          <path d="M18 68L35 51l12 12 35-35" {...common} />
          <path d="M67 28h15v15" {...common} />
          <line x1="18" y1="80" x2="82" y2="80" {...common} />
        </>
      )}

      {/* CAP */}
      {type === "cap" && (
        <>
          <circle cx="50" cy="50" r="33" {...common} />
          <line x1="50" y1="17" x2="50" y2="83" {...common} />
          <line x1="17" y1="50" x2="83" y2="50" {...common} />
          <text
            x="50"
            y="44"
            textAnchor="middle"
            fill={color}
            fontSize="15"
            fontWeight="800"
            stroke="none"
          >
            CAP
          </text>
        </>
      )}
    </svg>
  );
};

/* ============================================================
   SECTION TITLE
   ============================================================ */

const SectionTitle: React.FC<{
  number: string;
  title: string;
  frame: number;
  start: number;
  color: string;
}> = ({ number, title, frame, start, color }) => {
  const opacity = fade(frame, start, start + 12);

  return (
    <div
      style={{
        position: "absolute",
        top: 280,
        left: 50,
        right: 50,
        textAlign: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 46,
          fontWeight: 900,
          color: COLORS.white,
        }}
      >
        <span style={{ color }}>{number}. </span>
        {title}
      </div>
    </div>
  );
};

/* ============================================================
   VISUAL CONCEPT BOX
   ============================================================ */

const ConceptBox: React.FC<{
  title: string;
  subtitle?: string;
  icon: IconType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  frame: number;
  start: number;
}> = ({
  title,
  subtitle,
  icon,
  x,
  y,
  width,
  height,
  color,
  frame,
  start,
}) => {
  const opacity = fade(frame, start, start + 12);

  const scale = interpolate(
    frame,
    [start, start + 12],
    [0.92, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.4)),
    }
  );

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
        border: `2px solid ${color}`,
        borderRadius: 22,
        background: "rgba(20,5,9,0.88)",
        boxShadow: `0 0 35px ${color}20`,
        display: "flex",
        alignItems: "center",
        padding: "0 25px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 90,
          height: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <VisualIcon type={icon} color={color} size={78} />
      </div>

      <div
        style={{
          marginLeft: 18,
        }}
      >
        <div
          style={{
            fontSize: 27,
            fontWeight: 900,
            color: COLORS.white,
          }}
        >
          {title}
        </div>

        {subtitle && (
          <div
            style={{
              marginTop: 8,
              fontSize: 18,
              lineHeight: 1.35,
              color,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   MINI NODE
   ============================================================ */

const MiniNode: React.FC<{
  title: string;
  icon: IconType;
  color: string;
  frame: number;
  start: number;
  width?: number;
}> = ({ title, icon, color, frame, start, width = 170 }) => {
  const opacity = fade(frame, start, start + 10);

  return (
    <div
      style={{
        width,
        minHeight: 120,
        opacity,
        border: `2px solid ${color}`,
        borderRadius: 18,
        background: "rgba(20,5,9,0.9)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        boxSizing: "border-box",
      }}
    >
      <VisualIcon type={icon} color={color} size={50} />

      <div
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: COLORS.white,
        }}
      >
        {title}
      </div>
    </div>
  );
};

/* ============================================================
   PILL
   ============================================================ */

const Pill: React.FC<{
  text: string;
  icon?: IconType;
  color: string;
  frame: number;
  start: number;
}> = ({ text, icon, color, frame, start }) => {
  const opacity = fade(frame, start, start + 10);

  return (
    <div
      style={{
        minWidth: 145,
        padding: "12px 16px",
        borderRadius: 16,
        border: `2px solid ${color}`,
        background: "rgba(20,5,9,0.9)",
        color: COLORS.white,
        fontSize: 19,
        fontWeight: 700,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {icon && <VisualIcon type={icon} color={color} size={30} />}
      {text}
    </div>
  );
};

/* ============================================================
   CONNECTOR
   ============================================================ */

const Connector: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  frame: number;
  start: number;
}> = ({ x1, y1, x2, y2, color, frame, start }) => {
  const progress = fade(frame, start, start + 10);

  const x = x1 + (x2 - x1) * progress;
  const y = y1 + (y2 - y1) * progress;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: progress,
      }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x}
        y2={y}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {progress > 0.95 && (
        <circle
          cx={x2}
          cy={y2}
          r={6}
          fill={color}
        />
      )}
    </svg>
  );
};

/* ============================================================
   MAIN SCENE
   ============================================================ */

export const SystemDesignCoreConceptsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  /*
   * 60 seconds @ 30fps
   *
   * 0  - 3s   INTRO
   * 3  - 8s   SCALABILITY
   * 8  - 14s  RELIABILITY & AVAILABILITY
   * 14 - 19s  CONSISTENCY
   * 19 - 24s  PERFORMANCE
   * 24 - 31s  SCALING TECHNIQUES
   * 31 - 36s  STORAGE
   * 36 - 42s  COMMUNICATION
   * 42 - 48s  DISTRIBUTED SYSTEMS
   * 48 - 54s  SECURITY + OBSERVABILITY
   * 54 - 60s  FINAL MAP
   */

  const introOpacity = interpolate(
    frame,
    [0, 15, 75, 90],
    [1, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const sections = [
    [90, 240],
    [240, 420],
    [420, 570],
    [570, 720],
    [720, 930],
    [930, 1080],
    [1080, 1260],
    [1260, 1440],
    [1440, 1620],
  ];

  const sectionOpacity = (index: number) => {
    const [start, end] = sections[index];

    return interpolate(
      frame,
      [start, start + 12, end - 12, end],
      [0, 1, 1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
  };

  const finalOpacity = interpolate(
    frame,
    [1620, 1650],
    [0, 1],
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
      {/* ===================================================== */}
      {/* BACKGROUND */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          left: -300,
          top: 350,
          borderRadius: "50%",
          background: COLORS.red,
          opacity: 0.06,
          filter: "blur(100px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          right: -250,
          bottom: 250,
          borderRadius: "50%",
          background: COLORS.purple,
          opacity: 0.06,
          filter: "blur(100px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 8,
          background:
            "linear-gradient(90deg, #FF5268, #FF8A65, #9B7CFF)",
        }}
      />

      {/* ===================================================== */}
      {/* INTRO */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: introOpacity,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 330,
            left: 60,
            right: 60,
            textAlign: "center",
          }}
        >
          <VisualIcon
            type="network"
            color={COLORS.red}
            size={130}
          />

          <div
            style={{
              marginTop: 25,
              fontSize: 62,
              fontWeight: 900,
            }}
          >
            Core System Design
          </div>

          <div
            style={{
              marginTop: 15,
              fontSize: 30,
              color: COLORS.orange,
            }}
          >
            Concepts & Terminology
          </div>

          <div
            style={{
              marginTop: 45,
              fontSize: 25,
              color: COLORS.muted,
            }}
          >
            The vocabulary engineers use to design scalable systems.
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* 1. SCALABILITY */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: sectionOpacity(0),
        }}
      >
        <SectionTitle
          number="1"
          title="Scalability"
          frame={frame}
          start={95}
          color={COLORS.red}
        />

        <div
          style={{
            position: "absolute",
            top: 400,
            left: 70,
            right: 70,
            textAlign: "center",
            fontSize: 25,
            color: COLORS.muted,
          }}
        >
          Can the system handle more users and traffic?
        </div>

        <ConceptBox
          title="Scale Up"
          subtitle="Use a bigger server"
          icon="server"
          x={70}
          y={510}
          width={430}
          height={210}
          color={COLORS.orange}
          frame={frame}
          start={115}
        />

        <ConceptBox
          title="Scale Out"
          subtitle="Add more servers"
          icon="servers"
          x={580}
          y={510}
          width={430}
          height={210}
          color={COLORS.blue}
          frame={frame}
          start={135}
        />

        <Connector
          x1={500}
          y1={615}
          x2={580}
          y2={615}
          color={COLORS.white}
          frame={frame}
          start={150}
        />

        <div
          style={{
            position: "absolute",
            top: 780,
            left: 70,
            right: 70,
            textAlign: "center",
            fontSize: 23,
            color: COLORS.mint,
            fontWeight: 700,
          }}
        >
          Vertical Scaling ↔ Horizontal Scaling
        </div>
      </div>

      {/* ===================================================== */}
      {/* 2. RELIABILITY & AVAILABILITY */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: sectionOpacity(1),
        }}
      >
        <SectionTitle
          number="2"
          title="Reliability & Availability"
          frame={frame}
          start={245}
          color={COLORS.purple}
        />

        <ConceptBox
          title="Reliability"
          subtitle="Performs correctly without failure"
          icon="server"
          x={60}
          y={450}
          width={460}
          height={180}
          color={COLORS.green}
          frame={frame}
          start={265}
        />

        <ConceptBox
          title="Availability"
          subtitle="Remains accessible to users"
          icon="chart"
          x={560}
          y={450}
          width={460}
          height={180}
          color={COLORS.blue}
          frame={frame}
          start={285}
        />

        {/* SLI / SLO / SLA */}

        <div
          style={{
            position: "absolute",
            top: 680,
            left: 55,
            right: 55,
            display: "flex",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <ConceptBox
            title="SLI"
            subtitle="Measured metric"
            icon="metrics"
            x={55}
            y={680}
            width={300}
            height={170}
            color={COLORS.green}
            frame={frame}
            start={300}
          />

          <ConceptBox
            title="SLO"
            subtitle="Target goal"
            icon="target"
            x={390}
            y={680}
            width={300}
            height={170}
            color={COLORS.orange}
            frame={frame}
            start={315}
          />

          <ConceptBox
            title="SLA"
            subtitle="Customer contract"
            icon="contract"
            x={725}
            y={680}
            width={300}
            height={170}
            color={COLORS.pink}
            frame={frame}
            start={330}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 895,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <Pill
            text="Redundancy"
            icon="servers"
            color={COLORS.green}
            frame={frame}
            start={345}
          />

          <Pill
            text="Replication"
            icon="replication"
            color={COLORS.blue}
            frame={frame}
            start={355}
          />

          <Pill
            text="Failover"
            icon="server"
            color={COLORS.orange}
            frame={frame}
            start={365}
          />
        </div>
      </div>

      {/* ===================================================== */}
      {/* 3. CONSISTENCY */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: sectionOpacity(2),
        }}
      >
        <SectionTitle
          number="3"
          title="Consistency"
          frame={frame}
          start={425}
          color={COLORS.orange}
        />

        <div
          style={{
            position: "absolute",
            top: 410,
            left: 70,
            right: 70,
            textAlign: "center",
            fontSize: 25,
            color: COLORS.muted,
          }}
        >
          How do distributed systems keep data consistent?
        </div>

        <div
          style={{
            position: "absolute",
            top: 500,
            left: 170,
            right: 170,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ConceptBox
            title="CAP Theorem"
            subtitle="Consistency • Availability • Partition Tolerance"
            icon="cap"
            x={170}
            y={500}
            width={740}
            height={220}
            color={COLORS.orange}
            frame={frame}
            start={450}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 770,
            left: 100,
            right: 100,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <MiniNode
            title="Consistency"
            icon="database"
            color={COLORS.green}
            frame={frame}
            start={470}
          />

          <MiniNode
            title="Availability"
            icon="chart"
            color={COLORS.blue}
            frame={frame}
            start={480}
          />

          <MiniNode
            title="Partition"
            icon="network"
            color={COLORS.purple}
            frame={frame}
            start={490}
          />
        </div>
      </div>

      {/* ===================================================== */}
      {/* 4. PERFORMANCE */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: sectionOpacity(3),
        }}
      >
        <SectionTitle
          number="4"
          title="Performance"
          frame={frame}
          start={575}
          color={COLORS.pink}
        />

        <ConceptBox
          title="Latency"
          subtitle="Time to complete a request"
          icon="latency"
          x={60}
          y={500}
          width={460}
          height={220}
          color={COLORS.pink}
          frame={frame}
          start={600}
        />

        <ConceptBox
          title="Throughput"
          subtitle="Requests processed per second"
          icon="throughput"
          x={560}
          y={500}
          width={460}
          height={220}
          color={COLORS.blue}
          frame={frame}
          start={620}
        />

        <Connector
          x1={520}
          y1={610}
          x2={560}
          y2={610}
          color={COLORS.white}
          frame={frame}
          start={635}
        />

        <div
          style={{
            position: "absolute",
            top: 790,
            left: 70,
            right: 70,
            textAlign: "center",
            fontSize: 25,
            color: COLORS.mint,
            fontWeight: 700,
          }}
        >
          Fast ≠ High Capacity
        </div>
      </div>

      {/* ===================================================== */}
      {/* 5. SCALING TECHNIQUES */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: sectionOpacity(4),
        }}
      >
        <SectionTitle
          number="5"
          title="Scaling Techniques"
          frame={frame}
          start={725}
          color={COLORS.blue}
        />

        <ConceptBox
          title="Load Balancing"
          subtitle="Distribute incoming traffic"
          icon="load-balancer"
          x={55}
          y={470}
          width={470}
          height={200}
          color={COLORS.blue}
          frame={frame}
          start={750}
        />

        <ConceptBox
          title="Caching"
          subtitle="Serve frequently used data faster"
          icon="cache"
          x={555}
          y={470}
          width={470}
          height={200}
          color={COLORS.purple}
          frame={frame}
          start={775}
        />

        <ConceptBox
          title="Sharding"
          subtitle="Split data across machines"
          icon="shard"
          x={305}
          y={720}
          width={470}
          height={200}
          color={COLORS.orange}
          frame={frame}
          start={800}
        />

        <Connector
          x1={290}
          y1={570}
          x2={305}
          y2={800}
          color={COLORS.white}
          frame={frame}
          start={815}
        />

        <Connector
          x1={790}
          y1={570}
          x2={775}
          y2={800}
          color={COLORS.white}
          frame={frame}
          start={820}
        />
      </div>

      {/* ===================================================== */}
      {/* 6. STORAGE */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: sectionOpacity(5),
        }}
      >
        <SectionTitle
          number="6"
          title="Storage"
          frame={frame}
          start={935}
          color={COLORS.green}
        />

        <ConceptBox
          title="SQL"
          subtitle="Relational • Structured schema"
          icon="database"
          x={60}
          y={510}
          width={460}
          height={220}
          color={COLORS.green}
          frame={frame}
          start={960}
        />

        <ConceptBox
          title="NoSQL"
          subtitle="Flexible • Distributed data models"
          icon="databases"
          x={560}
          y={510}
          width={460}
          height={220}
          color={COLORS.purple}
          frame={frame}
          start={985}
        />

        <Connector
          x1={520}
          y1={620}
          x2={560}
          y2={620}
          color={COLORS.white}
          frame={frame}
          start={1000}
        />
      </div>

      {/* ===================================================== */}
        {/* 7. COMMUNICATION */}
        {/* ===================================================== */}

        <div
        style={{
            position: "absolute",
            inset: 0,
            opacity: sectionOpacity(6),
        }}
        >
        <SectionTitle
            number="7"
            title="Communication"
            frame={frame}
            start={1085}
            color={COLORS.blue}
        />

        {/* REST */}
        <div
            style={{
            position: "absolute",
            top: 470,
            left: 120,
            }}
        >
            <MiniNode
            title="REST"
            icon="api"
            color={COLORS.green}
            frame={frame}
            start={1110}
            width={270}
            />
        </div>

        {/* gRPC */}
        <div
            style={{
            position: "absolute",
            top: 470,
            left: 405,
            }}
        >
            <MiniNode
            title="gRPC"
            icon="network"
            color={COLORS.blue}
            frame={frame}
            start={1130}
            width={270}
            />
        </div>

        {/* GraphQL */}
        <div
            style={{
            position: "absolute",
            top: 470,
            left: 690,
            }}
        >
            <MiniNode
            title="GraphQL"
            icon="api"
            color={COLORS.purple}
            frame={frame}
            start={1150}
            width={270}
            />
        </div>

        {/* Communication visual */}
        <div
            style={{
            position: "absolute",
            top: 680,
            left: 100,
            right: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            }}
        >
            <MiniNode
            title="Client"
            icon="users"
            color={COLORS.orange}
            frame={frame}
            start={1170}
            />

            <div
            style={{
                flex: 1,
                height: 4,
                margin: "0 20px",
                background: COLORS.white,
                opacity: fade(frame, 1180, 1190),
            }}
            />

            <MiniNode
            title="API"
            icon="api"
            color={COLORS.blue}
            frame={frame}
            start={1185}
            />

            <div
            style={{
                flex: 1,
                height: 4,
                margin: "0 20px",
                background: COLORS.white,
                opacity: fade(frame, 1195, 1205),
            }}
            />

            <MiniNode
            title="Service"
            icon="server"
            color={COLORS.green}
            frame={frame}
            start={1200}
            />
        </div>
        </div>

      {/* ===================================================== */}
      {/* 8. DISTRIBUTED SYSTEMS */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: sectionOpacity(7),
        }}
      >
        <SectionTitle
          number="8"
          title="Distributed Systems"
          frame={frame}
          start={1265}
          color={COLORS.purple}
        />

        <div
          style={{
            position: "absolute",
            top: 440,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "center",
            gap: 15,
          }}
        >
          <Pill
            text="Replication"
            icon="replication"
            color={COLORS.green}
            frame={frame}
            start={1290}
          />

          <Pill
            text="Queues"
            icon="queue"
            color={COLORS.orange}
            frame={frame}
            start={1305}
          />

          <Pill
            text="Events"
            icon="event"
            color={COLORS.blue}
            frame={frame}
            start={1320}
          />
        </div>

        {/* Architecture */}

        <div
          style={{
            position: "absolute",
            top: 620,
            left: 65,
            right: 65,
            height: 320,
            border: `2px solid ${COLORS.purple}`,
            borderRadius: 25,
            background: "rgba(20,5,9,0.75)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 25,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 23,
              color: COLORS.purple,
              fontWeight: 800,
            }}
          >
            Services communicate across a distributed system
          </div>

          <div
            style={{
              position: "absolute",
              top: 110,
              left: 40,
              right: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <MiniNode
              title="Service A"
              icon="server"
              color={COLORS.green}
              frame={frame}
              start={1340}
              width={180}
            />

            <VisualIcon
              type="queue"
              color={COLORS.orange}
              size={70}
            />

            <MiniNode
              title="Service B"
              icon="server"
              color={COLORS.blue}
              frame={frame}
              start={1360}
              width={180}
            />
          </div>

          <div
            style={{
              position: "absolute",
              top: 245,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 19,
              color: COLORS.muted,
            }}
          >
            Messages • Events • Replicas
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* 9. SECURITY + OBSERVABILITY */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: sectionOpacity(8),
        }}
      >
        <SectionTitle
          number="9"
          title="Security + Observability"
          frame={frame}
          start={1445}
          color={COLORS.orange}
        />

        <ConceptBox
          title="Security"
          subtitle="Authentication • Authorization • Encryption"
          icon="shield"
          x={50}
          y={470}
          width={470}
          height={230}
          color={COLORS.orange}
          frame={frame}
          start={1470}
        />

        <ConceptBox
          title="Observability"
          subtitle="Logs • Metrics • Traces"
          icon="chart"
          x={560}
          y={470}
          width={470}
          height={230}
          color={COLORS.mint}
          frame={frame}
          start={1500}
        />

        <div
          style={{
            position: "absolute",
            top: 760,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <Pill
            text="Auth"
            icon="lock"
            color={COLORS.orange}
            frame={frame}
            start={1520}
          />

          <Pill
            text="Logs"
            icon="logs"
            color={COLORS.mint}
            frame={frame}
            start={1530}
          />

          <Pill
            text="Metrics"
            icon="metrics"
            color={COLORS.blue}
            frame={frame}
            start={1540}
          />

          <Pill
            text="Traces"
            icon="traces"
            color={COLORS.purple}
            frame={frame}
            start={1550}
          />
        </div>
      </div>

      {/* ===================================================== */}
      {/* FINAL SYSTEM DESIGN MAP */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: finalOpacity,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 120,
            left: 60,
            right: 60,
            textAlign: "center",
          }}
        >
          <VisualIcon
            type="network"
            color={COLORS.red}
            size={80}
          />

          <div
            style={{
              marginTop: 10,
              fontSize: 50,
              fontWeight: 900,
            }}
          >
            SYSTEM DESIGN
          </div>

          <div
            style={{
              marginTop: 5,
              fontSize: 22,
              color: COLORS.orange,
            }}
          >
            The Core Vocabulary
          </div>
        </div>

        {/* TOP THREE */}

        <div
          style={{
            position: "absolute",
            top: 315,
            left: 45,
            right: 45,
            display: "flex",
            gap: 12,
          }}
        >
          {[
            ["Scalability", "Scale Up / Out", "servers", COLORS.green],
            [
              "Reliability",
              "Availability • Failover",
              "server",
              COLORS.purple,
            ],
            [
              "Performance",
              "Latency • Throughput",
              "chart",
              COLORS.orange,
            ],
          ].map(([title, subtitle, icon, color], index) => (
            <div
              key={title as string}
              style={{
                flex: 1,
                minHeight: 150,
                border: `2px solid ${color}`,
                borderRadius: 18,
                padding: "12px 8px",
                textAlign: "center",
                background: "rgba(20,5,9,0.9)",
                opacity: fade(
                  frame,
                  1650 + index * 8,
                  1662 + index * 8
                ),
              }}
            >
              <VisualIcon
                type={icon as IconType}
                color={color as string}
                size={55}
              />

              <div
                style={{
                  fontSize: 21,
                  fontWeight: 800,
                }}
              >
                {title}
              </div>

              <div
                style={{
                  marginTop: 5,
                  fontSize: 14,
                  color,
                }}
              >
                {subtitle}
              </div>
            </div>
          ))}
        </div>

        {/* SCALING */}

        <div
          style={{
            position: "absolute",
            top: 500,
            left: 65,
            right: 65,
            padding: "15px 15px",
            border: `2px solid ${COLORS.blue}`,
            borderRadius: 20,
            background: "rgba(20,5,9,0.9)",
            opacity: fade(frame, 1680, 1692),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <VisualIcon
              type="load-balancer"
              color={COLORS.blue}
              size={48}
            />

            <div>
              <div
                style={{
                  color: COLORS.blue,
                  fontSize: 21,
                  fontWeight: 800,
                }}
              >
                Scaling Techniques
              </div>

              <div
                style={{
                  marginTop: 5,
                  fontSize: 16,
                }}
              >
                Load Balancing • Caching • Sharding
              </div>
            </div>
          </div>
        </div>

        {/* DISTRIBUTED */}

        <div
          style={{
            position: "absolute",
            top: 665,
            left: 65,
            right: 65,
            padding: "15px 15px",
            border: `2px solid ${COLORS.purple}`,
            borderRadius: 20,
            background: "rgba(20,5,9,0.9)",
            opacity: fade(frame, 1700, 1712),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <VisualIcon
              type="replication"
              color={COLORS.purple}
              size={48}
            />

            <div>
              <div
                style={{
                  color: COLORS.purple,
                  fontSize: 21,
                  fontWeight: 800,
                }}
              >
                Distributed Systems
              </div>

              <div
                style={{
                  marginTop: 5,
                  fontSize: 16,
                }}
              >
                Consistency • CAP • Replication • Queues • Events
              </div>
            </div>
          </div>
        </div>

        {/* STORAGE */}

        <div
          style={{
            position: "absolute",
            top: 830,
            left: 65,
            right: 65,
            padding: "15px 15px",
            border: `2px solid ${COLORS.green}`,
            borderRadius: 20,
            background: "rgba(20,5,9,0.9)",
            opacity: fade(frame, 1720, 1732),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <VisualIcon
              type="database"
              color={COLORS.green}
              size={48}
            />

            <div>
              <div
                style={{
                  color: COLORS.green,
                  fontSize: 21,
                  fontWeight: 800,
                }}
              >
                Storage & Communication
              </div>

              <div
                style={{
                  marginTop: 5,
                  fontSize: 16,
                }}
              >
                SQL • NoSQL • REST • gRPC • GraphQL
              </div>
            </div>
          </div>
        </div>

        {/* SECURITY / OBSERVABILITY */}

        <div
          style={{
            position: "absolute",
            top: 995,
            left: 65,
            right: 65,
            display: "flex",
            gap: 12,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "15px 10px",
              border: `2px solid ${COLORS.orange}`,
              borderRadius: 18,
              background: "rgba(20,5,9,0.9)",
              textAlign: "center",
              opacity: fade(frame, 1740, 1752),
            }}
          >
            <VisualIcon
              type="shield"
              color={COLORS.orange}
              size={48}
            />

            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              Security
            </div>

            <div
              style={{
                marginTop: 5,
                fontSize: 14,
                color: COLORS.orange,
              }}
            >
              Auth • Encryption
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: "15px 10px",
              border: `2px solid ${COLORS.mint}`,
              borderRadius: 18,
              background: "rgba(20,5,9,0.9)",
              textAlign: "center",
              opacity: fade(frame, 1750, 1762),
            }}
          >
            <VisualIcon
              type="chart"
              color={COLORS.mint}
              size={48}
            />

            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              Observability
            </div>

            <div
              style={{
                marginTop: 5,
                fontSize: 14,
                color: COLORS.mint,
              }}
            >
              Logs • Metrics • Traces
            </div>
          </div>
        </div>

        {/* FINAL */}

        <div
          style={{
            position: "absolute",
            bottom: 150,
            left: 60,
            right: 60,
            textAlign: "center",
            opacity: fade(frame, 1760, 1775),
          }}
        >
          <div
            style={{
              fontSize: 27,
              fontWeight: 800,
            }}
          >
            Master these concepts first.
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 20,
              color: COLORS.muted,
            }}
          >
            Then use them to design real-world systems.
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* PROGRESS */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 65,
          height: 6,
          borderRadius: 10,
          background: "rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, (frame / 1800) * 100)}%`,
            borderRadius: 10,
            background:
              "linear-gradient(90deg, #FF5268, #FF8A65, #9B7CFF)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          width,
          textAlign: "center",
          color: "#A66C76",
          fontSize: 16,
        }}
      >
        SYSTEM DESIGN • BACKEND • CLOUD
      </div>
    </AbsoluteFill>
  );
};