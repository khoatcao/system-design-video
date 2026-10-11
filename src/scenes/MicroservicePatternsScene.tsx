
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

import { microservicePatterns } from "../../content/microservice-patterns";
import { createTimeline } from "../timeline";

const C = {
    bg: "#080D20",
    panel: "rgba(16, 27, 55, 0.88)",
    panel2: "rgba(22, 38, 74, 0.88)",
    line: "rgba(112, 153, 224, 0.25)",
    white: "#F4F7FF",
    muted: "#9EAFD0",
    cyan: "#55E5FF",
    blue: "#548CFF",
    green: "#38F0B0",
    purple: "#B28AFF",
    orange: "#FFC078",
    pink: "#FF75C8",
    red: "#FF637F",
};

const FONT = "Arial, Helvetica, sans-serif";
const { sections: TIMELINE } = createTimeline(microservicePatterns);

const PATTERNS = [
    {
        id: "api-gateway",
        title: "API GATEWAY",
        subtitle: "ONE ENTRY POINT",
        description: "Routing · Authentication · Rate limiting",
        color: C.cyan,
        use: "Simplify client access",
        insight: "ONE FRONT DOOR. MANY SERVICES.",
    },
    {
        id: "circuit-breaker",
        title: "CIRCUIT BREAKER",
        subtitle: "FAIL FAST",
        description: "Stop calls to unhealthy dependencies",
        color: C.red,
        use: "Limit cascading failures",
        insight: "STOP CALLING A FAILING SERVICE.",
    },
    {
        id: "bulkhead",
        title: "BULKHEAD",
        subtitle: "ISOLATE RESOURCES",
        description: "Separate pools · Limit concurrency",
        color: C.green,
        use: "Protect unrelated requests",
        insight: "ONE POOL FAILS. OTHERS SURVIVE.",
    },
    {
        id: "saga",
        title: "SAGA PATTERN",
        subtitle: "DISTRIBUTED WORKFLOW",
        description: "Local transactions + compensation",
        color: C.orange,
        use: "Coordinate multi-service workflows",
        insight: "UNDO COMPLETED STEPS WHEN NEEDED.",
    },
    {
        id: "serverless",
        title: "SERVERLESS",
        subtitle: "EVENT-DRIVEN FUNCTIONS",
        description: "Managed execution · Elastic scaling",
        color: C.purple,
        use: "Run event-driven workloads",
        insight: "EVENT IN. FUNCTION RUNS.",
    },
    {
        id: "loose-coupling",
        title: "LOOSE COUPLING",
        subtitle: "ASYNC COMMUNICATION",
        description: "Queues · Pub/Sub · Message brokers",
        color: C.cyan,
        use: "Let services evolve independently",
        insight: "PRODUCERS DON'T NEED TO WAIT.",
    },
    {
        id: "transactional-outbox",
        title: "TRANSACTIONAL OUTBOX",
        subtitle: "RELIABLE EVENT PUBLISHING",
        description: "Business data + outbox in one transaction",
        color: C.orange,
        use: "Avoid dual-write inconsistencies",
        insight: "COMMIT DATA AND EVENT INTENT TOGETHER.",
    },
];

const clamp = (value: number, min = 0, max = 1) =>
    Math.max(min, Math.min(max, value));

const panel: React.CSSProperties = {
    background: "linear-gradient(145deg, rgba(23,39,76,0.9), rgba(10,18,42,0.9))",
    border: "1px solid rgba(142,174,255,0.19)",
    borderRadius: 28,
    boxShadow: "0 24px 70px rgba(0,0,0,0.23), inset 0 1px 0 rgba(255,255,255,0.045)",
    backdropFilter: "blur(16px)",
};

const Txt: React.FC<{
    children: React.ReactNode;
    size?: number;
    color?: string;
    weight?: number;
    align?: React.CSSProperties["textAlign"];
    tracking?: number;
    style?: React.CSSProperties;
}> = ({ children, size = 28, color = C.white, weight = 700, align, tracking = 0, style }) => (
    <div
        style={{
            fontFamily: FONT,
            fontSize: size,
            color,
            fontWeight: weight,
            textAlign: align,
            letterSpacing: tracking,
            lineHeight: 1.2,
            ...style,
        }}
    >
        {children}
    </div>
);

const Tag: React.FC<{
    children: React.ReactNode;
    color?: string;
    style?: React.CSSProperties;
}> = ({ children, color = C.cyan, style }) => (
    <div
        style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "11px 17px",
            borderRadius: 999,
            color,
            fontFamily: FONT,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 1.5,
            background: `${color}12`,
            border: `1px solid ${color}50`,
            boxShadow: `0 0 22px ${color}0D`,
            ...style,
        }}
    >
        {children}
    </div>
);

const Background: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    const driftX = Math.sin(frame / 65) * 26;
    const driftY = Math.cos(frame / 82) * 30;
    const pulse = 0.8 + Math.sin(frame / 23) * 0.12;
    const particles = Array.from({ length: 28 }, (_, i) => {
        const x = (i * 137.5 + 8) % 100;
        const baseY = (i * 43.7 + 3) % 100;
        const y = (baseY + frame * (0.018 + (i % 4) * 0.007)) % 100;
        const size = 2 + (i % 3);
        return { x, y, size, opacity: 0.2 + (i % 5) * 0.09, hue: i % 3 };
    });

    return (
        <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.bg }}>
            {/* Rich multicolor base */}
            <AbsoluteFill
                style={{
                    background: `
                        radial-gradient(ellipse at ${22 + driftX * 0.12}% ${15 + driftY * 0.1}%,
                            rgba(39,108,255,0.34) 0%, rgba(39,108,255,0.08) 28%, transparent 53%),
                        radial-gradient(ellipse at ${85 - driftX * 0.1}% ${35 + driftY * 0.13}%,
                            rgba(137,74,255,0.26) 0%, rgba(137,74,255,0.07) 27%, transparent 52%),
                        radial-gradient(ellipse at ${58 + driftX * 0.08}% 100%,
                            rgba(0,204,225,0.18) 0%, transparent 45%),
                        linear-gradient(155deg, #101B3B 0%, #090F25 43%, #11102C 72%, #071624 100%)
                    `,
                }}
            />

            {/* Soft moving light fields */}
            <div
                style={{
                    position: "absolute",
                    width: width * 0.8,
                    height: width * 0.8,
                    left: -width * 0.32 + driftX,
                    top: height * 0.18 + driftY,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(49,124,255,0.15), transparent 68%)",
                    filter: "blur(20px)",
                    transform: `scale(${pulse})`,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: width * 0.85,
                    height: width * 0.85,
                    right: -width * 0.4 - driftX,
                    top: height * 0.45 - driftY,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(180,75,255,0.13), transparent 70%)",
                    filter: "blur(24px)",
                    transform: `scale(${1.05 - pulse * 0.08})`,
                }}
            />

            {/* Subtle perspective grid, not a flat full-screen grid */}
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
                style={{ position: "absolute", inset: 0, opacity: 0.22 }}
            >
                <defs>
                    <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6CA9FF" stopOpacity="0" />
                        <stop offset="24%" stopColor="#6CA9FF" stopOpacity="0.5" />
                        <stop offset="75%" stopColor="#7E91FF" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#6CA9FF" stopOpacity="0" />
                    </linearGradient>
                    <pattern id="softGrid" width="66" height="66" patternUnits="userSpaceOnUse">
                        <path d="M 66 0 L 0 0 0 66" fill="none" stroke="#91B8FF" strokeWidth="1" />
                    </pattern>
                    <mask id="gridMask">
                        <rect width="100%" height="100%" fill="url(#gridFade)" />
                    </mask>
                </defs>
                <g
                    mask="url(#gridMask)"
                    transform={`translate(${driftX * 0.25} ${driftY * 0.25})`}
                >
                    <rect width="100%" height="100%" fill="url(#softGrid)" />
                </g>
            </svg>

            {/* Animated circuit traces around the edges */}
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
                style={{ position: "absolute", inset: 0, overflow: "hidden" }}
            >
                <defs>
                    <linearGradient id="traceGradient">
                        <stop offset="0%" stopColor={C.blue} stopOpacity="0.02" />
                        <stop offset="50%" stopColor={C.cyan} stopOpacity="0.65" />
                        <stop offset="100%" stopColor={C.purple} stopOpacity="0.05" />
                    </linearGradient>
                </defs>
                {Array.from({ length: 8 }, (_, i) => {
                    const y = 145 + i * 190;
                    const rightSide = i % 2 === 0;
                    const d = rightSide
                        ? `M ${width - 20} ${y} H ${width - 110} V ${y + 42} H ${width - 205}`
                        : `M 20 ${y + 65} H 105 V ${y + 18} H 195`;
                    const length = 250;
                    const offset = (frame * (1.5 + i * 0.16)) % length;
                    return (
                        <g key={i}>
                            <path
                                d={d}
                                fill="none"
                                stroke="url(#traceGradient)"
                                strokeWidth={2}
                            />
                            <path
                                d={d}
                                fill="none"
                                stroke={i % 2 ? C.cyan : C.purple}
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                strokeDasharray="18 232"
                                strokeDashoffset={-offset}
                                opacity={0.78}
                            />
                            <circle
                                cx={rightSide ? width - 205 : 195}
                                cy={rightSide ? y + 42 : y + 18}
                                r={4}
                                fill={i % 2 ? C.cyan : C.purple}
                                opacity={0.65 + Math.sin(frame / 12 + i) * 0.25}
                            />
                        </g>
                    );
                })}
            </svg>

            {/* Floating particles */}
            {particles.map((p, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        borderRadius: "50%",
                        background: p.hue === 0 ? C.cyan : p.hue === 1 ? C.blue : C.purple,
                        opacity: p.opacity * (0.65 + Math.sin(frame / 15 + i) * 0.35),
                        boxShadow: `0 0 ${p.size * 4}px ${p.hue === 2 ? C.purple : C.cyan}`,
                    }}
                />
            ))}

            {/* Edge vignette for readability */}
            <AbsoluteFill
                style={{
                    background:
                        "linear-gradient(90deg, rgba(4,8,20,0.28), transparent 18%, transparent 82%, rgba(4,8,20,0.28)), linear-gradient(180deg, rgba(4,8,20,0.1), transparent 18%, transparent 82%, rgba(4,8,20,0.4))",
                }}
            />
        </AbsoluteFill>
    );
};

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.white, overflow: "hidden" }}>
        <Background />
        {children}
    </AbsoluteFill>
);

const Reveal: React.FC<{
    children: React.ReactNode;
    delay?: number;
    style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = spring({
        frame: Math.max(0, frame - delay),
        fps,
        config: { damping: 18, stiffness: 100, mass: 0.75 },
    });
    const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                opacity,
                transform: `translateY(${(1 - progress) * 30}px) scale(${0.98 + progress * 0.02})`,
                ...style,
            }}
        >
            {children}
        </div>
    );
};

const Glow: React.FC<{
    color?: string;
    size?: number;
    style?: React.CSSProperties;
}> = ({ color = C.cyan, size = 240, style }) => {
    const frame = useCurrentFrame();
    const pulse = 0.86 + Math.sin(frame / 20) * 0.12;
    return (
        <div
            style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color}30 0%, ${color}10 34%, transparent 72%)`,
                filter: "blur(12px)",
                transform: `scale(${pulse})`,
                pointerEvents: "none",
                ...style,
            }}
        />
    );
};

const Node: React.FC<{
    title: string;
    subtitle?: string;
    color?: string;
    x?: number;
    y?: number;
    width?: number;
    active?: boolean;
}> = ({
    title,
    subtitle,
    color = C.cyan,
    x = 0,
    y = 0,
    width = 210,
    active = true,
}) => {
        const frame = useCurrentFrame();
        const pulse = active ? 1 + Math.sin(frame / 12) * 0.018 : 1;
        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width,
                    minHeight: 98,
                    boxSizing: "border-box",
                    padding: "19px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    borderRadius: 20,
                    border: `1.5px solid ${color}${active ? "B0" : "45"}`,
                    background: `linear-gradient(145deg, ${color}20, rgba(13,22,48,0.95) 72%)`,
                    boxShadow: active
                        ? `0 0 30px ${color}20, inset 0 0 18px ${color}08`
                        : "none",
                    transform: `scale(${pulse})`,
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: color,
                        boxShadow: `0 0 12px ${color}`,
                    }}
                />
                <Txt size={21} color={C.white} weight={800}>
                    {title}
                </Txt>
                {subtitle && (
                    <Txt size={15} color={C.muted} weight={500}>
                        {subtitle}
                    </Txt>
                )}
            </div>
        );
    };

const FlowLine: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    active?: boolean;
    delay?: number;
}> = ({ x1, y1, x2, y2, color = C.cyan, active = true, delay = 0 }) => {
    const frame = useCurrentFrame();
    const progress = ((frame * 2.2 + delay * 11) % 100) / 100;
    const cx = x1 + (x2 - x1) * progress;
    const cy = y1 + (y2 - y1) * progress;

    return (
        <g>
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={3}
                strokeOpacity={active ? 0.38 : 0.12}
                strokeLinecap="round"
            />
            {active && (
                <>
                    <circle cx={cx} cy={cy} r={6} fill={color} opacity={0.95} />
                    <circle cx={cx} cy={cy} r={13} fill={color} opacity={0.14} />
                </>
            )}
        </g>
    );
};

const NetworkCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 900 560"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
    >
        {children}
    </svg>
);

const ApiGatewayDiagram: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ position: "relative", width: "100%", height: 560 }}>
            <NetworkCanvas>
                <FlowLine x1={450} y1={100} x2={450} y2={210} delay={0} />
                <FlowLine x1={450} y1={310} x2={175} y2={405} delay={12} />
                <FlowLine x1={450} y1={310} x2={450} y2={405} delay={25} />
                <FlowLine x1={450} y1={310} x2={725} y2={405} delay={40} />
            </NetworkCanvas>
            <Node x={340} y={10} width={220} title="CLIENTS" subtitle="Web · Mobile · Apps" color={C.blue} />
            <Node x={320} y={205} width={260} title="API GATEWAY" subtitle="Auth · Routing · Limits" color={C.cyan} />
            <Node x={55} y={400} width={240} title="USER SERVICE" subtitle="Profile & identity" color={C.purple} />
            <Node x={330} y={400} width={240} title="ORDER SERVICE" subtitle="Business logic" color={C.green} />
            <Node x={605} y={400} width={240} title="PAYMENT SERVICE" subtitle="Transactions" color={C.orange} />
            <div
                style={{
                    position: "absolute",
                    left: 300,
                    top: 140,
                    width: 300,
                    textAlign: "center",
                    opacity: 0.8 + Math.sin(frame / 16) * 0.12,
                }}
            >
                <Tag color={C.cyan}>ONE ENTRY POINT</Tag>
            </div>
        </div>
    );
};

const CircuitBreakerDiagram: React.FC = () => {
    const frame = useCurrentFrame();
    const phase = Math.floor(frame / 45) % 3;
    const states = [
        { name: "CLOSED", color: C.green, note: "Requests flow normally" },
        { name: "OPEN", color: C.red, note: "Calls blocked immediately" },
        { name: "HALF-OPEN", color: C.orange, note: "Allow a test request" },
    ];
    const state = states[phase];

    return (
        <div style={{ position: "relative", width: "100%", height: 560 }}>
            <NetworkCanvas>
                <FlowLine x1={200} y1={260} x2={350} y2={260} color={state.color} active={phase !== 1} />
                <FlowLine x1={550} y1={260} x2={700} y2={260} color={state.color} active={phase !== 1} delay={15} />
            </NetworkCanvas>
            <Node x={35} y={210} width={190} title="SERVICE A" subtitle="Caller" color={C.blue} />
            <Node x={350} y={205} width={200} title="BREAKER" subtitle={state.name} color={state.color} />
            <Node x={675} y={210} width={190} title="SERVICE B" subtitle="Unhealthy dependency" color={C.purple} active={phase !== 1} />
            {phase === 1 && (
                <div
                    style={{
                        position: "absolute",
                        left: 575,
                        top: 224,
                        width: 85,
                        height: 85,
                        borderRadius: 22,
                        background: "rgba(255,99,127,0.13)",
                        border: `2px solid ${C.red}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C.red,
                        fontSize: 50,
                        fontWeight: 900,
                        boxShadow: `0 0 32px ${C.red}25`,
                    }}
                >
                    ×
                </div>
            )}
            <div
                style={{
                    position: "absolute",
                    left: 140,
                    right: 140,
                    top: 375,
                    padding: 30,
                    ...panel,
                    textAlign: "center",
                    borderColor: `${state.color}70`,
                }}
            >
                <Tag color={state.color}>{state.name}</Tag>
                <div style={{ height: 16 }} />
                <Txt size={26}>{state.note}</Txt>
                <div style={{ height: 14 }} />
                <Txt size={18} color={C.muted}>
                    {phase === 0
                        ? "Healthy dependency → pass requests"
                        : phase === 1
                            ? "Repeated failures → reject calls"
                            : "Probe succeeds → close the circuit"}
                </Txt>
            </div>
        </div>
    );
};

const BulkheadDiagram: React.FC = () => {
    const frame = useCurrentFrame();
    const failed = Math.floor(frame / 40) % 2 === 0;
    return (
        <div
            style={{
                display: "flex",
                gap: 22,
                height: 500,
                alignItems: "stretch",
                padding: "15px 8px",
                boxSizing: "border-box",
            }}
        >
            {[0, 1].map((pool) => {
                const color = pool === 0 ? C.red : C.green;
                const isFailed = pool === 0 && failed;
                return (
                    <div
                        key={pool}
                        style={{
                            flex: 1,
                            padding: 24,
                            borderRadius: 26,
                            border: `1px solid ${color}65`,
                            background: `linear-gradient(155deg, ${color}15, rgba(12,22,47,0.8))`,
                            boxShadow: `0 0 32px ${color}10`,
                        }}
                    >
                        <Tag color={color}>{pool === 0 ? "PAYMENTS POOL" : "ORDERS POOL"}</Tag>
                        <div style={{ height: 25 }} />
                        <Txt size={22} color={color}>
                            {isFailed ? "OVERLOADED" : "HEALTHY"}
                        </Txt>
                        <div style={{ height: 20 }} />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 13 }}>
                            {Array.from({ length: 6 }, (_, i) => {
                                const on = !isFailed || (i + Math.floor(frame / 8)) % 3 !== 0;
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            width: 48,
                                            height: 62,
                                            borderRadius: 14,
                                            border: `1px solid ${color}${on ? "95" : "35"}`,
                                            background: on ? `${color}25` : "rgba(255,255,255,0.025)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: on ? color : "#526079",
                                            fontSize: 22,
                                            fontWeight: 800,
                                        }}
                                    >
                                        {on ? "●" : "×"}
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ height: 25 }} />
                        <Txt size={18} color={C.muted}>
                            {pool === 0 ? "Isolated resource pool" : "Independent capacity"}
                        </Txt>
                    </div>
                );
            })}
        </div>
    );
};

const SagaDiagram: React.FC = () => {
    const frame = useCurrentFrame();
    const step = Math.floor(frame / 38) % 4;
    const items = [
        { title: "CREATE ORDER", color: C.cyan },
        { title: "CHARGE PAYMENT", color: C.green },
        { title: "RESERVE STOCK", color: C.orange },
    ];
    return (
        <div style={{ position: "relative", height: 540 }}>
            <NetworkCanvas>
                <FlowLine x1={280} y1={205} x2={325} y2={205} color={C.cyan} delay={0} />
                <FlowLine x1={575} y1={205} x2={620} y2={205} color={C.orange} delay={12} />
            </NetworkCanvas>
            <div style={{ display: "flex", gap: 22, paddingTop: 125 }}>
                {items.map((item, i) => {
                    const active = step === i;
                    const complete = step > i;
                    const color = complete ? C.green : item.color;
                    return (
                        <div
                            key={item.title}
                            style={{
                                flex: 1,
                                minHeight: 170,
                                borderRadius: 24,
                                border: `1.5px solid ${color}${active ? "D0" : "60"}`,
                                background: `linear-gradient(145deg, ${color}20, rgba(13,22,48,0.95))`,
                                boxShadow: active ? `0 0 36px ${color}25` : "none",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 18,
                                gap: 14,
                                transform: active ? "translateY(-10px)" : "translateY(0)",
                            }}
                        >
                            <div style={{ fontSize: 38, color, fontWeight: 900 }}>
                                {complete ? "✓" : active ? "●" : `0${i + 1}`}
                            </div>
                            <Txt size={19} align="center">{item.title}</Txt>
                            <Txt size={15} color={C.muted}>
                                {complete ? "COMMITTED" : active ? "PROCESSING" : "WAITING"}
                            </Txt>
                        </div>
                    );
                })}
            </div>
            <div
                style={{
                    marginTop: 38,
                    padding: 25,
                    borderRadius: 22,
                    background: step === 3 ? "rgba(255,99,127,0.12)" : "rgba(56,240,176,0.07)",
                    border: `1px solid ${step === 3 ? C.red : C.green}50`,
                    textAlign: "center",
                }}
            >
                <Txt size={23} color={step === 3 ? C.red : C.green}>
                    {step === 3 ? "FAILURE → RUN COMPENSATING ACTIONS" : "EACH SERVICE COMMITS LOCALLY"}
                </Txt>
                <div style={{ height: 10 }} />
                <Txt size={17} color={C.muted}>
                    {step === 3 ? "Refund payment · Release inventory · Cancel order" : "No single distributed database transaction required"}
                </Txt>
            </div>
        </div>
    );
};

const ServerlessDiagram: React.FC = () => {
    const frame = useCurrentFrame();
    const count = 1 + (Math.floor(frame / 24) % 4);
    return (
        <div style={{ position: "relative", height: 540 }}>
            <NetworkCanvas>
                <FlowLine x1={220} y1={250} x2={325} y2={250} color={C.purple} />
                <FlowLine x1={565} y1={250} x2={680} y2={250} color={C.cyan} delay={15} />
            </NetworkCanvas>
            <Node x={25} y={205} width={205} title="EVENT" subtitle="Upload · Webhook" color={C.orange} />
            <Node x={320} y={205} width={250} title="FUNCTIONS" subtitle="Auto-scaling runtime" color={C.purple} />
            <Node x={675} y={205} width={200} title="DATABASE" subtitle="Persist results" color={C.cyan} />
            <div
                style={{
                    position: "absolute",
                    left: 305,
                    top: 340,
                    width: 280,
                    padding: 20,
                    borderRadius: 22,
                    ...panel,
                    textAlign: "center",
                    borderColor: `${C.purple}60`,
                }}
            >
                <Txt size={18} color={C.muted}>ACTIVE INSTANCES</Txt>
                <div style={{ display: "flex", gap: 13, justifyContent: "center", marginTop: 16 }}>
                    {Array.from({ length: 4 }, (_, i) => (
                        <div
                            key={i}
                            style={{
                                width: 42,
                                height: 54,
                                borderRadius: 12,
                                border: `1px solid ${i < count ? C.purple : C.line}`,
                                background: i < count ? `${C.purple}35` : "rgba(255,255,255,0.025)",
                                boxShadow: i < count ? `0 0 18px ${C.purple}20` : "none",
                                opacity: i < count ? 1 : 0.45,
                            }}
                        />
                    ))}
                </div>
                <div style={{ marginTop: 16 }}>
                    <Txt size={20} color={C.purple}>{count} {count === 1 ? "INSTANCE" : "INSTANCES"}</Txt>
                </div>
            </div>
        </div>
    );
};

const LooseCouplingDiagram: React.FC = () => {
    const frame = useCurrentFrame();
    const queueCount = Math.floor(frame / 14) % 5;
    return (
        <div style={{ position: "relative", height: 540 }}>
            <NetworkCanvas>
                <FlowLine x1={235} y1={260} x2={335} y2={260} color={C.cyan} />
                <FlowLine x1={565} y1={260} x2={665} y2={170} color={C.green} delay={14} />
                <FlowLine x1={565} y1={260} x2={665} y2={360} color={C.purple} delay={25} />
            </NetworkCanvas>
            <Node x={25} y={210} width={215} title="PRODUCER" subtitle="Publish message" color={C.blue} />
            <Node x={325} y={210} width={250} title="MESSAGE BROKER" subtitle="Buffer · Route · Retry" color={C.cyan} />
            <Node x={655} y={120} width={220} title="CONSUMER A" subtitle="Independent worker" color={C.green} />
            <Node x={655} y={330} width={220} title="CONSUMER B" subtitle="Independent worker" color={C.purple} />
            <div
                style={{
                    position: "absolute",
                    left: 350,
                    top: 365,
                    display: "flex",
                    gap: 10,
                }}
            >
                {Array.from({ length: 5 }, (_, i) => (
                    <div
                        key={i}
                        style={{
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            background: i < queueCount ? C.cyan : "rgba(85,229,255,0.08)",
                            border: `1px solid ${C.cyan}80`,
                            boxShadow: i < queueCount ? `0 0 14px ${C.cyan}35` : "none",
                        }}
                    />
                ))}
            </div>
            <div style={{ position: "absolute", left: 320, top: 415 }}>
                <Tag color={C.cyan}>ASYNC QUEUE</Tag>
            </div>
        </div>
    );
};

const OutboxDiagram: React.FC = () => {
    const frame = useCurrentFrame();
    const step = Math.floor(frame / 32) % 3;
    const steps = [
        { title: "1. WRITE BUSINESS DATA", color: C.green },
        { title: "2. SAVE OUTBOX EVENT", color: C.orange },
        { title: "3. RELAY TO BROKER", color: C.cyan },
    ];
    return (
        <div style={{ position: "relative", height: 540 }}>
            <NetworkCanvas>
                <FlowLine x1={280} y1={240} x2={335} y2={240} color={C.green} />
                <FlowLine x1={565} y1={240} x2={620} y2={240} color={C.orange} />
            </NetworkCanvas>
            <Node x={25} y={190} width={260} title="APP TRANSACTION" subtitle="One database commit" color={C.green} />
            <Node x={320} y={190} width={260} title="OUTBOX TABLE" subtitle="Event stored reliably" color={C.orange} />
            <Node x={615} y={190} width={260} title="MESSAGE BROKER" subtitle="Publish after commit" color={C.cyan} />
            <div style={{ position: "absolute", top: 340, left: 90, right: 90, display: "flex", flexDirection: "column", gap: 13 }}>
                {steps.map((item, i) => {
                    const complete = step > i;
                    const active = step === i;
                    const color = complete ? C.green : item.color;
                    return (
                        <div
                            key={item.title}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 18,
                                padding: "17px 22px",
                                borderRadius: 17,
                                background: active ? `${color}16` : "rgba(255,255,255,0.025)",
                                border: `1px solid ${color}${active ? "A0" : "35"}`,
                                boxShadow: active ? `0 0 24px ${color}12` : "none",
                            }}
                        >
                            <Txt size={23} color={color}>{complete ? "✓" : active ? "●" : "○"}</Txt>
                            <Txt size={19}>{item.title}</Txt>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Diagram: React.FC<{ id: string }> = ({ id }) => {
    switch (id) {
        case "api-gateway":
            return <ApiGatewayDiagram />;
        case "circuit-breaker":
            return <CircuitBreakerDiagram />;
        case "bulkhead":
            return <BulkheadDiagram />;
        case "saga":
            return <SagaDiagram />;
        case "serverless":
            return <ServerlessDiagram />;
        case "loose-coupling":
            return <LooseCouplingDiagram />;
        case "transactional-outbox":
            return <OutboxDiagram />;
        default:
            return <ApiGatewayDiagram />;
    }
};

const Hook: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const titleScale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 100 } });
    return (
        <Shell>
            <Glow color={C.blue} size={650} style={{ top: 80, left: -180 }} />
            <Glow color={C.purple} size={580} style={{ top: 620, right: -220 }} />
            <AbsoluteFill style={{ padding: "105px 58px 90px", boxSizing: "border-box" }}>
                <Reveal>
                    <Tag color={C.cyan}>SYSTEM DESIGN / MICROSERVICES</Tag>
                </Reveal>
                <div style={{ height: 35 }} />
                <div style={{ transform: `scale(${0.92 + titleScale * 0.08})`, transformOrigin: "left center" }}>
                    <Txt size={78} weight={900} tracking={-2} style={{ lineHeight: 1.04 }}>
                        7 MICROSERVICE
                    </Txt>
                    <Txt size={94} weight={900} color={C.cyan} tracking={-3} style={{ lineHeight: 1.06 }}>
                        PATTERNS
                    </Txt>
                </div>
                <div style={{ height: 30 }} />
                <Reveal delay={12}>
                    <Txt size={30} color={C.muted} weight={500}>
                        Build systems that stay resilient
                        {"\n"}when services fail.
                    </Txt>
                </Reveal>
                <div style={{ height: 58 }} />
                <Reveal delay={18} style={{ flex: 1 }}>
                    <div style={{ ...panel, padding: 24, position: "relative", overflow: "hidden" }}>
                        <Glow color={C.cyan} size={300} style={{ left: 230, top: 40 }} />
                        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 19 }}>
                            {PATTERNS.slice(0, 5).map((p, i) => (
                                <div
                                    key={p.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 18,
                                        padding: "15px 18px",
                                        borderRadius: 18,
                                        background: `linear-gradient(90deg, ${p.color}15, rgba(255,255,255,0.018))`,
                                        border: `1px solid ${p.color}35`,
                                        transform: `translateX(${Math.sin(frame / 14 + i) * 4}px)`,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 45,
                                            height: 45,
                                            borderRadius: 14,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: `${p.color}20`,
                                            border: `1px solid ${p.color}65`,
                                            color: p.color,
                                            fontSize: 21,
                                            fontWeight: 900,
                                        }}
                                    >
                                        0{i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Txt size={23}>{p.title}</Txt>
                                        <Txt size={16} color={C.muted} weight={500}>{p.subtitle}</Txt>
                                    </div>
                                    <div style={{ color: p.color, fontSize: 25 }}>↗</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>
                <div style={{ height: 30 }} />
                <Reveal delay={28}>
                    <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                        <div style={{ width: 55, height: 3, background: C.cyan, boxShadow: `0 0 15px ${C.cyan}` }} />
                        <Txt size={20} color={C.muted} weight={700} tracking={2}>
                            AI HUB INSIDER
                        </Txt>
                    </div>
                </Reveal>
            </AbsoluteFill>
        </Shell>
    );
};

const PatternScene: React.FC<{ pattern: (typeof PATTERNS)[number] }> = ({ pattern }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({ frame: frame - 3, fps, config: { damping: 18, stiffness: 85 } });

    return (
        <Shell>
            <Glow color={pattern.color} size={620} style={{ top: 190, left: -250 }} />
            <Glow color={C.blue} size={440} style={{ top: 850, right: -240 }} />
            <AbsoluteFill
                style={{
                    padding: "85px 48px 75px",
                    boxSizing: "border-box",
                    opacity: interpolate(frame, [0, 7], [0, 1], { extrapolateRight: "clamp" }),
                }}
            >
                <Reveal delay={0}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Tag color={pattern.color}>MICROSERVICE PATTERN</Tag>
                        <Txt size={18} color={C.muted} weight={800}>
                            {String(PATTERNS.findIndex((p) => p.id === pattern.id) + 1).padStart(2, "0")} / 07
                        </Txt>
                    </div>
                </Reveal>
                <div style={{ height: 34 }} />
                <div style={{ transform: `translateX(${(1 - enter) * 35}px)` }}>
                    <Txt size={56} weight={900} tracking={-1.5} style={{ lineHeight: 1.08 }}>
                        {pattern.title}
                    </Txt>
                    <div style={{ height: 14 }} />
                    <Txt size={28} color={pattern.color} weight={800} tracking={1.5}>
                        {pattern.subtitle}
                    </Txt>
                    <div style={{ height: 17 }} />
                    <Txt size={23} color={C.muted} weight={500}>
                        {pattern.description}
                    </Txt>
                </div>
                <div style={{ height: 42 }} />
                <div
                    style={{
                        flex: 1,
                        minHeight: 0,
                        ...panel,
                        padding: "22px 18px",
                        position: "relative",
                        overflow: "hidden",
                        borderColor: `${pattern.color}40`,
                        boxShadow: `0 0 50px ${pattern.color}0B, 0 24px 70px rgba(0,0,0,0.2)`,
                        transform: `translateY(${(1 - enter) * 20}px)`,
                    }}
                >
                    <Glow color={pattern.color} size={330} style={{ top: 65, left: 280 }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <Diagram id={pattern.id} />
                    </div>
                </div>
                <div style={{ height: 25 }} />
                <Reveal delay={12}>
                    <div
                        style={{
                            padding: "23px 25px",
                            borderRadius: 22,
                            border: `1px solid ${pattern.color}65`,
                            background: `linear-gradient(100deg, ${pattern.color}16, rgba(15,25,52,0.9))`,
                            boxShadow: `0 0 32px ${pattern.color}0A`,
                        }}
                    >
                        <Txt size={16} color={pattern.color} weight={900} tracking={2}>
                            KEY TAKEAWAY
                        </Txt>
                        <div style={{ height: 9 }} />
                        <Txt size={25} weight={900}>{pattern.insight}</Txt>
                    </div>
                </Reveal>
                <div style={{ height: 18 }} />
                <Reveal delay={19}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 4, height: 42, borderRadius: 4, background: pattern.color, boxShadow: `0 0 15px ${pattern.color}` }} />
                        <div>
                            <Txt size={15} color={C.muted} weight={800} tracking={2}>WHEN TO USE IT</Txt>
                            <div style={{ height: 4 }} />
                            <Txt size={21}>{pattern.use}</Txt>
                        </div>
                    </div>
                </Reveal>
            </AbsoluteFill>
        </Shell>
    );
};

const Recap: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <Shell>
            <Glow color={C.blue} size={650} style={{ top: 50, left: -200 }} />
            <Glow color={C.purple} size={550} style={{ bottom: 150, right: -230 }} />
            <AbsoluteFill style={{ padding: "100px 54px 90px", boxSizing: "border-box" }}>
                <Reveal>
                    <Tag color={C.cyan}>QUICK RECAP</Tag>
                </Reveal>
                <div style={{ height: 28 }} />
                <Reveal delay={6}>
                    <Txt size={67} weight={900} tracking={-2}>7 PATTERNS.</Txt>
                    <Txt size={67} color={C.cyan} weight={900} tracking={-2}>ONE RESILIENT SYSTEM.</Txt>
                </Reveal>
                <div style={{ height: 42 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 17 }}>
                    {PATTERNS.map((p, i) => {
                        const opacity = interpolate(frame - i * 5, [0, 8], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        });
                        return (
                            <div
                                key={p.id}
                                style={{
                                    opacity,
                                    transform: `translateX(${(1 - opacity) * 28}px)`,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 17,
                                    padding: "15px 17px",
                                    borderRadius: 18,
                                    border: `1px solid ${p.color}40`,
                                    background: `linear-gradient(90deg, ${p.color}12, rgba(255,255,255,0.018))`,
                                }}
                            >
                                <div
                                    style={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 13,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: `${p.color}22`,
                                        color: p.color,
                                        fontSize: 20,
                                        fontWeight: 900,
                                    }}
                                >
                                    {i + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Txt size={22}>{p.title}</Txt>
                                    <Txt size={15} color={C.muted} weight={500}>{p.subtitle}</Txt>
                                </div>
                                <div style={{ color: p.color, fontSize: 24 }}>✦</div>
                            </div>
                        );
                    })}
                </div>
            </AbsoluteFill>
        </Shell>
    );
};

const Ending: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const scale = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 90 } });
    return (
        <Shell>
            <Glow color={C.cyan} size={700} style={{ top: 240, left: -200 }} />
            <Glow color={C.purple} size={700} style={{ top: 750, right: -250 }} />
            <AbsoluteFill
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 70,
                    boxSizing: "border-box",
                    textAlign: "center",
                }}
            >
                <div style={{ transform: `scale(${0.85 + scale * 0.15})` }}>
                    <div
                        style={{
                            width: 150,
                            height: 150,
                            borderRadius: 42,
                            margin: "0 auto 42px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 70,
                            color: C.cyan,
                            background: "linear-gradient(145deg, rgba(85,229,255,0.2), rgba(84,140,255,0.08))",
                            border: `1px solid ${C.cyan}80`,
                            boxShadow: `0 0 70px ${C.cyan}20`,
                        }}
                    >
                        ✦
                    </div>
                    <Txt size={76} weight={900} tracking={-2}>BUILD FOR</Txt>
                    <Txt size={86} color={C.cyan} weight={900} tracking={-2}>FAILURE.</Txt>
                    <div style={{ height: 28 }} />
                    <Txt size={27} color={C.muted} weight={500}>
                        Reliable systems are designed,
                        {"\n"}not just deployed.
                    </Txt>
                </div>
                <div style={{ height: 75 }} />
                <Reveal delay={15}>
                    <Tag color={C.cyan}>FOLLOW AI HUB INSIDER</Tag>
                </Reveal>
            </AbsoluteFill>
        </Shell>
    );
};

const CTA: React.FC = () => {
    const frame = useCurrentFrame();
    const pulse = 1 + Math.sin(frame / 10) * 0.025;
    return (
        <Shell>
            <Glow color={C.blue} size={650} style={{ top: 250, left: -190 }} />
            <Glow color={C.pink} size={550} style={{ bottom: 160, right: -200 }} />
            <AbsoluteFill
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 65,
                    boxSizing: "border-box",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        transform: `scale(${pulse})`,
                        padding: 44,
                        borderRadius: 36,
                        border: `1px solid ${C.cyan}45`,
                        background: "linear-gradient(145deg, rgba(24,46,86,0.88), rgba(12,20,46,0.82))",
                        boxShadow: `0 0 65px ${C.blue}15`,
                    }}
                >
                    <Txt size={27} color={C.muted} weight={700} tracking={2}>
                        MORE BACKEND ENGINEERING
                    </Txt>
                    <div style={{ height: 23 }} />
                    <Txt size={67} weight={900} tracking={-2}>LEVEL UP</Txt>
                    <Txt size={78} color={C.cyan} weight={900} tracking={-2}>YOUR SYSTEM</Txt>
                    <div style={{ height: 35 }} />
                    <Tag color={C.cyan}>FOLLOW AI HUB INSIDER</Tag>
                </div>
            </AbsoluteFill>
        </Shell>
    );
};

const SectionVisual: React.FC<{ id: string }> = ({ id }) => {
    if (id === "hook" || id === "intro") return <Hook />;

    const pattern = PATTERNS.find((p) => p.id === id);
    if (pattern) return <PatternScene pattern={pattern} />;

    if (id === "recap" || id === "summary") return <Recap />;
    if (id === "ending" || id === "outro") return <Ending />;
    if (id === "cta") return <CTA />;

    return <Hook />;
};

export const MicroservicePatternsScene: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
        {TIMELINE.map((section) => (
            <Sequence
                key={section.id}
                from={section.start}
                durationInFrames={section.duration}
                name={section.id}
            >
                <SectionVisual id={section.id} />
                <Audio src={staticFile(section.audio)} />
            </Sequence>
        ))}
    </AbsoluteFill>
);
