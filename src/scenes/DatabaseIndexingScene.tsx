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

import { createTimeline } from "../timeline";
import { databaseIndexing } from "../../content/database-indexing";


// ============================================================
// COLORS
// ============================================================

const C = {
    bg: "#07111F",
    bg2: "#0B1626",
    panel: "#0C1A2C",

    cyan: "#4DB8FF",
    green: "#1FD1A5",
    purple: "#9B7CFF",
    orange: "#FFB86C",
    red: "#FF5C7A",
    pink: "#FF6B9D",

    white: "#F4F7FB",
    muted: "#71859C",
    dim: "#31445B",

    grid: "#16304A",
};


// ============================================================
// HELPERS
// ============================================================

const clamp = (v: number) => Math.max(0, Math.min(1, v));

const fadeIn = (
    frame: number,
    start: number,
    duration = 15,
) => {
    return interpolate(
        frame,
        [start, start + duration],
        [0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        },
    );
};

function popIn(
    frame: number,
    fps: number,
    delay = 0,
) {
    return spring({
        frame: Math.max(0, frame - delay),
        fps,
        config: {
            damping: 14,
            stiffness: 150,
            mass: 0.7,
        },
    });
}


// ============================================================
// BACKGROUND
// ============================================================

function Background() {
    const frame = useCurrentFrame();

    const drift = interpolate(
        frame,
        [0, 2100],
        [0, 80],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        },
    );

    return (
        <AbsoluteFill
            style={{
                background: `
                    radial-gradient(
                        circle at ${25 + drift * 0.03}% 25%,
                        rgba(77,184,255,0.10),
                        transparent 32%
                    ),
                    radial-gradient(
                        circle at ${80 - drift * 0.02}% 75%,
                        rgba(155,124,255,0.08),
                        transparent 30%
                    ),
                    linear-gradient(
                        180deg,
                        ${C.bg},
                        ${C.bg2}
                    )
                `,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.22,
                    backgroundImage: `
                        linear-gradient(${C.grid} 1px, transparent 1px),
                        linear-gradient(90deg, ${C.grid} 1px, transparent 1px)
                    `,
                    backgroundSize: "72px 72px",
                    transform: `translate(${drift * 0.15}px, ${drift * 0.08}px)`,
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    left: -250,
                    top: 500,
                    background: C.cyan,
                    opacity: 0.035,
                    filter: "blur(100px)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    right: -250,
                    bottom: 350,
                    background: C.purple,
                    opacity: 0.04,
                    filter: "blur(100px)",
                }}
            />
        </AbsoluteFill>
    );
}


// ============================================================
// TOP LABEL
// ============================================================

function SectionLabel({
    label = "DATABASE INDEXING",
    color = C.cyan,
}: {
    label?: string;
    color?: string;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = fadeIn(frame, 0, 12);

    const y = interpolate(
        popIn(frame, fps),
        [0, 1],
        [18, 0],
    );

    return (
        <div
            style={{
                position: "absolute",
                top: 90,
                left: 70,
                opacity,
                transform: `translateY(${y}px)`,
                display: "flex",
                alignItems: "center",
                gap: 14,
            }}
        >
            <div
                style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 18px ${color}`,
                }}
            />

            <div
                style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: 4,
                    color,
                }}
            >
                {label}
            </div>
        </div>
    );
}


// ============================================================
// TITLE
// ============================================================

function BigTitle({
    children,
    color = C.white,
}: {
    children: React.ReactNode;
    color?: string;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const s = popIn(frame, fps);

    return (
        <div
            style={{
                position: "absolute",
                top: 160,
                left: 70,
                right: 70,
                fontFamily: "Arial, sans-serif",
                fontSize: 58,
                lineHeight: 1.05,
                fontWeight: 900,
                color,
                transform: `
                    translateY(${interpolate(
                    s,
                    [0, 1],
                    [35, 0],
                )}px)
                    scale(${interpolate(
                    s,
                    [0, 1],
                    [0.94, 1],
                )})
                `,
                opacity: s,
                letterSpacing: -2,
            }}
        >
            {children}
        </div>
    );
}


// ============================================================
// CONNECTION
// ============================================================

function Connection({
    x1,
    y1,
    x2,
    y2,
    color = C.cyan,
    width = 5,
    opacity = 1,
    progress = 1,
    dashed = false,
}: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    width?: number;
    opacity?: number;
    progress?: number;
    dashed?: boolean;
}) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    const length = Math.sqrt(
        dx * dx + dy * dy,
    );

    const angle = Math.atan2(dy, dx);

    return (
        <div
            style={{
                position: "absolute",
                left: x1,
                top: y1,
                width: length * clamp(progress),
                height: width,
                transformOrigin: "0 50%",
                transform: `rotate(${angle}rad)`,
                borderRadius: width,
                background: dashed
                    ? `repeating-linear-gradient(
                        90deg,
                        ${color} 0px,
                        ${color} 12px,
                        transparent 12px,
                        transparent 24px
                    )`
                    : color,
                opacity,
                boxShadow: `0 0 18px ${color}66`,
            }}
        />
    );
}


// ============================================================
// PACKET
// ============================================================

function Packet({
    x,
    y,
    color = C.cyan,
    size = 18,
    pulse = true,
}: {
    x: number;
    y: number;
    color?: string;
    size?: number;
    pulse?: boolean;
}) {
    const frame = useCurrentFrame();

    const scale = pulse
        ? 1 + Math.sin(frame * 0.18) * 0.12
        : 1;

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
                transform: `scale(${scale})`,
                boxShadow: `
                    0 0 10px ${color},
                    0 0 30px ${color}88
                `,
            }}
        />
    );
}


// ============================================================
// NODE
// ============================================================

function GlowNode({
    x,
    y,
    size = 110,
    color = C.cyan,
    label,
    active = false,
}: {
    x: number;
    y: number;
    size?: number;
    color?: string;
    label: string;
    active?: boolean;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const s = popIn(frame, fps);

    return (
        <div
            style={{
                position: "absolute",
                left: x - size / 2,
                top: y - size / 2,
                width: size,
                height: size,
                borderRadius: 24,
                border: `2px solid ${active ? color : color + "55"
                    }`,
                background: active
                    ? `${color}18`
                    : `${C.panel}CC`,
                boxShadow: active
                    ? `
                        0 0 24px ${color}66,
                        inset 0 0 30px ${color}18
                    `
                    : `0 0 12px ${color}15`,
                transform: `scale(${s})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                fontFamily: "Arial, sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: active
                    ? C.white
                    : C.muted,
                padding: 12,
            }}
        >
            {label}
        </div>
    );
}


// ============================================================
// SECTION 1 — HOOK
// ============================================================

function HookScene() {
    const frame = useCurrentFrame();

    const packetX = interpolate(
        frame,
        [18, 70],
        [180, 780],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        },
    );

    const scan = interpolate(
        frame,
        [75, 190],
        [0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        },
    );

    const rows = Array.from({
        length: 9,
    });

    return (
        <AbsoluteFill>
            <SectionLabel />

            <BigTitle>
                A million rows.
                <br />
                <span style={{ color: C.orange }}>
                    You only need 20.
                </span>
            </BigTitle>

            <div
                style={{
                    position: "absolute",
                    left: 70,
                    right: 70,
                    top: 470,
                    height: 680,
                }}
            >
                <GlowNode
                    x={130}
                    y={330}
                    size={150}
                    color={C.cyan}
                    label="APP"
                    active
                />

                <Connection
                    x1={205}
                    y1={330}
                    x2={370}
                    y2={330}
                    color={C.cyan}
                    progress={clamp(
                        (frame - 8) / 30,
                    )}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 380,
                        top: 180,
                        width: 500,
                        height: 350,
                        borderRadius: 32,
                        border: `2px solid ${C.cyan}55`,
                        background: `${C.panel}CC`,
                        boxShadow: `0 0 40px ${C.cyan}12`,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            left: 35,
                            top: 25,
                            fontFamily: "Arial",
                            fontSize: 18,
                            fontWeight: 800,
                            color: C.muted,
                            letterSpacing: 2,
                        }}
                    >
                        ORDERS TABLE
                    </div>

                    {rows.map((_, i) => {
                        const y = 75 + i * 28;

                        const opacity =
                            interpolate(
                                scan,
                                [
                                    i / 10,
                                    (i + 1) / 10,
                                ],
                                [0.25, 1],
                                {
                                    extrapolateLeft:
                                        "clamp",
                                    extrapolateRight:
                                        "clamp",
                                },
                            );

                        return (
                            <div
                                key={i}
                                style={{
                                    position:
                                        "absolute",
                                    left: 35,
                                    right: 35,
                                    top: y,
                                    height: 17,
                                    borderRadius: 5,
                                    background:
                                        i === 7
                                            ? `${C.green}${Math.round(
                                                opacity * 255,
                                            )
                                                .toString(16)
                                                .padStart(
                                                    2,
                                                    "0",
                                                )}`
                                            : `${C.dim}${Math.round(
                                                opacity * 255,
                                            )
                                                .toString(16)
                                                .padStart(
                                                    2,
                                                    "0",
                                                )}`,
                                }}
                            />
                        );
                    })}
                </div>

                <Packet
                    x={packetX}
                    y={510}
                    color={
                        frame > 65
                            ? C.red
                            : C.cyan
                    }
                    size={22}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 385,
                        top: 570,
                        fontFamily: "monospace",
                        fontSize: 24,
                        color: C.red,
                        opacity:
                            frame > 65 ? 1 : 0,
                    }}
                >
                    FULL TABLE SCAN
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 385,
                        top: 615,
                        fontFamily: "Arial",
                        fontSize: 19,
                        color: C.muted,
                        opacity:
                            frame > 85 ? 1 : 0,
                    }}
                >
                    1,000,000 rows examined
                </div>
            </div>
        </AbsoluteFill>
    );
}


// ============================================================
// SECTION 2 — QUERY
// ============================================================

function QueryScene() {
    const frame = useCurrentFrame();

    const progress = clamp(
        (frame - 12) / 50,
    );

    const lines = [
        "SELECT *",
        "FROM orders",
        "WHERE user_id = ?",
        "  AND status = ?",
        "ORDER BY created_at DESC",
        "LIMIT 20;",
    ];

    return (
        <AbsoluteFill>
            <SectionLabel color={C.cyan} />

            <BigTitle>
                Start with the
                <br />
                <span style={{ color: C.cyan }}>
                    query.
                </span>
            </BigTitle>

            <div
                style={{
                    position: "absolute",
                    left: 70,
                    top: 390,
                    width: 940,
                    height: 690,
                    borderRadius: 32,
                    border: `1px solid ${C.cyan}35`,
                    background: `${C.panel}CC`,
                    overflow: "hidden",
                    boxShadow: `0 0 60px ${C.cyan}10`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 64,
                        borderBottom: `1px solid ${C.dim}`,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 28,
                        gap: 9,
                    }}
                >
                    {[C.red, C.orange, C.green].map(
                        (c, i) => (
                            <div
                                key={i}
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    background: c,
                                }}
                            />
                        ),
                    )}

                    <span
                        style={{
                            marginLeft: 14,
                            fontFamily: "monospace",
                            fontSize: 17,
                            color: C.muted,
                        }}
                    >
                        query.sql
                    </span>
                </div>

                {lines.map((line, i) => {
                    const active =
                        i === 2 ||
                        i === 3 ||
                        i === 4;

                    const x =
                        line.startsWith("  ")
                            ? 60
                            : 42;

                    return (
                        <div
                            key={i}
                            style={{
                                position:
                                    "absolute",
                                left: x,
                                top:
                                    115 + i * 68,
                                fontFamily:
                                    "monospace",
                                fontSize: 30,
                                fontWeight: 700,
                                color: active
                                    ? i === 4
                                        ? C.orange
                                        : C.cyan
                                    : C.white,
                                opacity:
                                    interpolate(
                                        progress,
                                        [
                                            i / 7,
                                            (i + 1) / 7,
                                        ],
                                        [0.2, 1],
                                        {
                                            extrapolateLeft:
                                                "clamp",
                                            extrapolateRight:
                                                "clamp",
                                        },
                                    ),
                            }}
                        >
                            {line}
                        </div>
                    );
                })}

                <div
                    style={{
                        position: "absolute",
                        left: 45,
                        right: 45,
                        bottom: 34,
                        height: 5,
                        background: C.dim,
                        borderRadius: 10,
                    }}
                >
                    <div
                        style={{
                            width: `${progress * 100}%`,
                            height: "100%",
                            background: C.cyan,
                            borderRadius: 10,
                            boxShadow: `0 0 16px ${C.cyan}`,
                        }}
                    />
                </div>
            </div>
        </AbsoluteFill>
    );
}


// ============================================================
// SECTION 3 — ACCESS PATTERN
// ============================================================

function AccessPatternScene() {
    const frame = useCurrentFrame();

    const branches = [
        {
            label: "user_id",
            sub: "EQUALITY",
            color: C.cyan,
            x: 250,
            y: 620,
        },
        {
            label: "status",
            sub: "EQUALITY",
            color: C.green,
            x: 540,
            y: 800,
        },
        {
            label: "created_at",
            sub: "ORDER",
            color: C.orange,
            x: 830,
            y: 620,
        },
    ];

    return (
        <AbsoluteFill>
            <SectionLabel color={C.green} />

            <BigTitle>
                What does the query
                <br />
                <span style={{ color: C.green }}>
                    actually need?
                </span>
            </BigTitle>

            <div
                style={{
                    position: "absolute",
                    left: 540,
                    top: 450,
                    width: 150,
                    height: 100,
                    marginLeft: -75,
                    borderRadius: 24,
                    border: `2px solid ${C.white}55`,
                    background: C.panel,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.white,
                    fontFamily: "Arial",
                    fontSize: 22,
                    fontWeight: 900,
                    boxShadow: `0 0 30px ${C.white}08`,
                }}
            >
                QUERY
            </div>

            {branches.map((b, i) => {
                const p = popIn(
                    frame,
                    30,
                    15 + i * 10,
                );

                return (
                    <React.Fragment
                        key={b.label}
                    >
                        <Connection
                            x1={540}
                            y1={550}
                            x2={b.x}
                            y2={b.y - 65}
                            color={b.color}
                            progress={p}
                        />

                        <GlowNode
                            x={b.x}
                            y={b.y}
                            size={155}
                            color={b.color}
                            label={b.label}
                            active={
                                frame >
                                20 + i * 10
                            }
                        />

                        <div
                            style={{
                                position:
                                    "absolute",
                                left: b.x - 100,
                                top: b.y + 100,
                                width: 200,
                                textAlign:
                                    "center",
                                fontFamily:
                                    "Arial",
                                fontSize: 20,
                                fontWeight: 900,
                                letterSpacing: 2,
                                color: b.color,
                                opacity: p,
                            }}
                        >
                            {b.sub}
                        </div>
                    </React.Fragment>
                );
            })}

            <div
                style={{
                    position: "absolute",
                    left: 150,
                    right: 150,
                    top: 1180,
                    height: 120,
                    borderTop: `2px solid ${C.dim}`,
                    borderBottom: `2px solid ${C.dim}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 22,
                    fontFamily: "Arial",
                    fontSize: 32,
                    fontWeight: 900,
                }}
            >
                <span style={{ color: C.cyan }}>
                    EQUALITY
                </span>

                <span style={{ color: C.muted }}>
                    +
                </span>

                <span style={{ color: C.green }}>
                    EQUALITY
                </span>

                <span style={{ color: C.muted }}>
                    +
                </span>

                <span style={{ color: C.orange }}>
                    ORDER
                </span>
            </div>
        </AbsoluteFill>
    );
}


// ============================================================
// SECTION 4 — CHOOSE INDEX
// ============================================================

function BTree({
    activePath = 0,
}: {
    activePath?: number;
}) {
    const frame = useCurrentFrame();

    const nodes = [
        { x: 540, y: 540, label: "50" },

        { x: 350, y: 740, label: "20" },
        { x: 540, y: 740, label: "50" },
        { x: 730, y: 740, label: "80" },

        { x: 255, y: 950, label: "12" },
        { x: 350, y: 950, label: "20" },
        { x: 445, y: 950, label: "35" },

        { x: 540, y: 950, label: "50" },
        { x: 635, y: 950, label: "65" },

        { x: 730, y: 950, label: "80" },
        { x: 825, y: 950, label: "92" },
    ];

    const edges = [
        [540, 540, 350, 740],
        [540, 540, 540, 740],
        [540, 540, 730, 740],

        [350, 740, 255, 950],
        [350, 740, 350, 950],
        [350, 740, 445, 950],

        [540, 740, 540, 950],
        [540, 740, 635, 950],

        [730, 740, 730, 950],
        [730, 740, 825, 950],
    ];

    const p = clamp(
        (frame - 25) / 80,
    );

    return (
        <>
            {edges.map((e, i) => (
                <Connection
                    key={i}
                    x1={e[0]}
                    y1={e[1]}
                    x2={e[2]}
                    y2={e[3]}
                    color={
                        i < 2 &&
                            activePath > 0
                            ? C.cyan
                            : C.dim
                    }
                    opacity={0.8}
                    progress={p}
                    width={4}
                />
            ))}

            {nodes.map((n, i) => (
                <GlowNode
                    key={i}
                    x={n.x}
                    y={n.y}
                    size={72}
                    color={
                        i === 0 ||
                            i === 1 ||
                            i === 5 ||
                            i === 8
                            ? C.cyan
                            : C.purple
                    }
                    label={n.label}
                    active={
                        i === 0 ||
                        i === 1 ||
                        i === 5 ||
                        i === 8
                    }
                />
            ))}

            <Packet
                x={interpolate(
                    frame,
                    [70, 105, 140],
                    [540, 350, 350],
                    {
                        extrapolateLeft:
                            "clamp",
                        extrapolateRight:
                            "clamp",
                    },
                )}
                y={interpolate(
                    frame,
                    [70, 105, 140],
                    [540, 740, 950],
                    {
                        extrapolateLeft:
                            "clamp",
                        extrapolateRight:
                            "clamp",
                    },
                )}
                color={C.orange}
                size={24}
            />
        </>
    );
}

function ChooseIndexScene() {
    return (
        <AbsoluteFill>
            <SectionLabel color={C.purple} />

            <BigTitle>
                Choose an index
                <br />
                <span style={{ color: C.purple }}>
                    from the access pattern.
                </span>
            </BigTitle>

            <BTree />

            <div
                style={{
                    position: "absolute",
                    bottom: 310,
                    left: 100,
                    right: 100,
                    textAlign: "center",
                    fontFamily: "Arial",
                    fontSize: 27,
                    fontWeight: 800,
                    color: C.white,
                }}
            >
                B-TREE

                <span
                    style={{
                        color: C.muted,
                        margin: "0 16px",
                    }}
                >
                    /
                </span>

                <span style={{ color: C.green }}>
                    DEFAULT STARTING POINT
                </span>
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: 230,
                    left: 120,
                    right: 120,
                    textAlign: "center",
                    fontFamily: "Arial",
                    fontSize: 19,
                    color: C.muted,
                }}
            >
                equality • range • ordering
            </div>
        </AbsoluteFill>
    );
}


// ============================================================
// SECTION 5 — COMPOSITE INDEX
// ============================================================

function CompositeIndexScene() {
    const frame = useCurrentFrame();

    const progress = clamp(
        (frame - 20) / 80,
    );

    const columns = [
        {
            label: "user_id",
            color: C.cyan,
            x: 160,
        },
        {
            label: "status",
            color: C.green,
            x: 405,
        },
        {
            label: "created_at",
            color: C.orange,
            x: 650,
        },
    ];

    const packetX = interpolate(
        frame,
        [70, 105, 140, 175],
        [110, 355, 600, 860],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        },
    );

    return (
        <AbsoluteFill>
            <SectionLabel color={C.orange} />

            <BigTitle>
                Multiple filters?
                <br />
                <span style={{ color: C.orange }}>
                    Think composite index.
                </span>
            </BigTitle>

            <div
                style={{
                    position: "absolute",
                    left: 110,
                    right: 110,
                    top: 700,
                    height: 9,
                    borderRadius: 20,
                    background: C.dim,
                }}
            >
                <div
                    style={{
                        width: `${progress * 100}%`,
                        height: "100%",
                        borderRadius: 20,
                        background: `
                            linear-gradient(
                                90deg,
                                ${C.cyan},
                                ${C.green},
                                ${C.orange}
                            )
                        `,
                        boxShadow: `0 0 25px ${C.cyan}66`,
                    }}
                />
            </div>

            {columns.map((col, i) => {
                const p = popIn(
                    frame,
                    30,
                    i * 12,
                );

                return (
                    <React.Fragment
                        key={col.label}
                    >
                        <div
                            style={{
                                position:
                                    "absolute",
                                left: col.x,
                                top: 575,
                                width: 210,
                                height: 170,
                                borderRadius: 26,
                                border: `2px solid ${col.color}`,
                                background: `${col.color}12`,
                                boxShadow: `0 0 30px ${col.color}22`,
                                transform: `translateY(${interpolate(
                                    p,
                                    [0, 1],
                                    [50, 0],
                                )}px)`,
                                opacity: p,
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                flexDirection:
                                    "column",
                                fontFamily:
                                    "Arial",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 25,
                                    fontWeight: 900,
                                    color: col.color,
                                }}
                            >
                                {i + 1}
                            </div>

                            <div
                                style={{
                                    marginTop: 14,
                                    fontSize: 23,
                                    fontWeight: 800,
                                    color: C.white,
                                }}
                            >
                                {col.label}
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}

            <Packet
                x={packetX}
                y={704}
                color={C.white}
                size={24}
            />

            <div
                style={{
                    position: "absolute",
                    left: 120,
                    right: 120,
                    top: 930,
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 18,
                    fontFamily: "monospace",
                    fontSize: 27,
                    fontWeight: 800,
                }}
            >
                <span style={{ color: C.cyan }}>
                    (user_id
                </span>

                <span style={{ color: C.green }}>
                    , status
                </span>

                <span style={{ color: C.orange }}>
                    , created_at)
                </span>
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: 290,
                    left: 90,
                    right: 90,
                    textAlign: "center",
                    fontFamily: "Arial",
                    fontSize: 24,
                    color: C.muted,
                }}
            >
                Filter first → then preserve the required order
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 170,
                    top: 1200,
                    width: 740,
                    height: 170,
                    borderTop: `2px solid ${C.green}`,
                    borderBottom: `2px solid ${C.green}`,
                    opacity: progress,
                }}
            >
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: 30,
                            right: 30,
                            top: 25 + i * 42,
                            height: 20,
                            borderRadius: 8,
                            background: `${C.green}55`,
                        }}
                    />
                ))}

                <div
                    style={{
                        position: "absolute",
                        right: 25,
                        top: 60,
                        fontFamily: "Arial",
                        fontSize: 21,
                        fontWeight: 900,
                        color: C.green,
                    }}
                >
                    TOP 20 ROWS
                </div>
            </div>
        </AbsoluteFill>
    );
}


// ============================================================
// SECTION 6 — EXPLAIN
// ============================================================

function ExplainScene() {
    const frame = useCurrentFrame();

    const before = clamp(
        (frame - 10) / 55,
    );

    const after = clamp(
        (frame - 70) / 55,
    );

    return (
        <AbsoluteFill>
            <SectionLabel color={C.red} />

            <BigTitle>
                Don't trust the index.
                <br />
                <span style={{ color: C.red }}>
                    Verify it.
                </span>
            </BigTitle>

            <div
                style={{
                    position: "absolute",
                    left: 70,
                    top: 440,
                    width: 400,
                    height: 620,
                    borderRadius: 30,
                    border: `2px solid ${C.red}55`,
                    background: `${C.panel}CC`,
                    opacity:
                        1 - after * 0.35,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 30,
                        top: 28,
                        fontFamily: "Arial",
                        fontSize: 20,
                        fontWeight: 900,
                        letterSpacing: 3,
                        color: C.red,
                    }}
                >
                    BEFORE
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 50,
                        right: 50,
                        top: 150,
                        height: 280,
                        borderRadius: 20,
                        border: `2px solid ${C.red}33`,
                        overflow: "hidden",
                    }}
                >
                    {Array.from({
                        length: 12,
                    }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position:
                                    "absolute",
                                left: 25,
                                right: 25,
                                top:
                                    20 + i * 21,
                                height: 11,
                                borderRadius: 5,
                                background:
                                    i <
                                        before * 12
                                        ? C.red
                                        : C.dim,
                                opacity: 0.8,
                            }}
                        />
                    ))}
                </div>

                <div
                    style={{
                        position: "absolute",
                        bottom: 105,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        fontFamily: "monospace",
                        fontSize: 22,
                        fontWeight: 800,
                        color: C.red,
                    }}
                >
                    FULL SCAN
                </div>

                <div
                    style={{
                        position: "absolute",
                        bottom: 55,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        fontFamily: "Arial",
                        fontSize: 18,
                        color: C.muted,
                    }}
                >
                    1,000,000 rows
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    right: 70,
                    top: 440,
                    width: 400,
                    height: 620,
                    borderRadius: 30,
                    border: `2px solid ${C.green}66`,
                    background: `${C.panel}CC`,
                    opacity:
                        0.45 + after * 0.55,
                    transform: `translateY(${interpolate(
                        after,
                        [0, 1],
                        [70, 0],
                    )}px)`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 30,
                        top: 28,
                        fontFamily: "Arial",
                        fontSize: 20,
                        fontWeight: 900,
                        letterSpacing: 3,
                        color: C.green,
                    }}
                >
                    AFTER
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 50,
                        right: 50,
                        top: 150,
                        height: 130,
                        borderRadius: 20,
                        border: `2px solid ${C.green}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "monospace",
                        fontSize: 22,
                        fontWeight: 900,
                        color: C.green,
                        boxShadow: `0 0 25px ${C.green}22`,
                    }}
                >
                    INDEX
                </div>

                <Connection
                    x1={200}
                    y1={280}
                    x2={200}
                    y2={360}
                    color={C.green}
                    progress={after}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 50,
                        right: 50,
                        top: 360,
                        height: 80,
                        borderRadius: 18,
                        background: `${C.green}18`,
                        border: `1px solid ${C.green}55`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Arial",
                        fontSize: 22,
                        fontWeight: 900,
                        color: C.green,
                    }}
                >
                    20 ROWS
                </div>

                <Packet
                    x={200}
                    y={325}
                    color={C.green}
                    size={20}
                    pulse={frame > 70}
                />

                <div
                    style={{
                        position: "absolute",
                        bottom: 70,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        fontFamily: "monospace",
                        fontSize: 20,
                        fontWeight: 800,
                        color: C.green,
                    }}
                >
                    INDEX SCAN
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: 250,
                    left: 100,
                    right: 100,
                    textAlign: "center",
                    fontFamily: "monospace",
                    fontSize: 25,
                    fontWeight: 800,
                    color: C.white,
                }}
            >
                EXPLAIN / EXPLAIN ANALYZE
            </div>
        </AbsoluteFill>
    );
}


// ============================================================
// SECTION 7 — MEASURE
// ============================================================

function Metric({
    x,
    y,
    label,
    before,
    after,
    color,
}: {
    x: number;
    y: number;
    label: string;
    before: string;
    after: string;
    color: string;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const p = popIn(frame, fps);

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 880,
                height: 190,
                borderLeft: `5px solid ${color}`,
                background: `${C.panel}AA`,
                borderRadius: 20,
                transform: `translateX(${interpolate(
                    p,
                    [0, 1],
                    [70, 0],
                )}px)`,
                opacity: p,
                padding: "24px 30px",
                boxSizing: "border-box",
                fontFamily: "Arial",
            }}
        >
            <div
                style={{
                    fontSize: 20,
                    fontWeight: 900,
                    letterSpacing: 2,
                    color: C.muted,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    marginTop: 24,
                }}
            >
                <span
                    style={{
                        fontFamily: "monospace",
                        fontSize: 27,
                        fontWeight: 800,
                        color: C.red,
                    }}
                >
                    {before}
                </span>

                <span
                    style={{
                        fontSize: 28,
                        color: C.muted,
                    }}
                >
                    →
                </span>

                <span
                    style={{
                        fontFamily: "monospace",
                        fontSize: 30,
                        fontWeight: 900,
                        color,
                    }}
                >
                    {after}
                </span>
            </div>
        </div>
    );
}

function MeasureScene() {
    return (
        <AbsoluteFill>
            <SectionLabel color={C.green} />

            <BigTitle>
                Measure the
                <br />
                <span style={{ color: C.green }}>
                    real result.
                </span>
            </BigTitle>

            <Metric
                x={100}
                y={470}
                label="EXECUTION TIME"
                before="420 ms"
                after="8 ms"
                color={C.green}
            />

            <Metric
                x={100}
                y={700}
                label="ROWS EXAMINED"
                before="1,000,000"
                after="20"
                color={C.cyan}
            />

            <Metric
                x={100}
                y={930}
                label="EXECUTION PLAN"
                before="FULL SCAN"
                after="INDEX"
                color={C.orange}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: 260,
                    left: 120,
                    right: 120,
                    textAlign: "center",
                    fontFamily: "Arial",
                    fontSize: 17,
                    color: C.muted,
                }}
            >
                Illustrative example — actual results depend on your data,
                database, and workload.
            </div>
        </AbsoluteFill>
    );
}


// ============================================================
// SECTION 8 — TRADEOFF
// ============================================================

function TradeoffScene() {
    const frame = useCurrentFrame();

    const left = clamp(
        (frame - 20) / 50,
    );

    const right = clamp(
        (frame - 65) / 50,
    );

    return (
        <AbsoluteFill>
            <SectionLabel color={C.orange} />

            <BigTitle>
                Indexes are powerful.
                <br />
                <span style={{ color: C.orange }}>
                    But they're not free.
                </span>
            </BigTitle>

            <div
                style={{
                    position: "absolute",
                    left: 80,
                    top: 500,
                    width: 420,
                    height: 520,
                    borderRadius: 30,
                    border: `2px solid ${C.green}66`,
                    background: `${C.green}0C`,
                    transform: `translateY(${interpolate(
                        left,
                        [0, 1],
                        [50, 0],
                    )}px)`,
                    opacity: left,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 50,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        fontFamily: "Arial",
                        fontSize: 30,
                        fontWeight: 900,
                        color: C.green,
                    }}
                >
                    READ
                </div>

                <Connection
                    x1={100}
                    y1={260}
                    x2={320}
                    y2={260}
                    color={C.green}
                    progress={left}
                    width={8}
                />

                <Packet
                    x={interpolate(
                        frame,
                        [40, 90],
                        [100, 320],
                        {
                            extrapolateLeft:
                                "clamp",
                            extrapolateRight:
                                "clamp",
                        },
                    )}
                    y={260}
                    color={C.green}
                    size={24}
                />

                <div
                    style={{
                        position: "absolute",
                        bottom: 85,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        fontFamily: "Arial",
                        fontSize: 24,
                        fontWeight: 800,
                        color: C.white,
                    }}
                >
                    FASTER
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    right: 80,
                    top: 500,
                    width: 420,
                    height: 520,
                    borderRadius: 30,
                    border: `2px solid ${C.red}66`,
                    background: `${C.red}0C`,
                    transform: `translateY(${interpolate(
                        right,
                        [0, 1],
                        [50, 0],
                    )}px)`,
                    opacity: right,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 50,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        fontFamily: "Arial",
                        fontSize: 30,
                        fontWeight: 900,
                        color: C.red,
                    }}
                >
                    WRITE
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 70,
                        top: 200,
                        width: 120,
                        height: 120,
                        borderRadius: 20,
                        border: `2px solid ${C.red}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Arial",
                        fontWeight: 900,
                        color: C.white,
                    }}
                >
                    ROW
                </div>

                <div
                    style={{
                        position: "absolute",
                        right: 60,
                        top: 200,
                        width: 140,
                        height: 120,
                        borderRadius: 20,
                        border: `2px solid ${C.orange}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Arial",
                        fontWeight: 900,
                        color: C.orange,
                    }}
                >
                    INDEX
                </div>

                <Connection
                    x1={190}
                    y1={260}
                    x2={350}
                    y2={260}
                    color={C.red}
                    progress={right}
                />

                <div
                    style={{
                        position: "absolute",
                        bottom: 85,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        fontFamily: "Arial",
                        fontSize: 22,
                        fontWeight: 800,
                        color: C.white,
                    }}
                >
                    MORE MAINTENANCE
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: 260,
                    left: 100,
                    right: 100,
                    textAlign: "center",
                    fontFamily: "Arial",
                    fontSize: 23,
                    color: C.muted,
                }}
            >
                storage + insert/update overhead
            </div>
        </AbsoluteFill>
    );
}


// ============================================================
// SECTION 9 — FINAL
// ============================================================

function FinalScene() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const p = popIn(frame, fps);

    const steps = [
        {
            n: "01",
            label: "DESIGN",
            sub: "from access patterns",
            color: C.cyan,
        },
        {
            n: "02",
            label: "VERIFY",
            sub: "with EXPLAIN",
            color: C.purple,
        },
        {
            n: "03",
            label: "MEASURE",
            sub: "the real result",
            color: C.green,
        },
    ];

    return (
        <AbsoluteFill>
            <SectionLabel color={C.cyan} />

            <BigTitle>
                The rule is simple.
            </BigTitle>

            <div
                style={{
                    position: "absolute",
                    left: 100,
                    right: 100,
                    top: 470,
                }}
            >
                {steps.map((step, i) => {
                    const local = popIn(
                        frame,
                        fps,
                        15 + i * 15,
                    );

                    return (
                        <React.Fragment
                            key={step.label}
                        >
                            {i > 0 && (
                                <Connection
                                    x1={270}
                                    y1={
                                        i * 300 - 55
                                    }
                                    x2={810}
                                    y2={
                                        i * 300 - 55
                                    }
                                    color={C.dim}
                                    progress={local}
                                />
                            )}

                            <div
                                style={{
                                    height: 220,
                                    marginBottom: 70,
                                    borderRadius: 32,
                                    border: `2px solid ${step.color}66`,
                                    background: `${step.color}0D`,
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    padding:
                                        "0 45px",
                                    boxSizing:
                                        "border-box",
                                    transform: `translateX(${interpolate(
                                        local,
                                        [0, 1],
                                        [80, 0],
                                    )}px)`,
                                    opacity: local,
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily:
                                            "monospace",
                                        fontSize: 28,
                                        fontWeight: 900,
                                        color: step.color,
                                        width: 90,
                                    }}
                                >
                                    {step.n}
                                </div>

                                <div>
                                    <div
                                        style={{
                                            fontFamily:
                                                "Arial",
                                            fontSize: 40,
                                            fontWeight: 900,
                                            color: C.white,
                                        }}
                                    >
                                        {step.label}
                                    </div>

                                    <div
                                        style={{
                                            marginTop: 10,
                                            fontFamily:
                                                "Arial",
                                            fontSize: 21,
                                            color: C.muted,
                                        }}
                                    >
                                        {step.sub}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        marginLeft:
                                            "auto",
                                        width: 95,
                                        height: 95,
                                        borderRadius:
                                            "50%",
                                        border: `3px solid ${step.color}`,
                                        boxShadow: `0 0 30px ${step.color}44`,
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        color: step.color,
                                        fontSize: 34,
                                        fontWeight: 900,
                                    }}
                                >
                                    →
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: 210,
                    left: 80,
                    right: 80,
                    textAlign: "center",
                    fontFamily: "Arial",
                    fontSize: 25,
                    fontWeight: 800,
                    color: C.white,
                    opacity: p,
                }}
            >
                Design indexes for your access patterns.
            </div>
        </AbsoluteFill>
    );
}


// ============================================================
// MAIN SCENE
// ============================================================

export const DatabaseIndexingScene: React.FC = () => {
    const timeline = createTimeline(
        databaseIndexing,
    );

    return (
        <AbsoluteFill
            style={{
                background: C.bg,
                overflow: "hidden",
            }}
        >
            <Background />

            {timeline.sections.map(
                (section) => {
                    const Component =
                        section.id === "hook"
                            ? HookScene
                            : section.id === "query"
                                ? QueryScene
                                : section.id ===
                                    "access-pattern"
                                    ? AccessPatternScene
                                    : section.id ===
                                        "choose-index"
                                        ? ChooseIndexScene
                                        : section.id ===
                                            "composite-index"
                                            ? CompositeIndexScene
                                            : section.id ===
                                                "explain"
                                                ? ExplainScene
                                                : section.id ===
                                                    "measure"
                                                    ? MeasureScene
                                                    : section.id ===
                                                        "tradeoff"
                                                        ? TradeoffScene
                                                        : FinalScene;

                    return (
                        <Sequence
                            key={section.id}
                            from={section.start}
                            durationInFrames={
                                section.duration
                            }
                        >
                            {/* =====================================================
                                AUDIO
                                Each section gets its own audio track.
                                The audio starts exactly when this Sequence starts.
                            ===================================================== */}
                            <Audio
                                src={staticFile(
                                    section.audio,
                                )}
                                volume={1}
                                playbackRate={1}
                            />

                            {/* =====================================================
                                VISUAL
                                The visual section and its audio share the same
                                Sequence, so they stay synchronized.
                            ===================================================== */}
                            <Component />
                        </Sequence>
                    );
                },
            )}
        </AbsoluteFill>
    );
};