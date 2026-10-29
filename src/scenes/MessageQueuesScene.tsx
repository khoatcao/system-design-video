import React from "react";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    interpolate,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";

import { messageQueuesContent } from "../../content/message-queues";
import { createTimeline } from "../timeline";

const { sections: TIMELINE } = createTimeline(messageQueuesContent);

const C = {
    bg: "#0B1025",
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
const W = 1080;
const H = 1920;

const clamp = (n: number, min = 0, max = 1) =>
    Math.max(min, Math.min(max, n));

const lerp = (
    f: number,
    a: number,
    b: number,
    start: number,
    end: number,
) =>
    interpolate(f, [start, end], [a, b], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

const pulse = (f: number, speed = 1) =>
    0.5 + 0.5 * Math.sin((f * speed) / 8);

const Text: React.FC<{
    x: number;
    y: number;
    children: React.ReactNode;
    size?: number;
    color?: string;
    weight?: number;
    anchor?: "start" | "middle" | "end";
    opacity?: number;
    spacing?: number;
}> = ({
    x,
    y,
    children,
    size = 30,
    color = C.white,
    weight = 800,
    anchor = "start",
    opacity = 1,
    spacing = 0,
}) => (
        <text
            x={x}
            y={y}
            fill={color}
            fontFamily={FONT}
            fontSize={size}
            fontWeight={weight}
            textAnchor={anchor}
            opacity={opacity}
            letterSpacing={spacing}
        >
            {children}
        </text>
    );

const Line: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    opacity?: number;
    width?: number;
    dash?: string;
}> = ({
    x1,
    y1,
    x2,
    y2,
    color = C.cyan,
    opacity = 0.5,
    width = 3,
    dash,
}) => (
        <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={width}
            strokeOpacity={opacity}
            strokeDasharray={dash}
            strokeLinecap="round"
        />
    );

const Node: React.FC<{
    x: number;
    y: number;
    w?: number;
    h?: number;
    label: string;
    sub?: string;
    color?: string;
    status?: string;
    failed?: boolean;
    scale?: number;
}> = ({
    x,
    y,
    w = 220,
    h = 145,
    label,
    sub,
    color = C.cyan,
    status,
    failed = false,
    scale = 1,
}) => {
        const f = useCurrentFrame();
        const accent = failed ? C.red : color;
        const glow = 0.12 + pulse(f, 1.1) * 0.16;

        return (
            <g transform={`translate(${x} ${y}) scale(${scale})`}>
                <rect
                    x={-w / 2}
                    y={-h / 2}
                    width={w}
                    height={h}
                    rx={24}
                    fill="#111C3B"
                    fillOpacity={0.96}
                    stroke={accent}
                    strokeWidth={2}
                    strokeOpacity={0.8}
                />
                <rect
                    x={-w / 2 + 2}
                    y={-h / 2 + 2}
                    width={w - 4}
                    height={7}
                    rx={4}
                    fill={accent}
                    opacity={0.9}
                />
                <circle
                    cx={-w / 2 + 23}
                    cy={-h / 2 + 29}
                    r={6}
                    fill={accent}
                />
                <circle
                    cx={-w / 2 + 23}
                    cy={-h / 2 + 29}
                    r={17}
                    fill={accent}
                    opacity={glow}
                />
                <Text
                    x={0}
                    y={-7}
                    size={25}
                    anchor="middle"
                    weight={900}
                >
                    {label}
                </Text>
                {sub && (
                    <Text
                        x={0}
                        y={25}
                        size={17}
                        color={failed ? C.red : C.muted}
                        anchor="middle"
                        weight={600}
                    >
                        {sub}
                    </Text>
                )}
                {status && (
                    <Text
                        x={0}
                        y={h / 2 - 18}
                        size={14}
                        color={accent}
                        anchor="middle"
                        weight={900}
                        spacing={1.5}
                    >
                        {status}
                    </Text>
                )}
            </g>
        );
    };

const Packet: React.FC<{
    x: number;
    y: number;
    color?: string;
    size?: number;
    rotation?: number;
}> = ({ x, y, color = C.cyan, size = 12, rotation = 0 }) => (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
        <rect
            x={-size}
            y={-size}
            width={size * 2}
            height={size * 2}
            rx={4}
            fill={color}
        />
        <rect
            x={-size}
            y={-size}
            width={size * 2}
            height={size * 2}
            rx={4}
            fill="none"
            stroke={C.white}
            strokeOpacity={0.6}
            strokeWidth={1}
        />
    </g>
);

const MovingPackets: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    count?: number;
    color?: string;
    speed?: number;
    delay?: number;
    stalled?: boolean;
}> = ({
    x1,
    y1,
    x2,
    y2,
    count = 5,
    color = C.cyan,
    speed = 2,
    delay = 0,
    stalled = false,
}) => {
        const f = useCurrentFrame();

        return (
            <g>
                <Line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    color={color}
                    opacity={0.42}
                    width={4}
                />
                {Array.from({ length: count }, (_, i) => {
                    const t = stalled
                        ? clamp((i * 0.09 + f * 0.002) % 0.8)
                        : ((f * speed + i * (100 / count) + delay) % 100) / 100;

                    return (
                        <Packet
                            key={i}
                            x={x1 + (x2 - x1) * t}
                            y={y1 + (y2 - y1) * t}
                            color={color}
                            size={8 + (i % 2) * 3}
                        />
                    );
                })}
            </g>
        );
    };

const Burst: React.FC<{
    x: number;
    y: number;
    color?: string;
    start?: number;
}> = ({ x, y, color = C.red, start = 0 }) => {
    const f = useCurrentFrame();
    const p = clamp((f - start) / 30);

    return (
        <g transform={`translate(${x} ${y})`}>
            {Array.from({ length: 8 }, (_, i) => {
                const a = (i / 8) * Math.PI * 2;
                const r = 10 + p * 100;

                return (
                    <circle
                        key={i}
                        cx={Math.cos(a) * r}
                        cy={Math.sin(a) * r}
                        r={4 - p * 1.5}
                        fill={color}
                        opacity={1 - p}
                    />
                );
            })}
            <circle
                r={14 + p * 80}
                fill="none"
                stroke={color}
                strokeWidth={3}
                opacity={(1 - p) * 0.8}
            />
        </g>
    );
};

const Backdrop: React.FC<{ color?: string }> = ({ color = C.blue }) => {
    const f = useCurrentFrame();
    const { width, height } = useVideoConfig();

    return (
        <AbsoluteFill
            style={{
                overflow: "hidden",
                background: `
                    radial-gradient(ellipse at ${20 + Math.sin(f / 70) * 10}% 25%,
                        ${color}25, transparent 45%),
                    radial-gradient(ellipse at ${80 - Math.cos(f / 90) * 8}% 65%,
                        ${C.purple}18, transparent 44%),
                    linear-gradient(155deg, #111B3B, ${C.bg} 55%, #11102B)
                `,
            }}
        >
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                style={{ position: "absolute", inset: 0 }}
            >
                {Array.from({ length: 18 }, (_, i) => {
                    const y = i * 120 + ((f * (0.2 + i % 3 * 0.05)) % 120);

                    return (
                        <Line
                            key={i}
                            x1={0}
                            y1={y}
                            x2={width}
                            y2={y}
                            color={color}
                            opacity={0.045}
                            width={1}
                        />
                    );
                })}
                {Array.from({ length: 10 }, (_, i) => {
                    const x = i * 120 + 25;

                    return (
                        <Line
                            key={i}
                            x1={x}
                            y1={0}
                            x2={x}
                            y2={height}
                            color={C.cyan}
                            opacity={0.035}
                            width={1}
                        />
                    );
                })}
                {Array.from({ length: 42 }, (_, i) => {
                    const x = (i * 137.5 + 23) % width;
                    const y = (i * 91.3 + f * (0.35 + (i % 4) * 0.1)) % height;
                    const c = i % 3 === 0 ? C.purple : i % 3 === 1 ? C.cyan : C.blue;

                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r={2 + i % 3}
                            fill={c}
                            opacity={0.2 + pulse(f + i * 4) * 0.4}
                        />
                    );
                })}
            </svg>
        </AbsoluteFill>
    );
};

const Headline: React.FC<{
    eyebrow: string;
    lines: string[];
    color?: string;
    top?: number;
    size?: number;
}> = ({ eyebrow, lines, color = C.cyan, top = 130, size = 62 }) => {
    const f = useCurrentFrame();
    const enter = lerp(f, 50, 0, 0, 10);

    return (
        <g transform={`translate(0 ${enter})`}>
            <Text
                x={64}
                y={top}
                size={19}
                color={color}
                weight={900}
                spacing={4}
            >
                {eyebrow.toUpperCase()}
            </Text>
            {lines.map((line, i) => (
                <Text
                    key={line}
                    x={60}
                    y={top + 86 + i * (size * 1.08)}
                    size={size}
                    color={i === lines.length - 1 ? color : C.white}
                    weight={900}
                    spacing={-1.5}
                >
                    {line}
                </Text>
            ))}
            <Line
                x1={64}
                y1={top + 105 + lines.length * (size * 1.08)}
                x2={64 + 125 + pulse(f) * 35}
                y2={top + 105 + lines.length * (size * 1.08)}
                color={color}
                width={5}
                opacity={0.9}
            />
        </g>
    );
};

const Brand: React.FC = () => (
    <div
        style={{
            position: "absolute",
            left: 58,
            right: 58,
            bottom: 55,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 18,
            letterSpacing: 2,
            color: C.white,
        }}
    >
        <span>
            AI HUB <span style={{ color: C.cyan }}>INSIDER</span>
        </span>
        <span style={{ color: C.muted, fontSize: 13 }}>SYSTEM DESIGN</span>
    </div>
);

const Canvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
        }}
    >
        {children}
    </svg>
);

const Frame: React.FC<{
    color?: string;
    children: React.ReactNode;
}> = ({ color = C.cyan, children }) => (
    <Shell color={color}>
        {children}
        <Brand />
    </Shell>
);

const Shell: React.FC<{
    color?: string;
    children: React.ReactNode;
}> = ({ color = C.blue, children }) => (
    <AbsoluteFill style={{ overflow: "hidden", color: C.white }}>
        <Backdrop color={color} />
        {children}
    </AbsoluteFill>
);

// 01 — A healthy-looking dependency becomes a system-wide incident.
const HookVisual: React.FC = () => {
    const f = useCurrentFrame();
    const danger = lerp(f, 0, 1, 15, 70);
    const jitter = danger > 0.6 ? Math.sin(f * 2.7) * 5 : 0;

    return (
        <Frame color={C.red}>
            <Canvas>
                <Headline
                    eyebrow="Production incident"
                    lines={["ONE SERVICE", "GETS STUCK."]}
                    color={C.red}
                    top={140}
                    size={75}
                />

                <Text x={66} y={430} size={23} color={C.muted} weight={600}>
                    THE FAILURE DOESN'T STAY THERE
                </Text>

                <MovingPackets x1={130} y1={650} x2={390} y2={650} count={8} />
                <MovingPackets
                    x1={500}
                    y1={650}
                    x2={760}
                    y2={650}
                    count={8}
                    color={C.orange}
                    stalled
                />

                <Node
                    x={145}
                    y={650}
                    w={190}
                    h={130}
                    label="CLIENTS"
                    sub="Requests"
                    color={C.cyan}
                />
                <Node
                    x={445 + jitter}
                    y={650}
                    w={220}
                    h={150}
                    label="SERVICE B"
                    sub={danger > 0.6 ? "SATURATED" : "LATENCY RISING"}
                    color={C.orange}
                    failed={danger > 0.65}
                    status={danger > 0.65 ? "DEGRADED" : "HEALTHY"}
                />
                <Node
                    x={825}
                    y={650}
                    w={190}
                    h={130}
                    label="SERVICE C"
                    sub="Waiting..."
                    color={C.red}
                    failed={danger > 0.4}
                    status={danger > 0.65 ? "TIMEOUT" : "BLOCKED"}
                />

                <Burst x={445} y={650} color={C.red} start={35} />

                {Array.from({ length: 6 }, (_, i) => {
                    const y = 860 + i * 65;
                    const p = clamp((f - 20 - i * 5) / 25);

                    return (
                        <g key={i} opacity={p}>
                            <Line
                                x1={125}
                                y1={y}
                                x2={950}
                                y2={y}
                                color={C.red}
                                opacity={0.15}
                                width={2}
                            />
                            <Text
                                x={130}
                                y={y - 12}
                                size={17}
                                color={C.red}
                                weight={900}
                            >
                                {["LATENCY RISING", "THREADS BLOCKED", "POOL EXHAUSTED",
                                    "TIMEOUTS", "RETRIES", "CASCADE"][i]}
                            </Text>
                            <Text
                                x={940}
                                y={y - 12}
                                size={17}
                                color={C.red}
                                weight={900}
                                anchor="end"
                            >
                                {["120 ms", "640 ms", "POOL FULL", "504", "× 3", "OUTAGE"][i]}
                            </Text>
                        </g>
                    );
                })}

                <Text x={540} y={1420} size={48} weight={900} anchor="middle">
                    THE ENTIRE SYSTEM
                </Text>
                <Text
                    x={540}
                    y={1485}
                    size={60}
                    color={C.red}
                    weight={900}
                    anchor="middle"
                >
                    PAYS THE PRICE.
                </Text>
            </Canvas>
        </Frame>
    );
};

// 02 — Synchronous calls turn latency into blocked work.
const IncidentVisual: React.FC = () => {
    const f = useCurrentFrame();
    const load = clamp(f / 180);
    const slots = 28;

    return (
        <Frame color={C.orange}>
            <Canvas>
                <Headline
                    eyebrow="01 / The bottleneck"
                    lines={["EVERY CALLER", "MUST WAIT."]}
                    color={C.orange}
                    top={140}
                />

                <Node
                    x={220}
                    y={565}
                    label="SERVICE A"
                    sub="Synchronous call"
                    color={C.cyan}
                />
                <Node
                    x={790}
                    y={565}
                    label="SERVICE B"
                    sub="Can't keep up"
                    color={C.red}
                    failed
                />

                <MovingPackets
                    x1={340}
                    y1={565}
                    x2={650}
                    y2={565}
                    count={15}
                    color={C.orange}
                    speed={1.1}
                    stalled
                />

                <Text x={540} y={760} size={22} color={C.muted} anchor="middle">
                    CONNECTION POOL
                </Text>

                {Array.from({ length: slots }, (_, i) => {
                    const col = i % 7;
                    const row = Math.floor(i / 7);
                    const busy = i < load * slots;

                    return (
                        <g key={i}>
                            <rect
                                x={105 + col * 125}
                                y={820 + row * 76}
                                width={105}
                                height={53}
                                rx={10}
                                fill={busy ? C.red : "#1A2546"}
                                fillOpacity={busy ? 0.75 : 0.4}
                                stroke={busy ? C.red : "#50618C"}
                                strokeOpacity={busy ? 1 : 0.5}
                                strokeWidth={2}
                            />
                            {busy && (
                                <Text
                                    x={157 + col * 125}
                                    y={854 + row * 76}
                                    size={15}
                                    color={C.white}
                                    anchor="middle"
                                    weight={900}
                                >
                                    WAIT
                                </Text>
                            )}
                        </g>
                    );
                })}

                <Text x={540} y={1220} size={25} color={C.muted} anchor="middle">
                    OCCUPIED CONNECTIONS
                </Text>
                <Text
                    x={540}
                    y={1300}
                    size={76}
                    color={load > 0.8 ? C.red : C.orange}
                    anchor="middle"
                    weight={900}
                >
                    {Math.round(load * 100)}%
                </Text>

                <rect
                    x={120}
                    y={1375}
                    width={840}
                    height={14}
                    rx={7}
                    fill="#263251"
                />
                <rect
                    x={120}
                    y={1375}
                    width={840 * load}
                    height={14}
                    rx={7}
                    fill={load > 0.8 ? C.red : C.orange}
                />

                <Text x={540} y={1490} size={33} anchor="middle" weight={900}>
                    SLOW RESPONSE
                </Text>
                <Text x={540} y={1540} size={33} anchor="middle" color={C.red} weight={900}>
                    → BLOCKED THREADS
                </Text>
                <Text x={540} y={1590} size={33} anchor="middle" color={C.red} weight={900}>
                    → MORE TIMEOUTS
                </Text>
            </Canvas>
        </Frame>
    );
};

// 03 — The cascade spreads through a dependency graph.
const FailureVisual: React.FC = () => {
    const f = useCurrentFrame();
    const stage = Math.floor(f / 32);
    const nodes = [
        { x: 540, y: 510, label: "SERVICE B" },
        { x: 285, y: 770, label: "SERVICE A" },
        { x: 795, y: 770, label: "SERVICE C" },
        { x: 285, y: 1050, label: "WORKER D" },
        { x: 795, y: 1050, label: "API E" },
        { x: 540, y: 1315, label: "GATEWAY" },
    ];

    const edges = [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 5],
        [4, 5],
    ];

    return (
        <Frame color={C.red}>
            <Canvas>
                <Headline
                    eyebrow="02 / Cascading failure"
                    lines={["RETRIES MAKE", "IT EVEN WORSE."]}
                    color={C.red}
                    top={140}
                />

                {edges.map(([a, b], i) => {
                    const from = nodes[a];
                    const to = nodes[b];
                    const failed = stage >= i + 1;

                    return (
                        <g key={i}>
                            <Line
                                x1={from.x}
                                y1={from.y}
                                x2={to.x}
                                y2={to.y}
                                color={failed ? C.red : C.cyan}
                                opacity={0.55}
                                width={4}
                            />
                            {failed && (
                                <MovingPackets
                                    x1={from.x}
                                    y1={from.y}
                                    x2={to.x}
                                    y2={to.y}
                                    count={3}
                                    color={C.red}
                                    speed={3}
                                />
                            )}
                        </g>
                    );
                })}

                {nodes.map((n, i) => {
                    const failed = i === 0 || stage >= i + 1;

                    return (
                        <g key={n.label}>
                            <Node
                                x={n.x}
                                y={n.y}
                                w={220}
                                h={130}
                                label={n.label}
                                sub={failed ? "TIMEOUT / RETRY" : "WAITING"}
                                color={failed ? C.red : C.blue}
                                failed={failed}
                            />
                            {failed && <Burst x={n.x} y={n.y} start={i * 8} />}
                        </g>
                    );
                })}

                <Text x={540} y={1510} size={32} color={C.red} anchor="middle" weight={900}>
                    ONE FAILURE
                </Text>
                <Text x={540} y={1560} size={32} color={C.white} anchor="middle" weight={900}>
                    BECOMES EVERYONE'S PROBLEM.
                </Text>
            </Canvas>
        </Frame>
    );
};

// 04 — Queue insertion transforms a blocking dependency into a buffer.
const QueueVisual: React.FC = () => {
    const f = useCurrentFrame();
    const incoming = Math.min(18, Math.floor(f / 5) + 1);
    const consumed = f > 100 ? Math.min(incoming, Math.floor((f - 100) / 8)) : 0;
    const queued = Math.max(0, incoming - consumed);

    return (
        <Frame color={C.purple}>
            <Canvas>
                <Headline
                    eyebrow="03 / The architecture change"
                    lines={["INSERT A", "MESSAGE QUEUE."]}
                    color={C.purple}
                    top={140}
                />

                <Node
                    x={180}
                    y={700}
                    w={210}
                    h={150}
                    label="SERVICE A"
                    sub="Publish"
                    color={C.cyan}
                />
                <Node
                    x={900}
                    y={700}
                    w={210}
                    h={150}
                    label="SERVICE B"
                    sub="Consume"
                    color={C.green}
                />

                <MovingPackets
                    x1={290}
                    y1={700}
                    x2={390}
                    y2={700}
                    count={6}
                    color={C.cyan}
                    speed={2.5}
                />
                <MovingPackets
                    x1={690}
                    y1={700}
                    x2={790}
                    y2={700}
                    count={4}
                    color={C.green}
                    speed={1.3}
                    delay={30}
                />

                <path
                    d="M 390 700 L 430 700 L 430 640 L 650 640 L 650 700 L 690 700"
                    fill="none"
                    stroke={C.purple}
                    strokeWidth={4}
                    strokeOpacity={0.8}
                />

                <rect
                    x={385}
                    y={545}
                    width={310}
                    height={390}
                    rx={30}
                    fill="#19183D"
                    fillOpacity={0.95}
                    stroke={C.purple}
                    strokeWidth={3}
                />
                <rect
                    x={405}
                    y={565}
                    width={270}
                    height={350}
                    rx={20}
                    fill="none"
                    stroke={C.purple}
                    strokeOpacity={0.35}
                    strokeWidth={2}
                />

                <Text x={540} y={605} size={23} color={C.purple} anchor="middle" weight={900}>
                    DURABLE BROKER
                </Text>

                {Array.from({ length: 18 }, (_, i) => {
                    const col = i % 3;
                    const row = Math.floor(i / 3);
                    const active = i < queued;

                    return (
                        <g key={i}>
                            <rect
                                x={425 + col * 85}
                                y={645 + row * 42}
                                width={67}
                                height={28}
                                rx={7}
                                fill={active ? C.purple : "#2A3151"}
                                fillOpacity={active ? 0.9 : 0.25}
                                stroke={active ? C.cyan : "#657096"}
                                strokeOpacity={active ? 0.9 : 0.2}
                            />
                            {active && (
                                <circle
                                    cx={458 + col * 85}
                                    cy={659 + row * 42}
                                    r={4}
                                    fill={C.white}
                                />
                            )}
                        </g>
                    );
                })}

                <Text x={540} y={925} size={17} color={C.muted} anchor="middle">
                    BUFFERED MESSAGES
                </Text>

                <Text x={540} y={1100} size={29} color={C.cyan} anchor="middle" weight={900}>
                    PRODUCER KEEPS MOVING
                </Text>
                <Text x={540} y={1155} size={29} color={C.green} anchor="middle" weight={900}>
                    CONSUMER SETS ITS PACE
                </Text>

                <Line x1={150} y1={1245} x2={930} y2={1245} color={C.purple} opacity={0.5} />
                <Text x={150} y={1300} size={19} color={C.muted}>QUEUED</Text>
                <Text x={150} y={1375} size={56} color={C.purple} weight={900}>
                    {queued}
                </Text>
                <Text x={930} y={1300} size={19} color={C.muted} anchor="end">PROCESSED</Text>
                <Text x={930} y={1375} size={56} color={C.green} weight={900} anchor="end">
                    {consumed}
                </Text>
            </Canvas>
        </Frame>
    );
};

// 05 — The consumer stops; the queue survives and later drains.
const RecoveryVisual: React.FC = () => {
    const f = useCurrentFrame();
    const recovered = f > 115;
    const backlog = recovered
        ? clamp(1 - (f - 115) / 150)
        : clamp(f / 115);
    const count = Math.round(backlog * 30);

    return (
        <Frame color={C.green}>
            <Canvas>
                <Headline
                    eyebrow="04 / Recovery"
                    lines={["CONSUMER DOWN.", "MESSAGES SAFE."]}
                    color={C.green}
                    top={140}
                />

                <Node
                    x={540}
                    y={540}
                    w={290}
                    h={145}
                    label="DURABLE QUEUE"
                    sub={`${count} messages waiting`}
                    color={C.purple}
                />

                <Line x1={540} y1={615} x2={540} y2={720} color={C.purple} opacity={0.65} width={4} />

                {Array.from({ length: 30 }, (_, i) => {
                    const col = i % 6;
                    const row = Math.floor(i / 6);
                    const active = i < count;

                    return (
                        <rect
                            key={i}
                            x={185 + col * 142}
                            y={750 + row * 48}
                            width={112}
                            height={30}
                            rx={8}
                            fill={active ? C.purple : "#1C2848"}
                            fillOpacity={active ? 0.85 : 0.2}
                            stroke={active ? C.purple : "#526086"}
                            strokeOpacity={active ? 0.8 : 0.2}
                        />
                    );
                })}

                <Line x1={540} y1={1010} x2={540} y2={1110} color={recovered ? C.green : C.red} width={4} />
                <Node
                    x={540}
                    y={1195}
                    w={310}
                    h={155}
                    label="CONSUMER"
                    sub={recovered ? "PROCESSING" : "OFFLINE"}
                    color={recovered ? C.green : C.red}
                    failed={!recovered}
                    status={recovered ? "CATCHING UP" : "UNAVAILABLE"}
                />

                {recovered && (
                    <MovingPackets
                        x1={540}
                        y1={1030}
                        x2={540}
                        y2={1100}
                        count={5}
                        color={C.green}
                        speed={3}
                    />
                )}

                <Text x={540} y={1455} size={29} color={C.white} anchor="middle" weight={900}>
                    {recovered ? "BACKLOG DRAINS" : "NEW MESSAGES KEEP ARRIVING"}
                </Text>
                <Text x={540} y={1510} size={22} color={C.muted} anchor="middle">
                    {recovered
                        ? "Processing resumes at a controlled rate"
                        : "The queue absorbs the traffic spike"}
                </Text>
            </Canvas>
        </Frame>
    );
};

// 06 — Duplicate delivery, idempotency, retry budget, and DLQ.
const ReliabilityVisual: React.FC = () => {
    const f = useCurrentFrame();
    const phase = Math.floor(f / 40) % 4;
    const duplicate = phase === 1;
    const retry = phase === 2;
    const dead = phase === 3;

    return (
        <Frame color={C.pink}>
            <Canvas>
                <Headline
                    eyebrow="05 / Reliability"
                    lines={["DELIVERY CAN", "REPEAT OR FAIL."]}
                    color={C.pink}
                    top={140}
                />

                <Node
                    x={540}
                    y={560}
                    w={280}
                    h={145}
                    label="MESSAGE M1"
                    sub="At-least-once delivery"
                    color={C.purple}
                />

                <Line x1={540} y1={635} x2={330} y2={760} color={C.green} width={4} />
                <Line x1={540} y1={635} x2={750} y2={760} color={duplicate ? C.orange : C.green} width={4} />

                <Node
                    x={330}
                    y={830}
                    w={285}
                    h={145}
                    label="FIRST DELIVERY"
                    sub="Apply the effect"
                    color={C.green}
                    status="APPLIED"
                />
                <Node
                    x={750}
                    y={830}
                    w={285}
                    h={145}
                    label="REDELIVERY"
                    sub="Same message ID"
                    color={duplicate ? C.orange : C.green}
                    status={duplicate ? "DUPLICATE" : "DETECTED"}
                />

                <Text x={540} y={1070} size={28} color={C.green} anchor="middle" weight={900}>
                    IDEMPOTENCY KEY
                </Text>
                <Text x={540} y={1120} size={21} color={C.muted} anchor="middle">
                    Same event. No repeated side effect.
                </Text>

                <Line x1={540} y1={1170} x2={540} y2={1240} color={C.orange} width={4} />

                <g transform={`translate(540 1305)`}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <g key={i}>
                            <circle
                                cx={-180 + i * 90}
                                cy={0}
                                r={25}
                                fill={i < (retry ? 5 : 2) ? C.orange : "#222D4B"}
                                stroke={C.orange}
                                strokeWidth={2}
                                strokeOpacity={0.7}
                            />
                            <Text
                                x={-180 + i * 90}
                                y={7}
                                size={17}
                                color={C.bg}
                                anchor="middle"
                                weight={900}
                            >
                                {i + 1}
                            </Text>
                        </g>
                    ))}
                </g>

                <Text x={540} y={1370} size={20} color={C.orange} anchor="middle" weight={900}>
                    BOUNDED RETRIES
                </Text>

                <Line x1={540} y1={1410} x2={540} y2={1470} color={C.red} width={4} />

                <g transform={`translate(540 1530)`}>
                    <rect
                        x={-230}
                        y={-36}
                        width={460}
                        height={72}
                        rx={18}
                        fill="#26192F"
                        stroke={C.red}
                        strokeWidth={2}
                    />
                    {Array.from({ length: 5 }, (_, i) => (
                        <rect
                            key={i}
                            x={-190 + i * 78}
                            y={-12}
                            width={52}
                            height={24}
                            rx={6}
                            fill={dead ? C.red : "#63334C"}
                            fillOpacity={dead ? 0.9 : 0.4}
                        />
                    ))}
                    <Text x={0} y={66} size={20} color={C.red} anchor="middle" weight={900}>
                        DEAD-LETTER QUEUE
                    </Text>
                </g>
            </Canvas>
        </Frame>
    );
};

// 07 — Contrast blocked synchronous work with buffered asynchronous work.
const TakeawayVisual: React.FC = () => {
    const f = useCurrentFrame();
    const p = clamp(f / 60);

    return (
        <Frame color={C.cyan}>
            <Canvas>
                <Headline
                    eyebrow="The takeaway"
                    lines={["BUFFER THE WAIT.", "CONTAIN FAILURE."]}
                    color={C.green}
                    top={140}
                />

                <Text x={280} y={520} size={22} color={C.red} anchor="middle" weight={900}>
                    SYNCHRONOUS
                </Text>
                <Text x={800} y={520} size={22} color={C.green} anchor="middle" weight={900}>
                    ASYNCHRONOUS
                </Text>

                <Node
                    x={280}
                    y={665}
                    w={200}
                    h={125}
                    label="SERVICE A"
                    sub="Waits"
                    color={C.red}
                    failed
                />
                <Node
                    x={280}
                    y={930}
                    w={200}
                    h={125}
                    label="SERVICE B"
                    sub="Slow"
                    color={C.red}
                    failed
                />
                <MovingPackets
                    x1={280}
                    y1={730}
                    x2={280}
                    y2={865}
                    count={8}
                    color={C.red}
                    stalled
                />

                <Node
                    x={800}
                    y={665}
                    w={200}
                    h={125}
                    label="SERVICE A"
                    sub="Publishes"
                    color={C.cyan}
                />
                <Node
                    x={800}
                    y={930}
                    w={200}
                    h={125}
                    label="QUEUE"
                    sub="Buffers work"
                    color={C.purple}
                />
                <Node
                    x={800}
                    y={1195}
                    w={200}
                    h={125}
                    label="SERVICE B"
                    sub="Processes"
                    color={C.green}
                />

                <MovingPackets
                    x1={800}
                    y1={730}
                    x2={800}
                    y2={865}
                    count={6}
                    color={C.cyan}
                    speed={2.5}
                />
                <MovingPackets
                    x1={800}
                    y1={995}
                    x2={800}
                    y2={1130}
                    count={4}
                    color={C.green}
                    speed={1.2}
                />

                <Text x={280} y={1080} size={20} color={C.red} anchor="middle" weight={900}>
                    WAITING SPREADS
                </Text>
                <Text x={800} y={1325} size={20} color={C.green} anchor="middle" weight={900}>
                    WORK IS BUFFERED
                </Text>

                <Line x1={105} y1={1400} x2={975} y2={1400} color={C.cyan} opacity={0.4} />

                <Text x={540} y={1480} size={30} anchor="middle" weight={900}>
                    QUEUES DON'T ELIMINATE FAILURES.
                </Text>
                <Text x={540} y={1540} size={34} color={C.cyan} anchor="middle" weight={900}>
                    THEY HELP CONTAIN THEM.
                </Text>
            </Canvas>
        </Frame>
    );
};

// 08 — CTA uses a moving message stream, not another information panel.
const CtaVisual: React.FC = () => {
    const f = useCurrentFrame();
    const rotate = f * 0.6;
    const breathe = 1 + Math.sin(f / 9) * 0.035;

    return (
        <Frame color={C.purple}>
            <Canvas>
                {Array.from({ length: 3 }, (_, i) => (
                    <g
                        key={i}
                        transform={`translate(540 600) rotate(${rotate * (i % 2 ? -1 : 1)})`}
                    >
                        <rect
                            x={-170 + i * 25}
                            y={-170 + i * 25}
                            width={340 - i * 50}
                            height={340 - i * 50}
                            rx={42}
                            fill="none"
                            stroke={[C.cyan, C.purple, C.blue][i]}
                            strokeWidth={3}
                            strokeOpacity={0.65}
                            strokeDasharray="20 15"
                        />
                    </g>
                ))}

                <g transform={`translate(540 600) scale(${breathe})`}>
                    <rect
                        x={-90}
                        y={-115}
                        width={180}
                        height={230}
                        rx={28}
                        fill="#24204D"
                        stroke={C.purple}
                        strokeWidth={3}
                    />
                    {Array.from({ length: 4 }, (_, i) => (
                        <g key={i}>
                            <rect
                                x={-54}
                                y={-70 + i * 42}
                                width={108}
                                height={20}
                                rx={6}
                                fill={[C.cyan, C.blue, C.purple, C.pink][i]}
                            />
                        </g>
                    ))}
                </g>

                {Array.from({ length: 16 }, (_, i) => {
                    const a = (i / 16) * Math.PI * 2 + f * 0.02;
                    const r = 250 + Math.sin(f / 7 + i) * 25;

                    return (
                        <Packet
                            key={i}
                            x={540 + Math.cos(a) * r}
                            y={600 + Math.sin(a) * r}
                            color={[C.cyan, C.purple, C.blue, C.pink][i % 4]}
                            size={7 + (i % 3) * 2}
                        />
                    );
                })}

                <Text x={540} y={1050} size={28} color={C.muted} anchor="middle" weight={800}>
                    DESIGN FOR
                </Text>
                <Text x={540} y={1140} size={76} color={C.white} anchor="middle" weight={900}>
                    FAILURE.
                </Text>
                <Text x={540} y={1230} size={28} color={C.cyan} anchor="middle" weight={900}>
                    FOLLOW AI HUB INSIDER
                </Text>
                <Text x={540} y={1280} size={25} color={C.muted} anchor="middle" weight={600}>
                    FOR MORE SYSTEM DESIGN.
                </Text>
            </Canvas>
        </Frame>
    );
};

const SectionScene: React.FC<{
    section: (typeof TIMELINE)[number];
}> = ({ section }) => {
    switch (section.id) {
        case "hook":
            return <HookVisual />;
        case "incident":
            return <IncidentVisual />;
        case "failure":
            return <FailureVisual />;
        case "solution":
            return <QueueVisual />;
        case "recovery":
            return <RecoveryVisual />;
        case "tradeoff":
            return <ReliabilityVisual />;
        case "takeaway":
            return <TakeawayVisual />;
        case "cta":
            return <CtaVisual />;
        default:
            return (
                <Frame>
                    <Canvas>
                        <Headline
                            eyebrow="Message queues"
                            lines={["DESIGN FOR", "FAILURE."]}
                        />
                        <Text x={540} y={1050} size={27} anchor="middle">
                            {section.text}
                        </Text>
                    </Canvas>
                </Frame>
            );
    }
};

export const MessageQueuesScene: React.FC = () => {
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            {TIMELINE.map((section) => (
                <Sequence
                    key={section.id}
                    from={section.start}
                    durationInFrames={section.duration}
                >
                    <SectionScene section={section} />
                    <Audio src={staticFile(section.audio)} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};