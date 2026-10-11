import React from "react";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    interpolate,
    staticFile,
    useCurrentFrame,
} from "remotion";

import { createTimeline } from "../timeline";
import { databaseDeadlocks } from "../../content/database-deadlocks";

// =====================================================
// COLORS
// =====================================================

const BG = "#0B1220";
const BG_DARK = "#060B14";
const NAVY = "#111C2E";

const BLUE = "#4DB8FF";
const CYAN = "#28D7FF";
const GREEN = "#1FD1A5";
const RED = "#FF5C70";
const ORANGE = "#FFB86C";
const PURPLE = "#9B7CFF";
const PINK = "#FF6B9D";

const WHITE = "#F4F7FB";
const MUTED = "#8FA3B8";
const BORDER = "rgba(255,255,255,0.10)";
const CARD = "rgba(18,31,50,0.88)";

// =====================================================
// SHARED TIMELINE
// =====================================================

const databaseDeadlocksTimeline =
    createTimeline(databaseDeadlocks);

// =====================================================
// HELPERS
// =====================================================

const clamp = (
    value: number,
    min = 0,
    max = 1
) => Math.min(max, Math.max(min, value));

const fade = (
    frame: number,
    start: number,
    duration: number
) =>
    interpolate(
        frame,
        [start, start + duration],
        [0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

const slideX = (
    frame: number,
    start: number,
    distance = 100,
    duration = 18
) =>
    interpolate(
        frame,
        [start, start + duration],
        [distance, 0],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

const scaleIn = (
    frame: number,
    start: number,
    duration = 18
) =>
    interpolate(
        frame,
        [start, start + duration],
        [0.82, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

const pulse = (
    frame: number,
    speed = 0.12,
    amount = 0.08
) =>
    1 +
    Math.sin(frame * speed) * amount;

// =====================================================
// BACKGROUND
// =====================================================

const Background: React.FC = () => {
    const frame = useCurrentFrame();

    const glow1 = interpolate(
        Math.sin(frame * 0.025),
        [-1, 1],
        [0.20, 0.38]
    );

    const glow2 = interpolate(
        Math.sin(frame * 0.018 + 2),
        [-1, 1],
        [0.15, 0.30]
    );

    return (
        <AbsoluteFill
            style={{
                background:
                    "radial-gradient(circle at 50% 25%, #172A46 0%, #0B1220 42%, #050912 100%)",
                overflow: "hidden",
            }}
        >
            {/* Cyan glow */}
            <div
                style={{
                    position: "absolute",
                    width: 650,
                    height: 650,
                    borderRadius: "50%",
                    left: -280,
                    top: 180,
                    background: `rgba(40, 215, 255, ${glow1})`,
                    filter: "blur(140px)",
                    opacity: 0.45,
                }}
            />

            {/* Purple glow */}
            <div
                style={{
                    position: "absolute",
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    right: -320,
                    top: 600,
                    background: `rgba(155, 124, 255, ${glow2})`,
                    filter: "blur(160px)",
                    opacity: 0.35,
                }}
            />

            {/* Green glow */}
            <div
                style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    left: 250,
                    bottom: -250,
                    background: "rgba(31,209,165,0.12)",
                    filter: "blur(140px)",
                }}
            />

            {/* Grid */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.07,
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                    transform: `translateY(${(frame * 0.15) % 80}px)`,
                }}
            />

            {/* Vignette */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(circle, transparent 35%, rgba(3,7,14,0.58) 100%)",
                }}
            />
        </AbsoluteFill>
    );
};

// =====================================================
// GLOW
// =====================================================

const Glow: React.FC<{
    color: string;
    size?: number;
    opacity?: number;
}> = ({
    color,
    size = 300,
    opacity = 0.22,
}) => {
        return (
            <div
                style={{
                    position: "absolute",
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    background: color,
                    filter: "blur(100px)",
                    opacity,
                    pointerEvents: "none",
                }}
            />
        );
    };

// =====================================================
// SECTION LABEL
// =====================================================

const SectionLabel: React.FC<{
    text: string;
    color?: string;
}> = ({
    text,
    color = CYAN,
}) => {
        return (
            <div
                style={{
                    position: "absolute",
                    top: 100,
                    left: 70,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                }}
            >
                <div
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: color,
                        boxShadow: `0 0 18px ${color} `,
                    }}
                />

                <div
                    style={{
                        fontSize: 26,
                        fontWeight: 800,
                        letterSpacing: 3,
                        color,
                        textTransform: "uppercase",
                    }}
                >
                    {text}
                </div>
            </div>
        );
    };

// =====================================================
// SERVICE
// =====================================================

const Service: React.FC<{
    x: number;
    y: number;
    label: string;
    color: string;
    scale?: number;
}> = ({
    x,
    y,
    label,
    color,
    scale = 1,
}) => {
        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 230,
                    height: 125,
                    borderRadius: 22,
                    background:
                        "linear-gradient(145deg, rgba(28,47,72,0.96), rgba(12,22,37,0.96))",
                    border: `2px solid ${color} `,
                    boxShadow: `0 0 35px ${color} 33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${scale})`,
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        fontSize: 28,
                        fontWeight: 800,
                        color: WHITE,
                    }}
                >
                    {label}
                </div>
            </div>
        );
    };

// =====================================================
// DATABASE
// =====================================================

const Database: React.FC<{
    x: number;
    y: number;
    label?: string;
    color?: string;
    scale?: number;
}> = ({
    x,
    y,
    label = "DATABASE",
    color = BLUE,
    scale = 1,
}) => {
        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 260,
                    height: 170,
                    transform: `scale(${scale})`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 20,
                        width: 260,
                        height: 115,
                        borderLeft: `3px solid ${color} `,
                        borderRight: `3px solid ${color} `,
                        background:
                            "linear-gradient(90deg, rgba(17,32,52,0.96), rgba(8,18,31,0.96))",
                        boxShadow: `0 0 40px ${color} 2A`,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 260,
                        height: 50,
                        borderRadius: "50%",
                        background: NAVY,
                        border: `3px solid ${color} `,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 110,
                        width: 260,
                        height: 50,
                        borderRadius: "50%",
                        border: `3px solid ${color} `,
                        background: "rgba(8,18,31,0.98)",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 26,
                        fontWeight: 900,
                        color: WHITE,
                        letterSpacing: 1,
                    }}
                >
                    {label}
                </div>
            </div>
        );
    };

// =====================================================
// LOCK
// =====================================================

const Lock: React.FC<{
    x: number;
    y: number;
    color?: string;
    scale?: number;
}> = ({
    x,
    y,
    color = RED,
    scale = 1,
}) => {
        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 100,
                    height: 110,
                    transform: `scale(${scale})`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 24,
                        top: 42,
                        width: 52,
                        height: 48,
                        borderRadius: 10,
                        background: color,
                        boxShadow: `0 0 25px ${color} `,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 36,
                        top: 10,
                        width: 28,
                        height: 52,
                        border: `9px solid ${color} `,
                        borderBottom: "none",
                        borderRadius: "24px 24px 0 0",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 46,
                        top: 55,
                        width: 8,
                        height: 20,
                        background: WHITE,
                        borderRadius: 5,
                    }}
                />
            </div>
        );
    };

// =====================================================
// ARROW
// =====================================================

const Arrow: React.FC<{
    x: number;
    y: number;
    width?: number;
    color?: string;
    rotate?: number;
    opacity?: number;
}> = ({
    x,
    y,
    width = 180,
    color = CYAN,
    rotate = 0,
    opacity = 1,
}) => {
        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width,
                    height: 8,
                    background: color,
                    opacity,
                    transform: `rotate(${rotate}deg)`,
                    transformOrigin: "left center",
                    boxShadow: `0 0 15px ${color} `,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        right: -4,
                        top: -8,
                        width: 0,
                        height: 0,
                        borderTop: "12px solid transparent",
                        borderBottom: "12px solid transparent",
                        borderLeft: `22px solid ${color} `,
                    }}
                />
            </div>
        );
    };

// =====================================================
// HOOK
// =====================================================

const Hook: React.FC<{
    frame: number;
}> = ({
    frame,
}) => {
        const opacity = fade(frame, 0, 15);
        const scale = scaleIn(frame, 0, 20);

        const alarm = interpolate(
            Math.sin(frame * 0.25),
            [-1, 1],
            [0.65, 1]
        );

        return (
            <AbsoluteFill style={{ opacity }}>
                <SectionLabel
                    text="Database Deadlocks"
                    color={RED}
                />

                <Glow
                    color={RED}
                    size={500}
                    opacity={0.16}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 300,
                        left: 60,
                        right: 60,
                        textAlign: "center",
                        transform: `scale(${scale})`,
                    }}
                >
                    <div
                        style={{
                            fontSize: 64,
                            fontWeight: 950,
                            lineHeight: 1.08,
                            color: WHITE,
                        }}
                    >
                        What happens when
                        <br />
                        two transactions
                        <br />
                        <span
                            style={{
                                color: RED,
                                textShadow: `0 0 25px ${RED} `,
                            }}
                        >
                            block each other forever?
                        </span>
                    </div>
                </div>

                {/* Terminal */}
                <div
                    style={{
                        position: "absolute",
                        left: 80,
                        right: 80,
                        top: 850,
                        height: 500,
                        borderRadius: 28,
                        background: "#070D17",
                        border: `2px solid ${RED} 66`,
                        boxShadow: `0 0 60px ${RED} 22`,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            height: 62,
                            background: "#101B2A",
                            borderBottom: `1px solid ${BORDER} `,
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: 24,
                            gap: 10,
                        }}
                    >
                        <div
                            style={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                background: RED,
                            }}
                        />
                        <div
                            style={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                background: ORANGE,
                            }}
                        />
                        <div
                            style={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                background: GREEN,
                            }}
                        />
                    </div>

                    <div
                        style={{
                            padding: 35,
                            fontFamily: "monospace",
                            fontSize: 25,
                            lineHeight: 1.7,
                        }}
                    >
                        <div style={{ color: MUTED }}>
                            transaction_101
                        </div>

                        <div style={{ color: CYAN }}>
                            → waiting for lock: row_A
                        </div>

                        <div style={{ color: MUTED }}>
                            transaction_202
                        </div>

                        <div style={{ color: ORANGE }}>
                            → waiting for lock: row_B
                        </div>

                        <div
                            style={{
                                color: RED,
                                fontWeight: 900,
                                opacity: alarm,
                            }}
                        >
                            ⚠ DEADLOCK DETECTED
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        );
    };

// =====================================================
// OVERVIEW — NEW
// =====================================================

const Overview: React.FC<{
    frame: number;
}> = ({
    frame,
}) => {
        const opacity = fade(frame, 0, 10);

        const titleScale = scaleIn(frame, 0, 18);

        const items = [
            {
                number: "01",
                title: "Consistent Lock Order",
                color: CYAN,
            },
            {
                number: "02",
                title: "Short Transactions",
                color: GREEN,
            },
            {
                number: "03",
                title: "Lock Timeouts",
                color: ORANGE,
            },
            {
                number: "04",
                title: "Retry + Backoff",
                color: PURPLE,
            },
        ];

        return (
            <AbsoluteFill style={{ opacity }}>
                <SectionLabel
                    text="4 Deadlock Strategies"
                    color={CYAN}
                />

                <Glow
                    color={CYAN}
                    size={550}
                    opacity={0.13}
                />

                {/* Main intro */}
                <div
                    style={{
                        position: "absolute",
                        top: 270,
                        left: 70,
                        right: 70,
                        textAlign: "center",
                        transform: `scale(${titleScale})`,
                    }}
                >
                    <div
                        style={{
                            fontSize: 58,
                            fontWeight: 950,
                            lineHeight: 1.08,
                            color: WHITE,
                        }}
                    >
                        4 ways to
                        <br />
                        <span
                            style={{
                                color: CYAN,
                                textShadow: `0 0 30px ${CYAN} 66`,
                            }}
                        >
                            handle deadlocks
                        </span>
                    </div>

                    <div
                        style={{
                            marginTop: 28,
                            fontSize: 28,
                            color: MUTED,
                        }}
                    >
                        Prevent them. Fail fast. Recover safely.
                    </div>
                </div>

                {/* Four strategy cards */}
                <div
                    style={{
                        position: "absolute",
                        left: 90,
                        right: 90,
                        top: 700,
                        display: "flex",
                        flexDirection: "column",
                        gap: 22,
                    }}
                >
                    {items.map((item, i) => {
                        const enter = slideX(
                            frame,
                            12 + i * 7,
                            180,
                            18
                        );

                        const cardOpacity = fade(
                            frame,
                            10 + i * 7,
                            8
                        );

                        return (
                            <div
                                key={item.number}
                                style={{
                                    height: 150,
                                    borderRadius: 26,
                                    background:
                                        "linear-gradient(135deg, rgba(20,37,60,0.96), rgba(10,20,34,0.96))",
                                    border: `2px solid ${item.color} 66`,
                                    boxShadow: `0 0 35px ${item.color} 18`,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 30px",
                                    opacity: cardOpacity,
                                    transform: `translateX(${enter}px)`,
                                }}
                            >
                                {/* Number */}
                                <div
                                    style={{
                                        width: 86,
                                        height: 86,
                                        borderRadius: 22,
                                        border: `2px solid ${item.color} `,
                                        background: `${item.color} 14`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 27,
                                        fontWeight: 950,
                                        color: item.color,
                                        boxShadow: `0 0 25px ${item.color} 22`,
                                        marginRight: 25,
                                    }}
                                >
                                    {item.number}
                                </div>

                                {/* Arrow */}
                                <div
                                    style={{
                                        width: 44,
                                        height: 4,
                                        background: item.color,
                                        marginRight: 20,
                                        boxShadow: `0 0 12px ${item.color} `,
                                    }}
                                />

                                {/* Title */}
                                <div
                                    style={{
                                        fontSize: 29,
                                        fontWeight: 850,
                                        color: WHITE,
                                        flex: 1,
                                    }}
                                >
                                    {item.title}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom flow */}
                <div
                    style={{
                        position: "absolute",
                        left: 120,
                        right: 120,
                        bottom: 170,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 18,
                        opacity: fade(frame, 35, 12),
                    }}
                >
                    <span
                        style={{
                            fontSize: 25,
                            fontWeight: 900,
                            color: GREEN,
                        }}
                    >
                        PREVENT
                    </span>

                    <span
                        style={{
                            color: MUTED,
                            fontSize: 28,
                        }}
                    >
                        →
                    </span>

                    <span
                        style={{
                            fontSize: 25,
                            fontWeight: 900,
                            color: ORANGE,
                        }}
                    >
                        FAIL FAST
                    </span>

                    <span
                        style={{
                            color: MUTED,
                            fontSize: 28,
                        }}
                    >
                        →
                    </span>

                    <span
                        style={{
                            fontSize: 25,
                            fontWeight: 900,
                            color: PURPLE,
                        }}
                    >
                        RECOVER
                    </span>
                </div>
            </AbsoluteFill>
        );
    };

// =====================================================
// LOCKING ORDER
// =====================================================

const LockingOrder: React.FC<{
    frame: number;
}> = ({
    frame,
}) => {
        const opacity = fade(frame, 0, 12);

        const progress = clamp(
            (frame - 15) / 100
        );

        return (
            <AbsoluteFill style={{ opacity }}>
                <SectionLabel
                    text="Fix #1 — Consistent Lock Ordering"
                    color={CYAN}
                />

                <Glow
                    color={CYAN}
                    size={500}
                    opacity={0.12}
                />

                <Service
                    x={80}
                    y={320}
                    label="Transaction A"
                    color={CYAN}
                    scale={scaleIn(frame, 0)}
                />

                <Service
                    x={770}
                    y={320}
                    label="Transaction B"
                    color={PURPLE}
                    scale={scaleIn(frame, 8)}
                />

                <Database
                    x={410}
                    y={750}
                    label="ROW A"
                    color={CYAN}
                    scale={scaleIn(frame, 15)}
                />

                <Database
                    x={410}
                    y={1080}
                    label="ROW B"
                    color={PURPLE}
                    scale={scaleIn(frame, 22)}
                />

                <Arrow
                    x={300}
                    y={500}
                    width={120}
                    color={CYAN}
                    rotate={58}
                    opacity={progress}
                />

                <Arrow
                    x={930}
                    y={500}
                    width={120}
                    color={PURPLE}
                    rotate={122}
                    opacity={progress}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 150,
                        top: 1510,
                        width: 780,
                        padding: "28px 30px",
                        borderRadius: 24,
                        background: CARD,
                        border: `2px solid ${GREEN} 55`,
                        boxShadow: `0 0 40px ${GREEN} 16`,
                    }}
                >
                    <div
                        style={{
                            fontSize: 25,
                            color: MUTED,
                            marginBottom: 12,
                        }}
                    >
                        Both transactions acquire locks in the
                        same order
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 20,
                            fontSize: 32,
                            fontWeight: 900,
                        }}
                    >
                        <span style={{ color: CYAN }}>
                            ROW A
                        </span>

                        <span style={{ color: GREEN }}>
                            →
                        </span>

                        <span style={{ color: PURPLE }}>
                            ROW B
                        </span>
                    </div>
                </div>
            </AbsoluteFill>
        );
    };

// =====================================================
// SHORT TRANSACTIONS
// =====================================================

const ShortTransactions: React.FC<{
    frame: number;
}> = ({
    frame,
}) => {
        const opacity = fade(frame, 0, 12);

        const barWidth = interpolate(
            frame,
            [10, 70],
            [0, 620],
            {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            }
        );

        return (
            <AbsoluteFill style={{ opacity }}>
                <SectionLabel
                    text="Fix #2 — Keep Transactions Short"
                    color={GREEN}
                />

                <Glow
                    color={GREEN}
                    size={550}
                    opacity={0.13}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 310,
                        left: 70,
                        right: 70,
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: 52,
                            fontWeight: 950,
                            color: WHITE,
                        }}
                    >
                        Less time holding locks
                    </div>

                    <div
                        style={{
                            marginTop: 20,
                            fontSize: 28,
                            color: MUTED,
                        }}
                    >
                        means fewer opportunities for deadlocks
                    </div>
                </div>

                {/* Long transaction */}
                <div
                    style={{
                        position: "absolute",
                        top: 600,
                        left: 100,
                        right: 100,
                    }}
                >
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: 800,
                            color: RED,
                            marginBottom: 20,
                        }}
                    >
                        ❌ Long transaction
                    </div>

                    <div
                        style={{
                            height: 70,
                            borderRadius: 35,
                            background: "#1A2637",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: Math.min(
                                    720,
                                    barWidth + 100
                                ),
                                height: "100%",
                                borderRadius: 35,
                                background:
                                    "linear-gradient(90deg, #FF5C70, #FFB86C)",
                                boxShadow: `0 0 25px ${RED} 66`,
                            }}
                        />
                    </div>
                </div>

                {/* Short transaction */}
                <div
                    style={{
                        position: "absolute",
                        top: 850,
                        left: 100,
                        right: 100,
                    }}
                >
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: 800,
                            color: GREEN,
                            marginBottom: 20,
                        }}
                    >
                        ✓ Short transaction
                    </div>

                    <div
                        style={{
                            height: 70,
                            borderRadius: 35,
                            background: "#1A2637",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: Math.min(
                                    300,
                                    barWidth * 0.55
                                ),
                                height: "100%",
                                borderRadius: 35,
                                background:
                                    "linear-gradient(90deg, #1FD1A5, #28D7FF)",
                                boxShadow: `0 0 25px ${GREEN} 66`,
                            }}
                        />
                    </div>
                </div>

                {/* Lock release animation */}
                <div
                    style={{
                        position: "absolute",
                        top: 1160,
                        left: 170,
                        right: 170,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {[0, 1, 2, 3].map((i) => {
                        const s = scaleIn(
                            frame,
                            80 + i * 8,
                            15
                        );

                        return (
                            <div
                                key={i}
                                style={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: 25,
                                    background: "#13243A",
                                    border: `2px solid ${GREEN} `,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transform: `scale(${s})`,
                                    boxShadow: `0 0 25px ${GREEN} 22`,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 42,
                                    }}
                                >
                                    🔓
                                </div>
                            </div>
                        );
                    })}
                </div>
            </AbsoluteFill>
        );
    };

// =====================================================
// LOCK TIMEOUTS
// =====================================================

const LockTimeouts: React.FC<{
    frame: number;
}> = ({
    frame,
}) => {
        const opacity = fade(frame, 0, 12);

        const timer = interpolate(
            frame,
            [10, 120],
            [0, 100],
            {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            }
        );

        const danger = timer > 75;

        return (
            <AbsoluteFill style={{ opacity }}>
                <SectionLabel
                    text="Fix #3 — Lock Timeouts"
                    color={ORANGE}
                />

                <Glow
                    color={ORANGE}
                    size={500}
                    opacity={0.12}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 320,
                        left: 70,
                        right: 70,
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: 55,
                            fontWeight: 950,
                            color: WHITE,
                        }}
                    >
                        Don't wait forever
                    </div>

                    <div
                        style={{
                            marginTop: 18,
                            fontSize: 27,
                            color: MUTED,
                        }}
                    >
                        Abort blocked transactions after a timeout
                    </div>
                </div>

                {/* Timer */}
                <div
                    style={{
                        position: "absolute",
                        top: 650,
                        left: 220,
                        width: 640,
                        height: 300,
                        borderRadius: 40,
                        background: CARD,
                        border: `3px solid ${danger ? RED : ORANGE
                            } `,
                        boxShadow: `0 0 60px ${danger ? RED : ORANGE
                            } 33`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: 92,
                            fontWeight: 950,
                            color: danger ? RED : ORANGE,
                        }}
                    >
                        {Math.round(timer)}%
                    </div>

                    <div
                        style={{
                            fontSize: 27,
                            color: MUTED,
                        }}
                    >
                        lock wait time
                    </div>
                </div>

                {/* Timeout line */}
                <div
                    style={{
                        position: "absolute",
                        left: 150,
                        right: 150,
                        top: 1100,
                        height: 24,
                        borderRadius: 20,
                        background: "#1B283A",
                    }}
                >
                    <div
                        style={{
                            width: `${timer}% `,
                            height: "100%",
                            borderRadius: 20,
                            background:
                                danger
                                    ? RED
                                    : "linear-gradient(90deg, #1FD1A5, #FFB86C)",
                            boxShadow: `0 0 20px ${danger ? RED : ORANGE
                                } `,
                        }}
                    />

                    <div
                        style={{
                            position: "absolute",
                            right: 0,
                            top: -45,
                            fontSize: 23,
                            color: RED,
                            fontWeight: 800,
                        }}
                    >
                        TIMEOUT
                    </div>
                </div>

                {danger && (
                    <div
                        style={{
                            position: "absolute",
                            top: 1240,
                            left: 180,
                            right: 180,
                            padding: 28,
                            borderRadius: 22,
                            background: `${RED} 18`,
                            border: `2px solid ${RED} 77`,
                            textAlign: "center",
                            color: RED,
                            fontSize: 30,
                            fontWeight: 900,
                        }}
                    >
                        Transaction aborted → locks released
                    </div>
                )}
            </AbsoluteFill>
        );
    };

// =====================================================
// RETRY BACKOFF
// =====================================================

const RetryBackoff: React.FC<{
    frame: number;
}> = ({
    frame,
}) => {
        const opacity = fade(frame, 0, 12);

        const positions = [
            { x: 150, y: 700 },
            { x: 400, y: 550 },
            { x: 650, y: 700 },
            { x: 400, y: 850 },
        ];

        return (
            <AbsoluteFill style={{ opacity }}>
                <SectionLabel
                    text="Fix #4 — Retry With Backoff"
                    color={PURPLE}
                />

                <Glow
                    color={PURPLE}
                    size={600}
                    opacity={0.13}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 300,
                        left: 70,
                        right: 70,
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: 52,
                            fontWeight: 950,
                            color: WHITE,
                        }}
                    >
                        Retry safely
                    </div>

                    <div
                        style={{
                            marginTop: 20,
                            fontSize: 27,
                            color: MUTED,
                        }}
                    >
                        Randomized backoff prevents synchronized retries
                    </div>
                </div>

                {positions.map((p, i) => {
                    const delay = i * 18;

                    const s = scaleIn(
                        frame,
                        10 + delay,
                        18
                    );

                    return (
                        <React.Fragment key={i}>
                            <div
                                style={{
                                    position: "absolute",
                                    left: p.x,
                                    top: p.y,
                                    width: 170,
                                    height: 110,
                                    borderRadius: 22,
                                    background: CARD,
                                    border: `2px solid ${i % 2 === 0
                                        ? PURPLE
                                        : CYAN
                                        } `,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transform: `scale(${s})`,
                                    boxShadow: `0 0 30px ${i % 2 === 0
                                        ? PURPLE
                                        : CYAN
                                        } 33`,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 26,
                                        fontWeight: 900,
                                        color: WHITE,
                                    }}
                                >
                                    RETRY {i + 1}
                                </div>
                            </div>

                            {i < positions.length - 1 && (
                                <Arrow
                                    x={p.x + 80}
                                    y={p.y + 100}
                                    width={130}
                                    color={
                                        i % 2 === 0
                                            ? PURPLE
                                            : CYAN
                                    }
                                    rotate={
                                        i === 0
                                            ? -32
                                            : i === 1
                                                ? 32
                                                : 150
                                    }
                                    opacity={fade(
                                        frame,
                                        25 + delay,
                                        15
                                    )}
                                />
                            )}
                        </React.Fragment>
                    );
                })}

                <div
                    style={{
                        position: "absolute",
                        left: 170,
                        right: 170,
                        top: 1230,
                        padding: 30,
                        borderRadius: 24,
                        background: CARD,
                        border: `2px solid ${GREEN} 55`,
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: 27,
                            color: MUTED,
                        }}
                    >
                        100ms → 200ms → 400ms → 800ms
                    </div>

                    <div
                        style={{
                            marginTop: 15,
                            fontSize: 32,
                            fontWeight: 900,
                            color: GREEN,
                        }}
                    >
                        Exponential Backoff + Jitter
                    </div>
                </div>
            </AbsoluteFill>
        );
    };

// =====================================================
// COMPARISON
// =====================================================

const Comparison: React.FC<{
    frame: number;
}> = ({
    frame,
}) => {
        const opacity = fade(frame, 0, 12);

        const items = [
            {
                label: "Consistent lock order",
                value: "PREVENT",
                color: GREEN,
            },
            {
                label: "Short transactions",
                value: "REDUCE",
                color: CYAN,
            },
            {
                label: "Lock timeout",
                value: "RECOVER",
                color: ORANGE,
            },
            {
                label: "Retry + backoff",
                value: "RESOLVE",
                color: PURPLE,
            },
        ];

        return (
            <AbsoluteFill style={{ opacity }}>
                <SectionLabel
                    text="Deadlock Defense"
                    color={CYAN}
                />

                <Glow
                    color={CYAN}
                    size={500}
                    opacity={0.10}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 280,
                        left: 70,
                        right: 70,
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: 54,
                            fontWeight: 950,
                            color: WHITE,
                        }}
                    >
                        Prevent first.
                        <br />
                        Recover safely.
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 90,
                        right: 90,
                        top: 650,
                        display: "flex",
                        flexDirection: "column",
                        gap: 25,
                    }}
                >
                    {items.map((item, i) => {
                        const x = slideX(
                            frame,
                            i * 12,
                            100,
                            20
                        );

                        return (
                            <div
                                key={item.label}
                                style={{
                                    height: 150,
                                    borderRadius: 25,
                                    background: CARD,
                                    border: `2px solid ${item.color} 55`,
                                    boxShadow: `0 0 30px ${item.color} 18`,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 35px",
                                    transform: `translateX(${x}px)`,
                                }}
                            >
                                <div
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: "50%",
                                        background: `${item.color} 18`,
                                        border: `2px solid ${item.color} `,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 30,
                                        marginRight: 25,
                                    }}
                                >
                                    ✓
                                </div>

                                <div
                                    style={{
                                        flex: 1,
                                        fontSize: 28,
                                        fontWeight: 800,
                                        color: WHITE,
                                    }}
                                >
                                    {item.label}
                                </div>

                                <div
                                    style={{
                                        fontSize: 24,
                                        fontWeight: 950,
                                        color: item.color,
                                        letterSpacing: 2,
                                    }}
                                >
                                    {item.value}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </AbsoluteFill>
        );
    };

// =====================================================
// ENDING
// =====================================================

const Ending: React.FC<{
    frame: number;
}> = ({
    frame,
}) => {
        const opacity = fade(frame, 0, 15);
        const scale = scaleIn(frame, 0, 20);

        return (
            <AbsoluteFill style={{ opacity }}>
                <SectionLabel
                    text="Key Takeaway"
                    color={GREEN}
                />

                <Glow
                    color={GREEN}
                    size={600}
                    opacity={0.14}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 420,
                        left: 70,
                        right: 70,
                        textAlign: "center",
                        transform: `scale(${scale})`,
                    }}
                >
                    <div
                        style={{
                            fontSize: 62,
                            fontWeight: 950,
                            lineHeight: 1.15,
                            color: WHITE,
                        }}
                    >
                        Deadlocks are
                        <br />
                        <span
                            style={{
                                color: GREEN,
                                textShadow: `0 0 25px ${GREEN} `,
                            }}
                        >
                            preventable.
                        </span>
                    </div>

                    <div
                        style={{
                            marginTop: 50,
                            fontSize: 30,
                            lineHeight: 1.5,
                            color: MUTED,
                        }}
                    >
                        Control lock ordering.
                        <br />
                        Keep transactions short.
                        <br />
                        Timeout and retry safely.
                    </div>
                </div>

                <Database
                    x={410}
                    y={1120}
                    label="DB"
                    color={GREEN}
                    scale={pulse(frame, 0.08, 0.04)}
                />

                <Lock
                    x={300}
                    y={1160}
                    color={GREEN}
                    scale={scaleIn(frame, 20)}
                />

                <Lock
                    x={680}
                    y={1160}
                    color={GREEN}
                    scale={scaleIn(frame, 28)}
                />
            </AbsoluteFill>
        );
    };

// =====================================================
// CTA
// =====================================================

const CTA: React.FC<{
    frame: number;
}> = ({
    frame,
}) => {
        const opacity = fade(frame, 0, 15);
        const scale = scaleIn(frame, 0, 20);

        return (
            <AbsoluteFill style={{ opacity }}>
                <Glow
                    color={CYAN}
                    size={650}
                    opacity={0.16}
                />

                <Glow
                    color={PURPLE}
                    size={450}
                    opacity={0.12}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 350,
                        left: 70,
                        right: 70,
                        textAlign: "center",
                        transform: `scale(${scale})`,
                    }}
                >
                    <div
                        style={{
                            fontSize: 34,
                            fontWeight: 900,
                            color: CYAN,
                            letterSpacing: 4,
                        }}
                    >
                        AI HUB INSIDER
                    </div>

                    <div
                        style={{
                            marginTop: 35,
                            fontSize: 62,
                            fontWeight: 950,
                            lineHeight: 1.1,
                            color: WHITE,
                        }}
                    >
                        Master
                        <br />
                        <span
                            style={{
                                color: GREEN,
                            }}
                        >
                            System Design
                        </span>
                    </div>

                    <div
                        style={{
                            marginTop: 40,
                            fontSize: 29,
                            color: MUTED,
                            lineHeight: 1.5,
                        }}
                    >
                        Follow AI Hub Insider
                        <br />
                        for daily backend & system design tips.
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 180,
                        right: 180,
                        bottom: 420,
                        height: 130,
                        borderRadius: 30,
                        background:
                            "linear-gradient(135deg, rgba(31,209,165,0.18), rgba(77,184,255,0.16))",
                        border: `2px solid ${CYAN} 66`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 0 60px ${CYAN} 22`,
                        transform: `scale(${pulse(
                            frame,
                            0.08,
                            0.025
                        )
                            })`,
                    }}
                >
                    <div
                        style={{
                            fontSize: 34,
                            fontWeight: 900,
                            color: WHITE,
                        }}
                    >
                        Follow for more 🚀
                    </div>
                </div>
            </AbsoluteFill>
        );
    };

// =====================================================
// MAIN SCENE
// =====================================================

export const DatabaseDeadlocksScene: React.FC = () => {
    const frame = useCurrentFrame();

    const current =
        [...databaseDeadlocksTimeline.sections]
            .reverse()
            .find(
                (section) => frame >= section.start
            ) ??
        databaseDeadlocksTimeline.sections[0];

    const localFrame = Math.max(
        0,
        frame - current.start
    );

    const renderComponent = () => {
        switch (current.id) {
            case "hook":
                return <Hook frame={localFrame} />;

            // =================================================
            // NEW OVERVIEW SECTION
            // =================================================

            case "overview":
                return <Overview frame={localFrame} />;

            case "locking-order":
                return (
                    <LockingOrder
                        frame={localFrame}
                    />
                );

            case "short-transactions":
                return (
                    <ShortTransactions
                        frame={localFrame}
                    />
                );

            case "lock-timeouts":
                return (
                    <LockTimeouts
                        frame={localFrame}
                    />
                );

            case "retry-backoff":
                return (
                    <RetryBackoff
                        frame={localFrame}
                    />
                );

            case "comparison":
                return (
                    <Comparison
                        frame={localFrame}
                    />
                );

            case "ending":
                return (
                    <Ending
                        frame={localFrame}
                    />
                );

            case "cta":
                return (
                    <CTA
                        frame={localFrame}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <AbsoluteFill
            style={{
                fontFamily:
                    "Inter, Arial, sans-serif",
                background: BG_DARK,
            }}
        >
            <Background />

            {/* =================================================
                VISUAL
               ================================================= */}

            {renderComponent()}

            {/* =================================================
                AUDIO
                Every section gets its own audio sequence.
               ================================================= */}

            {databaseDeadlocksTimeline.sections.map(
                (section) => (
                    <Sequence
                        key={section.id}
                        from={section.start}
                        durationInFrames={
                            section.duration
                        }
                    >
                        <Audio
                            src={staticFile(
                                section.audio
                            )}
                            volume={1}
                        />
                    </Sequence>
                )
            )}
        </AbsoluteFill>
    );
};