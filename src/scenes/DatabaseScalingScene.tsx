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

// ============================================================
// DATABASE SCALING — AI HUB INSIDER
// Visual direction:
// - ByteByteGo-inspired system diagrams
// - Continuous evolving architecture
// - Large animated objects
// - Moving traffic/data packets
// - Minimal text
// - Strong visual transitions
// - 1080x1920 vertical
// ============================================================

const C = {
    bg: "#07111F",
    bg2: "#0B1B2E",
    panel: "#10243A",

    cyan: "#4DB8FF",
    green: "#1FD1A5",
    purple: "#9B7CFF",
    orange: "#FFB86C",
    pink: "#FF6B9D",
    red: "#FF647C",
    yellow: "#FFD166",

    white: "#F4F7FB",
    muted: "#8FA3B8",
    dim: "#50657C",

    grid: "rgba(77,184,255,0.07)",
};

const clamp = (n: number, min = 0, max = 1) =>
    Math.max(min, Math.min(max, n));

const ease = (n: number) => {
    const x = clamp(n);
    return x * x * (3 - 2 * x);
};

const pop = (frame: number, start: number, duration = 18) =>
    ease((frame - start) / duration);

const slideUp = (frame: number, start: number, distance = 100) => {
    const p = ease((frame - start) / 20);
    return {
        opacity: p,
        transform: `translateY(${(1 - p) * distance}px)`,
    };
};

const pulse = (frame: number, speed = 0.08) =>
    0.5 + 0.5 * Math.sin(frame * speed);

const scaleIn = (frame: number, start: number) =>
    interpolate(
        ease((frame - start) / 18),
        [0, 1],
        [0.65, 1]
    );

const glow = (color: string, amount = 20) =>
    `0 0 ${amount}px ${color}`;

// ============================================================
// BACKGROUND
// ============================================================

const Background: React.FC = () => {
    const frame = useCurrentFrame();

    const driftX = Math.sin(frame / 90) * 40;
    const driftY = Math.cos(frame / 120) * 30;

    return (
        <AbsoluteFill
            style={{
                background: `
                    radial-gradient(
                        circle at ${30 + driftX / 10}% ${18 + driftY / 10}%,
                        rgba(77,184,255,0.12),
                        transparent 32%
                    ),
                    radial-gradient(
                        circle at ${75 - driftX / 15}% ${75 + driftY / 15}%,
                        rgba(155,124,255,0.10),
                        transparent 34%
                    ),
                    linear-gradient(145deg, ${C.bg}, ${C.bg2})
                `,
            }}
        >
            <AbsoluteFill
                style={{
                    opacity: 0.8,
                    backgroundImage: `
                        linear-gradient(${C.grid} 1px, transparent 1px),
                        linear-gradient(90deg, ${C.grid} 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px",
                    transform: `translate(${driftX}px, ${driftY}px)`,
                }}
            />

            {/* vignette */}
            <AbsoluteFill
                style={{
                    background:
                        "radial-gradient(circle, transparent 35%, rgba(2,7,14,0.55) 100%)",
                }}
            />
        </AbsoluteFill>
    );
};

// ============================================================
// TEXT
// ============================================================

const Label: React.FC<{
    children: React.ReactNode;
    color?: string;
    size?: number;
}> = ({ children, color = C.cyan, size = 22 }) => (
    <div
        style={{
            fontFamily: "Inter, Arial, sans-serif",
            fontWeight: 800,
            fontSize: size,
            color,
            letterSpacing: 1.2,
            textTransform: "uppercase",
        }}
    >
        {children}
    </div>
);

const BigTitle: React.FC<{
    children: React.ReactNode;
    color?: string;
    size?: number;
}> = ({ children, color = C.white, size = 66 }) => (
    <div
        style={{
            fontFamily: "Inter, Arial, sans-serif",
            fontWeight: 900,
            fontSize: size,
            lineHeight: 1.02,
            color,
            letterSpacing: -2,
        }}
    >
        {children}
    </div>
);

const Caption: React.FC<{
    children: React.ReactNode;
    color?: string;
    size?: number;
}> = ({ children, color = C.muted, size = 25 }) => (
    <div
        style={{
            fontFamily: "Inter, Arial, sans-serif",
            fontWeight: 600,
            fontSize: size,
            lineHeight: 1.3,
            color,
        }}
    >
        {children}
    </div>
);

// ============================================================
// NODE
// ============================================================

const Node: React.FC<{
    x: number;
    y: number;
    width?: number;
    height?: number;
    label: string;
    sub?: string;
    color?: string;
    scale?: number;
    glowAmount?: number;
}> = ({
    x,
    y,
    width = 240,
    height = 150,
    label,
    sub,
    color = C.cyan,
    scale = 1,
    glowAmount = 18,
}) => {
        const frame = useCurrentFrame();
        const s = scaleIn(frame, 0) * scale;

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width,
                    height,
                    transform: `scale(${s})`,
                    transformOrigin: "center",
                    borderRadius: 24,
                    background: `linear-gradient(145deg, rgba(16,36,58,0.96), rgba(8,23,39,0.96))`,
                    border: `2px solid ${color}`,
                    boxShadow: glow(color, glowAmount),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Inter, Arial, sans-serif",
                }}
            >
                <div
                    style={{
                        fontSize: 28,
                        fontWeight: 900,
                        color: C.white,
                    }}
                >
                    {label}
                </div>

                {sub && (
                    <div
                        style={{
                            marginTop: 8,
                            fontSize: 19,
                            fontWeight: 700,
                            color,
                        }}
                    >
                        {sub}
                    </div>
                )}
            </div>
        );
    };

// ============================================================
// DATABASE
// ============================================================

const Database: React.FC<{
    x: number;
    y: number;
    scale?: number;
    color?: string;
    hot?: boolean;
    label?: string;
}> = ({
    x,
    y,
    scale = 1,
    color = C.cyan,
    hot = false,
    label = "DATABASE",
}) => {
        const frame = useCurrentFrame();

        const p = pulse(frame, 0.08);
        const glowAmount = hot ? 20 + p * 25 : 12;

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 300 * scale,
                    height: 250 * scale,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 300,
                        height: 80,
                        borderRadius: "50%",
                        background:
                            "linear-gradient(180deg, #193B5A, #0D263E)",
                        border: `4px solid ${color}`,
                        boxShadow: glow(color, glowAmount),
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 38,
                        left: 0,
                        width: 300,
                        height: 170,
                        background:
                            "linear-gradient(180deg, #112E48, #0A1D31)",
                        borderLeft: `4px solid ${color}`,
                        borderRight: `4px solid ${color}`,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 168,
                        left: 0,
                        width: 300,
                        height: 80,
                        borderRadius: "50%",
                        background: "#0B2136",
                        border: `4px solid ${color}`,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 20,
                        width: "100%",
                        textAlign: "center",
                        fontFamily: "Inter, Arial, sans-serif",
                        fontSize: 27,
                        fontWeight: 900,
                        color: C.white,
                    }}
                >
                    {label}
                </div>

                {hot && (
                    <div
                        style={{
                            position: "absolute",
                            top: 105,
                            width: "100%",
                            textAlign: "center",
                            fontFamily: "Inter, Arial, sans-serif",
                            fontSize: 34,
                            fontWeight: 900,
                            color: C.red,
                        }}
                    >
                        {Math.round(94 + p * 5)}%
                    </div>
                )}
            </div>
        );
    };

// ============================================================
// USER
// ============================================================

const UserIcon: React.FC<{
    x: number;
    y: number;
    scale?: number;
}> = ({ x, y, scale = 1 }) => {
    const frame = useCurrentFrame();

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 110 * scale,
                height: 110 * scale,
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 30%, ${C.cyan}, ${C.purple})`,
                boxShadow: glow(C.cyan, 25),
                transform: `scale(${0.9 + pulse(frame, 0.05) * 0.1})`,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 18 * scale,
                    left: 38 * scale,
                    width: 34 * scale,
                    height: 34 * scale,
                    borderRadius: "50%",
                    background: C.white,
                }}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: 14 * scale,
                    left: 22 * scale,
                    width: 66 * scale,
                    height: 36 * scale,
                    borderRadius: "40px 40px 20px 20px",
                    background: C.white,
                }}
            />
        </div>
    );
};

// ============================================================
// CONNECTION
// ============================================================

const Connection: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    width?: number;
    progress?: number;
}> = ({
    x1,
    y1,
    x2,
    y2,
    color = C.cyan,
    width = 5,
    progress = 1,
}) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        return (
            <div
                style={{
                    position: "absolute",
                    left: x1,
                    top: y1,
                    width: length * clamp(progress),
                    height: width,
                    transformOrigin: "left center",
                    transform: `rotate(${angle}deg)`,
                    background: color,
                    borderRadius: width,
                    boxShadow: glow(color, 10),
                }}
            />
        );
    };

// ============================================================
// PACKET
// ============================================================

const Packet: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    delay?: number;
    duration?: number;
    color?: string;
    size?: number;
}> = ({
    x1,
    y1,
    x2,
    y2,
    delay = 0,
    duration = 45,
    color = C.cyan,
    size = 16,
}) => {
        const frame = useCurrentFrame();

        const progress =
            ((frame - delay) % duration + duration) / duration;

        const x = interpolate(progress, [0, 1], [x1, x2]);
        const y = interpolate(progress, [0, 1], [y1, y2]);

        return (
            <div
                style={{
                    position: "absolute",
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: glow(color, 18),
                }}
            />
        );
    };

// ============================================================
// TRAFFIC PARTICLES
// ============================================================

const Traffic: React.FC<{
    count?: number;
    y?: number;
    color?: string;
    speed?: number;
}> = ({
    count = 10,
    y = 400,
    color = C.cyan,
    speed = 1,
}) => {
        const frame = useCurrentFrame();

        return (
            <>
                {Array.from({ length: count }).map((_, i) => {
                    const offset = (i * 137) % 1200;
                    const x =
                        ((frame * 5 * speed + offset) % 1300) - 120;

                    const yy =
                        y +
                        Math.sin(frame / 14 + i) * 20;

                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: x,
                                top: yy,
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: color,
                                boxShadow: glow(color, 12),
                            }}
                        />
                    );
                })}
            </>
        );
    };

// ============================================================
// CPU METER
// ============================================================

const CpuMeter: React.FC<{
    x: number;
    y: number;
    value?: number;
    color?: string;
}> = ({ x, y, value = 0.95, color = C.red }) => {
    const frame = useCurrentFrame();

    const animated = interpolate(
        ease(frame / 20),
        [0, 1],
        [0, value]
    );

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 500,
                fontFamily: "Inter, Arial, sans-serif",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                }}
            >
                <span
                    style={{
                        color: C.muted,
                        fontSize: 22,
                        fontWeight: 800,
                    }}
                >
                    DATABASE CPU
                </span>

                <span
                    style={{
                        color,
                        fontSize: 27,
                        fontWeight: 900,
                    }}
                >
                    {Math.round(animated * 100)}%
                </span>
            </div>

            <div
                style={{
                    width: "100%",
                    height: 22,
                    borderRadius: 20,
                    background: "#091827",
                    border: `2px solid ${C.dim}`,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${animated * 100}%`,
                        height: "100%",
                        borderRadius: 20,
                        background: color,
                        boxShadow: glow(color, 18),
                    }}
                />
            </div>
        </div>
    );
};

// ============================================================
// SECTION HEADER
// ============================================================

const SectionHeader: React.FC<{
    number: string;
    title: string;
    subtitle: string;
    color: string;
}> = ({ number, title, subtitle, color }) => {
    const frame = useCurrentFrame();

    return (
        <div
            style={{
                position: "absolute",
                left: 70,
                top: 90,
                right: 70,
                ...slideUp(frame, 0, 50),
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                }}
            >
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: color,
                        color: C.bg,
                        fontSize: 30,
                        fontWeight: 900,
                        boxShadow: glow(color, 22),
                    }}
                >
                    {number}
                </div>

                <BigTitle size={54}>{title}</BigTitle>
            </div>

            <div style={{ marginTop: 18 }}>
                <Caption>{subtitle}</Caption>
            </div>
        </div>
    );
};

// ============================================================
// HOOK
// ============================================================

const Hook: React.FC = () => {
    const frame = useCurrentFrame();

    const shake =
        frame < 35
            ? Math.sin(frame * 1.8) * (35 - frame) * 0.5
            : 0;

    return (
        <AbsoluteFill>
            <Traffic
                count={22}
                y={650}
                color={C.cyan}
                speed={2}
            />

            <div
                style={{
                    position: "absolute",
                    left: 70,
                    top: 150,
                    ...slideUp(frame, 0, 80),
                }}
            >
                <Label color={C.red}>DATABASE UNDER PRESSURE</Label>

                <div style={{ marginTop: 20 }}>
                    <BigTitle size={72}>
                        CPU hits
                    </BigTitle>

                    <BigTitle size={100} color={C.red}>
                        99%
                    </BigTitle>
                </div>

                <div style={{ marginTop: 20, width: 760 }}>
                    <Caption size={30}>
                        Traffic spikes. Your database is
                        struggling. What do you do?
                    </Caption>
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 390 + shake,
                    top: 600,
                }}
            >
                <Database
                    x={0}
                    y={0}
                    scale={1}
                    color={C.red}
                    hot
                />
            </div>

            <CpuMeter
                x={290}
                y={1000}
                value={0.99}
                color={C.red}
            />

            <div
                style={{
                    position: "absolute",
                    left: 70,
                    bottom: 190,
                    ...slideUp(frame, 25, 70),
                }}
            >
                <Label color={C.green}>
                    7 WAYS TO SCALE
                </Label>

                <div style={{ marginTop: 14 }}>
                    <BigTitle size={50}>
                        From simple optimizations
                    </BigTitle>

                    <BigTitle size={50} color={C.cyan}>
                        to distributed databases.
                    </BigTitle>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// INDEXING
// ============================================================

const Indexing: React.FC = () => {
    const frame = useCurrentFrame();

    const scanProgress = interpolate(
        frame,
        [30, 150],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const indexed = frame > 165;

    return (
        <AbsoluteFill>
            <SectionHeader
                number="1"
                title="Indexing"
                subtitle="Skip the full table scan and jump directly to the data."
                color={C.cyan}
            />

            <div
                style={{
                    position: "absolute",
                    left: 70,
                    top: 430,
                    fontFamily: "Inter, Arial, sans-serif",
                }}
            >
                <Label color={indexed ? C.green : C.orange}>
                    {indexed ? "INDEX LOOKUP" : "FULL TABLE SCAN"}
                </Label>
            </div>

            {/* table */}
            <div
                style={{
                    position: "absolute",
                    left: 80,
                    top: 520,
                    width: 900,
                    height: 500,
                    borderRadius: 28,
                    background: "rgba(10,28,46,0.9)",
                    border: `2px solid ${C.dim}`,
                    padding: 24,
                }}
            >
                {Array.from({ length: 9 }).map((_, i) => {
                    const y = 30 + i * 50;

                    const highlighted =
                        indexed && i === 6;

                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: 24,
                                top: y,
                                width: 852,
                                height: 36,
                                borderRadius: 10,
                                background: highlighted
                                    ? "rgba(31,209,165,0.25)"
                                    : "rgba(255,255,255,0.025)",
                                border: highlighted
                                    ? `2px solid ${C.green}`
                                    : "1px solid rgba(255,255,255,0.04)",
                                opacity:
                                    indexed
                                        ? highlighted
                                            ? 1
                                            : 0.25
                                        : 1,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: "100%",
                                    padding: "0 18px",
                                    gap: 30,
                                }}
                            >
                                <span
                                    style={{
                                        color: C.dim,
                                        fontSize: 17,
                                        fontWeight: 700,
                                    }}
                                >
                                    #{i + 1}
                                </span>

                                <span
                                    style={{
                                        color: C.muted,
                                        fontSize: 17,
                                    }}
                                >
                                    user_id
                                </span>

                                <span
                                    style={{
                                        color: C.white,
                                        fontSize: 17,
                                        fontWeight: 800,
                                    }}
                                >
                                    {1000 + i * 137}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {!indexed && (
                    <div
                        style={{
                            position: "absolute",
                            left: 70,
                            top: 40 + scanProgress * 380,
                            width: 760,
                            height: 5,
                            background: C.orange,
                            boxShadow: glow(C.orange, 18),
                        }}
                    />
                )}
            </div>

            {/* magnifier */}
            <div
                style={{
                    position: "absolute",
                    left: indexed ? 720 : 130,
                    top: indexed ? 800 : 500 + scanProgress * 380,
                    width: 85,
                    height: 85,
                    borderRadius: "50%",
                    border: `7px solid ${indexed ? C.green : C.orange}`,
                    boxShadow: glow(
                        indexed ? C.green : C.orange,
                        25
                    ),
                    transition: "none",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: 100,
                    bottom: 160,
                    right: 100,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <Label color={C.orange}>WITHOUT INDEX</Label>
                    <Caption>Scan many rows</Caption>
                </div>

                <div style={{ textAlign: "right" }}>
                    <Label color={C.green}>WITH INDEX</Label>
                    <Caption>Jump to the target</Caption>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// MATERIALIZED VIEW
// ============================================================

const Materialized: React.FC = () => {
    const frame = useCurrentFrame();

    const resultVisible = frame > 105;

    return (
        <AbsoluteFill>
            <SectionHeader
                number="2"
                title="Materialized Views"
                subtitle="Precompute expensive queries instead of repeating them."
                color={C.purple}
            />

            <Node
                x={70}
                y={500}
                width={220}
                height={120}
                label="ORDERS"
                color={C.cyan}
            />

            <Node
                x={70}
                y={680}
                width={220}
                height={120}
                label="USERS"
                color={C.green}
            />

            <Node
                x={70}
                y={860}
                width={220}
                height={120}
                label="PRODUCTS"
                color={C.orange}
            />

            <Connection
                x1={290}
                y1={560}
                x2={480}
                y2={690}
                color={C.cyan}
            />

            <Connection
                x1={290}
                y1={740}
                x2={480}
                y2={710}
                color={C.green}
            />

            <Connection
                x1={290}
                y1={920}
                x2={480}
                y2={730}
                color={C.orange}
            />

            <div
                style={{
                    position: "absolute",
                    left: 480,
                    top: 630,
                    width: 300,
                    height: 170,
                    borderRadius: 28,
                    border: `3px solid ${C.pink}`,
                    background: "rgba(255,100,124,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    boxShadow: glow(C.pink, 25),
                    transform: `scale(${scaleIn(frame, 20)})`,
                }}
            >
                <div
                    style={{
                        fontSize: 27,
                        fontWeight: 900,
                        color: C.white,
                    }}
                >
                    JOIN + GROUP
                </div>

                <div
                    style={{
                        marginTop: 10,
                        color: C.pink,
                        fontSize: 20,
                        fontWeight: 800,
                    }}
                >
                    EXPENSIVE
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 805,
                    top: 650,
                    opacity: resultVisible ? 1 : 0,
                    transform: `scale(${resultVisible ? 1 : 0.5})`,
                }}
            >
                <div
                    style={{
                        width: 190,
                        height: 130,
                        borderRadius: 24,
                        border: `3px solid ${C.purple}`,
                        background: "rgba(155,124,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        boxShadow: glow(C.purple, 25),
                    }}
                >
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: 900,
                            color: C.white,
                        }}
                    >
                        VIEW
                    </div>

                    <div
                        style={{
                            marginTop: 8,
                            color: C.purple,
                            fontSize: 18,
                            fontWeight: 800,
                        }}
                    >
                        PRECOMPUTED
                    </div>
                </div>
            </div>

            {resultVisible && (
                <Packet
                    x1={780}
                    y1={715}
                    x2={805}
                    y2={715}
                    color={C.purple}
                    duration={25}
                />
            )}

            <div
                style={{
                    position: "absolute",
                    left: 90,
                    bottom: 170,
                }}
            >
                <Label color={C.purple}>
                    TRADEOFF
                </Label>

                <Caption>
                    Faster reads ⚡ · Stale data risk
                </Caption>
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// DENORMALIZATION
// ============================================================

const Denormalization: React.FC = () => {
    const frame = useCurrentFrame();

    const duplicated = frame > 100;

    return (
        <AbsoluteFill>
            <SectionHeader
                number="3"
                title="Denormalization"
                subtitle="Duplicate data to remove expensive joins from hot read paths."
                color={C.orange}
            />

            {!duplicated ? (
                <>
                    <Node
                        x={80}
                        y={500}
                        width={270}
                        height={150}
                        label="USERS"
                        sub="user_id"
                        color={C.cyan}
                    />

                    <Node
                        x={400}
                        y={720}
                        width={270}
                        height={150}
                        label="ORDERS"
                        sub="user_id"
                        color={C.green}
                    />

                    <Node
                        x={720}
                        y={500}
                        width={270}
                        height={150}
                        label="PRODUCTS"
                        sub="product_id"
                        color={C.purple}
                    />

                    <Connection
                        x1={350}
                        y1={580}
                        x2={490}
                        y2={720}
                        color={C.cyan}
                    />

                    <Connection
                        x1={720}
                        y1={580}
                        x2={670}
                        y2={720}
                        color={C.purple}
                    />

                    <div
                        style={{
                            position: "absolute",
                            left: 340,
                            top: 930,
                            color: C.red,
                            fontSize: 28,
                            fontWeight: 900,
                        }}
                    >
                        JOIN EVERY TIME
                    </div>
                </>
            ) : (
                <>
                    <div
                        style={{
                            position: "absolute",
                            left: 80,
                            top: 500,
                            width: 900,
                            height: 390,
                            borderRadius: 32,
                            border: `3px solid ${C.orange}`,
                            background:
                                "linear-gradient(145deg, rgba(255,184,108,0.14), rgba(16,36,58,0.8))",
                            boxShadow: glow(C.orange, 25),
                            padding: 35,
                        }}
                    >
                        <Label color={C.orange}>
                            ORDERS
                        </Label>

                        <div
                            style={{
                                marginTop: 40,
                                display: "grid",
                                gridTemplateColumns:
                                    "1fr 1fr",
                                gap: 24,
                            }}
                        >
                            {[
                                ["order_id", "10291"],
                                ["user_name", "Alex"],
                                ["product", "MacBook"],
                                ["price", "$1999"],
                            ].map(([a, b]) => (
                                <div
                                    key={a}
                                    style={{
                                        height: 90,
                                        borderRadius: 18,
                                        background:
                                            "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        padding: 18,
                                    }}
                                >
                                    <div
                                        style={{
                                            color: C.muted,
                                            fontSize: 17,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {a}
                                    </div>

                                    <div
                                        style={{
                                            marginTop: 7,
                                            color: C.white,
                                            fontSize: 23,
                                            fontWeight: 900,
                                        }}
                                    >
                                        {b}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            left: 130,
                            top: 1000,
                        }}
                    >
                        <Label color={C.green}>
                            ONE READ
                        </Label>

                        <Caption>
                            More storage · simpler reads
                        </Caption>
                    </div>
                </>
            )}
        </AbsoluteFill>
    );
};

// ============================================================
// CACHING
// ============================================================

const Caching: React.FC = () => {
    const frame = useCurrentFrame();

    const cacheActive = frame > 90;

    return (
        <AbsoluteFill>
            <SectionHeader
                number="4"
                title="Caching"
                subtitle="Serve hot data before it reaches the database."
                color={C.green}
            />

            <div
                style={{
                    position: "absolute",
                    left: 60,
                    top: 470,
                }}
            >
                <Label color={C.cyan}>TRAFFIC</Label>
            </div>

            {Array.from({ length: 8 }).map((_, i) => (
                <UserIcon
                    key={i}
                    x={70 + (i % 4) * 115}
                    y={540 + Math.floor(i / 4) * 130}
                    scale={0.55}
                />
            ))}

            <Connection
                x1={520}
                y1={670}
                x2={650}
                y2={670}
                color={C.cyan}
            />

            <div
                style={{
                    position: "absolute",
                    left: 650,
                    top: 530,
                    width: 270,
                    height: 280,
                    borderRadius: 32,
                    background:
                        "linear-gradient(145deg, rgba(31,209,165,0.18), rgba(8,32,39,0.95))",
                    border: `4px solid ${C.green}`,
                    boxShadow: glow(C.green, 30),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        fontSize: 48,
                        fontWeight: 900,
                        color: C.green,
                    }}
                >
                    REDIS
                </div>

                <div
                    style={{
                        marginTop: 16,
                        color: C.white,
                        fontSize: 24,
                        fontWeight: 800,
                    }}
                >
                    CACHE
                </div>

                <div
                    style={{
                        marginTop: 24,
                        fontSize: 18,
                        fontWeight: 800,
                        color: C.muted,
                    }}
                >
                    ⚡ MEMORY
                </div>
            </div>

            <Connection
                x1={790}
                y1={810}
                x2={790}
                y2={980}
                color={cacheActive ? C.green : C.red}
            />

            <Database
                x={640}
                y={980}
                scale={0.8}
                color={cacheActive ? C.green : C.red}
                hot={!cacheActive}
            />

            {cacheActive && (
                <>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Packet
                            key={i}
                            x1={100}
                            y1={600 + i * 70}
                            x2={650}
                            y2={600 + i * 30}
                            delay={i * 10}
                            color={C.green}
                            duration={35}
                        />
                    ))}

                    <div
                        style={{
                            position: "absolute",
                            left: 110,
                            bottom: 190,
                        }}
                    >
                        <Label color={C.green}>
                            CACHE HIT
                        </Label>

                        <Caption>
                            Database traffic drops dramatically
                        </Caption>
                    </div>
                </>
            )}
        </AbsoluteFill>
    );
};

// ============================================================
// VERTICAL SCALING
// ============================================================

const VerticalScaling: React.FC = () => {
    const frame = useCurrentFrame();

    const growing = interpolate(
        frame,
        [20, 110],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const cpu = interpolate(
        frame,
        [20, 110],
        [0.99, 0.42],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <AbsoluteFill>
            <SectionHeader
                number="5"
                title="Vertical Scaling"
                subtitle="Give the same database more CPU, RAM, or faster storage."
                color={C.yellow}
            />

            <div
                style={{
                    position: "absolute",
                    left: 110,
                    top: 520,
                    width: 820,
                    height: 580,
                    borderRadius: 36,
                    background:
                        "linear-gradient(145deg, rgba(255,209,102,0.10), rgba(10,28,46,0.95))",
                    border: `3px solid ${C.yellow}`,
                    boxShadow: glow(C.yellow, 22),
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 90,
                        top: 100,
                        width: 640,
                        height: 350,
                        borderRadius: 30,
                        background: "#0A1D31",
                        border: `4px solid ${C.yellow}`,
                        transform: `scale(${1 + growing * 0.18})`,
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            marginTop: 70,
                            color: C.white,
                            fontSize: 42,
                            fontWeight: 900,
                        }}
                    >
                        DATABASE
                    </div>

                    <div
                        style={{
                            marginTop: 50,
                            display: "flex",
                            justifyContent: "center",
                            gap: 20,
                        }}
                    >
                        {[
                            ["CPU", `${Math.round(8 + growing * 24)} cores`],
                            ["RAM", `${Math.round(32 + growing * 96)} GB`],
                            ["SSD", growing > 0.5 ? "NVMe" : "SSD"],
                        ].map(([name, value]) => (
                            <div
                                key={name}
                                style={{
                                    width: 160,
                                    height: 100,
                                    borderRadius: 18,
                                    background:
                                        "rgba(255,255,255,0.05)",
                                    border: `2px solid ${C.yellow}`,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <div
                                    style={{
                                        color: C.muted,
                                        fontSize: 16,
                                        fontWeight: 800,
                                    }}
                                >
                                    {name}
                                </div>

                                <div
                                    style={{
                                        marginTop: 8,
                                        color: C.white,
                                        fontSize: 20,
                                        fontWeight: 900,
                                    }}
                                >
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <CpuMeter
                x={220}
                y={1160}
                value={cpu}
                color={cpu > 0.7 ? C.red : C.green}
            />

            {frame > 150 && (
                <div
                    style={{
                        position: "absolute",
                        left: 140,
                        bottom: 80,
                        width: 800,
                        textAlign: "center",
                    }}
                >
                    <Label color={C.red}>
                        ⚠️ SINGLE-MACHINE LIMIT
                    </Label>
                </div>
            )}
        </AbsoluteFill>
    );
};

// ============================================================
// REPLICATION
// ============================================================

const Replication: React.FC = () => {
    const frame = useCurrentFrame();

    const replicas = frame > 80 ? 3 : 0;

    return (
        <AbsoluteFill>
            <SectionHeader
                number="6"
                title="Replication"
                subtitle="Separate write traffic from read traffic."
                color={C.pink}
            />

            <div
                style={{
                    position: "absolute",
                    left: 80,
                    top: 520,
                }}
            >
                <Label color={C.pink}>
                    WRITE
                </Label>

                <Node
                    x={0}
                    y={50}
                    width={300}
                    height={180}
                    label="PRIMARY"
                    sub="WRITE"
                    color={C.pink}
                />
            </div>

            <Connection
                x1={380}
                y1={650}
                x2={650}
                y2={510}
                color={C.pink}
            />

            <Connection
                x1={380}
                y1={650}
                x2={650}
                y2={690}
                color={C.cyan}
            />

            <Connection
                x1={380}
                y1={650}
                x2={650}
                y2={870}
                color={C.cyan}
            />

            {[510, 690, 870].map((y, i) => (
                <div
                    key={i}
                    style={{
                        opacity: replicas >= 3 ? 1 : 0,
                        transform: `scale(${replicas >= 3 ? 1 : 0.5})`,
                    }}
                >
                    <Node
                        x={650}
                        y={y}
                        width={280}
                        height={140}
                        label={`REPLICA ${i + 1}`}
                        sub="READ"
                        color={C.cyan}
                    />
                </div>
            ))}

            <div
                style={{
                    position: "absolute",
                    left: 90,
                    bottom: 170,
                }}
            >
                <Label color={C.cyan}>
                    READ-HEAVY WORKLOAD
                </Label>

                <Caption>
                    More replicas → more read capacity
                </Caption>
            </div>

            {frame > 110 && (
                <div
                    style={{
                        position: "absolute",
                        right: 80,
                        bottom: 170,
                        textAlign: "right",
                    }}
                >
                    <Label color={C.orange}>
                        TRADEOFF
                    </Label>

                    <Caption>
                        Replication lag
                    </Caption>
                </div>
            )}
        </AbsoluteFill>
    );
};

// ============================================================
// SHARDING
// ============================================================

const Sharding: React.FC = () => {
    const frame = useCurrentFrame();

    const split = ease((frame - 60) / 55);

    const shardXs = [70, 365, 660];

    return (
        <AbsoluteFill>
            <SectionHeader
                number="7"
                title="Sharding"
                subtitle="Split data across multiple database servers."
                color={C.purple}
            />

            {frame < 80 ? (
                <>
                    <Database
                        x={380}
                        y={560}
                        scale={1.05}
                        color={C.red}
                        hot
                    />

                    <div
                        style={{
                            position: "absolute",
                            left: 250,
                            top: 940,
                        }}
                    >
                        <Label color={C.red}>
                            ONE DATABASE
                        </Label>

                        <Caption>
                            Everything is hitting one machine
                        </Caption>
                    </div>
                </>
            ) : (
                <>
                    <div
                        style={{
                            position: "absolute",
                            left: 80,
                            top: 500,
                            right: 80,
                            height: 600,
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 20,
                        }}
                    >
                        {shardXs.map((x, i) => (
                            <div
                                key={i}
                                style={{
                                    width: 270,
                                    transform: `translateY(${(1 - split) *
                                        (i === 1 ? 30 : 70)
                                        }px) scale(${0.8 + split * 0.2})`,
                                    opacity: split,
                                }}
                            >
                                <Database
                                    x={0}
                                    y={0}
                                    scale={0.72}
                                    color={
                                        [
                                            C.cyan,
                                            C.green,
                                            C.purple,
                                        ][i]
                                    }
                                    label={`SHARD ${i + 1}`}
                                />

                                <div
                                    style={{
                                        marginTop: 230,
                                        textAlign: "center",
                                        fontFamily:
                                            "Inter, Arial, sans-serif",
                                    }}
                                >
                                    <div
                                        style={{
                                            color: C.white,
                                            fontSize: 22,
                                            fontWeight: 900,
                                        }}
                                    >
                                        {[
                                            "A — F",
                                            "G — M",
                                            "N — Z",
                                        ][i]}
                                    </div>

                                    <div
                                        style={{
                                            marginTop: 8,
                                            color: C.muted,
                                            fontSize: 17,
                                            fontWeight: 700,
                                        }}
                                    >
                                        SHARD KEY
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {Array.from({ length: 12 }).map((_, i) => {
                        const target = i % 3;

                        return (
                            <Packet
                                key={i}
                                x1={500}
                                y1={420}
                                x2={190 + target * 295}
                                y2={620}
                                delay={i * 8}
                                duration={55}
                                color={
                                    [
                                        C.cyan,
                                        C.green,
                                        C.purple,
                                    ][target]
                                }
                                size={13}
                            />
                        );
                    })}

                    <div
                        style={{
                            position: "absolute",
                            left: 90,
                            bottom: 120,
                        }}
                    >
                        <Label color={C.purple}>
                            HORIZONTAL SCALING
                        </Label>

                        <Caption>
                            More data + more write capacity
                        </Caption>
                    </div>

                    {frame > 150 && (
                        <div
                            style={{
                                position: "absolute",
                                right: 80,
                                bottom: 120,
                                textAlign: "right",
                            }}
                        >
                            <Label color={C.red}>
                                ⚠️ COMPLEXITY
                            </Label>

                            <Caption>
                                Cross-shard queries · hotspots ·
                                rebalancing
                            </Caption>
                        </div>
                    )}
                </>
            )}
        </AbsoluteFill>
    );
};

// ============================================================
// ENDING / CTA
// ============================================================

const Ending: React.FC = () => {
    const frame = useCurrentFrame();

    const items = [
        ["1", "Index", C.cyan],
        ["2", "Materialize", C.purple],
        ["3", "Denormalize", C.orange],
        ["4", "Cache", C.green],
        ["5", "Scale Up", C.yellow],
        ["6", "Replicate", C.pink],
        ["7", "Shard", C.purple],
    ] as const;

    return (
        <AbsoluteFill>
            <div
                style={{
                    position: "absolute",
                    left: 70,
                    top: 130,
                    right: 70,
                    textAlign: "center",
                    ...slideUp(frame, 0, 70),
                }}
            >
                <Label color={C.green}>
                    THE GOLDEN RULE
                </Label>

                <div style={{ marginTop: 25 }}>
                    <BigTitle size={65}>
                        Don't jump straight
                    </BigTitle>

                    <BigTitle size={75} color={C.purple}>
                        to sharding.
                    </BigTitle>
                </div>

                <div
                    style={{
                        marginTop: 30,
                        padding: "0 40px",
                    }}
                >
                    <Caption size={28}>
                        Find the bottleneck first.
                        Then choose the simplest strategy
                        that solves it.
                    </Caption>
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 70,
                    top: 650,
                    right: 70,
                }}
            >
                {items.map(([num, label, color], i) => {
                    const p = pop(frame, i * 9, 18);

                    return (
                        <div
                            key={num}
                            style={{
                                height: 65,
                                marginBottom: 12,
                                borderRadius: 18,
                                background:
                                    "rgba(16,36,58,0.8)",
                                border: `2px solid ${color}`,
                                display: "flex",
                                alignItems: "center",
                                padding: "0 22px",
                                opacity: p,
                                transform: `translateX(${(1 - p) * 80}px)`,
                            }}
                        >
                            <div
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 12,
                                    background: color,
                                    color: C.bg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 900,
                                }}
                            >
                                {num}
                            </div>

                            <div
                                style={{
                                    marginLeft: 18,
                                    color: C.white,
                                    fontSize: 23,
                                    fontWeight: 800,
                                }}
                            >
                                {label}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 70,
                    right: 70,
                    bottom: 100,
                    textAlign: "center",
                    ...slideUp(frame, 75, 60),
                }}
            >
                <Label color={C.cyan}>
                    AI HUB INSIDER
                </Label>

                <div style={{ marginTop: 12 }}>
                    <Caption size={25}>
                        Follow for more system design breakdowns.
                    </Caption>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// SECTIONS
// ============================================================

type Section = {
    id: string;
    audio: string;
    duration: number;
    component: React.ReactNode;
};

const sections: Section[] = [
    {
        id: "hook",
        audio: staticFile(
            "audio/database-scaling/hook.mp3"
        ),
        duration: 7.569705,
        component: <Hook />,
    },
    {
        id: "indexing",
        audio: staticFile(
            "audio/database-scaling/indexing.mp3"
        ),
        duration: 13.096054,
        component: <Indexing />,
    },
    {
        id: "materialized",
        audio: staticFile(
            "audio/database-scaling/materialized.mp3"
        ),
        duration: 17.925805,
        component: <Materialized />,
    },
    {
        id: "denormalization",
        audio: staticFile(
            "audio/database-scaling/denormalization.mp3"
        ),
        duration: 14.675011,
        component: <Denormalization />,
    },
    {
        id: "vertical",
        audio: staticFile(
            "audio/database-scaling/vertical.mp3"
        ),
        duration: 14.582132,
        component: <VerticalScaling />,
    },
    {
        id: "caching",
        audio: staticFile(
            "audio/database-scaling/caching.mp3"
        ),
        duration: 16.021769,
        component: <Caching />,
    },
    {
        id: "replication",
        audio: staticFile(
            "audio/database-scaling/replication.mp3"
        ),
        duration: 12.306576,
        component: <Replication />,
    },
    {
        id: "sharding",
        audio: staticFile(
            "audio/database-scaling/sharding.mp3"
        ),
        duration: 15.18585,
        component: <Sharding />,
    },
    {
        id: "ending",
        audio: staticFile(
            "audio/database-scaling/ending.mp3"
        ),
        duration: 10.866939,
        component: <Ending />,
    },
];

// ============================================================
// TOTAL DURATION
// ============================================================

export const DATABASE_SCALING_DURATION_IN_FRAMES = Math.ceil(
    sections.reduce((sum, section) => sum + section.duration, 0) * 30
);

// ============================================================
// MAIN SCENE
// ============================================================

export const DatabaseScalingScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    let elapsed = 0;

    const currentSection = sections.find((section) => {
        const start = elapsed;
        elapsed += section.duration;

        const startFrame = Math.round(start * fps);
        const endFrame = Math.round(
            (start + section.duration) * fps
        );

        return frame >= startFrame && frame < endFrame;
    });

    elapsed = 0;

    return (
        <AbsoluteFill
            style={{
                backgroundColor: C.bg,
                overflow: "hidden",
            }}
        >
            <Background />

            {/* ==================================================
                VISUAL SEQUENCES

                Each section gets its own Sequence.

                This is important because:
                useCurrentFrame() becomes LOCAL to the section.
                ================================================== */}

            {sections.map((section) => {
                const startSeconds = sections
                    .slice(
                        0,
                        sections.findIndex(
                            (s) => s.id === section.id
                        )
                    )
                    .reduce(
                        (sum, s) => sum + s.duration,
                        0
                    );

                const from = Math.round(
                    startSeconds * fps
                );

                const durationInFrames = Math.ceil(
                    section.duration * fps
                );

                return (
                    <Sequence
                        key={`visual-${section.id}`}
                        from={from}
                        durationInFrames={durationInFrames}
                    >
                        <AbsoluteFill>
                            {section.component}
                        </AbsoluteFill>
                    </Sequence>
                );
            })}

            {/* ==================================================
                AUDIO

                IMPORTANT:
                DO NOT render only currentSection.audio.

                Every audio track exists at its absolute timeline
                position, so Remotion renders the entire narration.
                ================================================== */}

            {sections.map((section, index) => {
                const startSeconds = sections
                    .slice(0, index)
                    .reduce(
                        (sum, s) => sum + s.duration,
                        0
                    );

                const from = Math.round(
                    startSeconds * fps
                );

                const durationInFrames = Math.ceil(
                    section.duration * fps
                );

                return (
                    <Sequence
                        key={`audio-${section.id}`}
                        from={from}
                        durationInFrames={durationInFrames}
                    >
                        <Audio
                            src={section.audio}
                            startFrom={0}
                        />
                    </Sequence>
                );
            })}

            {/* ==================================================
                TOP BRAND
                ================================================== */}

            <div
                style={{
                    position: "absolute",
                    top: 28,
                    left: 40,
                    fontFamily: "Inter, Arial, sans-serif",
                    fontSize: 17,
                    fontWeight: 900,
                    color: C.dim,
                    letterSpacing: 2,
                    zIndex: 100,
                }}
            >
                AI HUB INSIDER
            </div>

            {/* ==================================================
                PROGRESS
                ================================================== */}

            <div
                style={{
                    position: "absolute",
                    left: 40,
                    right: 40,
                    bottom: 28,
                    height: 5,
                    borderRadius: 5,
                    background: "rgba(255,255,255,0.08)",
                    zIndex: 100,
                }}
            >
                <div
                    style={{
                        width: `${clamp(
                            frame /
                            DATABASE_SCALING_DURATION_IN_FRAMES
                        ) * 100}%`,
                        height: "100%",
                        borderRadius: 5,
                        background: C.cyan,
                        boxShadow: glow(C.cyan, 12),
                    }}
                />
            </div>

            {/* section indicator */}

            {currentSection && (
                <div
                    style={{
                        position: "absolute",
                        right: 40,
                        top: 28,
                        fontFamily:
                            "Inter, Arial, sans-serif",
                        fontSize: 15,
                        fontWeight: 800,
                        color: C.dim,
                        letterSpacing: 1,
                        zIndex: 100,
                    }}
                >
                    {currentSection.id.toUpperCase()}
                </div>
            )}
        </AbsoluteFill>
    );
};

export default DatabaseScalingScene;