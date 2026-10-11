import React from "react";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    interpolate,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";

const C = {
    bg: "#07111F",
    panel: "#101F32",
    panel2: "#142941",
    line: "#29435C",
    blue: "#55A7FF",
    cyan: "#4DEBFF",
    green: "#42E6A4",
    red: "#FF536D",
    orange: "#FFBD66",
    purple: "#B39AFF",
    white: "#F4F8FF",
    muted: "#91A8C2",
};


const SECTIONS = [
    { id: "hook", duration: 4.829751 },
    { id: "overview", duration: 6.269388 },
    { id: "closed", duration: 6.548027 },
    { id: "open", duration: 7.987664 },
    { id: "half-open", duration: 8.173424 },
    { id: "comparison", duration: 10.077460 },
    { id: "ending", duration: 9.473741 },
    { id: "cta", duration: 4.829751 },
];

const TOTAL_SECONDS = SECTIONS.reduce(
    (total, section) => total + section.duration,
    0,
);

const clamp = (v: number, a = 0, b = 1) =>
    Math.max(a, Math.min(b, v));

const appear = (frame: number, delay = 0, duration = 12) =>
    interpolate(frame - delay, [0, duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

const lift = (frame: number, delay = 0) =>
    interpolate(
        spring({
            frame: Math.max(0, frame - delay),
            fps: 30,
            config: { damping: 16, stiffness: 115 },
        }),
        [0, 1],
        [38, 0],
    );

const Panel: React.FC<{
    children: React.ReactNode;
    color?: string;
    style?: React.CSSProperties;
}> = ({ children, color = C.line, style }) => (
    <div
        style={{
            background: `linear - gradient(145deg, ${C.panel2}, ${C.panel})`,
            border: `1px solid ${color} 88`,
            borderRadius: 20,
            boxShadow: `0 12px 40px #00000028, 0 0 24px ${color} 12`,
            color: C.white,
            boxSizing: "border-box",
            ...style,
        }}
    >
        {children}
    </div>
);

const Tag: React.FC<{ text: string; color?: string }> = ({
    text,
    color = C.cyan,
}) => (
    <div
        style={{
            display: "inline-flex",
            alignItems: "center",
            alignSelf: "flex-start",
            gap: 9,
            border: `1px solid ${color} 70`,
            borderRadius: 100,
            padding: "9px 14px",
            color,
            background: `${color} 12`,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 1,
        }}
    >
        <span
            style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 10px ${color} `,
            }}
        />
        {text}
    </div>
);

const Service: React.FC<{
    name: string;
    sub: string;
    color: string;
    frame: number;
    delay?: number;
    failed?: boolean;
    width?: number;
}> = ({
    name,
    sub,
    color,
    frame,
    delay = 0,
    failed = false,
    width = 210,
}) => (
        <div
            style={{
                width,
                minHeight: 95,
                padding: "14px 10px",
                borderRadius: 17,
                border: `2px solid ${color} `,
                background: `linear - gradient(145deg, ${color}20, #0C1A2C)`,
                boxShadow: `0 0 28px ${color} 18`,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                opacity: appear(frame, delay),
                transform: `translateY(${lift(frame, delay)}px)`,
                position: "relative",
            }}
        >
            <div
                style={{
                    fontSize: 20,
                    fontWeight: 900,
                    textAlign: "center",
                }}
            >
                {name}
            </div>
            <div
                style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: failed ? C.red : C.muted,
                    textAlign: "center",
                }}
            >
                {failed ? "✕ SERVICE UNAVAILABLE" : sub}
            </div>
            {failed && (
                <div
                    style={{
                        position: "absolute",
                        right: -8,
                        top: -10,
                        borderRadius: 8,
                        background: C.red,
                        color: "#fff",
                        padding: "4px 7px",
                        fontSize: 12,
                        fontWeight: 900,
                    }}
                >
                    ERROR
                </div>
            )}
        </div>
    );

const Lane: React.FC<{
    frame: number;
    color?: string;
    vertical?: boolean;
    broken?: boolean;
    delay?: number;
    packets?: number;
    duration?: number;
}> = ({
    frame,
    color = C.cyan,
    vertical = false,
    broken = false,
    delay = 0,
    packets = 3,
    duration = 48,
}) => {
        const progress = ((frame - delay) % duration + duration) % duration;

        return (
            <div
                style={{
                    width: vertical ? 4 : 78,
                    height: vertical ? 76 : 4,
                    position: "relative",
                    flexShrink: 0,
                    borderRadius: 10,
                    background: broken ? `${C.red} 28` : `${color} 45`,
                    overflow: "visible",
                }}
            >
                {broken && (
                    <div
                        style={{
                            position: "absolute",
                            left: vertical ? -14 : "42%",
                            top: vertical ? "42%" : -15,
                            color: C.red,
                            fontSize: 29,
                            fontWeight: 900,
                            zIndex: 3,
                        }}
                    >
                        ×
                    </div>
                )}

                {!broken &&
                    frame >= delay &&
                    Array.from({ length: packets }).map((_, i) => {
                        const p =
                            ((progress / duration + i / packets) % 1) * 100;

                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    left: vertical ? 0 : `${p}% `,
                                    top: vertical ? `${p}% ` : -4,
                                    width: 12,
                                    height: 12,
                                    borderRadius: 4,
                                    background: color,
                                    boxShadow: `0 0 13px ${color} `,
                                    transform: "translate(-50%, -25%)",
                                }}
                            />
                        );
                    })}
            </div>
        );
    };

const BreakerSwitch: React.FC<{
    frame: number;
    state: "CLOSED" | "OPEN" | "HALF-OPEN";
}> = ({ frame, state }) => {
    const color =
        state === "OPEN"
            ? C.red
            : state === "HALF-OPEN"
                ? C.orange
                : C.green;

    const open = state === "OPEN";
    const half = state === "HALF-OPEN";

    return (
        <Panel
            color={color}
            style={{
                width: 235,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                opacity: appear(frame, 5),
                transform: `translateY(${lift(frame, 5)}px)`,
            }}
        >
            <div
                style={{
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: 2,
                    color: C.muted,
                }}
            >
                CIRCUIT BREAKER
            </div>

            <svg width="165" height="88" viewBox="0 0 180 100">
                <circle cx="35" cy="50" r="11" fill={color} />
                <circle cx="145" cy="50" r="11" fill={color} />
                <path
                    d="M35 50 L145 50"
                    stroke={`${color} 35`}
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <path
                    d={
                        open
                            ? "M35 50 L88 18"
                            : half
                                ? "M35 50 L105 35"
                                : "M35 50 L145 50"
                    }
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                />
                <circle
                    cx={open ? 88 : half ? 105 : 145}
                    cy={open ? 18 : half ? 35 : 50}
                    r="7"
                    fill={C.white}
                />
                <circle
                    cx="90"
                    cy="50"
                    r={35 + Math.sin(frame / 5) * 3}
                    stroke={`${color} 25`}
                    strokeWidth="2"
                    fill="none"
                />
            </svg>

            <div
                style={{
                    fontSize: 23,
                    fontWeight: 950,
                    color,
                    letterSpacing: 1,
                }}
            >
                {state}
            </div>
        </Panel>
    );
};

const Architecture: React.FC<{
    frame: number;
    state: "CLOSED" | "OPEN" | "HALF-OPEN";
    compact?: boolean;
}> = ({ frame, state, compact = false }) => {
    const open = state === "OPEN";
    const half = state === "HALF-OPEN";

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: compact ? 10 : 16,
                width: "100%",
            }}
        >
            <Service
                name="API GATEWAY"
                sub="Incoming requests"
                color={C.blue}
                frame={frame}
                width={compact ? 220 : 250}
            />

            <Lane frame={frame} vertical color={C.cyan} duration={30} />

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <div
                    style={{
                        color: C.cyan,
                        fontSize: 12,
                        fontWeight: 900,
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        letterSpacing: 2,
                    }}
                >
                    REQUEST
                </div>
                <BreakerSwitch frame={frame} state={state} />
            </div>

            <Lane
                frame={frame}
                vertical
                color={open ? C.red : half ? C.orange : C.green}
                broken={open}
                delay={8}
                duration={40}
            />

            <Service
                name="PAYMENT SERVICE"
                sub={open ? "Calls rejected" : half ? "Recovery probe" : "Healthy"}
                color={open ? C.red : half ? C.orange : C.green}
                frame={frame}
                delay={10}
                width={compact ? 220 : 250}
            />

            {open && (
                <Tag text="FAIL FAST · NO DOWNSTREAM CALL" color={C.red} />
            )}
            {half && (
                <Tag text="LIMITED PROBE REQUESTS" color={C.orange} />
            )}
        </div>
    );
};

const PacketFlow: React.FC<{
    frame: number;
    mode: "healthy" | "failure" | "probe";
}> = ({ frame, mode }) => {
    const isFailure = mode === "failure";
    const isProbe = mode === "probe";
    const color = isFailure ? C.red : isProbe ? C.orange : C.green;

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: 300,
                borderRadius: 24,
                border: `1px solid ${C.line} `,
                background: "#081625",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 25,
                    right: 25,
                    top: 150,
                    height: 4,
                    background: `${C.cyan} 45`,
                }}
            />

            {[0, 1, 2, 3, 4].map((i) => {
                const progress =
                    ((frame - i * (isProbe ? 22 : 8)) %
                        (isProbe ? 85 : 48) +
                        (isProbe ? 85 : 48)) %
                    (isProbe ? 85 : 48);

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: 30 + (progress / (isProbe ? 85 : 48)) * 650,
                            top: 144 + (i % 2) * 15,
                            width: 13,
                            height: 13,
                            borderRadius: 4,
                            background:
                                isFailure && i % 2 === 0 ? C.red : color,
                            boxShadow: `0 0 15px ${color} `,
                        }}
                    />
                );
            })}

            <div
                style={{
                    position: "absolute",
                    left: "6%",
                    top: 85,
                    width: "25%",
                    textAlign: "center",
                }}
            >
                <div style={{ fontSize: 34 }}>⇢</div>
                <div style={{ color: C.muted, fontSize: 15, fontWeight: 800 }}>
                    CLIENT
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: "40%",
                    top: 75,
                    width: "22%",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        width: 62,
                        height: 62,
                        margin: "0 auto 8px",
                        borderRadius: 16,
                        display: "grid",
                        placeItems: "center",
                        border: `2px solid ${color} `,
                        background: `${color} 16`,
                        color,
                        fontSize: 30,
                        fontWeight: 950,
                    }}
                >
                    {isFailure ? "×" : isProbe ? "?" : "✓"}
                </div>
                <div style={{ color, fontSize: 15, fontWeight: 900 }}>
                    {isFailure ? "BLOCKED" : isProbe ? "PROBE" : "PASS"}
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    right: "4%",
                    top: 85,
                    width: "27%",
                    textAlign: "center",
                }}
            >
                <div style={{ fontSize: 34, color }}>▣</div>
                <div style={{ color: C.muted, fontSize: 15, fontWeight: 800 }}>
                    SERVICE
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    color,
                    fontSize: 14,
                    fontWeight: 900,
                }}
            >
                <span>
                    {isFailure
                        ? "REQUEST REJECTED"
                        : isProbe
                            ? "COOLDOWN COMPLETE"
                            : "200 OK"}
                </span>
                <span>
                    {isFailure
                        ? "FAIL FAST"
                        : isProbe
                            ? "TEST RECOVERY →"
                            : "REQUESTS FLOWING →"}
                </span>
            </div>
        </div>
    );
};

const StateCard: React.FC<{
    frame: number;
    title: string;
    subtitle: string;
    color: string;
    symbol: string;
    delay: number;
}> = ({ frame, title, subtitle, color, symbol, delay }) => (
    <Panel
        color={color}
        style={{
            width: "100%",
            padding: 18,
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: appear(frame, delay),
            transform: `translateX(${interpolate(
                spring({
                    frame: Math.max(0, frame - delay),
                    fps: 30,
                    config: { damping: 15, stiffness: 100 },
                }),
                [0, 1],
                [70, 0],
            )}px)`,
        }}
    >
        <div
            style={{
                width: 58,
                height: 58,
                flexShrink: 0,
                borderRadius: 16,
                display: "grid",
                placeItems: "center",
                background: `${color} 17`,
                border: `1px solid ${color} 80`,
                color,
                fontSize: 32,
                fontWeight: 950,
            }}
        >
            {symbol}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 950, color }}>
                {title}
            </div>
            <div
                style={{
                    fontSize: 16,
                    color: C.muted,
                    marginTop: 6,
                    lineHeight: 1.4,
                }}
            >
                {subtitle}
            </div>
        </div>
    </Panel>
);

/**
 * A microservices dependency map.
 * The payment node fails first, followed by connected services.
 */
const CascadingFailureMap: React.FC<{ frame: number }> = ({ frame }) => {
    const nodes = [
        { id: "gateway", label: "API GATEWAY", x: 50, y: 12, delay: 44 },
        { id: "order", label: "ORDER", x: 24, y: 34, delay: 20 },
        { id: "payment", label: "PAYMENT", x: 76, y: 34, delay: 0 },
        { id: "inventory", label: "INVENTORY", x: 15, y: 61, delay: 32 },
        { id: "checkout", label: "CHECKOUT", x: 50, y: 61, delay: 22 },
        { id: "shipping", label: "SHIPPING", x: 85, y: 61, delay: 36 },
        { id: "database", label: "DATABASE", x: 50, y: 84, delay: 42 },
    ];

    const links: [string, string][] = [
        ["gateway", "order"],
        ["gateway", "payment"],
        ["order", "inventory"],
        ["order", "checkout"],
        ["payment", "checkout"],
        ["payment", "shipping"],
        ["checkout", "database"],
    ];

    const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));

    const isFailed = (id: string) => {
        const node = nodeMap[id];
        return frame >= node.delay;
    };

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: 490,
                borderRadius: 24,
                border: `1px solid ${C.line} `,
                background: "linear-gradient(160deg, #0D1D30, #07111F)",
                overflow: "hidden",
            }}
        >
            {/* Connections between dependent services */}
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                }}
            >
                {links.map(([from, to], i) => {
                    const a = nodeMap[from];
                    const b = nodeMap[to];
                    const failed = isFailed(from) || isFailed(to);

                    return (
                        <g key={`${from} -${to} `}>
                            <line
                                x1={a.x}
                                y1={a.y}
                                x2={b.x}
                                y2={b.y}
                                stroke={failed ? C.red : C.cyan}
                                strokeWidth={failed ? 0.75 : 0.45}
                                strokeDasharray={failed ? "2 1" : "1.5 1.5"}
                                opacity={failed ? 0.9 : 0.45}
                            />
                            {failed && (
                                <circle
                                    cx={(a.x + b.x) / 2}
                                    cy={(a.y + b.y) / 2}
                                    r={
                                        0.7 +
                                        Math.abs(
                                            Math.sin((frame + i * 7) / 3),
                                        ) *
                                        0.7
                                    }
                                    fill={C.red}
                                />
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* Service nodes flash red as failures spread */}
            {nodes.map((node) => {
                const failed = isFailed(node.id);
                const payment = node.id === "payment";
                const flash =
                    failed &&
                    Math.sin((frame + node.delay) * 1.3) > 0.15;
                const color = failed ? C.red : C.cyan;

                return (
                    <div
                        key={node.id}
                        style={{
                            position: "absolute",
                            left: `${node.x}% `,
                            top: `${node.y}% `,
                            transform: "translate(-50%, -50%)",
                            width: payment ? 158 : 136,
                            minHeight: payment ? 76 : 65,
                            padding: "8px 5px",
                            boxSizing: "border-box",
                            borderRadius: 13,
                            border: `${payment ? 3 : 2}px solid ${color} `,
                            background: failed
                                ? flash
                                    ? "#541D31"
                                    : "#291627"
                                : "#102A40",
                            boxShadow: failed
                                ? `0 0 ${flash ? 28 : 12}px ${C.red} 80`
                                : `0 0 16px ${C.cyan} 20`,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 5,
                            zIndex: 2,
                        }}
                    >
                        <div
                            style={{
                                color,
                                fontSize: payment ? 16 : 13,
                                fontWeight: 950,
                                textAlign: "center",
                            }}
                        >
                            {node.label}
                        </div>
                        <div
                            style={{
                                color: failed ? "#FF9AAA" : C.muted,
                                fontSize: 10,
                                fontWeight: 900,
                                textAlign: "center",
                            }}
                        >
                            {failed
                                ? payment
                                    ? "✕ SERVICE DOWN"
                                    : "⚠ ERRORS"
                                : "✓ HEALTHY"}
                        </div>
                    </div>
                );
            })}

            <div
                style={{
                    position: "absolute",
                    left: 10,
                    right: 10,
                    bottom: 8,
                    textAlign: "center",
                    color: C.red,
                    fontSize: 14,
                    fontWeight: 950,
                    letterSpacing: 0.5,
                    opacity: appear(frame, 8),
                }}
            >
                ⚠ ONE FAILURE. CASCADING ERRORS.
            </div>
        </div>
    );
};

const SceneVisual: React.FC<{ id: string; frame: number }> = ({
    id,
    frame,
}) => {
    const { fps } = useVideoConfig();

    const heading: Record<string, string> = {
        hook: "HOW DO YOU STOP A SINGLE FAILING SERVICE FROM TAKING DOWN YOUR ENTIRE BACKEND?",
        overview: "THE CIRCUIT BREAKER",
        closed: "CLOSED: LET TRAFFIC FLOW",
        open: "OPEN: CUT THE CONNECTION",
        "half-open": "HALF-OPEN: TEST THE RECOVERY",
        comparison: "THREE STATES. ONE LIFECYCLE.",
        ending: "CONTAIN THE DAMAGE",
        cta: "BUILD SYSTEMS THAT RECOVER",
    };

    const kicker: Record<string, string> = {
        hook: "PRODUCTION INCIDENT / CASCADING FAILURE",
        overview: "RESILIENCE PATTERN",
        closed: "STATE 01 / NORMAL OPERATION",
        open: "STATE 02 / FAIL FAST",
        "half-open": "STATE 03 / RECOVERY CHECK",
        comparison: "THE STATE MACHINE",
        ending: "PRODUCTION CHECKLIST",
        cta: "AI HUB INSIDER",
    };

    const accent: Record<string, string> = {
        hook: C.red,
        overview: C.cyan,
        closed: C.green,
        open: C.red,
        "half-open": C.orange,
        comparison: C.purple,
        ending: C.green,
        cta: C.cyan,
    };

    const color = accent[id] ?? C.cyan;
    const title = heading[id] ?? "";
    const currentFrame = Math.max(0, frame);

    return (
        <AbsoluteFill
            style={{
                padding: "58px 42px 68px",
                color: C.white,
                fontFamily: "Inter, Arial, sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Animated technical background */}
            <AbsoluteFill
                style={{
                    backgroundImage: `
linear - gradient(${C.line}22 1px, transparent 1px),
    linear - gradient(90deg, ${C.line}22 1px, transparent 1px)
        `,
                    backgroundSize: "42px 42px",
                    transform: `translate(${(frame * 0.22) % 42}px, ${(frame * 0.22) % 42}px)`,
                    opacity: 0.55,
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    top: -250,
                    right: -210,
                    borderRadius: "50%",
                    background: `radial - gradient(circle, ${color}22, transparent 70 %)`,
                }}
            />

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                {/* Brand header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        opacity: appear(currentFrame),
                    }}
                >
                    <div
                        style={{
                            fontSize: 17,
                            fontWeight: 950,
                            letterSpacing: 2,
                            color: C.white,
                        }}
                    >
                        <span style={{ color: C.cyan }}>AI HUB</span> INSIDER
                    </div>
                    <div
                        style={{
                            color: C.muted,
                            fontSize: 13,
                            fontWeight: 800,
                            letterSpacing: 1.5,
                        }}
                    >
                        SYSTEM DESIGN
                    </div>
                </div>

                <div
                    style={{
                        height: 2,
                        marginTop: 16,
                        background: `linear - gradient(90deg, ${color}, transparent)`,
                        opacity: 0.8,
                    }}
                />

                {/* Animated title */}
                <div
                    style={{
                        marginTop: id === "hook" ? 22 : 28,
                        opacity: appear(currentFrame, 2),
                        transform: `translateY(${lift(currentFrame, 2)}px)`,
                    }}
                >
                    <div
                        style={{
                            fontSize: 13,
                            fontWeight: 900,
                            color,
                            letterSpacing: 1.5,
                            marginBottom: 10,
                        }}
                    >
                        {kicker[id]}
                    </div>
                    <div
                        style={{
                            fontSize: id === "hook" ? 32 : 38,
                            lineHeight: 1.12,
                            fontWeight: 950,
                            letterSpacing: -0.8,
                            maxWidth: 930,
                        }}
                    >
                        {title}
                    </div>
                </div>

                {/* Scene-specific motion graphics */}
                <div
                    style={{
                        marginTop: id === "hook" ? 18 : 28,
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        flex: 1,
                        minHeight: 0,
                    }}
                >
                    {id === "hook" && (
                        <>
                            <Tag
                                text="PAYMENT SERVICE FAILURE DETECTED"
                                color={C.red}
                            />

                            <CascadingFailureMap frame={currentFrame} />

                            <Panel
                                color={C.red}
                                style={{
                                    padding: 17,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 34,
                                        color: C.red,
                                        fontWeight: 950,
                                    }}
                                >
                                    ⚡
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 950,
                                            color: C.white,
                                        }}
                                    >
                                        ONE SERVICE FAILS.
                                    </div>
                                    <div
                                        style={{
                                            marginTop: 5,
                                            fontSize: 17,
                                            fontWeight: 900,
                                            color: C.red,
                                        }}
                                    >
                                        THE FAILURE SPREADS.
                                    </div>
                                </div>
                            </Panel>
                        </>
                    )}

                    {id === "overview" && (
                        <>
                            <Architecture frame={currentFrame} state="CLOSED" />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    color: C.muted,
                                    fontSize: 13,
                                    fontWeight: 800,
                                }}
                            >
                                <span style={{ color: C.green }}>CLOSED</span>
                                <span>→</span>
                                <span style={{ color: C.red }}>OPEN</span>
                                <span>→</span>
                                <span style={{ color: C.orange }}>HALF-OPEN</span>
                            </div>
                            <Panel color={C.cyan} style={{ padding: 19 }}>
                                <div style={{ fontSize: 20, fontWeight: 900 }}>
                                    A BREAKER AROUND A REMOTE CALL
                                </div>
                                <div
                                    style={{
                                        fontSize: 16,
                                        color: C.muted,
                                        marginTop: 8,
                                        lineHeight: 1.45,
                                    }}
                                >
                                    Detect repeated failures. Stop calls
                                    temporarily. Test the dependency before
                                    restoring traffic.
                                </div>
                            </Panel>
                        </>
                    )}

                    {id === "closed" && (
                        <>
                            <Tag text="NORMAL OPERATION" color={C.green} />
                            <PacketFlow frame={currentFrame} mode="healthy" />
                            <Architecture
                                frame={currentFrame}
                                state="CLOSED"
                                compact
                            />
                            <Panel color={C.green} style={{ padding: 19 }}>
                                <div
                                    style={{
                                        fontSize: 21,
                                        fontWeight: 950,
                                        color: C.green,
                                    }}
                                >
                                    ✓ REQUESTS PASS THROUGH
                                </div>
                                <div
                                    style={{
                                        marginTop: 8,
                                        fontSize: 16,
                                        color: C.muted,
                                    }}
                                >
                                    The breaker monitors failures and timeouts.
                                </div>
                            </Panel>
                        </>
                    )}

                    {id === "open" && (
                        <>
                            <Tag
                                text="FAILURE THRESHOLD EXCEEDED"
                                color={C.red}
                            />
                            <PacketFlow frame={currentFrame} mode="failure" />
                            <Architecture
                                frame={currentFrame}
                                state="OPEN"
                                compact
                            />
                            <Panel color={C.red} style={{ padding: 19 }}>
                                <div
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 950,
                                        color: C.red,
                                    }}
                                >
                                    CIRCUIT TRIPPED
                                </div>
                                <div
                                    style={{
                                        marginTop: 8,
                                        fontSize: 16,
                                        color: C.muted,
                                        lineHeight: 1.4,
                                    }}
                                >
                                    Reject calls immediately. Avoid repeated
                                    waits, resource exhaustion, and additional
                                    load.
                                </div>
                            </Panel>
                        </>
                    )}

                    {id === "half-open" && (
                        <>
                            <Tag text="COOLDOWN FINISHED" color={C.orange} />

                            <Panel
                                color={C.orange}
                                style={{
                                    padding: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 20,
                                }}
                            >
                                <div
                                    style={{
                                        width: 85,
                                        height: 85,
                                        borderRadius: "50%",
                                        border: `5px solid ${C.orange} `,
                                        display: "grid",
                                        placeItems: "center",
                                        color: C.orange,
                                        fontSize: 30,
                                        fontWeight: 950,
                                        boxShadow: `0 0 30px ${C.orange} 20`,
                                        flexShrink: 0,
                                    }}
                                >
                                    {Math.max(
                                        0,
                                        3 - (Math.floor(currentFrame / 30) % 4),
                                    )}
                                </div>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 950 }}>
                                        SEND A FEW PROBES
                                    </div>
                                    <div
                                        style={{
                                            marginTop: 8,
                                            fontSize: 16,
                                            color: C.muted,
                                        }}
                                    >
                                        Do not flood the recovering service.
                                    </div>
                                </div>
                            </Panel>

                            <PacketFlow frame={currentFrame} mode="probe" />

                            <div style={{ display: "flex", gap: 12 }}>
                                <Panel
                                    color={C.green}
                                    style={{ flex: 1, padding: 17 }}
                                >
                                    <div style={{ fontSize: 30, color: C.green }}>
                                        ✓
                                    </div>
                                    <div style={{ fontSize: 18, fontWeight: 950 }}>
                                        SUCCESS
                                    </div>
                                    <div
                                        style={{
                                            marginTop: 6,
                                            color: C.muted,
                                            fontSize: 14,
                                        }}
                                    >
                                        Close breaker
                                    </div>
                                </Panel>
                                <Panel
                                    color={C.red}
                                    style={{ flex: 1, padding: 17 }}
                                >
                                    <div style={{ fontSize: 30, color: C.red }}>
                                        ×
                                    </div>
                                    <div style={{ fontSize: 18, fontWeight: 950 }}>
                                        FAILURE
                                    </div>
                                    <div
                                        style={{
                                            marginTop: 6,
                                            color: C.muted,
                                            fontSize: 14,
                                        }}
                                    >
                                        Open again
                                    </div>
                                </Panel>
                            </div>
                        </>
                    )}

                    {id === "comparison" && (
                        <>
                            <StateCard
                                frame={currentFrame}
                                title="CLOSED"
                                subtitle="Normal requests pass through"
                                color={C.green}
                                symbol="✓"
                                delay={0}
                            />

                            <div
                                style={{
                                    textAlign: "center",
                                    color: C.muted,
                                    fontSize: 20,
                                    fontWeight: 900,
                                }}
                            >
                                ↓ FAILURE THRESHOLD EXCEEDED
                            </div>

                            <StateCard
                                frame={currentFrame}
                                title="OPEN"
                                subtitle="Calls fail fast without contacting dependency"
                                color={C.red}
                                symbol="×"
                                delay={8}
                            />

                            <div
                                style={{
                                    textAlign: "center",
                                    color: C.muted,
                                    fontSize: 20,
                                    fontWeight: 900,
                                }}
                            >
                                ↓ COOLDOWN EXPIRES
                            </div>

                            <StateCard
                                frame={currentFrame}
                                title="HALF-OPEN"
                                subtitle="Limited probes test if recovery succeeded"
                                color={C.orange}
                                symbol="◉"
                                delay={16}
                            />

                            <Panel color={C.purple} style={{ padding: 19 }}>
                                <div style={{ fontSize: 18, fontWeight: 900 }}>
                                    RECOVERY DECIDES THE NEXT STATE
                                </div>
                                <div
                                    style={{
                                        marginTop: 8,
                                        color: C.muted,
                                        fontSize: 15,
                                    }}
                                >
                                    Probe success → Closed · Probe failure → Open
                                </div>
                            </Panel>
                        </>
                    )}

                    {id === "ending" && (
                        <>
                            <Tag
                                text="RESILIENCE IS A SYSTEM DESIGN DECISION"
                                color={C.green}
                            />

                            <Architecture
                                frame={currentFrame}
                                state="CLOSED"
                                compact
                            />

                            {[
                                {
                                    n: "01",
                                    title: "TIMEOUTS",
                                    desc: "Bound how long a call can wait",
                                    color: C.cyan,
                                },
                                {
                                    n: "02",
                                    title: "BOUNDED RETRIES",
                                    desc: "Retry carefully, with backoff and jitter",
                                    color: C.purple,
                                },
                                {
                                    n: "03",
                                    title: "FALLBACKS",
                                    desc: "Return a safe alternative when possible",
                                    color: C.green,
                                },
                            ].map((item, i) => (
                                <Panel
                                    key={item.n}
                                    color={item.color}
                                    style={{
                                        padding: 15,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 15,
                                        opacity: appear(currentFrame, i * 7),
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 22,
                                            fontWeight: 950,
                                            color: item.color,
                                        }}
                                    >
                                        {item.n}
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 950,
                                            }}
                                        >
                                            {item.title}
                                        </div>
                                        <div
                                            style={{
                                                marginTop: 4,
                                                color: C.muted,
                                                fontSize: 14,
                                            }}
                                        >
                                            {item.desc}
                                        </div>
                                    </div>
                                </Panel>
                            ))}
                        </>
                    )}

                    {id === "cta" && (
                        <>
                            <div
                                style={{
                                    position: "relative",
                                    margin: "20px auto",
                                    width: 220,
                                    height: 220,
                                    display: "grid",
                                    placeItems: "center",
                                }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        style={{
                                            position: "absolute",
                                            inset: i * 20,
                                            border: `2px solid ${i === 1 ? C.cyan : C.purple} 66`,
                                            borderRadius: 35 + i * 8,
                                            transform: `rotate(${frame * (i % 2 ? -0.6 : 0.6) + i * 25}deg)`,
                                        }}
                                    />
                                ))}
                                <div
                                    style={{
                                        fontSize: 100,
                                        color: C.cyan,
                                        textShadow: `0 0 40px ${C.cyan} 55`,
                                        transform: `scale(${1 + Math.sin(frame / 7) * 0.04})`,
                                    }}
                                >
                                    ⚡
                                </div>
                            </div>

                            <div
                                style={{
                                    textAlign: "center",
                                    fontSize: 32,
                                    fontWeight: 950,
                                    lineHeight: 1.25,
                                }}
                            >
                                DESIGN FOR
                                <div style={{ color: C.cyan }}>FAILURE.</div>
                                BUILD FOR
                                <div style={{ color: C.purple }}>RECOVERY.</div>
                            </div>

                            <Panel
                                color={C.cyan}
                                style={{
                                    marginTop: 16,
                                    padding: 22,
                                    textAlign: "center",
                                    opacity: appear(currentFrame, 8),
                                    transform: `translateY(${lift(currentFrame, 8)}px)`,
                                }}
                            >
                                <div style={{ fontSize: 23, fontWeight: 950 }}>
                                    FOLLOW AI HUB INSIDER
                                </div>
                                <div
                                    style={{
                                        marginTop: 10,
                                        fontSize: 15,
                                        color: C.muted,
                                    }}
                                >
                                    BACKEND · SYSTEM DESIGN · CLOUD
                                </div>
                            </Panel>
                        </>
                    )}
                </div>

                {/* Animated global progress */}
                <div style={{ marginTop: 16 }}>
                    <div
                        style={{
                            height: 4,
                            background: "#FFFFFF15",
                            borderRadius: 10,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: `${clamp(currentFrame / (fps * TOTAL_SECONDS)) * 100}% `,
                                background: `linear - gradient(90deg, ${C.cyan}, ${color})`,
                                boxShadow: `0 0 15px ${color} `,
                            }}
                        />
                    </div>

                    <div
                        style={{
                            marginTop: 8,
                            display: "flex",
                            justifyContent: "space-between",
                            color: C.muted,
                            fontSize: 12,
                            fontWeight: 800,
                        }}
                    >
                        <span>MICROSERVICES / RESILIENCE</span>
                        <span>{id.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

export const CircuitBreakerScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    let cursor = 0;

    const timeline = SECTIONS.map((section) => {
        const from = cursor;
        const durationInFrames = Math.ceil(section.duration * fps);
        cursor += durationInFrames;

        return {
            ...section,
            from,
            durationInFrames,
        };
    });

    const active =
        [...timeline].reverse().find((section) => frame >= section.from) ??
        timeline[0];


    return (
        <AbsoluteFill
            style={{
                background: C.bg,
                fontFamily: "Inter, Arial, sans-serif",
            }}
        >
            {timeline.map((section) => (
                <Sequence
                    key={section.id}
                    from={section.from}
                    durationInFrames={section.durationInFrames}
                >
                    <Audio
                        src={staticFile(
                            `audio/circuit-breaker/${section.id}.mp3`,
                        )}
                    />

                    <SceneVisual
                        id={section.id}
                        frame={useCurrentFrame() - section.from}
                    />
                </Sequence>
            ))}
        </AbsoluteFill>
    );

};