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
import { sagaVs2pc } from "../../content/saga-vs-2pc";
import { createTimeline } from "../timeline";

const C = {
    bg: "#080D20",
    panel: "rgba(16, 27, 55, 0.92)",
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
const { sections: TIMELINE } = createTimeline(sagaVs2pc);

/**
 * Remotion staticFile() paths are relative to public/.
 * Accepts paths such as:
 * "audio/saga-vs-2pc/hook.mp3"
 * "/audio/saga-vs-2pc/hook.mp3"
 * "public/audio/saga-vs-2pc/hook.mp3"
 */
const normalizePublicAssetPath = (path: string): string =>
    path
        .replace(/\\/g, "/")
        .replace(/^\/+/, "")
        .replace(/^public\//i, "");

const panel: React.CSSProperties = {
    background:
        "linear-gradient(145deg, rgba(23,39,76,0.94), rgba(10,18,42,0.96))",
    border: "1px solid rgba(142,174,255,0.22)",
    borderRadius: 26,
    boxShadow: "0 24px 70px rgba(0,0,0,0.25)",
};

const Txt: React.FC<{
    children: React.ReactNode;
    size?: number;
    color?: string;
    weight?: number;
    align?: React.CSSProperties["textAlign"];
    tracking?: number;
    style?: React.CSSProperties;
}> = ({
    children,
    size = 28,
    color = C.white,
    weight = 700,
    align,
    tracking = 0,
    style,
}) => (
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
}> = ({ children, color = C.cyan }) => (
    <div
        style={{
            display: "inline-flex",
            padding: "10px 16px",
            borderRadius: 999,
            border: `1px solid ${color}65`,
            background: `${color}14`,
            color,
            fontFamily: FONT,
            fontSize: 17,
            fontWeight: 900,
            letterSpacing: 1.3,
        }}
    >
        {children}
    </div>
);

const Background: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill
            style={{
                overflow: "hidden",
                backgroundColor: C.bg,
            }}
        >
            <AbsoluteFill
                style={{
                    background: `
                        radial-gradient(
                            ellipse at ${20 + Math.sin(frame / 70) * 8}% 18%,
                            rgba(39,108,255,0.35),
                            transparent 48%
                        ),
                        radial-gradient(
                            ellipse at ${82 + Math.cos(frame / 65) * 7}% 45%,
                            rgba(137,74,255,0.24),
                            transparent 50%
                        ),
                        radial-gradient(
                            ellipse at 45% 100%,
                            rgba(0,204,225,0.15),
                            transparent 45%
                        ),
                        linear-gradient(
                            155deg,
                            #101B3B,
                            #090F25 48%,
                            #11102C
                        )
                    `,
                }}
            />

            <svg
                width="100%"
                height="100%"
                viewBox="0 0 1080 1920"
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.2,
                }}
            >
                <defs>
                    <pattern
                        id="sagaGrid"
                        width="70"
                        height="70"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 70 0 L 0 0 0 70"
                            fill="none"
                            stroke="#91B8FF"
                            strokeWidth="1"
                        />
                    </pattern>

                    <linearGradient
                        id="sagaGridFade"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor="white"
                            stopOpacity="0"
                        />
                        <stop
                            offset="35%"
                            stopColor="white"
                            stopOpacity="1"
                        />
                        <stop
                            offset="75%"
                            stopColor="white"
                            stopOpacity=".6"
                        />
                        <stop
                            offset="100%"
                            stopColor="white"
                            stopOpacity="0"
                        />
                    </linearGradient>

                    <mask id="sagaMask">
                        <rect
                            width="1080"
                            height="1920"
                            fill="url(#sagaGridFade)"
                        />
                    </mask>
                </defs>

                <g mask="url(#sagaMask)">
                    <rect
                        width="1080"
                        height="1920"
                        fill="url(#sagaGrid)"
                    />
                </g>
            </svg>

            {Array.from({ length: 36 }, (_, i) => {
                const x = (i * 173 + 40) % 1080;
                const y =
                    (i * 241 +
                        frame * (0.6 + (i % 3) * 0.25)) %
                    1920;
                const size = 2 + (i % 3);
                const color = i % 2 ? C.cyan : C.purple;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x,
                            top: y,
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            background: color,
                            opacity: 0.25 + (i % 4) * 0.12,
                            boxShadow: `0 0 12px ${color}`,
                        }}
                    />
                );
            })}

            <AbsoluteFill
                style={{
                    background:
                        "linear-gradient(180deg, rgba(4,8,20,.05), transparent 20%, transparent 80%, rgba(4,8,20,.4))",
                }}
            />
        </AbsoluteFill>
    );
};

const Shell: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <AbsoluteFill
        style={{
            overflow: "hidden",
            color: C.white,
            fontFamily: FONT,
        }}
    >
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
        config: {
            damping: 18,
            stiffness: 100,
        },
    });

    const opacity = interpolate(
        frame - delay,
        [0, 8],
        [0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        },
    );

    return (
        <div
            style={{
                opacity,
                transform: `translateY(${(1 - progress) * 28}px)`,
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
}> = ({ color = C.cyan, size = 360, style }) => {
    const frame = useCurrentFrame();

    return (
        <div
            style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color}28, ${color}09 40%, transparent 72%)`,
                filter: "blur(14px)",
                transform: `scale(${0.9 + Math.sin(frame / 18) * 0.08})`,
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
    x: number;
    y: number;
    width?: number;
    active?: boolean;
}> = ({
    title,
    subtitle,
    color = C.cyan,
    x,
    y,
    width = 230,
    active = true,
}) => {
        const frame = useCurrentFrame();

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width,
                    minHeight: 112,
                    boxSizing: "border-box",
                    padding: "16px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 9,
                    borderRadius: 20,
                    border: `1.5px solid ${color}${active ? "C0" : "45"}`,
                    background: `linear-gradient(145deg, ${color}22, rgba(13,22,48,.97) 75%)`,
                    boxShadow: active ? `0 0 28px ${color}20` : "none",
                    transform: `scale(${active ? 1 + Math.sin(frame / 12) * 0.012 : 1})`,
                    textAlign: "center",
                    zIndex: 2,
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

                <Txt size={20} weight={900} align="center">
                    {title}
                </Txt>

                {subtitle && (
                    <Txt size={15} color={C.muted} weight={500} align="center">
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
}> = ({
    x1,
    y1,
    x2,
    y2,
    color = C.cyan,
    active = true,
    delay = 0,
}) => {
        const frame = useCurrentFrame();
        const progress = ((frame * 2.5 + delay * 9) % 100) / 100;
        const x = x1 + (x2 - x1) * progress;
        const y = y1 + (y2 - y1) * progress;

        return (
            <g>
                <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={color}
                    strokeWidth={3}
                    strokeOpacity={active ? 0.48 : 0.13}
                    strokeLinecap="round"
                />
                {active && (
                    <>
                        <circle cx={x} cy={y} r={6} fill={color} />
                        <circle
                            cx={x}
                            cy={y}
                            r={15}
                            fill={color}
                            opacity={0.14}
                        />
                    </>
                )}
            </g>
        );
    };

const DiagramCanvas: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 900 650"
        preserveAspectRatio="xMidYMid meet"
        style={{
            position: "absolute",
            inset: 0,
            overflow: "visible",
        }}
    >
        {children}
    </svg>
);

// ============================================================
// HOOK: ONE E-COMMERCE CHECKOUT, TWO DIFFERENT STRATEGIES
// ============================================================

const Hook: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame: frame - 4,
        fps,
        config: {
            damping: 14,
            stiffness: 95,
        },
    });

    return (
        <Shell>
            <Glow
                color={C.blue}
                size={650}
                style={{ top: 80, left: -230 }}
            />
            <Glow
                color={C.purple}
                size={620}
                style={{ top: 850, right: -270 }}
            />

            <AbsoluteFill
                style={{
                    padding: "105px 55px 80px",
                    boxSizing: "border-box",
                }}
            >
                <Reveal>
                    <Tag>SYSTEM DESIGN / DISTRIBUTED TRANSACTIONS</Tag>
                </Reveal>

                <div style={{ height: 45 }} />

                <div style={{ transform: `scale(${0.92 + scale * 0.08})` }}>
                    <Txt
                        size={72}
                        weight={900}
                        tracking={-2}
                        style={{ lineHeight: 1.04 }}
                    >
                        ONE CHECKOUT.
                    </Txt>
                    <Txt
                        size={83}
                        color={C.cyan}
                        weight={900}
                        tracking={-3}
                        style={{ lineHeight: 1.1 }}
                    >
                        3 SERVICES.
                    </Txt>
                </div>

                <div style={{ height: 25 }} />

                <Reveal delay={9}>
                    <Txt size={28} color={C.muted} weight={500}>
                        How do you keep a distributed transaction consistent?
                    </Txt>
                </Reveal>

                <div style={{ height: 48 }} />

                <Reveal delay={15}>
                    <div style={{ ...panel, padding: 24 }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 18,
                            }}
                        >
                            {[
                                {
                                    title: "ORDER SERVICE",
                                    sub: "Create order",
                                    color: C.cyan,
                                },
                                {
                                    title: "PAYMENT SERVICE",
                                    sub: "Charge customer",
                                    color: C.green,
                                },
                                {
                                    title: "INVENTORY SERVICE",
                                    sub: "Reserve stock",
                                    color: C.orange,
                                },
                            ].map((item, i) => (
                                <div
                                    key={item.title}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 18,
                                        padding: 20,
                                        borderRadius: 19,
                                        border: `1px solid ${item.color}65`,
                                        background: `linear-gradient(100deg, ${item.color}18, rgba(255,255,255,.02))`,
                                        transform: `translateX(${Math.sin(frame / 13 + i) * 4}px)`,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 55,
                                            height: 55,
                                            borderRadius: 16,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: `${item.color}20`,
                                            color: item.color,
                                            fontSize: 24,
                                            fontWeight: 900,
                                        }}
                                    >
                                        0{i + 1}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <Txt size={23}>{item.title}</Txt>
                                        <Txt
                                            size={18}
                                            color={C.muted}
                                            weight={500}
                                        >
                                            {item.sub}
                                        </Txt>
                                    </div>

                                    <Txt size={28} color={item.color}>
                                        ↗
                                    </Txt>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                <div style={{ height: 36 }} />

                <Reveal delay={24}>
                    <div
                        style={{
                            display: "flex",
                            gap: 14,
                            alignItems: "center",
                        }}
                    >
                        <Tag color={C.red}>2PC</Tag>
                        <Txt size={21} color={C.muted}>
                            Coordinate one decision
                        </Txt>
                    </div>

                    <div style={{ height: 14 }} />

                    <div
                        style={{
                            display: "flex",
                            gap: 14,
                            alignItems: "center",
                        }}
                    >
                        <Tag color={C.green}>SAGA</Tag>
                        <Txt size={21} color={C.muted}>
                            Coordinate local steps
                        </Txt>
                    </div>
                </Reveal>

                <div style={{ flex: 1 }} />

                <Txt size={19} color={C.muted} weight={800} tracking={2}>
                    AI HUB INSIDER
                </Txt>
            </AbsoluteFill>
        </Shell>
    );
};

// ============================================================
// TWO-PHASE COMMIT: PREPARE -> VOTE -> COMMIT / ABORT
// ============================================================

const TwoPhaseCommitDiagram: React.FC = () => {
    const frame = useCurrentFrame();
    const phase = Math.floor(frame / 42) % 4;

    const phases = [
        {
            title: "1. PREPARE",
            note: "Coordinator asks every participant",
            color: C.blue,
        },
        {
            title: "2. VOTE YES",
            note: "Participants prepare and wait",
            color: C.orange,
        },
        {
            title: "3. COMMIT",
            note: "Coordinator broadcasts the decision",
            color: C.green,
        },
        {
            title: "IF A PARTICIPANT FAILS",
            note: "Waiting can delay progress",
            color: C.red,
        },
    ];

    const current = phases[phase];

    return (
        <div style={{ position: "relative", height: 650 }}>
            <DiagramCanvas>
                <FlowLine
                    x1={450}
                    y1={150}
                    x2={450}
                    y2={245}
                    color={current.color}
                />
                <FlowLine
                    x1={450}
                    y1={355}
                    x2={170}
                    y2={440}
                    color={phase === 3 ? C.red : current.color}
                    delay={4}
                />
                <FlowLine
                    x1={450}
                    y1={355}
                    x2={450}
                    y2={440}
                    color={phase === 3 ? C.red : current.color}
                    delay={12}
                />
                <FlowLine
                    x1={450}
                    y1={355}
                    x2={730}
                    y2={440}
                    color={phase === 3 ? C.red : current.color}
                    delay={20}
                />
            </DiagramCanvas>

            <Node
                x={330}
                y={35}
                width={240}
                title="APPLICATION"
                subtitle="Checkout request"
                color={C.cyan}
            />

            <Node
                x={320}
                y={240}
                width={260}
                title="2PC COORDINATOR"
                subtitle={
                    phase === 0
                        ? "Send PREPARE"
                        : phase === 2
                            ? "Send COMMIT"
                            : "Wait for votes"
                }
                color={current.color}
            />

            {[0, 1, 2].map((i) => {
                const x = [50, 330, 610][i];
                const names = ["ORDER DB", "PAYMENT DB", "STOCK DB"];
                const waiting = phase === 1 || phase === 3;
                const committed = phase === 2;

                return (
                    <React.Fragment key={names[i]}>
                        <Node
                            x={x}
                            y={440}
                            width={240}
                            title={names[i]}
                            subtitle={
                                committed
                                    ? "COMMITTED"
                                    : waiting
                                        ? "PREPARED · WAITING"
                                        : "PARTICIPANT"
                            }
                            color={
                                committed
                                    ? C.green
                                    : waiting
                                        ? C.orange
                                        : C.blue
                            }
                            active
                        />
                    </React.Fragment>
                );
            })}

            <div
                style={{
                    position: "absolute",
                    top: 580,
                    left: 25,
                    right: 25,
                    padding: "16px 20px",
                    borderRadius: 18,
                    border: `1px solid ${current.color}70`,
                    background: `${current.color}12`,
                    textAlign: "center",
                }}
            >
                <Txt size={23} color={current.color} weight={900}>
                    {current.title}
                </Txt>
                <Txt size={17} color={C.muted} weight={500}>
                    {current.note}
                </Txt>
            </div>
        </div>
    );
};

const TwoPhaseCommitScene: React.FC = () => {
    return (
        <Shell>
            <Glow
                color={C.red}
                size={550}
                style={{ top: 300, left: -240 }}
            />
            <Glow
                color={C.blue}
                size={450}
                style={{ bottom: 200, right: -220 }}
            />

            <AbsoluteFill
                style={{
                    padding: "80px 42px 65px",
                    boxSizing: "border-box",
                }}
            >
                <Reveal>
                    <Tag color={C.red}>STRATEGY 01</Tag>
                </Reveal>

                <div style={{ height: 22 }} />

                <Reveal delay={3}>
                    <Txt size={59} weight={900} tracking={-1.8}>
                        TWO-PHASE
                    </Txt>
                    <Txt
                        size={66}
                        color={C.red}
                        weight={900}
                        tracking={-2}
                    >
                        COMMIT (2PC)
                    </Txt>
                    <div style={{ height: 14 }} />
                    <Txt size={23} color={C.muted}>
                        One coordinator. One distributed decision.
                    </Txt>
                </Reveal>

                <div style={{ height: 25 }} />

                <div
                    style={{
                        ...panel,
                        padding: "12px 8px",
                        flex: 1,
                        minHeight: 0,
                    }}
                >
                    <TwoPhaseCommitDiagram />
                </div>

                <div style={{ height: 20 }} />

                <Reveal delay={12}>
                    <div
                        style={{
                            padding: 22,
                            borderRadius: 22,
                            border: `1px solid ${C.red}60`,
                            background:
                                "linear-gradient(100deg, rgba(255,99,127,.13), rgba(16,27,55,.8))",
                        }}
                    >
                        <Txt
                            size={17}
                            color={C.red}
                            weight={900}
                            tracking={1.5}
                        >
                            THE TRADE-OFF
                        </Txt>
                        <div style={{ height: 8 }} />
                        <Txt size={24} weight={900}>
                            Participants may block while awaiting a decision.
                        </Txt>
                        <div style={{ height: 8 }} />
                        <Txt size={17} color={C.muted}>
                            A slow coordinator or network failure can delay
                            progress.
                        </Txt>
                    </div>
                </Reveal>
            </AbsoluteFill>
        </Shell>
    );
};

// ============================================================
// SAGA: LOCAL TRANSACTIONS + COMPENSATION
// ============================================================

const SagaDiagram: React.FC = () => {
    const frame = useCurrentFrame();
    const phase = Math.floor(frame / 38) % 5;

    const steps = [
        {
            title: "CREATE ORDER",
            sub: "Order created",
            color: C.cyan,
        },
        {
            title: "CHARGE PAYMENT",
            sub: "Payment captured",
            color: C.green,
        },
        {
            title: "RESERVE STOCK",
            sub: "Reservation fails",
            color: C.orange,
        },
    ];

    const compensating = phase === 3 || phase === 4;
    const done = phase === 4;

    return (
        <div style={{ position: "relative", height: 650 }}>
            <DiagramCanvas>
                <FlowLine
                    x1={280}
                    y1={230}
                    x2={325}
                    y2={230}
                    color={compensating ? C.red : C.cyan}
                    active={!compensating}
                />
                <FlowLine
                    x1={575}
                    y1={230}
                    x2={620}
                    y2={230}
                    color={phase === 2 ? C.red : C.orange}
                    active={!compensating}
                />
            </DiagramCanvas>

            <div
                style={{
                    display: "flex",
                    gap: 12,
                    paddingTop: 135,
                }}
            >
                {steps.map((item, i) => {
                    const isFailed = phase === 2 && i === 2;
                    const isComplete = phase > i && !isFailed;
                    const active = phase === i;

                    const color = isFailed
                        ? C.red
                        : isComplete
                            ? C.green
                            : item.color;

                    return (
                        <div
                            key={item.title}
                            style={{
                                flex: 1,
                                minWidth: 0,
                                minHeight: 195,
                                boxSizing: "border-box",
                                padding: "18px 9px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 13,
                                textAlign: "center",
                                borderRadius: 20,
                                border: `1.5px solid ${color}${active || isFailed ? "D0" : "65"}`,
                                background: `linear-gradient(145deg, ${color}20, rgba(13,22,48,.96))`,
                                boxShadow:
                                    active || isFailed
                                        ? `0 0 30px ${color}20`
                                        : "none",
                                transform: active
                                    ? "translateY(-9px)"
                                    : "none",
                            }}
                        >
                            <Txt size={35} color={color} weight={900}>
                                {isFailed
                                    ? "×"
                                    : isComplete
                                        ? "✓"
                                        : `0${i + 1}`}
                            </Txt>

                            <Txt size={17} weight={900} align="center">
                                {item.title}
                            </Txt>

                            <Txt
                                size={14}
                                color={color}
                                weight={800}
                                align="center"
                            >
                                {isFailed
                                    ? "FAILED"
                                    : isComplete
                                        ? "COMMITTED"
                                        : active
                                            ? "PROCESSING"
                                            : "PENDING"}
                            </Txt>
                        </div>
                    );
                })}
            </div>

            <div
                style={{
                    marginTop: 28,
                    padding: 22,
                    borderRadius: 22,
                    border: `1px solid ${compensating ? C.red : C.green}65`,
                    background: compensating
                        ? "rgba(255,99,127,.1)"
                        : "rgba(56,240,176,.07)",
                }}
            >
                <Txt
                    size={20}
                    color={compensating ? C.red : C.green}
                    weight={900}
                    align="center"
                >
                    {compensating
                        ? "COMPENSATE PREVIOUS STEPS"
                        : done
                            ? "WORKFLOW COMPENSATED"
                            : "EACH STEP COMMITS LOCALLY"}
                </Txt>

                <div style={{ height: 12 }} />

                {compensating ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 8,
                            }}
                        >
                            <Txt size={16} color={C.red}>
                                Refund payment
                            </Txt>
                            <Txt size={16} color={C.red}>
                                {done ? "✓ DONE" : "RUNNING"}
                            </Txt>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 8,
                            }}
                        >
                            <Txt size={16} color={C.red}>
                                Cancel order
                            </Txt>
                            <Txt size={16} color={C.red}>
                                {done ? "✓ DONE" : "NEXT"}
                            </Txt>
                        </div>
                    </div>
                ) : (
                    <Txt size={17} color={C.muted} align="center">
                        A failure triggers explicit recovery actions.
                    </Txt>
                )}
            </div>

            <div style={{ marginTop: 19, textAlign: "center" }}>
                <Tag color={compensating ? C.red : C.cyan}>
                    {compensating
                        ? "FORWARD FAILURE → COMPENSATION"
                        : "EVENTS / COMMANDS → NEXT STEP"}
                </Tag>
            </div>
        </div>
    );
};

const SagaScene: React.FC = () => (
    <Shell>
        <Glow
            color={C.green}
            size={560}
            style={{ top: 260, left: -230 }}
        />
        <Glow
            color={C.orange}
            size={500}
            style={{ bottom: 160, right: -220 }}
        />

        <AbsoluteFill
            style={{
                padding: "80px 42px 65px",
                boxSizing: "border-box",
            }}
        >
            <Reveal>
                <Tag color={C.green}>STRATEGY 02</Tag>
            </Reveal>

            <div style={{ height: 22 }} />

            <Reveal delay={3}>
                <Txt
                    size={64}
                    color={C.green}
                    weight={900}
                    tracking={-2}
                >
                    SAGA PATTERN
                </Txt>
                <div style={{ height: 14 }} />
                <Txt size={23} color={C.muted}>
                    Local transactions. Event-driven coordination.
                </Txt>
            </Reveal>

            <div style={{ height: 25 }} />

            <div
                style={{
                    ...panel,
                    padding: "12px 8px",
                    flex: 1,
                    minHeight: 0,
                }}
            >
                <SagaDiagram />
            </div>

            <div style={{ height: 20 }} />

            <Reveal delay={12}>
                <div
                    style={{
                        padding: 22,
                        borderRadius: 22,
                        border: `1px solid ${C.green}60`,
                        background:
                            "linear-gradient(100deg, rgba(56,240,176,.12), rgba(16,27,55,.8))",
                    }}
                >
                    <Txt
                        size={17}
                        color={C.green}
                        weight={900}
                        tracking={1.5}
                    >
                        THE TRADE-OFF
                    </Txt>
                    <div style={{ height: 8 }} />
                    <Txt size={24} weight={900}>
                        More availability, but eventual consistency.
                    </Txt>
                    <div style={{ height: 8 }} />
                    <Txt size={17} color={C.muted}>
                        Compensation is a new business action, not a literal
                        database rollback.
                    </Txt>
                </div>
            </Reveal>
        </AbsoluteFill>
    </Shell>
);


// ============================================================
// COMPARISON: CHOOSE BASED ON YOUR REQUIREMENTS
// ============================================================

const ComparisonScene: React.FC = () => {
    const frame = useCurrentFrame();

    const rows = [
        {
            label: "COORDINATION",
            left: "Coordinator decides",
            right: "Local steps coordinate",
        },
        {
            label: "FAILURE RECOVERY",
            left: "Abort / commit decision",
            right: "Compensating actions",
        },
        {
            label: "CONSISTENCY",
            left: "Atomic outcome",
            right: "Often eventual",
        },
        {
            label: "BEST FIT",
            left: "Supported atomic transactions",
            right: "Long-running workflows",
        },
    ];

    return (
        <Shell>
            <Glow
                color={C.red}
                size={500}
                style={{ top: 260, left: -250 }}
            />
            <Glow
                color={C.green}
                size={500}
                style={{ bottom: 220, right: -250 }}
            />

            <AbsoluteFill
                style={{
                    padding: "100px 42px 75px",
                    boxSizing: "border-box",
                }}
            >
                <Reveal>
                    <Tag>THE COMPARISON</Tag>
                </Reveal>

                <div style={{ height: 26 }} />

                <Reveal delay={3}>
                    <Txt size={65} weight={900} tracking={-2}>
                        WHICH ONE
                    </Txt>
                    <Txt
                        size={73}
                        color={C.cyan}
                        weight={900}
                        tracking={-2}
                    >
                        SHOULD YOU USE?
                    </Txt>
                </Reveal>

                <div style={{ height: 38 }} />

                <div style={{ display: "flex", gap: 14 }}>
                    <div
                        style={{
                            flex: 1,
                            padding: 17,
                            borderRadius: 20,
                            border: `1px solid ${C.red}70`,
                            background: `${C.red}12`,
                        }}
                    >
                        <Txt
                            size={25}
                            color={C.red}
                            weight={900}
                            align="center"
                        >
                            2PC
                        </Txt>
                        <div style={{ height: 8 }} />
                        <Txt size={16} color={C.muted} align="center">
                            Atomic coordination
                        </Txt>
                    </div>

                    <div
                        style={{
                            flex: 1,
                            padding: 17,
                            borderRadius: 20,
                            border: `1px solid ${C.green}70`,
                            background: `${C.green}12`,
                        }}
                    >
                        <Txt
                            size={25}
                            color={C.green}
                            weight={900}
                            align="center"
                        >
                            SAGA
                        </Txt>
                        <div style={{ height: 8 }} />
                        <Txt size={16} color={C.muted} align="center">
                            Workflow recovery
                        </Txt>
                    </div>
                </div>

                <div style={{ height: 25 }} />

                <div style={{ ...panel, padding: 17, flex: 1 }}>
                    {rows.map((row, i) => {
                        const opacity = interpolate(
                            frame - i * 7,
                            [0, 8],
                            [0, 1],
                            {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                            },
                        );

                        return (
                            <div
                                key={row.label}
                                style={{
                                    opacity,
                                    padding: "22px 8px",
                                    borderBottom:
                                        i === rows.length - 1
                                            ? "none"
                                            : `1px solid ${C.white}12`,
                                }}
                            >
                                <Txt
                                    size={15}
                                    color={C.cyan}
                                    weight={900}
                                    tracking={1.3}
                                >
                                    {row.label}
                                </Txt>

                                <div style={{ height: 13 }} />

                                <div style={{ display: "flex", gap: 12 }}>
                                    <div style={{ flex: 1 }}>
                                        <Txt
                                            size={18}
                                            color={C.white}
                                            weight={700}
                                        >
                                            {row.left}
                                        </Txt>
                                    </div>

                                    <div
                                        style={{
                                            width: 1,
                                            background: C.white + "20",
                                        }}
                                    />

                                    <div style={{ flex: 1 }}>
                                        <Txt
                                            size={18}
                                            color={C.white}
                                            weight={700}
                                        >
                                            {row.right}
                                        </Txt>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ height: 24 }} />

                <Reveal delay={24}>
                    <Txt size={21} color={C.muted} align="center">
                        Choose based on consistency, infrastructure, and
                        failure requirements.
                    </Txt>
                </Reveal>
            </AbsoluteFill>
        </Shell>
    );
};

// ============================================================
// TAKEAWAY
// ============================================================

const EndingScene: React.FC = () => {
    const { fps } = useVideoConfig();

    const scale = spring({
        frame: useCurrentFrame() - 5,
        fps,
        config: {
            damping: 14,
            stiffness: 90,
        },
    });

    return (
        <Shell>
            <Glow
                color={C.cyan}
                size={650}
                style={{ top: 250, left: -220 }}
            />
            <Glow
                color={C.purple}
                size={550}
                style={{ bottom: 200, right: -230 }}
            />

            <AbsoluteFill
                style={{
                    padding: 60,
                    boxSizing: "border-box",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <div style={{ transform: `scale(${0.9 + scale * 0.1})` }}>
                    <Tag>REMEMBER THIS</Tag>

                    <div style={{ height: 42 }} />

                    <Txt size={67} weight={900} tracking={-2}>
                        2PC
                    </Txt>
                    <Txt size={29} color={C.red} weight={900}>
                        COORDINATE ONE DECISION
                    </Txt>

                    <div style={{ height: 35 }} />

                    <Txt
                        size={67}
                        color={C.green}
                        weight={900}
                        tracking={-2}
                    >
                        SAGA
                    </Txt>
                    <Txt size={27} color={C.green} weight={900}>
                        COMPENSATE FAILED WORKFLOWS
                    </Txt>

                    <div style={{ height: 45 }} />

                    <div
                        style={{
                            ...panel,
                            padding: 28,
                            borderColor: `${C.cyan}65`,
                        }}
                    >
                        <Txt size={25} weight={900}>
                            Distributed transactions need a failure strategy.
                        </Txt>
                    </div>
                </div>
            </AbsoluteFill>
        </Shell>
    );
};

// ============================================================
// CTA
// ============================================================

const CTA: React.FC = () => {
    const frame = useCurrentFrame();
    const pulse = 1 + Math.sin(frame / 10) * 0.02;

    return (
        <Shell>
            <Glow
                color={C.blue}
                size={650}
                style={{ top: 300, left: -220 }}
            />
            <Glow
                color={C.pink}
                size={500}
                style={{ bottom: 200, right: -200 }}
            />

            <AbsoluteFill
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 55,
                    boxSizing: "border-box",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        transform: `scale(${pulse})`,
                        padding: 35,
                        borderRadius: 32,
                        border: `1px solid ${C.cyan}55`,
                        background:
                            "linear-gradient(145deg, rgba(24,46,86,.94), rgba(12,20,46,.9))",
                        boxShadow: `0 0 65px ${C.blue}18`,
                    }}
                >
                    <Txt
                        size={23}
                        color={C.muted}
                        weight={800}
                        tracking={2}
                    >
                        YOUR TURN
                    </Txt>

                    <div style={{ height: 24 }} />

                    <Txt size={44} weight={900}>
                        E-COMMERCE
                    </Txt>
                    <Txt size={58} color={C.cyan} weight={900}>
                        CHECKOUT
                    </Txt>

                    <div style={{ height: 22 }} />

                    <Txt size={23} color={C.muted} weight={500}>
                        Would you choose 2PC or Saga?
                    </Txt>

                    <div style={{ height: 32 }} />

                    <Tag>COMMENT BELOW</Tag>

                    <div style={{ height: 30 }} />

                    <Txt size={25} weight={900}>
                        FOLLOW
                    </Txt>
                    <Txt size={34} color={C.cyan} weight={900}>
                        AI HUB INSIDER
                    </Txt>

                    <div style={{ height: 12 }} />

                    <Txt size={17} color={C.muted}>
                        Daily backend & system design tips
                    </Txt>
                </div>
            </AbsoluteFill>
        </Shell>
    );
};

// ============================================================
// SECTION ROUTER
// ============================================================

const SectionVisual: React.FC<{ id: string }> = ({ id }) => {
    switch (id) {
        case "hook":
        case "intro":
            return <Hook />;

        case "two-phase-commit":
            return <TwoPhaseCommitScene />;

        case "saga-pattern":
            return <SagaScene />;

        case "comparison":
            return <ComparisonScene />;

        case "ending":
        case "outro":
            return <EndingScene />;

        case "cta":
            return <CTA />;

        default:
            return <Hook />;
    }
};

// ============================================================
// MAIN COMPOSITION
// ============================================================

export const SagaVs2PCScene: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
        {TIMELINE.map((section) => (
            <Sequence
                key={section.id}
                from={section.start}
                durationInFrames={section.duration}
                name={section.id}
            >
                <SectionVisual id={section.id} />

                {typeof section.audio === "string" &&
                    section.audio.trim() !== "" ? (
                    <Audio
                        src={staticFile(
                            normalizePublicAssetPath(section.audio),
                        )}
                        volume={1}
                    />
                ) : null}
            </Sequence>
        ))}
    </AbsoluteFill>
);