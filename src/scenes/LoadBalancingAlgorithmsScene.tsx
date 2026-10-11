import React from "react";
import {
    AbsoluteFill,
    Audio,
    Easing,
    interpolate,
    Sequence,
    staticFile,
    useCurrentFrame,
} from "remotion";

import { loadBalancing } from "../../content/load-balancing_algorithms";
import { createTimeline } from "../timeline";

const BG = "#060B12";
const PANEL = "#0B1626";
const CYAN = "#4DB8FF";
const GREEN = "#1FD1A5";
const PURPLE = "#9B7CFF";
const ORANGE = "#FFB86C";
const PINK = "#FF6B9D";
const WHITE = "#F4F7FB";
const MUTED = "#8FA3B8";

const timeline = createTimeline(loadBalancing);

type ServerProps = {
    x: number;
    y: number;
    label: string;
    active?: boolean;
    color?: string;
    frame: number;
    connections?: number;
};

const ease = Easing.out(Easing.cubic);

const clamp = (value: number, min = 0, max = 1) =>
    Math.max(min, Math.min(max, value));

const pulse = (frame: number, speed = 1) =>
    (Math.sin(frame * 0.12 * speed) + 1) / 2;

const fadeIn = (frame: number, start = 0, length = 18) =>
    interpolate(frame, [start, start + length], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: ease,
    });

const slideUp = (frame: number, start = 0, distance = 40) =>
    interpolate(frame, [start, start + 20], [distance, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: ease,
    });

const AnimatedGrid: React.FC<{ frame: number }> = ({ frame }) => {
    const drift = (frame * 0.35) % 80;

    return (
        <AbsoluteFill
            style={{
                backgroundColor: BG,
                overflow: "hidden",
            }}
        >
            {Array.from({ length: 16 }).map((_, i) => (
                <div
                    key={`v-${i}`}
                    style={{
                        position: "absolute",
                        left: i * 80 - drift,
                        top: 0,
                        width: 1,
                        height: "100%",
                        background: "rgba(77,184,255,0.055)",
                    }}
                />
            ))}

            {Array.from({ length: 28 }).map((_, i) => (
                <div
                    key={`h-${i}`}
                    style={{
                        position: "absolute",
                        top: i * 80,
                        left: 0,
                        width: "100%",
                        height: 1,
                        background: "rgba(31,209,165,0.035)",
                    }}
                />
            ))}

            <div
                style={{
                    position: "absolute",
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    left: -280,
                    top: 200,
                    background:
                        "radial-gradient(circle, rgba(77,184,255,0.10), transparent 65%)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    right: -250,
                    bottom: 100,
                    background:
                        "radial-gradient(circle, rgba(155,124,255,0.09), transparent 65%)",
                }}
            />
        </AbsoluteFill>
    );
};

const Header: React.FC<{
    title: string;
    subtitle: string;
    frame: number;
}> = ({ title, subtitle, frame }) => {
    const opacity = fadeIn(frame);
    const y = slideUp(frame);

    return (
        <div
            style={{
                position: "absolute",
                top: 95,
                left: 70,
                right: 70,
                opacity,
                transform: `translateY(${y}px)`,
            }}
        >
            <div
                style={{
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: 4,
                    color: GREEN,
                    marginBottom: 16,
                    textTransform: "uppercase",
                }}
            >
                AI HUB INSIDER · SYSTEM DESIGN
            </div>

            <div
                style={{
                    fontSize: 52,
                    lineHeight: 1.05,
                    fontWeight: 900,
                    color: WHITE,
                    letterSpacing: -1.5,
                }}
            >
                {title}
            </div>

            <div
                style={{
                    marginTop: 18,
                    fontSize: 25,
                    lineHeight: 1.35,
                    color: MUTED,
                    maxWidth: 850,
                }}
            >
                {subtitle}
            </div>

            <div
                style={{
                    marginTop: 25,
                    width: 180,
                    height: 5,
                    borderRadius: 10,
                    background: `linear-gradient(90deg, ${CYAN}, ${GREEN}, ${PURPLE})`,
                }}
            />
        </div>
    );
};

const Server: React.FC<ServerProps> = ({
    x,
    y,
    label,
    active,
    color = CYAN,
    frame,
    connections,
}) => {
    const p = pulse(frame, 1.2);

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 220,
                height: 125,
                transform: active
                    ? `scale(${1 + p * 0.035})`
                    : "scale(1)",
                borderRadius: 24,
                border: `2px solid ${active ? color : "rgba(255,255,255,0.10)"
                    }`,
                background: active
                    ? `linear-gradient(145deg, rgba(11,22,38,0.98), rgba(11,30,45,0.98))`
                    : PANEL,
                boxShadow: active
                    ? `0 0 ${25 + p * 25}px ${color}55`
                    : "0 15px 35px rgba(0,0,0,0.25)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    fontSize: 21,
                    fontWeight: 800,
                    color: active ? color : WHITE,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    display: "flex",
                    gap: 7,
                    marginTop: 14,
                }}
            >
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background:
                                active && i < 3
                                    ? color
                                    : "rgba(255,255,255,0.16)",
                            boxShadow:
                                active && i < 3
                                    ? `0 0 12px ${color}`
                                    : "none",
                        }}
                    />
                ))}
            </div>

            {connections !== undefined && (
                <div
                    style={{
                        marginTop: 10,
                        fontSize: 16,
                        color: MUTED,
                    }}
                >
                    {connections} connections
                </div>
            )}
        </div>
    );
};

const LoadBalancer: React.FC<{
    x: number;
    y: number;
    frame: number;
}> = ({ x, y, frame }) => {
    const p = pulse(frame);

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 270,
                height: 145,
                borderRadius: 30,
                background:
                    "linear-gradient(145deg, rgba(18,46,70,0.98), rgba(9,25,40,0.98))",
                border: `2px solid ${CYAN}`,
                boxShadow: `0 0 ${35 + p * 25}px ${CYAN}55`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    fontSize: 31,
                    fontWeight: 900,
                    color: WHITE,
                }}
            >
                LOAD BALANCER
            </div>

            <div
                style={{
                    marginTop: 12,
                    fontSize: 17,
                    color: CYAN,
                    letterSpacing: 2,
                }}
            >
                ROUTING ENGINE
            </div>

            <div
                style={{
                    position: "absolute",
                    top: -7,
                    right: 25,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: GREEN,
                    boxShadow: `0 0 18px ${GREEN}`,
                }}
            />
        </div>
    );
};

const Packet: React.FC<{
    frame: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    delay?: number;
    color?: string;
}> = ({
    frame,
    startX,
    startY,
    endX,
    endY,
    delay = 0,
    color = CYAN,
}) => {
        const progress = clamp((frame - delay) / 35);

        if (progress <= 0) return null;

        const x = interpolate(progress, [0, 1], [startX, endX]);
        const y = interpolate(progress, [0, 1], [startY, endY]);

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 22px ${color}, 0 0 45px ${color}77`,
                    transform: `scale(${1 + Math.sin(progress * Math.PI) * 0.5})`,
                }}
            />
        );
    };

const FlowLine: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    frame?: number;
}> = ({ x1, y1, x2, y2, color = CYAN, frame = 0 }) => {
    const opacity = 0.25 + pulse(frame, 0.7) * 0.3;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    return (
        <div
            style={{
                position: "absolute",
                left: x1,
                top: y1,
                width: length,
                height: 3,
                transformOrigin: "left center",
                transform: `rotate(${angle}rad)`,
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                opacity,
            }}
        />
    );
};

const HookVisual: React.FC<{ frame: number }> = ({ frame }) => {
    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: 600,
                    left: 70,
                    fontSize: 25,
                    color: MUTED,
                    opacity: fadeIn(frame, 10),
                }}
            >
                Incoming traffic
            </div>

            <LoadBalancer x={405} y={760} frame={frame} />

            <Server
                x={80}
                y={1030}
                label="SERVER 1"
                active
                color={CYAN}
                frame={frame}
            />

            <Server
                x={430}
                y={1030}
                label="SERVER 2"
                active
                color={GREEN}
                frame={frame}
            />

            <Server
                x={780}
                y={1030}
                label="SERVER 3"
                active
                color={PURPLE}
                frame={frame}
            />

            <FlowLine
                x1={540}
                y1={905}
                x2={190}
                y2={1030}
                color={CYAN}
                frame={frame}
            />

            <FlowLine
                x1={540}
                y1={905}
                x2={540}
                y2={1030}
                color={GREEN}
                frame={frame}
            />

            <FlowLine
                x1={540}
                y1={905}
                x2={890}
                y2={1030}
                color={PURPLE}
                frame={frame}
            />

            {[0, 12, 24, 36].map((delay) => (
                <Packet
                    key={delay}
                    frame={frame}
                    startX={170}
                    startY={650}
                    endX={525}
                    endY={800}
                    delay={delay}
                    color={CYAN}
                />
            ))}

            <div
                style={{
                    position: "absolute",
                    top: 1250,
                    left: 70,
                    right: 70,
                    textAlign: "center",
                    fontSize: 38,
                    fontWeight: 900,
                    color: WHITE,
                    opacity: fadeIn(frame, 20),
                }}
            >
                WHO GETS THE NEXT REQUEST?
            </div>
        </>
    );
};

const RoundRobinVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const selected = Math.floor(frame / 20) % 3;

    return (
        <>
            <LoadBalancer x={405} y={620} frame={frame} />

            <Server
                x={80}
                y={1010}
                label="SERVER 1"
                active={selected === 0}
                color={CYAN}
                frame={frame}
            />

            <Server
                x={430}
                y={1010}
                label="SERVER 2"
                active={selected === 1}
                color={GREEN}
                frame={frame}
            />

            <Server
                x={780}
                y={1010}
                label="SERVER 3"
                active={selected === 2}
                color={PURPLE}
                frame={frame}
            />

            {[190, 540, 890].map((x, i) => (
                <FlowLine
                    key={x}
                    x1={540}
                    y1={765}
                    x2={x}
                    y2={1010}
                    color={[CYAN, GREEN, PURPLE][i]}
                    frame={frame}
                />
            ))}

            <Packet
                frame={frame}
                startX={540}
                startY={780}
                endX={[190, 540, 890][selected]}
                endY={1020}
                color={[CYAN, GREEN, PURPLE][selected]}
            />

            <div
                style={{
                    position: "absolute",
                    top: 850,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontSize: 31,
                    fontWeight: 800,
                    color: WHITE,
                }}
            >
                {`REQUEST → SERVER ${selected + 1}`}
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 1270,
                    left: 70,
                    right: 70,
                    textAlign: "center",
                    fontSize: 34,
                    color: CYAN,
                    fontWeight: 900,
                }}
            >
                1 → 2 → 3 → 1 → 2 → 3
            </div>
        </>
    );
};

const WeightedRoundRobinVisual: React.FC<{ frame: number }> = ({
    frame,
}) => {
    const weights = [5, 3, 1];
    const colors = [CYAN, GREEN, PURPLE];
    const total = weights.reduce((a, b) => a + b, 0);

    const active = Math.floor(frame / 12) % total;

    let selected = 0;
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (active < cumulative) {
            selected = i;
            break;
        }
    }

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: 600,
                    left: 70,
                    fontSize: 25,
                    color: MUTED,
                }}
            >
                Traffic allocation
            </div>

            {weights.map((weight, i) => {
                const width = weight * 110;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: 80,
                            top: 730 + i * 145,
                            width: 900,
                            height: 95,
                            borderRadius: 20,
                            background: PANEL,
                            border: `2px solid ${selected === i
                                ? colors[i]
                                : "rgba(255,255,255,0.08)"
                                }`,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width,
                                background: `${colors[i]}22`,
                                borderRight: `4px solid ${colors[i]}`,
                            }}
                        />

                        <div
                            style={{
                                position: "absolute",
                                left: 25,
                                top: 28,
                                fontSize: 25,
                                fontWeight: 900,
                                color: WHITE,
                            }}
                        >
                            SERVER {i + 1}
                        </div>

                        <div
                            style={{
                                position: "absolute",
                                right: 30,
                                top: 25,
                                fontSize: 32,
                                fontWeight: 900,
                                color: colors[i],
                            }}
                        >
                            {weight}×
                        </div>
                    </div>
                );
            })}

            <div
                style={{
                    position: "absolute",
                    top: 1230,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontSize: 30,
                    fontWeight: 800,
                    color: WHITE,
                }}
            >
                More capacity → More traffic
            </div>
        </>
    );
};

const LeastConnectionsVisual: React.FC<{ frame: number }> = ({
    frame,
}) => {
    const values = [8, 3, 6];
    const colors = [CYAN, GREEN, PURPLE];
    const selected = 1;

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: 590,
                    left: 70,
                    right: 70,
                    textAlign: "center",
                    fontSize: 34,
                    fontWeight: 900,
                    color: WHITE,
                }}
            >
                Find the server with
                <span style={{ color: GREEN }}> FEWEST CONNECTIONS</span>
            </div>

            {values.map((value, i) => {
                const animated = value + Math.sin(frame * 0.08 + i) * 1.2;

                return (
                    <div key={i}>
                        <Server
                            x={80 + i * 350}
                            y={850}
                            label={`SERVER ${i + 1}`}
                            active={i === selected}
                            color={colors[i]}
                            frame={frame}
                            connections={value}
                        />

                        {Array.from({ length: value }).map((_, j) => {
                            const angle =
                                (j / value) * Math.PI * 2 +
                                frame * 0.015;

                            const radius = 115;

                            return (
                                <div
                                    key={j}
                                    style={{
                                        position: "absolute",
                                        left:
                                            190 +
                                            i * 350 +
                                            Math.cos(angle) * radius,
                                        top:
                                            910 +
                                            Math.sin(angle) * radius * 0.55,
                                        width: 9,
                                        height: 9,
                                        borderRadius: "50%",
                                        background: colors[i],
                                        opacity: 0.7,
                                        boxShadow: `0 0 10px ${colors[i]}`,
                                    }}
                                />
                            );
                        })}
                    </div>
                );
            })}

            <div
                style={{
                    position: "absolute",
                    top: 1230,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontSize: 40,
                    fontWeight: 900,
                    color: GREEN,
                }}
            >
                3 CONNECTIONS ← SELECTED
            </div>
        </>
    );
};

const IpHashVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const phase = Math.floor(frame / 30) % 3;

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: 600,
                    left: 80,
                    width: 920,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {[
                    ["CLIENT", "103.24.18.5"],
                    ["HASH()", "H(103.24.18.5)"],
                    ["SERVER", "SERVER 2"],
                ].map(([title, value], i) => (
                    <React.Fragment key={title}>
                        <div
                            style={{
                                width: 245,
                                height: 180,
                                borderRadius: 28,
                                background: PANEL,
                                border: `2px solid ${[CYAN, PURPLE, GREEN][i]
                                    }`,
                                boxShadow:
                                    phase === i
                                        ? `0 0 35px ${[CYAN, PURPLE, GREEN][i]
                                        }66`
                                        : "none",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 18,
                                    color: MUTED,
                                    letterSpacing: 2,
                                }}
                            >
                                {title}
                            </div>

                            <div
                                style={{
                                    marginTop: 20,
                                    fontSize: 25,
                                    fontWeight: 900,
                                    color: [CYAN, PURPLE, GREEN][i],
                                }}
                            >
                                {value}
                            </div>
                        </div>

                        {i < 2 && (
                            <div
                                style={{
                                    fontSize: 42,
                                    color: WHITE,
                                    opacity: 0.8,
                                }}
                            >
                                →
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 930,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontSize: 34,
                    color: GREEN,
                    fontWeight: 900,
                }}
            >
                SAME CLIENT → SAME SERVER
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 1060,
                    left: 130,
                    right: 130,
                    height: 170,
                    borderRadius: 30,
                    background: "rgba(31,209,165,0.06)",
                    border: "1px solid rgba(31,209,165,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 27,
                    color: MUTED,
                    textAlign: "center",
                    padding: 30,
                }}
            >
                Session persistence
                <br />
                without storing the mapping at the client
            </div>
        </>
    );
};

const RandomVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const selected = Math.floor(frame / 25) % 3;
    const rotation = frame * 5;

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: 600,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        width: 180,
                        height: 180,
                        borderRadius: 35,
                        background:
                            "linear-gradient(145deg, #18283D, #0A1422)",
                        border: `3px solid ${ORANGE}`,
                        boxShadow: `0 0 45px ${ORANGE}66`,
                        transform: `rotate(${rotation}deg)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 70,
                    }}
                >
                    ⚄
                </div>
            </div>

            {[0, 1, 2].map((i) => (
                <Server
                    key={i}
                    x={80 + i * 350}
                    y={1000}
                    label={`SERVER ${i + 1}`}
                    active={selected === i}
                    color={[CYAN, GREEN, PURPLE][i]}
                    frame={frame}
                />
            ))}

            <div
                style={{
                    position: "absolute",
                    top: 860,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontSize: 38,
                    fontWeight: 900,
                    color: ORANGE,
                }}
            >
                RANDOM → SERVER {selected + 1}
            </div>

            {Array.from({ length: 10 }).map((_, i) => {
                const angle = (i / 10) * Math.PI * 2 + frame * 0.025;
                const radius = 170 + Math.sin(frame * 0.04 + i) * 30;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: 540 + Math.cos(angle) * radius,
                            top: 690 + Math.sin(angle) * radius,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: ORANGE,
                            boxShadow: `0 0 12px ${ORANGE}`,
                        }}
                    />
                );
            })}
        </>
    );
};

const LeastResponseTimeVisual: React.FC<{ frame: number }> = ({
    frame,
}) => {
    const values = [120, 42, 180];
    const colors = [CYAN, GREEN, PURPLE];
    const selected = 1;

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: 590,
                    left: 70,
                    fontSize: 28,
                    color: MUTED,
                }}
            >
                Server latency
            </div>

            {values.map((value, i) => {
                const width = interpolate(
                    clamp((frame - 10) / 25),
                    [0, 1],
                    [0, value * 3],
                );

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            top: 730 + i * 190,
                            left: 80,
                            right: 80,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 15,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 27,
                                    fontWeight: 800,
                                    color: WHITE,
                                }}
                            >
                                SERVER {i + 1}
                            </span>

                            <span
                                style={{
                                    fontSize: 28,
                                    fontWeight: 900,
                                    color: colors[i],
                                }}
                            >
                                {value}ms
                            </span>
                        </div>

                        <div
                            style={{
                                height: 48,
                                borderRadius: 24,
                                background: "rgba(255,255,255,0.06)",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    width: Math.min(width, 800),
                                    height: "100%",
                                    borderRadius: 24,
                                    background: `linear-gradient(90deg, ${colors[i]}55, ${colors[i]})`,
                                    boxShadow:
                                        i === selected
                                            ? `0 0 30px ${colors[i]}88`
                                            : "none",
                                }}
                            />
                        </div>
                    </div>
                );
            })}

            <div
                style={{
                    position: "absolute",
                    top: 1320,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontSize: 40,
                    fontWeight: 900,
                    color: GREEN,
                }}
            >
                ⚡ 42ms → FASTEST SERVER
            </div>
        </>
    );
};

const FinalVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const items = [
        ["ROUND ROBIN", "Similar servers", CYAN],
        ["WEIGHTED RR", "Different capacity", GREEN],
        ["LEAST CONNECTIONS", "Long-lived connections", PURPLE],
        ["IP HASH", "Session affinity", PINK],
        ["RANDOM", "Simple stateless", ORANGE],
        ["RESPONSE TIME", "Variable performance", CYAN],
    ] as const;

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: 570,
                    left: 70,
                    right: 70,
                    fontSize: 31,
                    color: MUTED,
                    textAlign: "center",
                }}
            >
                Match the algorithm to your workload
            </div>

            {items.map(([name, desc, color], i) => {
                const row = Math.floor(i / 2);
                const col = i % 2;

                const start = i * 7;

                const opacity = fadeIn(frame, start, 14);
                const y = slideUp(frame, start, 35);

                return (
                    <div
                        key={name}
                        style={{
                            position: "absolute",
                            left: col === 0 ? 65 : 555,
                            top: 700 + row * 205,
                            width: 460,
                            height: 165,
                            borderRadius: 28,
                            background: PANEL,
                            border: `2px solid ${color}66`,
                            boxShadow:
                                opacity > 0.8
                                    ? `0 0 25px ${color}22`
                                    : "none",
                            opacity,
                            transform: `translateY(${y}px)`,
                            padding: 25,
                            boxSizing: "border-box",
                        }}
                    >
                        <div
                            style={{
                                width: 45,
                                height: 6,
                                borderRadius: 10,
                                background: color,
                                boxShadow: `0 0 14px ${color}`,
                                marginBottom: 18,
                            }}
                        />

                        <div
                            style={{
                                fontSize: 22,
                                fontWeight: 900,
                                color,
                            }}
                        >
                            {name}
                        </div>

                        <div
                            style={{
                                marginTop: 14,
                                fontSize: 21,
                                color: WHITE,
                            }}
                        >
                            {desc}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

const AlgorithmVisual: React.FC<{
    id: string;
    frame: number;
}> = ({ id, frame }) => {
    switch (id) {
        case "hook":
            return <HookVisual frame={frame} />;

        case "round-robin":
            return <RoundRobinVisual frame={frame} />;

        case "weighted-round-robin":
            return <WeightedRoundRobinVisual frame={frame} />;

        case "least-connections":
            return <LeastConnectionsVisual frame={frame} />;

        case "ip-hash":
            return <IpHashVisual frame={frame} />;

        case "random":
            return <RandomVisual frame={frame} />;

        case "least-response-time":
            return <LeastResponseTimeVisual frame={frame} />;

        case "final":
            return <FinalVisual frame={frame} />;

        default:
            return null;
    }
};

export const LoadBalancingAlgorithmsScene: React.FC = () => {
    const frame = useCurrentFrame();

    const current = timeline.sections.find(
        (item) =>
            frame >= item.start &&
            frame < item.start + item.duration,
    );

    if (!current) {
        return null;
    }

    const section = loadBalancing.sections.find(
        (item) => item.id === current.id,
    );

    if (!section) {
        return null;
    }

    const localFrame = frame - current.start;

    return (
        <AbsoluteFill
            style={{
                backgroundColor: BG,
                color: WHITE,
                fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                overflow: "hidden",
            }}
        >
            <AnimatedGrid frame={frame} />

            <Header
                title={section.title}
                subtitle={section.subtitle}
                frame={localFrame}
            />

            <AlgorithmVisual
                id={section.id}
                frame={localFrame}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: 70,
                    left: 70,
                    right: 70,
                    height: 5,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.08)",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${interpolate(
                            localFrame,
                            [0, current.duration],
                            [0, 100],
                            {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                            },
                        )}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${CYAN}, ${GREEN}, ${PURPLE})`,
                    }}
                />
            </div>

            {timeline.sections.map((audioSection) => (
                <Sequence
                    key={audioSection.id}
                    from={audioSection.start}
                    durationInFrames={audioSection.duration}
                >
                    <Audio src={staticFile(audioSection.audio)} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};