import React from "react";
import {
    AbsoluteFill,
    Audio,
    Easing,
    Sequence,
    interpolate,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";

import { observabilityPillars } from "../../content/observability-pillars";
import { createTimeline } from "../timeline";

/**
 * ObservabilityPillarsScene
 *
 * Incident-driven motion graphics:
 * 1. Hook: trace a request through services until the database stalls.
 * 2. Metrics: latency and error-rate spikes reveal the incident.
 * 3. Logs: inspect structured logs to identify the connection-pool timeout.
 * 4. Distributed tracing: inspect spans to find the slow database query.
 * 5. Comparison: Metrics = WHEN, Logs = WHAT, Traces = WHERE.
 *
 * Keeps the existing content, timeline, audio paths, and exported component.
 */

const TIMELINE = createTimeline(observabilityPillars);

const C = {
    bg: "#101B38",
    panel: "#101A30",
    panel2: "#152541",
    line: "#385173",
    cyan: "#49DDF5",
    blue: "#5A92FF",
    purple: "#B39AFF",
    pink: "#FF75CE",
    green: "#55F0B5",
    yellow: "#FFD66B",
    red: "#FF5E75",
    white: "#F4F7FF",
    muted: "#9AACC9",
};

const clamp = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
};

const fade = (f: number, start = 0, duration = 14) =>
    interpolate(f, [start, start + duration], [0, 1], clamp);

const slide = (f: number, start = 0, duration = 18, distance = 48) =>
    interpolate(f, [start, start + duration], [distance, 0], {
        ...clamp,
        easing: Easing.out(Easing.cubic),
    });

const pop = (f: number, fps: number, start = 0) =>
    spring({
        frame: Math.max(0, f - start),
        fps,
        config: { damping: 14, stiffness: 145, mass: 0.72 },
    });

const glow = (color: string, blur = 18) =>
    `0 0 ${blur}px ${color}70, 0 0 ${blur * 2}px ${color}24`;

const text: React.CSSProperties = {
    color: C.white,
    fontFamily: "Inter, Arial, sans-serif",
};

const Kicker: React.FC<{
    children: React.ReactNode;
    color?: string;
}> = ({ children, color = C.cyan }) => (
    <div
        style={{
            color,
            fontSize: 23,
            fontWeight: 900,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 18,
        }}
    >
        {children}
    </div>
);

const Heading: React.FC<{
    children: React.ReactNode;
    size?: number;
    color?: string;
}> = ({ children, size = 54, color = C.white }) => (
    <div
        style={{
            ...text,
            fontSize: size,
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            color,
        }}
    >
        {children}
    </div>
);

const Subheading: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <div
        style={{
            ...text,
            fontSize: 26,
            lineHeight: 1.45,
            color: C.muted,
            fontWeight: 500,
        }}
    >
        {children}
    </div>
);

const Panel: React.FC<{
    children: React.ReactNode;
    style?: React.CSSProperties;
    borderColor?: string;
}> = ({ children, style, borderColor = C.line }) => (
    <div
        style={{
            position: "relative",
            background: `linear-gradient(145deg, ${C.panel2}, ${C.panel})`,
            border: `1px solid ${borderColor}`,
            borderRadius: 22,
            overflow: "hidden",
            boxShadow: "0 18px 45px #00000035",
            ...style,
        }}
    >
        {children}
    </div>
);

const Tag: React.FC<{
    children: React.ReactNode;
    color?: string;
}> = ({ children, color = C.cyan }) => (
    <div
        style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 8,
            padding: "8px 12px",
            color,
            background: `${color}15`,
            border: `1px solid ${color}55`,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 0.5,
        }}
    >
        {children}
    </div>
);

const Dot: React.FC<{ color: string; size?: number }> = ({
    color,
    size = 12,
}) => (
    <div
        style={{
            width: size,
            height: size,
            borderRadius: "50%",
            flexShrink: 0,
            background: color,
            boxShadow: glow(color, 8),
        }}
    />
);

const Arrow: React.FC<{
    color?: string;
    width?: number;
}> = ({ color = C.cyan, width = 56 }) => (
    <svg width={width} height={28} viewBox={`0 0 ${width} 28`}>
        <path
            d={`M2 14 H${width - 10} M${width - 20} 5 L${width - 10} 14 L${width - 20} 23`}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Node: React.FC<{
    label: string;
    sublabel?: string;
    color: string;
    active?: boolean;
    width?: number;
}> = ({ label, sublabel, color, active = false, width = 180 }) => (
    <div
        style={{
            width,
            minHeight: 110,
            boxSizing: "border-box",
            padding: "16px 10px",
            borderRadius: 16,
            border: `2px solid ${active ? color : `${color}65`}`,
            background: active ? `${color}20` : "#0B1427",
            boxShadow: active ? glow(color, 16) : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 8,
        }}
    >
        <div
            style={{
                color,
                fontSize: 23,
                fontWeight: 900,
                lineHeight: 1.1,
            }}
        >
            {label}
        </div>
        {sublabel && (
            <div
                style={{
                    color: C.muted,
                    fontSize: 16,
                    fontWeight: 600,
                }}
            >
                {sublabel}
            </div>
        )}
    </div>
);

const MovingPacket: React.FC<{
    frame: number;
    start: number;
    end: number;
    color?: string;
    y?: number;
    radius?: number;
}> = ({
    frame,
    start,
    end,
    color = C.cyan,
    y = 0,
    radius = 9,
}) => {
        const x = interpolate(frame, [start, end], [0, 1], clamp);
        const visible = frame >= start && frame <= end;

        if (!visible) return null;

        return (
            <div
                style={{
                    position: "absolute",
                    left: `${x * 100}%`,
                    top: y,
                    width: radius * 2,
                    height: radius * 2,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: glow(color, 14),
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                }}
            />
        );
    };


const Backdrop: React.FC<{ frame: number }> = ({ frame }) => {
    const drift = interpolate(frame, [0, 300], [0, 70], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const pulse = Math.sin(frame * 0.025) * 35;

    return (
        <AbsoluteFill
            style={{
                background:
                    "linear-gradient(135deg, #101B38 0%, #172C55 38%, #252052 72%, #142D4A 100%)",
                overflow: "hidden",
            }}
        >
            {/* Animated colorful ambient light */}
            <div
                style={{
                    position: "absolute",
                    top: -180 + drift,
                    left: -120,
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(0, 210, 255, 0.32) 0%, rgba(0, 130, 255, 0.15) 38%, transparent 72%)",
                    filter: "blur(25px)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    top: 250,
                    right: -230 - pulse,
                    width: 750,
                    height: 750,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(151, 92, 255, 0.34) 0%, rgba(111, 65, 220, 0.15) 42%, transparent 72%)",
                    filter: "blur(35px)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: -280,
                    left: 100 - drift,
                    width: 850,
                    height: 650,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse, rgba(0, 235, 190, 0.20) 0%, rgba(0, 170, 200, 0.09) 42%, transparent 72%)",
                    filter: "blur(35px)",
                }}
            />

            {/* Subtle technical grid */}
            <AbsoluteFill
                style={{
                    opacity: 0.22,
                    backgroundImage: `
                        linear-gradient(rgba(113, 190, 255, 0.16) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(113, 190, 255, 0.16) 1px, transparent 1px)
                    `,
                    backgroundSize: "44px 44px",
                    transform: `translate(${drift * 0.25}px, ${-drift * 0.15}px)`,
                }}
            />

            {/* Colorful moving light streaks */}
            <div
                style={{
                    position: "absolute",
                    top: "34%",
                    left: "-20%",
                    width: "140%",
                    height: 2,
                    opacity: 0.35,
                    background:
                        "linear-gradient(90deg, transparent, #45DDF5, #9275FF, transparent)",
                    transform: `translateX(${drift * 1.5}px) rotate(-12deg)`,
                    boxShadow: "0 0 18px rgba(69, 221, 245, 0.45)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: "24%",
                    left: "-20%",
                    width: "140%",
                    height: 2,
                    opacity: 0.25,
                    background:
                        "linear-gradient(90deg, transparent, #51F0C0, #B39AFF, transparent)",
                    transform: `translateX(${-drift}px) rotate(-12deg)`,
                }}
            />
        </AbsoluteFill>
    );
};


const SectionHeader: React.FC<{
    kicker: string;
    title: string;
    subtitle: string;
    frame: number;
    color?: string;
}> = ({
    kicker,
    title,
    subtitle,
    frame,
    color = C.cyan,
}) => (
        <div
            style={{
                position: "absolute",
                top: 92,
                left: 62,
                right: 62,
                opacity: fade(frame, 0, 12),
                transform: `translateY(${slide(frame, 0, 16, 30)}px)`,
            }}
        >
            <Kicker color={color}>{kicker}</Kicker>
            <Heading size={52}>{title}</Heading>
            <div style={{ height: 16 }} />
            <Subheading>{subtitle}</Subheading>
        </div>
    );

// ============================================================
// HOOK: one request travels through the system, then stalls
// ============================================================


const HookVisual: React.FC<{
    frame: number;
    fps: number;
}> = ({ frame, fps }) => {
    const beat = frame / fps;
    const pulse = 1 + Math.sin(frame * 0.22) * 0.035;
    const incident = beat >= 1.2;
    const dbStalled = beat >= 3.5;
    const timeout = beat >= 5.2;
    const revealTrace = beat >= 6.2;

    const latency = interpolate(
        beat,
        [0, 1.2, 2.2, 3.5, 5.2],
        [180, 420, 980, 2750, 3200],
        clamp,
    );

    const errorRate = interpolate(
        beat,
        [0, 2, 4, 6],
        [0.1, 0.5, 4.8, 12.4],
        clamp,
    );

    const nodes = [
        { label: "CLIENT", sublabel: "Browser", color: C.blue },
        { label: "CHECKOUT", sublabel: "API service", color: C.cyan },
        { label: "PAYMENT", sublabel: "42 ms", color: C.green },
        {
            label: "DATABASE",
            sublabel: dbStalled ? "2.75 s delay" : "Query running",
            color: dbStalled ? C.red : C.purple,
        },
    ];

    return (
        <AbsoluteFill>
            {/* Small incident header — not a full paragraph */}
            <div
                style={{
                    position: "absolute",
                    top: 92,
                    left: 48,
                    right: 48,
                    opacity: fade(frame, 0, 8),
                    transform: `translateY(${slide(frame, 0, 12, 24)}px)`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 18,
                    }}
                >
                    <div
                        style={{
                            width: 13,
                            height: 13,
                            borderRadius: "50%",
                            background: C.red,
                            boxShadow: glow(C.red, 15),
                            transform: `scale(${pulse})`,
                        }}
                    />
                    <Kicker color={C.red}>LIVE PRODUCTION INCIDENT</Kicker>
                </div>

                <Heading size={59}>
                    CHECKOUT
                    <span style={{ color: C.red }}> IS FAILING</span>
                </Heading>
            </div>

            {/* Main alert dashboard */}
            <Panel
                borderColor={incident ? C.red : C.cyan}
                style={{
                    position: "absolute",
                    top: 300,
                    left: 38,
                    right: 38,
                    height: 350,
                    padding: 25,
                    boxSizing: "border-box",
                    boxShadow: incident
                        ? `0 0 ${24 + Math.sin(frame * 0.2) * 8}px ${C.red}35`
                        : glow(C.cyan, 12),
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            color: C.muted,
                            fontSize: 18,
                            fontWeight: 900,
                            letterSpacing: 1.5,
                        }}
                    >
                        CHECKOUT API · P95 LATENCY
                    </div>
                    <Tag color={incident ? C.red : C.green}>
                        {incident ? "ALERT FIRING" : "HEALTHY"}
                    </Tag>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 12,
                        marginTop: 22,
                    }}
                >
                    <div
                        style={{
                            color: incident ? C.red : C.cyan,
                            fontSize: 100,
                            lineHeight: 1,
                            fontWeight: 900,
                            letterSpacing: -5,
                            transform: `scale(${incident ? pulse : 1})`,
                            transformOrigin: "left center",
                            textShadow: incident ? glow(C.red, 18) : "none",
                        }}
                    >
                        {(latency / 1000).toFixed(1)}s
                    </div>
                    <div
                        style={{
                            color: C.muted,
                            fontSize: 22,
                            fontWeight: 800,
                        }}
                    >
                        response time
                    </div>
                </div>

                {/* Animated latency chart */}
                <svg
                    width="100%"
                    height="105"
                    viewBox="0 0 900 105"
                    preserveAspectRatio="none"
                    style={{ marginTop: 15, overflow: "visible" }}
                >
                    {[25, 55, 85].map((y) => (
                        <line
                            key={y}
                            x1="0"
                            y1={y}
                            x2="900"
                            y2={y}
                            stroke={C.line}
                            strokeDasharray="5 9"
                            strokeWidth="1.5"
                        />
                    ))}

                    <line
                        x1="0"
                        y1="53"
                        x2="900"
                        y2="53"
                        stroke={C.yellow}
                        strokeDasharray="8 8"
                        strokeWidth="2"
                        opacity={0.85}
                    />

                    <polyline
                        points={Array.from({ length: 35 }, (_, i) => {
                            const x = (i / 34) * 900;
                            const progress = interpolate(
                                beat,
                                [0, 1.5, 5.5],
                                [0, 0.08, 1],
                                clamp,
                            );
                            const spike = i < 20
                                ? 0
                                : ((i - 20) / 14) * 65 * progress;
                            const jitter =
                                Math.sin(i * 1.8 + frame * 0.1) *
                                (incident ? 5 : 2);
                            const y = Math.max(
                                7,
                                Math.min(98, 82 - spike - jitter),
                            );
                            return `${x},${y}`;
                        }).join(" ")}
                        fill="none"
                        stroke={incident ? C.red : C.cyan}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 7,
                    }}
                >
                    <div style={{ color: C.muted, fontSize: 17 }}>
                        Error rate
                    </div>
                    <div
                        style={{
                            color: incident ? C.red : C.green,
                            fontSize: 23,
                            fontWeight: 900,
                        }}
                    >
                        {errorRate.toFixed(1)}%
                    </div>
                    <div
                        style={{
                            color: C.red,
                            fontSize: 17,
                            fontWeight: 900,
                            opacity: timeout ? 1 : 0.25,
                        }}
                    >
                        5XX ERRORS ↑
                    </div>
                </div>
            </Panel>

            {/* Request journey: animate the packet and highlight the bottleneck */}
            <div
                style={{
                    position: "absolute",
                    top: 710,
                    left: 48,
                    right: 48,
                    opacity: fade(frame, 10, 12),
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 22,
                    }}
                >
                    <Kicker color={C.cyan}>FOLLOW ONE REQUEST</Kicker>
                    <div
                        style={{
                            color: C.muted,
                            fontSize: 16,
                            fontWeight: 800,
                        }}
                    >
                        TRACE ID · 8F3A2C
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 5,
                    }}
                >
                    {nodes.map((node, i) => {
                        const activeIndex = Math.min(
                            3,
                            Math.floor(beat / 1.15),
                        );
                        const isStalled = i === 3 && dbStalled;
                        const isActive = i === activeIndex;

                        return (
                            <React.Fragment key={node.label}>
                                <div
                                    style={{
                                        width: i === 1 ? 174 : 145,
                                        minHeight: 125,
                                        boxSizing: "border-box",
                                        padding: "16px 6px",
                                        borderRadius: 17,
                                        border: `2px solid ${isStalled
                                            ? C.red
                                            : isActive
                                                ? node.color
                                                : `${node.color}65`
                                            }`,
                                        background: isStalled
                                            ? `${C.red}20`
                                            : isActive
                                                ? `${node.color}18`
                                                : "#0B1427",
                                        boxShadow: isStalled
                                            ? glow(C.red, 18)
                                            : isActive
                                                ? glow(node.color, 12)
                                                : "none",
                                        transform: `scale(${isStalled
                                            ? pulse
                                            : isActive
                                                ? 1.035
                                                : 1
                                            })`,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        gap: 10,
                                    }}
                                >
                                    {isStalled && (
                                        <div
                                            style={{
                                                color: C.red,
                                                fontSize: 13,
                                                fontWeight: 900,
                                                letterSpacing: 1,
                                            }}
                                        >
                                            BOTTLENECK
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            color: isStalled
                                                ? C.red
                                                : node.color,
                                            fontSize: 19,
                                            fontWeight: 900,
                                        }}
                                    >
                                        {node.label}
                                    </div>
                                    <div
                                        style={{
                                            color: C.muted,
                                            fontSize: 15,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {node.sublabel}
                                    </div>
                                </div>

                                {i < nodes.length - 1 && (
                                    <div
                                        style={{
                                            flex: 1,
                                            minWidth: 12,
                                            position: "relative",
                                            height: 5,
                                            borderRadius: 10,
                                            background: C.line,
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                borderRadius: 10,
                                                background:
                                                    i === 2 && dbStalled
                                                        ? C.red
                                                        : C.cyan,
                                                transform: `scaleX(${beat >= (i + 1) * 1.15
                                                    ? 1
                                                    : 0.15
                                                    })`,
                                                transformOrigin: "left",
                                                opacity: 0.9,
                                            }}
                                        />
                                        {beat >= i * 1.15 &&
                                            beat < (i + 1) * 1.15 + 0.5 && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        left: `${interpolate(
                                                            beat,
                                                            [
                                                                i * 1.15,
                                                                (i + 1) * 1.15,
                                                            ],
                                                            [0, 100],
                                                            clamp,
                                                        )
                                                            }%`,
                                                        top: "50%",
                                                        width: 15,
                                                        height: 15,
                                                        borderRadius: "50%",
                                                        background: C.white,
                                                        boxShadow: glow(
                                                            C.cyan,
                                                            15,
                                                        ),
                                                        transform:
                                                            "translate(-50%, -50%)",
                                                    }}
                                                />
                                            )}
                                        <div
                                            style={{
                                                position: "absolute",
                                                right: -3,
                                                top: -5,
                                                width: 0,
                                                height: 0,
                                                borderTop: "7px solid transparent",
                                                borderBottom: "7px solid transparent",
                                                borderLeft: `10px solid ${i === 2 && dbStalled
                                                    ? C.red
                                                    : C.cyan
                                                    }`,
                                            }}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* The reveal: short, high-contrast incident message */}
            <Panel
                borderColor={timeout ? C.red : C.yellow}
                style={{
                    position: "absolute",
                    left: 42,
                    right: 42,
                    bottom: 230,
                    padding: 24,
                    opacity: fade(frame, fps * 3.4, 10),
                    transform: `translateY(${slide(
                        frame,
                        fps * 3.4,
                        14,
                        24,
                    )}px)`,
                    boxShadow: timeout ? glow(C.red, 15) : "none",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 15,
                    }}
                >
                    <div
                        style={{
                            width: 54,
                            height: 54,
                            flexShrink: 0,
                            borderRadius: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: `${timeout ? C.red : C.yellow}18`,
                            border: `1px solid ${timeout ? C.red : C.yellow}`,
                            color: timeout ? C.red : C.yellow,
                            fontSize: 30,
                            fontWeight: 900,
                        }}
                    >
                        !
                    </div>
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                color: timeout ? C.red : C.yellow,
                                fontSize: 21,
                                fontWeight: 900,
                                letterSpacing: 1,
                            }}
                        >
                            {timeout
                                ? "DATABASE QUERY: 2.75s"
                                : "REQUEST TAKING TOO LONG"}
                        </div>
                        <div
                            style={{
                                color: C.white,
                                fontSize: 23,
                                fontWeight: 800,
                                marginTop: 8,
                                lineHeight: 1.3,
                            }}
                        >
                            {revealTrace
                                ? "Where is the bottleneck?"
                                : "Users are waiting. Errors are rising."}
                        </div>
                    </div>
                </div>
            </Panel>

            <div
                style={{
                    position: "absolute",
                    bottom: 115,
                    left: 50,
                    right: 50,
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                    opacity: fade(frame, fps * 5.2, 12),
                }}
            >
                <Tag color={C.cyan}>METRICS</Tag>
                <Tag color={C.yellow}>LOGS</Tag>
                <Tag color={C.purple}>TRACES</Tag>
            </div>
        </AbsoluteFill>
    );
};



// ============================================================
// METRICS: live dashboard, moving graph and incident threshold
// ============================================================

const MetricsVisual: React.FC<{
    frame: number;
    fps: number;
}> = ({ frame, fps }) => {
    const local = Math.max(0, frame / fps);
    const incident = local > 3.2;
    const late = local > 5.2;

    const latency = incident
        ? interpolate(local, [3.2, 5.2, 7.2], [180, 950, 1200], {
            ...clamp,
        })
        : interpolate(local, [0, 3.2], [85, 150], clamp);

    const errorRate = incident
        ? interpolate(local, [3.2, 5.2, 7.2], [0.5, 7.5, 12], clamp)
        : interpolate(local, [0, 3.2], [0.1, 0.5], clamp);

    const cpu = incident
        ? interpolate(local, [3.2, 5.2, 7.2], [48, 91, 97], clamp)
        : interpolate(local, [0, 3.2], [35, 48], clamp);

    const points = Array.from({ length: 42 }, (_, i) => {
        const x = 58 + (i / 41) * 850;
        const base = 330 - Math.sin(i * 0.7) * 8 - Math.cos(i * 0.31) * 7;
        const progress = interpolate(local, [2.7, 4.5, 7.2], [0, 0.2, 1], clamp);
        const spikeStart = 22;
        const spike = i < spikeStart ? 0 : ((i - spikeStart) / 19) * progress * 200;
        const jitter = Math.sin(i * 1.7 + frame * 0.09) * (incident ? 13 : 5);
        return `${x},${base - spike - jitter}`;
    }).join(" ");

    const metricCards = [
        {
            label: "P95 LATENCY",
            value: `${Math.round(latency)} ms`,
            color: late ? C.red : C.cyan,
            hint: late ? "SLO BREACHED" : "WITHIN TARGET",
        },
        {
            label: "ERROR RATE",
            value: `${errorRate.toFixed(1)}%`,
            color: incident ? C.red : C.green,
            hint: incident ? "5XX INCREASING" : "HEALTHY",
        },
        {
            label: "DATABASE CPU",
            value: `${Math.round(cpu)}%`,
            color: cpu > 85 ? C.yellow : C.purple,
            hint: cpu > 85 ? "NEAR SATURATION" : "NORMAL",
        },
    ];

    return (
        <AbsoluteFill>
            <SectionHeader
                kicker="Pillar 01 · Metrics"
                title="When did things go wrong?"
                subtitle="Metrics turn system health into measurable signals."
                frame={frame}
            />

            <div
                style={{
                    position: "absolute",
                    top: 370,
                    left: 42,
                    right: 42,
                    display: "flex",
                    gap: 14,
                }}
            >
                {metricCards.map((metric, i) => (
                    <Panel
                        key={metric.label}
                        borderColor={metric.color}
                        style={{
                            flex: 1,
                            padding: 19,
                            minHeight: 164,
                            opacity: fade(frame, i * 6, 12),
                            transform: `translateY(${slide(frame, i * 6, 18, 20)}px)`,
                        }}
                    >
                        <div
                            style={{
                                color: C.muted,
                                fontSize: 17,
                                fontWeight: 800,
                                letterSpacing: 1,
                            }}
                        >
                            {metric.label}
                        </div>
                        <div
                            style={{
                                marginTop: 15,
                                color: metric.color,
                                fontSize: 34,
                                fontWeight: 900,
                                letterSpacing: -1,
                            }}
                        >
                            {metric.value}
                        </div>
                        <div
                            style={{
                                marginTop: 12,
                                color: metric.color,
                                fontSize: 14,
                                fontWeight: 900,
                            }}
                        >
                            {metric.hint}
                        </div>
                    </Panel>
                ))}
            </div>

            <Panel
                style={{
                    position: "absolute",
                    top: 575,
                    left: 42,
                    right: 42,
                    height: 440,
                    padding: 20,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                >
                    <div
                        style={{
                            fontSize: 23,
                            fontWeight: 900,
                            color: C.white,
                        }}
                    >
                        API P95 LATENCY
                    </div>
                    <Tag color={late ? C.red : C.cyan}>
                        {late ? "ALERT FIRING" : "LIVE · 1 MIN"}
                    </Tag>
                </div>

                <svg
                    width="100%"
                    height="310"
                    viewBox="0 0 960 370"
                    preserveAspectRatio="none"
                >
                    {[0, 1, 2, 3, 4].map((i) => {
                        const y = 55 + i * 67;
                        return (
                            <g key={i}>
                                <line
                                    x1="58"
                                    y1={y}
                                    x2="910"
                                    y2={y}
                                    stroke={C.line}
                                    strokeDasharray="5 8"
                                    strokeWidth="1.5"
                                />
                                <text
                                    x="5"
                                    y={y + 6}
                                    fill={C.muted}
                                    fontSize="17"
                                >
                                    {1000 - i * 200}
                                </text>
                            </g>
                        );
                    })}

                    <line
                        x1="58"
                        y1="195"
                        x2="910"
                        y2="195"
                        stroke={C.yellow}
                        strokeDasharray="8 7"
                        strokeWidth="2"
                    />
                    <text
                        x="740"
                        y="184"
                        fill={C.yellow}
                        fontSize="17"
                        fontWeight="800"
                    >
                        SLO THRESHOLD
                    </text>

                    <polyline
                        points={points}
                        fill="none"
                        stroke={late ? C.red : C.cyan}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <circle
                        cx={58 + interpolate(local, [0, 7.2], [0, 850], clamp)}
                        cy={330 - (incident ? interpolate(local, [3.2, 7.2], [0, 200], clamp) : 0)}
                        r="9"
                        fill={late ? C.red : C.cyan}
                    />
                </svg>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: C.muted,
                        fontSize: 16,
                        marginTop: 3,
                    }}
                >
                    <span>10:00</span>
                    <span>10:01</span>
                    <span>10:02</span>
                    <span>10:03</span>
                    <span>10:04</span>
                </div>
            </Panel>

            <Panel
                style={{
                    position: "absolute",
                    bottom: 135,
                    left: 54,
                    right: 54,
                    padding: 24,
                    borderColor: late ? C.red : C.green,
                    opacity: fade(frame, fps * 3, 12),
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <Dot color={late ? C.red : C.green} size={18} />
                    <div>
                        <div
                            style={{
                                color: late ? C.red : C.green,
                                fontSize: 22,
                                fontWeight: 900,
                            }}
                        >
                            {late ? "ALERT: P95 LATENCY ABOVE SLO" : "WATCHING SERVICE HEALTH"}
                        </div>
                        <div
                            style={{
                                color: C.white,
                                fontSize: 22,
                                marginTop: 8,
                                lineHeight: 1.35,
                            }}
                        >
                            Metrics reveal WHEN the incident starts — not necessarily WHY.
                        </div>
                    </div>
                </div>
            </Panel>
        </AbsoluteFill>
    );
};

// ============================================================
// LOGS: streaming structured logs, highlight the root cause
// ============================================================

type LogItem = {
    time: string;
    level: string;
    service: string;
    message: string;
    color: string;
};

const logItems: LogItem[] = [
    {
        time: "10:03:12.104",
        level: "INFO",
        service: "api-gateway",
        message: "request_started route=/orders",
        color: C.cyan,
    },
    {
        time: "10:03:12.138",
        level: "INFO",
        service: "orders",
        message: "fetching_order id=84721",
        color: C.cyan,
    },
    {
        time: "10:03:12.181",
        level: "WARN",
        service: "orders",
        message: "db_pool_in_use=98% pool_max=50",
        color: C.yellow,
    },
    {
        time: "10:03:12.207",
        level: "WARN",
        service: "postgres",
        message: "query_duration_ms=2900",
        color: C.yellow,
    },
    {
        time: "10:03:15.210",
        level: "ERROR",
        service: "orders",
        message: "ConnectionPoolTimeout: timed out acquiring connection",
        color: C.red,
    },
    {
        time: "10:03:15.214",
        level: "ERROR",
        service: "api-gateway",
        message: "upstream_timeout status=504",
        color: C.red,
    },
    {
        time: "10:03:15.219",
        level: "INFO",
        service: "orders",
        message: "request_completed status=504 duration_ms=3115",
        color: C.muted,
    },
];

const LogsVisual: React.FC<{
    frame: number;
    fps: number;
}> = ({ frame, fps }) => {
    const local = Math.max(0, frame / fps);
    const activeIndex = Math.min(
        logItems.length - 1,
        Math.floor(interpolate(local, [0, 6.8], [0, logItems.length], clamp)),
    );

    return (
        <AbsoluteFill>
            <SectionHeader
                kicker="Pillar 02 · Logs"
                title="What exactly failed?"
                subtitle="Search structured events around the time the alert fired."
                frame={frame}
                color={C.yellow}
            />

            <Panel
                style={{
                    position: "absolute",
                    top: 370,
                    left: 34,
                    right: 34,
                    height: 690,
                    padding: 18,
                    borderColor: C.yellow,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "4px 6px 18px",
                        borderBottom: `1px solid ${C.line}`,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Dot color={C.yellow} />
                        <div
                            style={{
                                color: C.white,
                                fontSize: 22,
                                fontWeight: 900,
                            }}
                        >
                            LOG EXPLORER
                        </div>
                    </div>
                    <Tag color={C.yellow}>orders-service</Tag>
                </div>

                <div
                    style={{
                        marginTop: 14,
                        padding: "13px 15px",
                        background: "#080F20",
                        border: `1px solid ${C.line}`,
                        borderRadius: 10,
                        color: C.muted,
                        fontSize: 18,
                        fontFamily: "monospace",
                    }}
                >
                    service="orders" AND timestamp="10:03"
                </div>

                <div style={{ marginTop: 16 }}>
                    {logItems.map((item, i) => {
                        const revealed = frame >= i * 7;
                        const selected = i === activeIndex;
                        return (
                            <div
                                key={`${item.time}-${item.message}`}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "148px 76px 126px 1fr",
                                    alignItems: "center",
                                    gap: 7,
                                    minHeight: 75,
                                    padding: "6px 7px",
                                    borderRadius: 8,
                                    marginBottom: 5,
                                    opacity: revealed ? 1 : 0.14,
                                    background: selected
                                        ? `${item.color}18`
                                        : "transparent",
                                    border: `1px solid ${selected ? `${item.color}85` : "transparent"
                                        }`,
                                    transform: `translateX(${revealed ? 0 : 12}px)`,
                                }}
                            >
                                <div
                                    style={{
                                        color: C.muted,
                                        fontSize: 15,
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {item.time}
                                </div>
                                <div
                                    style={{
                                        color: item.color,
                                        fontSize: 15,
                                        fontWeight: 900,
                                    }}
                                >
                                    {item.level}
                                </div>
                                <div
                                    style={{
                                        color: C.purple,
                                        fontSize: 14,
                                        fontWeight: 800,
                                    }}
                                >
                                    {item.service}
                                </div>
                                <div
                                    style={{
                                        color: selected ? C.white : C.muted,
                                        fontSize: 15,
                                        fontFamily: "monospace",
                                        fontWeight: selected ? 800 : 500,
                                        overflowWrap: "anywhere",
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {item.message}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Panel>

            <Panel
                style={{
                    position: "absolute",
                    bottom: 128,
                    left: 48,
                    right: 48,
                    padding: 23,
                    borderColor: C.red,
                    opacity: fade(frame, fps * 4, 12),
                    transform: `translateY(${slide(frame, fps * 4, 16, 22)}px)`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 15,
                    }}
                >
                    <div
                        style={{
                            color: C.red,
                            fontSize: 28,
                            fontWeight: 900,
                        }}
                    >
                        !
                    </div>
                    <div>
                        <div
                            style={{
                                color: C.red,
                                fontSize: 21,
                                fontWeight: 900,
                                marginBottom: 8,
                            }}
                        >
                            ROOT-CAUSE CLUE
                        </div>
                        <div
                            style={{
                                color: C.white,
                                fontSize: 22,
                                lineHeight: 1.4,
                                fontWeight: 700,
                            }}
                        >
                            ConnectionPoolTimeout — the service cannot acquire a database
                            connection.
                        </div>
                    </div>
                </div>
            </Panel>
        </AbsoluteFill>
    );
};

// ============================================================
// DISTRIBUTED TRACING: request waterfall with a slow DB span
// ============================================================

type Span = {
    name: string;
    service: string;
    start: number;
    duration: number;
    color: string;
    depth: number;
};

const spans: Span[] = [
    {
        name: "POST /orders",
        service: "api-gateway",
        start: 0,
        duration: 3.2,
        color: C.blue,
        depth: 0,
    },
    {
        name: "create_order()",
        service: "orders",
        start: 0.12,
        duration: 3.0,
        color: C.purple,
        depth: 1,
    },
    {
        name: "validate_inventory()",
        service: "orders",
        start: 0.2,
        duration: 0.22,
        color: C.green,
        depth: 2,
    },
    {
        name: "acquire_connection()",
        service: "db-pool",
        start: 0.45,
        duration: 0.85,
        color: C.yellow,
        depth: 2,
    },
    {
        name: "SELECT * FROM orders",
        service: "postgres",
        start: 1.3,
        duration: 1.65,
        color: C.red,
        depth: 2,
    },
    {
        name: "serialize_response()",
        service: "orders",
        start: 2.98,
        duration: 0.12,
        color: C.cyan,
        depth: 2,
    },
];

const TracingVisual: React.FC<{
    frame: number;
    fps: number;
}> = ({ frame, fps }) => {
    const local = Math.max(0, frame / fps);
    const reveal = interpolate(local, [0, 5.5], [0, 1], clamp);
    const maxMs = 3.5;
    const chartLeft = 350;
    const chartWidth = 500;

    return (
        <AbsoluteFill>
            <SectionHeader
                kicker="Pillar 03 · Distributed tracing"
                title="Where is the time going?"
                subtitle="Follow one request across service boundaries."
                frame={frame}
                color={C.purple}
            />

            <Panel
                style={{
                    position: "absolute",
                    top: 365,
                    left: 32,
                    right: 32,
                    height: 680,
                    padding: 18,
                    borderColor: C.purple,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                    }}
                >
                    <div>
                        <div
                            style={{
                                color: C.white,
                                fontSize: 22,
                                fontWeight: 900,
                            }}
                        >
                            TRACE #8F3A2C
                        </div>
                        <div
                            style={{
                                color: C.muted,
                                fontSize: 16,
                                marginTop: 5,
                            }}
                        >
                            POST /orders · 3.2 seconds
                        </div>
                    </div>
                    <Tag color={C.red}>SLOW TRACE</Tag>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `${chartLeft}px 1fr`,
                        alignItems: "center",
                        height: 45,
                        borderBottom: `1px solid ${C.line}`,
                        color: C.muted,
                        fontSize: 15,
                        fontWeight: 800,
                    }}
                >
                    <div>SPAN / SERVICE</div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>0 ms</span>
                        <span>1,000</span>
                        <span>2,000</span>
                        <span>3,000</span>
                    </div>
                </div>

                <div style={{ marginTop: 10 }}>
                    {spans.map((span, i) => {
                        const left = (span.start / maxMs) * chartWidth;
                        const width = (span.duration / maxMs) * chartWidth;
                        const selected = span.name.includes("SELECT");
                        const rowY = 8 + i * 87;

                        return (
                            <div
                                key={span.name}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: `${chartLeft}px 1fr`,
                                    alignItems: "center",
                                    minHeight: 80,
                                    opacity: fade(frame, i * 7, 12),
                                    transform: `translateX(${slide(frame, i * 7, 16, 18)}px)`,
                                }}
                            >
                                <div
                                    style={{
                                        paddingLeft: span.depth * 18,
                                        paddingRight: 8,
                                    }}
                                >
                                    <div
                                        style={{
                                            color: selected ? C.red : C.white,
                                            fontSize: 17,
                                            fontWeight: 900,
                                            lineHeight: 1.25,
                                        }}
                                    >
                                        {span.name}
                                    </div>
                                    <div
                                        style={{
                                            color: C.muted,
                                            fontSize: 14,
                                            marginTop: 5,
                                        }}
                                    >
                                        {span.service}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        position: "relative",
                                        height: 48,
                                        background: "#0A1224",
                                        borderRadius: 8,
                                        border: `1px solid ${C.line}`,
                                        overflow: "hidden",
                                    }}
                                >
                                    {[0, 1, 2, 3].map((tick) => (
                                        <div
                                            key={tick}
                                            style={{
                                                position: "absolute",
                                                left: `${(tick / 3.5) * 100}%`,
                                                top: 0,
                                                bottom: 0,
                                                width: 1,
                                                background: `${C.line}90`,
                                            }}
                                        />
                                    ))}

                                    <div
                                        style={{
                                            position: "absolute",
                                            left: `${left}px`,
                                            top: 7,
                                            width: `${Math.max(4, width * reveal)}px`,
                                            height: 32,
                                            borderRadius: 6,
                                            background: selected
                                                ? `linear-gradient(90deg, ${C.red}70, ${C.red})`
                                                : `linear-gradient(90deg, ${span.color}55, ${span.color})`,
                                            boxShadow: selected ? glow(C.red, 12) : "none",
                                        }}
                                    />
                                    {selected && reveal > 0.7 && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                left: `${Math.min(chartWidth - 100, left + width + 8)}px`,
                                                top: 12,
                                                color: C.red,
                                                fontSize: 13,
                                                fontWeight: 900,
                                            }}
                                        >
                                            1.65s
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div
                    style={{
                        position: "absolute",
                        bottom: 18,
                        left: 20,
                        right: 20,
                        color: C.muted,
                        fontSize: 15,
                    }}
                >
                    Each span records the time spent in one operation.
                </div>
            </Panel>

            <Panel
                style={{
                    position: "absolute",
                    bottom: 122,
                    left: 48,
                    right: 48,
                    padding: 22,
                    borderColor: C.red,
                    opacity: fade(frame, fps * 4, 12),
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 15,
                    }}
                >
                    <div
                        style={{
                            color: C.red,
                            fontSize: 29,
                            fontWeight: 900,
                        }}
                    >
                        1.65s
                    </div>
                    <div>
                        <div
                            style={{
                                color: C.red,
                                fontSize: 20,
                                fontWeight: 900,
                            }}
                        >
                            DATABASE QUERY
                        </div>
                        <div
                            style={{
                                color: C.white,
                                fontSize: 21,
                                marginTop: 6,
                                lineHeight: 1.35,
                            }}
                        >
                            The waterfall exposes WHERE the request spends its time.
                        </div>
                    </div>
                </div>
            </Panel>
        </AbsoluteFill>
    );
};

// ============================================================
// COMPARISON: three signals work together
// ============================================================

const ComparisonVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const items = [
        {
            number: "01",
            title: "METRICS",
            question: "WHEN?",
            detail: "Latency spikes at 10:03.",
            color: C.cyan,
            icon: "↗",
        },
        {
            number: "02",
            title: "LOGS",
            question: "WHAT?",
            detail: "Connection pool times out.",
            color: C.yellow,
            icon: "≡",
        },
        {
            number: "03",
            title: "TRACES",
            question: "WHERE?",
            detail: "The database span takes 1.65s.",
            color: C.purple,
            icon: "⇢",
        },
    ];

    return (
        <AbsoluteFill>
            <SectionHeader
                kicker="Put the signals together"
                title="One incident. Three perspectives."
                subtitle="No single signal tells the entire story."
                frame={frame}
            />

            <div
                style={{
                    position: "absolute",
                    top: 390,
                    left: 48,
                    right: 48,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                }}
            >
                {items.map((item, i) => (
                    <Panel
                        key={item.title}
                        borderColor={item.color}
                        style={{
                            padding: 25,
                            minHeight: 170,
                            opacity: fade(frame, i * 12, 14),
                            transform: `translateX(${slide(frame, i * 12, 18, 60)}px)`,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 20,
                            }}
                        >
                            <div
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 17,
                                    background: `${item.color}17`,
                                    border: `1px solid ${item.color}75`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: item.color,
                                    fontSize: 38,
                                    fontWeight: 900,
                                }}
                            >
                                {item.icon}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        color: item.color,
                                        fontSize: 19,
                                        fontWeight: 900,
                                        letterSpacing: 2,
                                    }}
                                >
                                    {item.number} · {item.title}
                                </div>
                                <div
                                    style={{
                                        color: C.white,
                                        fontSize: 31,
                                        fontWeight: 900,
                                        marginTop: 7,
                                    }}
                                >
                                    {item.question}
                                </div>
                                <div
                                    style={{
                                        color: C.muted,
                                        fontSize: 20,
                                        marginTop: 7,
                                        lineHeight: 1.35,
                                    }}
                                >
                                    {item.detail}
                                </div>
                            </div>
                        </div>
                    </Panel>
                ))}
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: 135,
                    left: 52,
                    right: 52,
                    textAlign: "center",
                    opacity: fade(frame, 2, 14),
                }}
            >
                <Heading size={34}>
                    Detect → Investigate → Pinpoint
                </Heading>
                <div style={{ height: 12 }} />
                <Subheading>
                    Combine signals to find the root cause faster.
                </Subheading>
            </div>
        </AbsoluteFill>
    );
};


const ObservabilityToolsOutro: React.FC<{ frame: number }> = ({ frame }) => {
    const tools = [
        {
            name: "Prometheus",
            role: "METRICS",
            color: "#FF8A65",
            icon: "P",
            description: "Collect and query metrics",
        },
        {
            name: "Grafana",
            role: "VISUALIZATION",
            color: "#FFB74D",
            icon: "G",
            description: "Dashboards and alerts",
        },
        {
            name: "Datadog",
            role: "FULL-STACK OBSERVABILITY",
            color: "#B39DFF",
            icon: "D",
            description: "Metrics, logs and traces",
        },
    ];

    return (
        <AbsoluteFill
            style={{
                ...text,
                justifyContent: "center",
                alignItems: "center",
                padding: 48,
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    fontSize: 22,
                    fontWeight: 900,
                    letterSpacing: 4,
                    color: C.cyan,
                    marginBottom: 20,
                    opacity: fade(frame, 0, 12),
                }}
            >
                PUT IT INTO PRACTICE
            </div>

            <div
                style={{
                    fontSize: 54,
                    lineHeight: 1.12,
                    fontWeight: 900,
                    textAlign: "center",
                    marginBottom: 18,
                    opacity: fade(frame, 4, 14),
                    transform: `translateY(${slide(frame, 4, 16, 25)}px)`,
                }}
            >
                Your Observability
                <br />
                <span style={{ color: C.cyan }}>Toolkit</span>
            </div>

            <div
                style={{
                    fontSize: 23,
                    color: C.muted,
                    textAlign: "center",
                    marginBottom: 38,
                    opacity: fade(frame, 8, 12),
                }}
            >
                Three tools. One complete picture.
            </div>

            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 22,
                }}
            >
                {tools.map((tool, index) => {
                    const start = 12 + index * 10;
                    const progress = fade(frame, start, 14);
                    const translateX = slide(frame, start, 16, 75);

                    return (
                        <Panel
                            key={tool.name}
                            borderColor={tool.color}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 22,
                                padding: "23px 21px",
                                opacity: progress,
                                transform: `translateX(${translateX}px)`,
                                boxShadow: `0 0 24px ${tool.color}20`,
                            }}
                        >
                            <div
                                style={{
                                    width: 76,
                                    height: 76,
                                    flexShrink: 0,
                                    borderRadius: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: `${tool.color}20`,
                                    border: `2px solid ${tool.color}`,
                                    color: tool.color,
                                    fontSize: 42,
                                    fontWeight: 900,
                                    boxShadow: `0 0 18px ${tool.color}25`,
                                }}
                            >
                                {tool.icon}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        color: C.white,
                                        fontSize: 30,
                                        fontWeight: 900,
                                        marginBottom: 7,
                                    }}
                                >
                                    {tool.name}
                                </div>

                                <div
                                    style={{
                                        color: tool.color,
                                        fontSize: 15,
                                        fontWeight: 900,
                                        letterSpacing: 1.2,
                                        marginBottom: 7,
                                    }}
                                >
                                    {tool.role}
                                </div>

                                <div
                                    style={{
                                        color: C.muted,
                                        fontSize: 19,
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {tool.description}
                                </div>
                            </div>

                            <div
                                style={{
                                    color: tool.color,
                                    fontSize: 30,
                                    fontWeight: 900,
                                }}
                            >
                                →
                            </div>
                        </Panel>
                    );
                })}
            </div>

            <div
                style={{
                    marginTop: 32,
                    padding: "17px 20px",
                    borderRadius: 18,
                    background: `${C.green}12`,
                    border: `1px solid ${C.green}80`,
                    color: C.green,
                    fontSize: 20,
                    fontWeight: 900,
                    textAlign: "center",
                    opacity: fade(frame, 45, 14),
                    transform: `scale(${interpolate(
                        frame,
                        [45, 60],
                        [0.94, 1],
                        clamp
                    )})`,
                }}
            >
                Metrics + Logs + Traces = Observability
            </div>
        </AbsoluteFill>
    );
};


// ============================================================
// ENDING
// ============================================================

const EndingVisual: React.FC<{ frame: number }> = ({ frame }) => (
    <AbsoluteFill>
        <div
            style={{
                position: "absolute",
                top: 240,
                left: 55,
                right: 55,
                opacity: fade(frame, 0, 15),
                transform: `translateY(${slide(frame, 0, 18, 35)}px)`,
            }}
        >
            <Kicker color={C.green}>The takeaway</Kicker>
            <Heading size={58}>
                Don’t just detect the failure.
                <span style={{ color: C.cyan }}> Find the cause.</span>
            </Heading>
        </div>

        <div
            style={{
                position: "absolute",
                top: 550,
                left: 55,
                right: 55,
                display: "flex",
                flexDirection: "column",
                gap: 22,
            }}
        >
            {[
                { label: "METRICS", desc: "Spot abnormal system behavior", color: C.cyan },
                { label: "LOGS", desc: "Understand the event and error", color: C.yellow },
                { label: "TRACES", desc: "Locate the slow service or span", color: C.purple },
            ].map((item, i) => (
                <Panel
                    key={item.label}
                    borderColor={item.color}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        padding: 24,
                        opacity: fade(frame, i * 9, 12),
                        transform: `translateX(${slide(frame, i * 9, 18, 45)}px)`,
                    }}
                >
                    <Dot color={item.color} size={18} />
                    <div>
                        <div
                            style={{
                                color: item.color,
                                fontSize: 24,
                                fontWeight: 900,
                            }}
                        >
                            {item.label}
                        </div>
                        <div
                            style={{
                                color: C.white,
                                fontSize: 22,
                                marginTop: 7,
                            }}
                        >
                            {item.desc}
                        </div>
                    </div>
                </Panel>
            ))}
        </div>

        <Panel
            borderColor={C.green}
            style={{
                position: "absolute",
                left: 54,
                right: 54,
                bottom: 170,
                padding: 26,
                textAlign: "center",
                opacity: fade(frame, 2.4 * 30, 12),
                transform: `scale(${interpolate(frame, [72, 90], [0.94, 1], clamp)})`,
            }}
        >
            <Heading size={31} color={C.green}>
                Observability is how you debug production.
            </Heading>
        </Panel>
    </AbsoluteFill>
);

// ============================================================
// CTA
// ============================================================

const CtaVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const pulse = 1 + Math.sin(frame * 0.12) * 0.018;

    return (
        <AbsoluteFill>
            <div
                style={{
                    position: "absolute",
                    top: 280,
                    left: 50,
                    right: 50,
                    textAlign: "center",
                    opacity: fade(frame, 0, 15),
                    transform: `translateY(${slide(frame, 0, 18, 25)}px)`,
                }}
            >
                <Kicker color={C.cyan}>AI Hub Insider</Kicker>
                <Heading size={58}>
                    Build better
                    <span style={{ color: C.cyan }}> backend systems.</span>
                </Heading>
                <div style={{ height: 25 }} />
                <Subheading>
                    Follow for daily backend and system design tips.
                </Subheading>
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 630,
                    left: 100,
                    right: 100,
                    display: "flex",
                    flexDirection: "column",
                    gap: 22,
                    transform: `scale(${pulse})`,
                }}
            >
                {[
                    { text: "SYSTEM DESIGN", color: C.cyan },
                    { text: "BACKEND ENGINEERING", color: C.purple },
                    { text: "CLOUD & DISTRIBUTED SYSTEMS", color: C.green },
                ].map((item, i) => (
                    <Panel
                        key={item.text}
                        borderColor={item.color}
                        style={{
                            padding: 22,
                            textAlign: "center",
                            opacity: fade(frame, i * 8, 12),
                        }}
                    >
                        <div
                            style={{
                                color: item.color,
                                fontSize: 21,
                                fontWeight: 900,
                                letterSpacing: 1,
                            }}
                        >
                            {item.text}
                        </div>
                    </Panel>
                ))}
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: 180,
                    left: 50,
                    right: 50,
                    textAlign: "center",
                    opacity: fade(frame, 45, 14),
                }}
            >
                <Heading size={30}>Follow AI Hub Insider</Heading>
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// Fallback for unknown section IDs
// ============================================================

const PillarSummary: React.FC<{
    frame: number;
    title?: string;
    subtitle?: string;
}> = ({ frame, title = "Observability", subtitle = "Understand your system." }) => (
    <AbsoluteFill>
        <div
            style={{
                position: "absolute",
                top: 300,
                left: 55,
                right: 55,
                opacity: fade(frame, 0, 15),
            }}
        >
            <Kicker>Backend engineering</Kicker>
            <Heading size={60}>{title}</Heading>
            <div style={{ height: 20 }} />
            <Subheading>{subtitle}</Subheading>
        </div>

        <div
            style={{
                position: "absolute",
                top: 600,
                left: 55,
                right: 55,
                display: "flex",
                flexDirection: "column",
                gap: 20,
            }}
        >
            {[
                { title: "METRICS", subtitle: "When did it happen?", color: C.cyan },
                { title: "LOGS", subtitle: "What happened?", color: C.yellow },
                { title: "TRACES", subtitle: "Where did it happen?", color: C.purple },
            ].map((item, i) => (
                <Panel
                    key={item.title}
                    borderColor={item.color}
                    style={{
                        padding: 25,
                        opacity: fade(frame, i * 8, 12),
                    }}
                >
                    <div
                        style={{
                            color: item.color,
                            fontSize: 26,
                            fontWeight: 900,
                        }}
                    >
                        {item.title}
                    </div>
                    <div
                        style={{
                            color: C.white,
                            fontSize: 22,
                            marginTop: 8,
                        }}
                    >
                        {item.subtitle}
                    </div>
                </Panel>
            ))}
        </div>
    </AbsoluteFill>
);

// ============================================================
// Main scene
// ============================================================

export const ObservabilityPillarsScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const timelineResult: any = createTimeline(observabilityPillars);

    const timelineSections: any[] = Array.isArray(timelineResult)
        ? timelineResult
        : Array.isArray(timelineResult?.sections)
            ? timelineResult.sections
            : [];

    if (timelineSections.length === 0) {
        throw new Error(
            `Invalid timeline: createTimeline() must return an array or an object with a sections array. Received: ${timelineResult === null
                ? "null"
                : typeof timelineResult
            }`,
        );
    }

    return (
        <AbsoluteFill style={{ backgroundColor: C.bg, ...text }}>
            <Backdrop frame={frame} />

            {timelineSections.map((section: any, index: number) => {
                const sectionId = String(
                    section.id ?? section.key ?? section.name ?? "",
                )
                    .toLowerCase()
                    .replace(/_/g, "-");

                const from = section.start ?? section.from ?? 0;
                const duration = Math.max(
                    1,
                    section.duration ?? section.durationInFrames ?? 1,
                );

                return (
                    <Sequence
                        key={`${sectionId}-${from}-${index}`}
                        from={from}
                        durationInFrames={duration}
                        name={sectionId || `section-${index}`}
                    >
                        <SectionContent
                            section={section}
                            sectionId={sectionId}
                            fps={fps}
                        />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};


const SectionContent: React.FC<{
    section: any;
    sectionId: string;
    fps: number;
}> = ({ section, sectionId, fps }) => {
    const frame = useCurrentFrame();

    const normalizedId = sectionId
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");

    const title = section.title ?? section.heading ?? "Observability";
    const subtitle =
        section.subtitle ??
        section.description ??
        "Understand your production systems.";

    let visual: React.ReactNode;

    if (
        normalizedId.includes("hook") ||
        normalizedId.includes("intro")
    ) {
        visual = <HookVisual frame={frame} fps={fps} />;
    } else if (normalizedId.includes("metric")) {
        visual = <MetricsVisual frame={frame} fps={fps} />;
    } else if (normalizedId.includes("log")) {
        visual = <LogsVisual frame={frame} fps={fps} />;
    } else if (
        normalizedId.includes("trace") ||
        normalizedId.includes("distributed-tracing")
    ) {
        visual = <TracingVisual frame={frame} fps={fps} />;
    } else if (
        normalizedId.includes("tools-outro") ||
        normalizedId.includes("observability-tools")
    ) {
        visual = <ObservabilityToolsOutro frame={frame} />;
    } else if (
        normalizedId.includes("comparison") ||
        normalizedId.includes("summary")
    ) {
        visual = <ComparisonVisual frame={frame} />;
    } else if (normalizedId.includes("ending")) {
        visual = <EndingVisual frame={frame} />;
    } else if (normalizedId.includes("cta")) {
        visual = <CtaVisual frame={frame} />;
    } else {
        visual = (
            <PillarSummary
                frame={frame}
                title={title}
                subtitle={subtitle}
            />
        );
    }

    const audioPath = section.audio ?? section.audioPath;

    return (
        <AbsoluteFill>
            {visual}
            {audioPath && (
                <Audio
                    src={staticFile(
                        String(audioPath).replace(/^public\//, "")
                    )}
                />
            )}
        </AbsoluteFill>
    );
};

export default ObservabilityPillarsScene;