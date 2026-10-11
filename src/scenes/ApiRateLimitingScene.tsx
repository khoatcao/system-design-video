import React from "react";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    staticFile,
    useCurrentFrame,
    interpolate,
} from "remotion";

import { apiRateLimiting } from "../../content/api-rate-limiting";
import { createTimeline } from "../timeline";

// ============================================================
// COLORS
// ============================================================

const BG = "#07111F";
const CYAN = "#4DB8FF";
const GREEN = "#1FD1A5";
const PURPLE = "#9B7CFF";
const ORANGE = "#FFB86C";
const RED = "#FF5C7A";
const WHITE = "#F4F7FB";
const MUTED = "#8FA3B8";

// ============================================================
// TIMELINE
// ============================================================

const timeline = createTimeline(apiRateLimiting);

// ============================================================
// HELPERS
// ============================================================

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

const ease = (v: number) => {
    const t = clamp(v);
    return 1 - Math.pow(1 - t, 3);
};

const inAnim = (
    frame: number,
    start = 0,
    duration = 16
) =>
    ease(
        interpolate(frame, [start, start + duration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        })
    );

const pulse = (
    frame: number,
    speed = 8,
    min = 0.92,
    max = 1.08
) =>
    interpolate(
        Math.sin(frame / speed),
        [-1, 1],
        [min, max]
    );

const lerp = (
    frame: number,
    start: number,
    end: number,
    duration: number
) =>
    interpolate(frame, [0, duration], [start, end], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

// ============================================================
// BACKGROUND
// ============================================================

const Background: React.FC<{
    accent?: string;
}> = ({ accent = CYAN }) => {
    const frame = useCurrentFrame();

    const drift = (frame * 0.22) % 70;

    return (
        <AbsoluteFill
            style={{
                background:
                    "radial-gradient(circle at 50% 35%, #10263D 0%, #07111F 48%, #030812 100%)",
                overflow: "hidden",
            }}
        >
            {/* large ambient glow */}

            <div
                style={{
                    position: "absolute",
                    width: 800,
                    height: 800,
                    left: -320,
                    top: -350,
                    borderRadius: "50%",
                    background: `radial - gradient(circle, ${accent}20 0 %, transparent 68 %)`,
                    filter: "blur(30px)",
                    transform: `translate(${Math.sin(frame / 70) * 30}px, ${Math.cos(frame / 80) * 20
                        }px)`,
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: 700,
                    height: 700,
                    right: -330,
                    bottom: -300,
                    borderRadius: "50%",
                    background: `radial - gradient(circle, ${GREEN}13 0 %, transparent 70 %)`,
                    filter: "blur(35px)",
                }}
            />

            {/* moving technical grid */}

            <div
                style={{
                    position: "absolute",
                    inset: -100,
                    opacity: 0.055,
                    transform: `translate(${drift}px, ${drift}px)`,
                    backgroundImage: `
linear - gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    linear - gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
        `,
                    backgroundSize: "70px 70px",
                }}
            />

            {/* scan line */}

            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: `${(frame * 0.8) % 1100} px`,
                    height: 2,
                    background: `linear - gradient(90deg, transparent, ${accent}22, transparent)`,
                    opacity: 0.5,
                }}
            />

            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.48) 100%)",
                }}
            />
        </AbsoluteFill>
    );
};

// ============================================================
// TOPIC LABEL
// ============================================================

const TopicLabel: React.FC<{
    color?: string;
}> = ({ color = CYAN }) => {
    const frame = useCurrentFrame();
    const p = inAnim(frame);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: p,
                transform: `translateY(${(1 - p) * 15}px)`,
            }}
        >
            <div
                style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 18px ${color} `,
                }}
            />

            <div
                style={{
                    color,
                    fontSize: 18,
                    fontWeight: 900,
                    letterSpacing: 4,
                }}
            >
                API RATE LIMITING
            </div>
        </div>
    );
};

// ============================================================
// BIG TITLE
// ============================================================

const BigTitle: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const frame = useCurrentFrame();
    const p = inAnim(frame, 5, 14);

    return (
        <div
            style={{
                color: WHITE,
                fontSize: 58,
                lineHeight: 1.04,
                fontWeight: 950,
                letterSpacing: -2.5,
                opacity: p,
                transform: `translateY(${(1 - p) * 25}px)`,
            }}
        >
            {children}
        </div>
    );
};

// ============================================================
// REQUEST DOT
// ============================================================

const RequestDot: React.FC<{
    x: number;
    y: number;
    color?: string;
    size?: number;
    delay?: number;
}> = ({
    x,
    y,
    color = CYAN,
    size = 15,
    delay = 0,
}) => {
        const frame = useCurrentFrame();
        const p = inAnim(frame, delay, 8);

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 18px ${color} `,
                    opacity: p,
                    transform: `scale(${p * pulse(frame + delay, 5, 0.9, 1.12)})`,
                }}
            />
        );
    };

// ============================================================
// CONNECTION
// ============================================================

const Connection: React.FC<{
    x: number;
    y: number;
    width: number;
    color?: string;
}> = ({ x, y, width, color = CYAN }) => {
    const frame = useCurrentFrame();

    const travel = (frame * 4) % (width + 80);

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width,
                height: 3,
                background: `${color} 30`,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: travel - 50,
                    top: -4,
                    width: 50,
                    height: 11,
                    borderRadius: 20,
                    background: color,
                    boxShadow: `0 0 18px ${color} `,
                }}
            />
        </div>
    );
};

// ============================================================
// SERVER
// ============================================================

const Server: React.FC<{
    x: number;
    y: number;
    color: string;
    label: string;
    scale?: number;
}> = ({
    x,
    y,
    color,
    label,
    scale = 1,
}) => {
        const frame = useCurrentFrame();

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 190 * scale,
                    height: 125 * scale,
                    borderRadius: 22,
                    border: `2px solid ${color} `,
                    background:
                        "linear-gradient(145deg, rgba(17,35,56,.98), rgba(5,13,24,.98))",
                    boxShadow: `0 0 35px ${color} 25`,
                    transform: `scale(${pulse(frame, 15, 0.98, 1.02)})`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        width: 80 * scale,
                        height: 7 * scale,
                        borderRadius: 10,
                        background: color,
                        boxShadow: `0 0 15px ${color} `,
                        marginBottom: 17 * scale,
                    }}
                />

                <div
                    style={{
                        color: WHITE,
                        fontSize: 21 * scale,
                        fontWeight: 900,
                    }}
                >
                    {label}
                </div>
            </div>
        );
    };

// ============================================================
// HOOK — TRAFFIC FLOOD
// ============================================================

const HookScene: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill>
            <Background accent={RED} />

            <div
                style={{
                    position: "absolute",
                    left: 65,
                    top: 120,
                    width: 900,
                }}
            >
                <TopicLabel color={RED} />

                <div style={{ marginTop: 25 }}>
                    <BigTitle>
                        What happens when
                        <br />
                        <span style={{ color: RED }}>
                            100,000 requests
                        </span>
                        <br />
                        hit your API?
                    </BigTitle>
                </div>
            </div>

            {/* traffic counter */}

            <div
                style={{
                    position: "absolute",
                    left: 70,
                    top: 540,
                    fontSize: 76,
                    fontWeight: 950,
                    color: WHITE,
                    letterSpacing: -4,
                }}
            >
                {Math.floor(
                    interpolate(
                        frame,
                        [0, 80],
                        [0, 100000],
                        {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        }
                    )
                ).toLocaleString()}
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 75,
                    top: 625,
                    color: MUTED,
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: 3,
                }}
            >
                REQUESTS / SECOND
            </div>

            {/* traffic streams */}

            {[0, 1, 2, 3].map((row) => (
                <React.Fragment key={row}>
                    {Array.from({ length: 9 }).map((_, i) => {
                        const x =
                            65 +
                            ((frame * (5 + row) +
                                i * 105) %
                                820);

                        const y =
                            720 +
                            row * 58 +
                            Math.sin(i * 2) * 5;

                        return (
                            <RequestDot
                                key={`${row} -${i} `}
                                x={x}
                                y={y}
                                color={row === 3 ? RED : CYAN}
                                size={14}
                            />
                        );
                    })}
                </React.Fragment>
            ))}

            {/* limiter */}

            <div
                style={{
                    position: "absolute",
                    left: 365,
                    top: 905,
                    width: 330,
                    height: 155,
                    borderRadius: 28,
                    border: `3px solid ${GREEN} `,
                    background: `${GREEN} 10`,
                    boxShadow: `0 0 50px ${GREEN} 25`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        fontSize: 28,
                        fontWeight: 950,
                        color: GREEN,
                    }}
                >
                    RATE LIMITER
                </div>

                <div
                    style={{
                        marginTop: 12,
                        color: MUTED,
                        fontSize: 17,
                    }}
                >
                    protect the backend
                </div>
            </div>

            <Connection
                x={695}
                y={980}
                width={150}
                color={GREEN}
            />

            <Server
                x={845}
                y={925}
                color={GREEN}
                label="API"
                scale={0.8}
            />

            {/* rejected traffic */}

            {[0, 1, 2, 3].map((i) => (
                <RequestDot
                    key={i}
                    x={720 + i * 58}
                    y={1055 + i * 25}
                    color={RED}
                    delay={i * 4}
                />
            ))}

            <div
                style={{
                    position: "absolute",
                    right: 70,
                    top: 1110,
                    color: RED,
                    fontSize: 20,
                    fontWeight: 950,
                    letterSpacing: 2,
                }}
            >
                429 TOO MANY
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// TOKEN BUCKET
// ============================================================

const TokenBucketScene: React.FC = () => {
    const frame = useCurrentFrame();

    const consumed = Math.floor(frame / 18) % 9;

    return (
        <AbsoluteFill>
            <Background accent={GREEN} />

            <div
                style={{
                    position: "absolute",
                    left: 65,
                    top: 115,
                }}
            >
                <TopicLabel color={GREEN} />

                <div style={{ marginTop: 24 }}>
                    <BigTitle>
                        Token Bucket
                    </BigTitle>
                </div>

                <div
                    style={{
                        marginTop: 16,
                        color: MUTED,
                        fontSize: 22,
                    }}
                >
                    Bursts are allowed — but only while tokens exist.
                </div>
            </div>

            {/* incoming burst */}

            <div
                style={{
                    position: "absolute",
                    left: 70,
                    top: 620,
                    color: CYAN,
                    fontSize: 18,
                    fontWeight: 900,
                    letterSpacing: 3,
                }}
            >
                REQUEST BURST
            </div>

            {Array.from({ length: 12 }).map((_, i) => {
                const x =
                    70 +
                    ((frame * 4 + i * 70) % 330);

                const y =
                    690 +
                    (i % 4) * 55;

                return (
                    <RequestDot
                        key={i}
                        x={x}
                        y={y}
                        color={CYAN}
                        size={17}
                    />
                );
            })}

            <Connection
                x={370}
                y={790}
                width={100}
                color={CYAN}
            />

            {/* bucket */}

            <div
                style={{
                    position: "absolute",
                    left: 470,
                    top: 580,
                    width: 300,
                    height: 440,
                    border: `4px solid ${GREEN} `,
                    borderTop: "none",
                    borderRadius: "0 0 55px 55px",
                    background:
                        "linear-gradient(to top, rgba(31,209,165,.16), rgba(31,209,165,.02))",
                    boxShadow: `0 0 50px ${GREEN} 22`,
                }}
            >
                {/* token refill */}

                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: -90,
                        textAlign: "center",
                        color: GREEN,
                        fontSize: 18,
                        fontWeight: 900,
                        letterSpacing: 2,
                    }}
                >
                    REFILL RATE
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 145,
                        top: -70,
                        width: 5,
                        height: 65,
                        background: GREEN,
                        boxShadow: `0 0 20px ${GREEN} `,
                    }}
                />

                {/* tokens */}

                {Array.from({ length: 12 }).map((_, i) => {
                    const row = Math.floor(i / 4);
                    const col = i % 4;

                    const used =
                        i === consumed;

                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: 48 + col * 58,
                                bottom:
                                    50 + row * 75,
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: used
                                    ? `${GREEN} 22`
                                    : GREEN,
                                border: `2px solid ${GREEN} `,
                                boxShadow: used
                                    ? "none"
                                    : `0 0 20px ${GREEN} `,
                                opacity: used ? 0.35 : 1,
                                transform: `scale(${used ? 0.7 : 1
                                    })`,
                            }}
                        />
                    );
                })}

                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: -65,
                        textAlign: "center",
                        color: GREEN,
                        fontSize: 18,
                        fontWeight: 900,
                    }}
                >
                    1 REQUEST = 1 TOKEN
                </div>
            </div>

            {/* API */}

            <Connection
                x={770}
                y={790}
                width={100}
                color={GREEN}
            />

            <Server
                x={870}
                y={720}
                color={GREEN}
                label="API"
                scale={0.72}
            />

            {/* consumed token animation */}

            <div
                style={{
                    position: "absolute",
                    left:
                        610 +
                        ((frame * 5) % 230),
                    top: 750,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: GREEN,
                    boxShadow: `0 0 20px ${GREEN} `,
                }}
            />
        </AbsoluteFill>
    );
};

// ============================================================
// LEAKY BUCKET
// ============================================================

const LeakyBucketScene: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill>
            <Background accent={PURPLE} />

            <div
                style={{
                    position: "absolute",
                    left: 65,
                    top: 115,
                }}
            >
                <TopicLabel color={PURPLE} />

                <div style={{ marginTop: 24 }}>
                    <BigTitle>
                        Leaky Bucket
                    </BigTitle>
                </div>

                <div
                    style={{
                        marginTop: 16,
                        color: MUTED,
                        fontSize: 22,
                    }}
                >
                    Absorb the burst. Release requests at a constant rate.
                </div>
            </div>

            {/* burst */}

            <div
                style={{
                    position: "absolute",
                    left: 65,
                    top: 620,
                    color: CYAN,
                    fontSize: 18,
                    fontWeight: 900,
                    letterSpacing: 3,
                }}
            >
                BURST TRAFFIC
            </div>

            {Array.from({ length: 15 }).map((_, i) => {
                const x =
                    65 +
                    ((frame * 4 + i * 55) % 300);

                const y =
                    690 +
                    (i % 5) * 50;

                return (
                    <RequestDot
                        key={i}
                        x={x}
                        y={y}
                        color={CYAN}
                        size={16}
                    />
                );
            })}

            <Connection
                x={350}
                y={810}
                width={90}
                color={CYAN}
            />

            {/* queue */}

            <div
                style={{
                    position: "absolute",
                    left: 440,
                    top: 610,
                    width: 350,
                    height: 430,
                    border: `4px solid ${PURPLE} `,
                    borderTop: "none",
                    borderRadius: "0 0 65px 65px",
                    background: `${PURPLE} 0C`,
                    boxShadow: `0 0 50px ${PURPLE} 20`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: -70,
                        width: "100%",
                        textAlign: "center",
                        color: PURPLE,
                        fontSize: 21,
                        fontWeight: 950,
                        letterSpacing: 2,
                    }}
                >
                    REQUEST QUEUE
                </div>

                {/* queue particles */}

                {Array.from({ length: 10 }).map((_, i) => {
                    const row = Math.floor(i / 2);
                    const col = i % 2;

                    return (
                        <RequestDot
                            key={i}
                            x={
                                520 +
                                col * 150
                            }
                            y={
                                700 +
                                row * 55
                            }
                            color={PURPLE}
                            size={22}
                            delay={i * 3}
                        />
                    );
                })}
            </div>

            {/* constant leak */}

            <div
                style={{
                    position: "absolute",
                    left: 610,
                    top: 1040,
                    width: 6,
                    height: 150,
                    background: PURPLE,
                    boxShadow: `0 0 25px ${PURPLE} `,
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: 585,
                    top: 1170,
                    width: 55,
                    height: 55,
                    borderRadius: "50%",
                    background: GREEN,
                    boxShadow: `0 0 25px ${GREEN} `,
                    transform: `translateY(${(frame * 3) % 70
                        }px)`,
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: 540,
                    top: 1280,
                    color: GREEN,
                    fontSize: 20,
                    fontWeight: 950,
                    letterSpacing: 2,
                }}
            >
                CONSTANT OUTPUT
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// FIXED WINDOW
// ============================================================

const FixedWindowScene: React.FC = () => {
    const frame = useCurrentFrame();

    const cycle = (frame % 150) / 150;
    const boundary = cycle > 0.84;

    return (
        <AbsoluteFill>
            <Background accent={ORANGE} />

            <div
                style={{
                    position: "absolute",
                    left: 65,
                    top: 115,
                }}
            >
                <TopicLabel color={ORANGE} />

                <div style={{ marginTop: 24 }}>
                    <BigTitle>
                        Fixed Window
                    </BigTitle>
                </div>

                <div
                    style={{
                        marginTop: 16,
                        color: MUTED,
                        fontSize: 22,
                    }}
                >
                    Count requests. Reset the counter. Repeat.
                </div>
            </div>

            {/* timeline */}

            <div
                style={{
                    position: "absolute",
                    left: 80,
                    right: 80,
                    top: 680,
                    height: 7,
                    borderRadius: 10,
                    background: `${ORANGE} 35`,
                }}
            />

            {/* window */}

            <div
                style={{
                    position: "absolute",
                    left: 95,
                    top: 570,
                    width: 780,
                    height: 300,
                    border: `3px solid ${boundary ? RED : ORANGE
                        } `,
                    borderRadius: 28,
                    background: boundary
                        ? `${RED}08`
                        : `${ORANGE}08`,
                    boxShadow: boundary
                        ? `0 0 45px ${RED} 30`
                        : `0 0 35px ${ORANGE} 18`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 25,
                        top: 25,
                        color: boundary
                            ? RED
                            : ORANGE,
                        fontSize: 18,
                        fontWeight: 900,
                        letterSpacing: 2,
                    }}
                >
                    WINDOW
                </div>

                <div
                    style={{
                        position: "absolute",
                        right: 25,
                        top: 22,
                        color: WHITE,
                        fontSize: 28,
                        fontWeight: 950,
                    }}
                >
                    {Math.floor(cycle * 1000)} ms
                </div>

                {/* request dots */}

                {Array.from({ length: 10 }).map(
                    (_, i) => {
                        const allowed = i < 6;

                        return (
                            <RequestDot
                                key={i}
                                x={
                                    55 +
                                    (i % 5) * 135
                                }
                                y={
                                    105 +
                                    Math.floor(i / 5) *
                                    80
                                }
                                color={
                                    allowed
                                        ? GREEN
                                        : RED
                                }
                                size={25}
                                delay={i * 5}
                            />
                        );
                    }
                )}

                <div
                    style={{
                        position: "absolute",
                        left: 25,
                        right: 25,
                        bottom: 25,
                        height: 5,
                        background: `${ORANGE} 35`,
                    }}
                >
                    <div
                        style={{
                            width: `${cycle * 100}% `,
                            height: "100%",
                            background: ORANGE,
                        }}
                    />
                </div>
            </div>

            {/* reset boundary */}

            <div
                style={{
                    position: "absolute",
                    left: 875,
                    top: 530,
                    width: 4,
                    height: 410,
                    background: boundary
                        ? RED
                        : ORANGE,
                    boxShadow: `0 0 20px ${boundary ? RED : ORANGE
                        } `,
                }}
            />

            {/* burst at boundary */}

            {boundary &&
                Array.from({ length: 7 }).map(
                    (_, i) => {
                        const p =
                            ((frame * 7 +
                                i * 30) %
                                250) /
                            250;

                        return (
                            <RequestDot
                                key={i}
                                x={
                                    875 +
                                    p * 100
                                }
                                y={
                                    610 +
                                    i * 60
                                }
                                color={RED}
                                size={18}
                            />
                        );
                    }
                )}

            <div
                style={{
                    position: "absolute",
                    right: 70,
                    top: 1010,
                    color: RED,
                    fontSize: 22,
                    fontWeight: 950,
                    letterSpacing: 2,
                    opacity: boundary ? 1 : 0.45,
                }}
            >
                BOUNDARY BURST
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 90,
                    top: 1010,
                    color: GREEN,
                    fontSize: 21,
                    fontWeight: 900,
                }}
            >
                6 REQUESTS → PASS
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// SLIDING WINDOW
// ============================================================

const SlidingWindowScene: React.FC = () => {
    const frame = useCurrentFrame();

    const windowX =
        100 + ((frame * 2.2) % 500);

    return (
        <AbsoluteFill>
            <Background accent={CYAN} />

            <div
                style={{
                    position: "absolute",
                    left: 65,
                    top: 115,
                }}
            >
                <TopicLabel color={CYAN} />

                <div style={{ marginTop: 24 }}>
                    <BigTitle>
                        Sliding Window
                    </BigTitle>
                </div>

                <div
                    style={{
                        marginTop: 16,
                        color: MUTED,
                        fontSize: 22,
                    }}
                >
                    The limit moves with time — no hard reset boundary.
                </div>
            </div>

            {/* time axis */}

            <div
                style={{
                    position: "absolute",
                    left: 80,
                    right: 80,
                    top: 820,
                    height: 8,
                    background: `${CYAN} 30`,
                    borderRadius: 10,
                }}
            />

            {/* requests */}

            {Array.from({ length: 18 }).map((_, i) => {
                const x = 80 + i * 53;

                const active =
                    x >= windowX &&
                    x <= windowX + 370;

                return (
                    <RequestDot
                        key={i}
                        x={x}
                        y={800}
                        color={active ? GREEN : RED}
                        size={22}
                    />
                );
            })}

            {/* moving window */}

            <div
                style={{
                    position: "absolute",
                    left: windowX,
                    top: 630,
                    width: 370,
                    height: 310,
                    borderRadius: 30,
                    border: `3px solid ${CYAN} `,
                    background: `${CYAN}08`,
                    boxShadow: `0 0 50px ${CYAN} 20`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 28,
                        top: 25,
                        color: CYAN,
                        fontSize: 20,
                        fontWeight: 950,
                        letterSpacing: 2,
                    }}
                >
                    ROLLING 1 SECOND
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 28,
                        bottom: 35,
                        color: WHITE,
                        fontSize: 48,
                        fontWeight: 950,
                    }}
                >
                    7
                    <span
                        style={{
                            marginLeft: 12,
                            fontSize: 20,
                            color: GREEN,
                        }}
                    >
                        ALLOWED
                    </span>
                </div>
            </div>

            {/* moving arrow */}

            <div
                style={{
                    position: "absolute",
                    left: windowX + 145,
                    top: 950,
                    width: 80,
                    height: 4,
                    background: CYAN,
                    boxShadow: `0 0 15px ${CYAN} `,
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: windowX + 215,
                    top: 940,
                    color: CYAN,
                    fontSize: 17,
                    fontWeight: 900,
                }}
            >
                TIME →
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 80,
                    bottom: 170,
                    color: GREEN,
                    fontSize: 23,
                    fontWeight: 950,
                    letterSpacing: 2,
                }}
            >
                ✓ PRECISE TRAFFIC CONTROL
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// COMPARISON — VISUAL MATRIX
// ============================================================

const ComparisonScene: React.FC = () => {
    const frame = useCurrentFrame();

    const items = [
        {
            name: "TOKEN",
            color: GREEN,
            description: "BURSTS",
            type: "token",
        },
        {
            name: "LEAKY",
            color: PURPLE,
            description: "SMOOTH",
            type: "leaky",
        },
        {
            name: "FIXED",
            color: ORANGE,
            description: "SIMPLE",
            type: "fixed",
        },
        {
            name: "SLIDING",
            color: CYAN,
            description: "PRECISE",
            type: "sliding",
        },
    ];

    return (
        <AbsoluteFill>
            <Background />

            <div
                style={{
                    position: "absolute",
                    left: 65,
                    top: 110,
                }}
            >
                <TopicLabel />

                <div style={{ marginTop: 22 }}>
                    <BigTitle>
                        Four algorithms.
                        <br />
                        Four traffic behaviors.
                    </BigTitle>
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 55,
                    right: 55,
                    top: 565,
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 1fr",
                    gap: 18,
                }}
            >
                {items.map((item, index) => {
                    const p = inAnim(
                        frame,
                        index * 7,
                        16
                    );

                    return (
                        <div
                            key={item.name}
                            style={{
                                height: 300,
                                borderRadius: 28,
                                border: `2px solid ${item.color} 66`,
                                background:
                                    "linear-gradient(145deg, rgba(14,29,47,.95), rgba(5,12,22,.95))",
                                opacity: p,
                                transform: `translateY(${(1 - p) * 35
                                    }px)`,
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    left: 22,
                                    top: 20,
                                    color: item.color,
                                    fontSize: 21,
                                    fontWeight: 950,
                                    letterSpacing: 2,
                                }}
                            >
                                {item.name}
                            </div>

                            {/* visual */}

                            {item.type ===
                                "token" && (
                                    <>
                                        {Array.from({
                                            length: 8,
                                        }).map(
                                            (_, i) => (
                                                <RequestDot
                                                    key={i}
                                                    x={
                                                        35 +
                                                        (i %
                                                            4) *
                                                        50
                                                    }
                                                    y={
                                                        100 +
                                                        Math.floor(
                                                            i /
                                                            4
                                                        ) *
                                                        55
                                                    }
                                                    color={
                                                        GREEN
                                                    }
                                                    size={
                                                        18
                                                    }
                                                />
                                            )
                                        )}

                                        <div
                                            style={{
                                                position:
                                                    "absolute",
                                                right: 45,
                                                top: 125,
                                                width: 80,
                                                height: 5,
                                                background:
                                                    GREEN,
                                                boxShadow: `0 0 15px ${GREEN} `,
                                            }}
                                        />
                                    </>
                                )}

                            {item.type ===
                                "leaky" && (
                                    <>
                                        {Array.from({
                                            length: 5,
                                        }).map(
                                            (_, i) => (
                                                <div
                                                    key={
                                                        i
                                                    }
                                                    style={{
                                                        position:
                                                            "absolute",
                                                        left: 45,
                                                        top:
                                                            95 +
                                                            i *
                                                            30,
                                                        width: 100,
                                                        height: 15,
                                                        borderRadius: 5,
                                                        background:
                                                            `${PURPLE} 55`,
                                                        border: `1px solid ${PURPLE} `,
                                                    }}
                                                />
                                            )
                                        )}

                                        <div
                                            style={{
                                                position:
                                                    "absolute",
                                                right: 65,
                                                top: 125,
                                                width: 80,
                                                height: 5,
                                                background:
                                                    PURPLE,
                                                boxShadow: `0 0 15px ${PURPLE} `,
                                            }}
                                        />
                                    </>
                                )}

                            {item.type ===
                                "fixed" && (
                                    <>
                                        <div
                                            style={{
                                                position:
                                                    "absolute",
                                                left: 35,
                                                right: 35,
                                                top: 125,
                                                height: 3,
                                                background:
                                                    ORANGE,
                                            }}
                                        />

                                        <div
                                            style={{
                                                position:
                                                    "absolute",
                                                left: 170,
                                                top: 80,
                                                height: 100,
                                                width: 3,
                                                background:
                                                    RED,
                                                boxShadow: `0 0 15px ${RED} `,
                                            }}
                                        />
                                    </>
                                )}

                            {item.type ===
                                "sliding" && (
                                    <>
                                        <div
                                            style={{
                                                position:
                                                    "absolute",
                                                left:
                                                    35 +
                                                    ((frame *
                                                        1.8) %
                                                        100),
                                                top: 95,
                                                width: 150,
                                                height: 110,
                                                border: `2px solid ${CYAN} `,
                                                borderRadius: 15,
                                                background: `${CYAN} 10`,
                                            }}
                                        />

                                        {Array.from({
                                            length: 7,
                                        }).map(
                                            (_, i) => (
                                                <RequestDot
                                                    key={i}
                                                    x={
                                                        40 +
                                                        i *
                                                        35
                                                    }
                                                    y={
                                                        150
                                                    }
                                                    color={
                                                        i %
                                                            3 ===
                                                            0
                                                            ? RED
                                                            : GREEN
                                                    }
                                                    size={
                                                        12
                                                    }
                                                />
                                            )
                                        )}
                                    </>
                                )}

                            <div
                                style={{
                                    position:
                                        "absolute",
                                    left: 22,
                                    bottom: 20,
                                    color: WHITE,
                                    fontSize: 18,
                                    fontWeight: 900,
                                }}
                            >
                                {item.description}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// ENDING
// ============================================================

const EndingScene: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill>
            <Background accent={GREEN} />

            <div
                style={{
                    position: "absolute",
                    left: 65,
                    top: 120,
                    width: 900,
                    textAlign: "center",
                }}
            >
                <TopicLabel color={GREEN} />

                <div
                    style={{
                        marginTop: 25,
                        fontSize: 54,
                        lineHeight: 1.08,
                        fontWeight: 950,
                        color: WHITE,
                    }}
                >
                    Which algorithm
                    <br />
                    <span style={{ color: GREEN }}>
                        would you choose?
                    </span>
                </div>
            </div>

            {/* clients */}

            <Server
                x={60}
                y={650}
                color={CYAN}
                label="CLIENTS"
                scale={0.8}
            />

            <Connection
                x={215}
                y={715}
                width={160}
                color={CYAN}
            />

            {/* limiter */}

            <div
                style={{
                    position: "absolute",
                    left: 375,
                    top: 600,
                    width: 300,
                    height: 230,
                    borderRadius: 32,
                    border: `3px solid ${GREEN} `,
                    background: `${GREEN} 0C`,
                    boxShadow: `0 0 60px ${GREEN} 25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        border: `5px solid ${GREEN} `,
                        boxShadow: `0 0 35px ${GREEN} `,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: GREEN,
                        fontSize: 32,
                        fontWeight: 950,
                        transform: `scale(${pulse(
                            frame,
                            10,
                            0.95,
                            1.05
                        )
                            })`,
                    }}
                >
                    ↓
                </div>

                <div
                    style={{
                        marginTop: 18,
                        color: WHITE,
                        fontSize: 22,
                        fontWeight: 950,
                    }}
                >
                    RATE LIMITER
                </div>
            </div>

            <Connection
                x={675}
                y={715}
                width={150}
                color={GREEN}
            />

            <Server
                x={825}
                y={650}
                color={GREEN}
                label="API"
                scale={0.8}
            />

            {/* traffic */}

            {Array.from({ length: 8 }).map(
                (_, i) => (
                    <RequestDot
                        key={i}
                        x={
                            220 +
                            ((frame * 4 +
                                i * 85) %
                                620)
                        }
                        y={
                            700 +
                            Math.sin(i * 2) * 35
                        }
                        color={
                            i % 3 === 0
                                ? RED
                                : GREEN
                        }
                        size={14}
                    />
                )
            )}

            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 150,
                    textAlign: "center",
                    color: MUTED,
                    fontSize: 22,
                    fontWeight: 700,
                }}
            >
                Protect the backend before traffic becomes the incident.
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// CTA
// ============================================================

const CTAScene: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill>
            <Background accent={CYAN} />

            {/* animated network */}

            {Array.from({ length: 24 }).map((_, i) => {
                const angle =
                    (i / 24) * Math.PI * 2;

                const radius = 250;

                const x =
                    540 +
                    Math.cos(angle) *
                    radius;

                const y =
                    850 +
                    Math.sin(angle) *
                    radius;

                return (
                    <RequestDot
                        key={i}
                        x={x}
                        y={y}
                        color={
                            i % 2 === 0
                                ? CYAN
                                : GREEN
                        }
                        size={9}
                    />
                );
            })}

            <div
                style={{
                    position: "absolute",
                    left: 390,
                    top: 700,
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    border: `3px solid ${CYAN} 55`,
                    boxShadow: `0 0 80px ${CYAN} 18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${pulse(
                        frame,
                        15,
                        0.96,
                        1.04
                    )
                        })`,
                }}
            >
                <div
                    style={{
                        color: WHITE,
                        fontSize: 27,
                        fontWeight: 950,
                        letterSpacing: 3,
                    }}
                >
                    AI HUB
                    <br />
                    INSIDER
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 65,
                    right: 65,
                    top: 270,
                    textAlign: "center",
                    color: WHITE,
                    fontSize: 48,
                    lineHeight: 1.1,
                    fontWeight: 950,
                }}
            >
                Learn backend.
                <br />
                Build better systems.
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 230,
                    textAlign: "center",
                    color: GREEN,
                    fontSize: 25,
                    fontWeight: 950,
                    letterSpacing: 2,
                }}
            >
                FOLLOW FOR MORE SYSTEM DESIGN
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// SECTION ROUTER
// ============================================================

const SectionVisual: React.FC<{
    id: string;
}> = ({ id }) => {
    switch (id) {
        case "hook":
            return <HookScene />;

        case "token-bucket":
            return <TokenBucketScene />;

        case "leaky-bucket":
            return <LeakyBucketScene />;

        case "fixed-window":
            return <FixedWindowScene />;

        case "sliding-window":
            return <SlidingWindowScene />;

        case "comparison":
            return <ComparisonScene />;

        case "ending":
            return <EndingScene />;

        case "cta":
            return <CTAScene />;

        default:
            return <HookScene />;
    }
};

// ============================================================
// MAIN
// ============================================================

export const ApiRateLimitingScene: React.FC = () => {
    return (
        <AbsoluteFill
            style={{
                background: BG,
                fontFamily:
                    "Inter, Arial, sans-serif",
                overflow: "hidden",
            }}
        >
            {timeline.sections.map((section) => (
                <Sequence
                    key={section.id}
                    from={section.start}
                    durationInFrames={section.duration}
                >
                    <AbsoluteFill>
                        <SectionVisual
                            id={section.id}
                        />

                        {section.audio && (
                            <Audio
                                src={staticFile(
                                    section.audio
                                )}
                            />
                        )}
                    </AbsoluteFill>
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};  