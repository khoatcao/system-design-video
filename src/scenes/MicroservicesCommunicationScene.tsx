import React from "react";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    interpolate,
    spring,
    staticFile,
    useCurrentFrame,
} from "remotion";

import microservicesCommunication from "../../content/microservices-communication";
import { createTimeline, FPS } from "../timeline";

/* =========================================================
   COLORS
========================================================= */

const C = {
    bg: "#07111F",
    bg2: "#0B1626",
    panel: "#102238",

    cyan: "#4DB8FF",
    green: "#1FD1A5",
    purple: "#9B7CFF",
    orange: "#FFB86C",
    pink: "#FF6B9D",

    white: "#F4F7FB",
    muted: "#8FA3B8",
    line: "#28445F",

    red: "#FF6B6B",
};

/* =========================================================
   GLOBAL TIMELINE
========================================================= */

const timeline = createTimeline(microservicesCommunication);

/* =========================================================
   BACKGROUND
========================================================= */

const Background: React.FC<{
    intensity?: number;
}> = ({ intensity = 1 }) => {
    const frame = useCurrentFrame();

    const pulse = interpolate(
        Math.sin(frame * 0.045),
        [-1, 1],
        [0.15, 0.35]
    );

    return (
        <AbsoluteFill
            style={{
                background: C.bg,
                overflow: "hidden",
            }}
        >
            {/* Deep gradient layers */}
            <AbsoluteFill
                style={{
                    background:
                        "radial-gradient(circle at 50% 25%, rgba(77,184,255,0.13), transparent 38%)",
                }}
            />

            <AbsoluteFill
                style={{
                    background:
                        "radial-gradient(circle at 15% 80%, rgba(155,124,255,0.08), transparent 32%)",
                }}
            />

            <AbsoluteFill
                style={{
                    background:
                        "radial-gradient(circle at 90% 70%, rgba(31,209,165,0.07), transparent 30%)",
                }}
            />

            {/* Grid */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.16 * intensity,
                    backgroundImage: `
                        linear-gradient(rgba(77,184,255,0.13) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(77,184,255,0.13) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px",
                    transform: `translateY(${(frame * 0.15) % 60}px)`,
                }}
            />

            {/* Floating particles */}
            {Array.from({ length: 28 }).map((_, i) => {
                const x = (i * 83) % 1080;
                const baseY = (i * 137) % 1920;

                const y =
                    (baseY - frame * (0.25 + (i % 4) * 0.08)) %
                    2020;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x,
                            top: y < 0 ? y + 2020 : y,
                            width: i % 5 === 0 ? 4 : 2,
                            height: i % 5 === 0 ? 4 : 2,
                            borderRadius: "50%",
                            background:
                                i % 3 === 0
                                    ? C.cyan
                                    : i % 3 === 1
                                        ? C.green
                                        : C.purple,
                            opacity: 0.15 + pulse,
                            boxShadow: `0 0 12px ${i % 3 === 0
                                ? C.cyan
                                : i % 3 === 1
                                    ? C.green
                                    : C.purple
                                }`,
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};

/* =========================================================
   GLOW NODE
========================================================= */

const Node: React.FC<{
    x: number;
    y: number;
    label: string;
    color?: string;
    size?: number;
    icon?: string;
}> = ({
    x,
    y,
    label,
    color = C.cyan,
    size = 110,
    icon,
}) => {
        const frame = useCurrentFrame();

        const scale = spring({
            frame,
            fps: FPS,
            config: {
                damping: 14,
                stiffness: 90,
            },
        });

        const pulse =
            1 +
            Math.sin(frame * 0.08 + x * 0.01) * 0.025;

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: size,
                    height: size,
                    transform: `translate(-50%, -50%) scale(${scale * pulse
                        })`,
                }}
            >
                {/* Glow */}
                <div
                    style={{
                        position: "absolute",
                        inset: -18,
                        borderRadius: 28,
                        background: color,
                        opacity: 0.08,
                        filter: "blur(18px)",
                    }}
                />

                {/* Outer ring */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 24,
                        border: `2px solid ${color}`,
                        background: `linear-gradient(145deg, ${color}18, ${C.panel}f5)`,
                        boxShadow: `
                        0 0 30px ${color}20,
                        inset 0 0 20px ${color}08
                    `,
                    }}
                />

                {/* Inner icon */}
                <div
                    style={{
                        position: "absolute",
                        inset: 16,
                        borderRadius: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `${color}12`,
                        border: `1px solid ${color}35`,
                        color,
                        fontSize: icon ? 30 : 20,
                        fontWeight: 800,
                    }}
                >
                    {icon || "◆"}
                </div>

                {/* Label */}
                <div
                    style={{
                        position: "absolute",
                        top: size + 12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        whiteSpace: "nowrap",
                        color: C.white,
                        fontSize: 24,
                        fontWeight: 700,
                        letterSpacing: -0.4,
                    }}
                >
                    {label}
                </div>
            </div>
        );
    };

/* =========================================================
   CONNECTION
========================================================= */

const Connection: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    width?: number;
    dashed?: boolean;
}> = ({
    x1,
    y1,
    x2,
    y2,
    color = C.cyan,
    width = 3,
    dashed = false,
}) => {
        const frame = useCurrentFrame();

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        const flow = (frame * 1.5) % 28;

        return (
            <>
                <div
                    style={{
                        position: "absolute",
                        left: x1,
                        top: y1,
                        width: length,
                        height: width,
                        transformOrigin: "0 50%",
                        transform: `rotate(${angle}deg)`,
                        background: dashed
                            ? `repeating-linear-gradient(
                            90deg,
                            ${color}90 0px,
                            ${color}90 12px,
                            transparent 12px,
                            transparent 22px
                        )`
                            : `linear-gradient(
                            90deg,
                            transparent,
                            ${color}65,
                            ${color}90,
                            transparent
                        )`,
                        backgroundPosition: `${-flow}px 0`,
                        boxShadow: `0 0 12px ${color}35`,
                    }}
                />

                {!dashed && (
                    <div
                        style={{
                            position: "absolute",
                            left:
                                x1 +
                                ((x2 - x1) *
                                    ((frame * 0.018) % 1)),
                            top:
                                y1 +
                                ((y2 - y1) *
                                    ((frame * 0.018) % 1)),
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            background: color,
                            boxShadow: `0 0 15px ${color}`,
                        }}
                    />
                )}
            </>
        );
    };

/* =========================================================
   PACKET
========================================================= */

const Packet: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    label?: string;
    speed?: number;
    delay?: number;
}> = ({
    x1,
    y1,
    x2,
    y2,
    color = C.cyan,
    label,
    speed = 0.012,
    delay = 0,
}) => {
        const frame = useCurrentFrame();

        const progress =
            ((frame * speed + delay) % 1);

        const x = interpolate(progress, [0, 1], [x1, x2]);
        const y = interpolate(progress, [0, 1], [y1, y2]);

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    transform: "translate(-50%, -50%)",
                    zIndex: 20,
                }}
            >
                <div
                    style={{
                        width: 15,
                        height: 15,
                        borderRadius: 50,
                        background: color,
                        boxShadow: `
                        0 0 8px ${color},
                        0 0 22px ${color}
                    `,
                    }}
                />

                {label && (
                    <div
                        style={{
                            position: "absolute",
                            top: 20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            padding: "5px 10px",
                            borderRadius: 8,
                            background: `${C.bg}e8`,
                            border: `1px solid ${color}55`,
                            color,
                            fontSize: 15,
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {label}
                    </div>
                )}
            </div>
        );
    };

/* =========================================================
   TITLE
========================================================= */

const SectionTitle: React.FC<{
    eyebrow: string;
    title: string;
    color: string;
}> = ({ eyebrow, title, color }) => {
    const frame = useCurrentFrame();

    const opacity = interpolate(frame, [0, 18], [0, 1], {
        extrapolateRight: "clamp",
    });

    const y = interpolate(frame, [0, 20], [35, 0], {
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                top: 100,
                left: 70,
                right: 70,
                opacity,
                transform: `translateY(${y}px)`,
                zIndex: 100,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 14,
                }}
            >
                <div
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: color,
                        boxShadow: `0 0 15px ${color}`,
                    }}
                />

                <div
                    style={{
                        color,
                        fontSize: 21,
                        fontWeight: 900,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                    }}
                >
                    {eyebrow}
                </div>
            </div>

            <div
                style={{
                    color: C.white,
                    fontSize: 54,
                    fontWeight: 900,
                    lineHeight: 1.02,
                    letterSpacing: -2,
                }}
            >
                {title}
            </div>
        </div>
    );
};

/* =========================================================
   SMALL CHIP
========================================================= */

const Chip: React.FC<{
    x: number;
    y: number;
    text: string;
    color: string;
}> = ({ x, y, text, color }) => {
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                padding: "8px 14px",
                borderRadius: 999,
                border: `1px solid ${color}55`,
                background: `${color}12`,
                color,
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: 0.3,
            }}
        >
            {text}
        </div>
    );
};

const HookScene = () => {
    const frame = useCurrentFrame();

    const pulse = 1 + Math.sin(frame * 0.08) * 0.04;

    /*
     * Layout
     *
     * CLIENT
     *    │
     *    ▼
     * API GATEWAY
     *    │
     * ┌──┼──────────────┐
     * ▼  ▼              ▼
     * USER ORDER       PAYMENT
     *      │
     *      ▼
     *    BROKER
     *   /  |   \
     *  ▼   ▼    ▼
     * EMAIL ANALYTICS NOTIFICATION
     */

    return (
        <AbsoluteFill>
            <Background intensity={1.5} />

            {/* =====================================================
                TOP TITLE
            ===================================================== */}

            <div
                style={{
                    position: "absolute",
                    top: 85,
                    left: 65,
                    right: 65,
                    zIndex: 100,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 14,
                    }}
                >
                    <div
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: C.cyan,
                            boxShadow: `0 0 18px ${C.cyan}`,
                        }}
                    />

                    <div
                        style={{
                            color: C.cyan,
                            fontSize: 19,
                            fontWeight: 900,
                            letterSpacing: 3,
                        }}
                    >
                        MICROSERVICES
                    </div>
                </div>

                <div
                    style={{
                        color: C.white,
                        fontSize: 52,
                        fontWeight: 900,
                        lineHeight: 1,
                        letterSpacing: -2,
                    }}
                >
                    How do services
                    <br />
                    <span style={{ color: C.cyan }}>
                        communicate?
                    </span>
                </div>
            </div>

            {/* =====================================================
                CLIENT
            ===================================================== */}

            <div
                style={{
                    position: "absolute",
                    left: 540,
                    top: 420,
                    transform: "translateX(-50%)",
                    zIndex: 20,
                }}
            >
                <div
                    style={{
                        width: 150,
                        height: 90,
                        borderRadius: 24,
                        background: `
                            linear-gradient(
                                145deg,
                                ${C.cyan}20,
                                ${C.panel}
                            )
                        `,
                        border: `2px solid ${C.cyan}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `
                            0 0 35px ${C.cyan}25,
                            inset 0 0 25px ${C.cyan}08
                        `,
                    }}
                >
                    <div
                        style={{
                            color: C.cyan,
                            fontSize: 28,
                            fontWeight: 900,
                        }}
                    >
                        CLIENT
                    </div>

                    <div
                        style={{
                            color: C.muted,
                            fontSize: 14,
                            fontWeight: 700,
                        }}
                    >
                        Browser / App
                    </div>
                </div>
            </div>

            {/* =====================================================
                CLIENT → GATEWAY CONNECTION
            ===================================================== */}

            <Connection
                x1={540}
                y1={510}
                x2={540}
                y2={650}
                color={C.cyan}
                width={4}
            />

            <Packet
                x1={540}
                y1={510}
                x2={540}
                y2={650}
                color={C.cyan}
                label="REQUEST"
                speed={0.012}
            />

            {/* =====================================================
                API GATEWAY
            ===================================================== */}

            <div
                style={{
                    position: "absolute",
                    left: 540,
                    top: 700,
                    transform: "translateX(-50%)",
                    zIndex: 30,
                }}
            >
                {/* rotating outer ring */}

                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 190,
                        height: 190,
                        transform: `
                            translate(-50%, -50%)
                            rotate(${frame * 0.3}deg)
                        `,
                        borderRadius: "50%",
                        border: `1px dashed ${C.cyan}45`,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 165,
                        height: 165,
                        transform: `
                            translate(-50%, -50%)
                            scale(${pulse})
                        `,
                        borderRadius: "50%",
                        background: C.cyan,
                        opacity: 0.05,
                        filter: "blur(25px)",
                    }}
                />

                <div
                    style={{
                        width: 150,
                        height: 115,
                        borderRadius: 28,
                        background: `
                            linear-gradient(
                                145deg,
                                ${C.cyan}25,
                                ${C.panel}
                            )
                        `,
                        border: `2px solid ${C.cyan}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `
                            0 0 45px ${C.cyan}25,
                            inset 0 0 25px ${C.cyan}10
                        `,
                    }}
                >
                    <div
                        style={{
                            color: C.white,
                            fontSize: 28,
                            fontWeight: 900,
                        }}
                    >
                        API
                    </div>

                    <div
                        style={{
                            color: C.cyan,
                            fontSize: 17,
                            fontWeight: 900,
                            letterSpacing: 2,
                        }}
                    >
                        GATEWAY
                    </div>
                </div>
            </div>

            {/* =====================================================
                GATEWAY → SERVICES
            ===================================================== */}

            {/* User */}
            <Connection
                x1={500}
                y1={775}
                x2={210}
                y2={970}
                color={C.green}
                width={4}
            />

            {/* Order */}
            <Connection
                x1={540}
                y1={775}
                x2={540}
                y2={970}
                color={C.orange}
                width={4}
            />

            {/* Payment */}
            <Connection
                x1={580}
                y1={775}
                x2={870}
                y2={970}
                color={C.pink}
                width={4}
            />

            {/* Request packets */}

            <Packet
                x1={500}
                y1={775}
                x2={210}
                y2={970}
                color={C.green}
                label="JSON"
                speed={0.010}
            />

            <Packet
                x1={540}
                y1={775}
                x2={540}
                y2={970}
                color={C.orange}
                label="gRPC"
                speed={0.013}
                delay={0.25}
            />

            <Packet
                x1={580}
                y1={775}
                x2={870}
                y2={970}
                color={C.pink}
                label="REQUEST"
                speed={0.009}
                delay={0.45}
            />

            {/* =====================================================
                SERVICES
            ===================================================== */}

            <Node
                x={210}
                y={1040}
                label="User Service"
                color={C.green}
                size={125}
                icon="U"
            />

            <Node
                x={540}
                y={1040}
                label="Order Service"
                color={C.orange}
                size={125}
                icon="O"
            />

            <Node
                x={870}
                y={1040}
                label="Payment Service"
                color={C.pink}
                size={125}
                icon="$"
            />

            {/* =====================================================
                ORDER → MESSAGE BROKER
            ===================================================== */}

            <Connection
                x1={540}
                y1={1110}
                x2={540}
                y2={1250}
                color={C.orange}
                width={4}
            />

            <Packet
                x1={540}
                y1={1110}
                x2={540}
                y2={1250}
                color={C.orange}
                label="EVENT"
                speed={0.011}
                delay={0.15}
            />

            {/* =====================================================
                MESSAGE BROKER
            ===================================================== */}

            <div
                style={{
                    position: "absolute",
                    left: 540,
                    top: 1320,
                    transform: "translateX(-50%)",
                    width: 270,
                    height: 145,
                    borderRadius: 30,
                    background: `
                        linear-gradient(
                            145deg,
                            ${C.orange}18,
                            ${C.panel}
                        )
                    `,
                    border: `2px solid ${C.orange}75`,
                    boxShadow: `
                        0 0 40px ${C.orange}18,
                        inset 0 0 25px ${C.orange}08
                    `,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        color: C.orange,
                        fontSize: 19,
                        fontWeight: 900,
                        letterSpacing: 2,
                    }}
                >
                    MESSAGE
                </div>

                <div
                    style={{
                        color: C.white,
                        fontSize: 31,
                        fontWeight: 900,
                    }}
                >
                    BROKER
                </div>

                {/* Queue */}

                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 12,
                    }}
                >
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: 16,
                                height: 16,
                                borderRadius: 5,
                                background:
                                    i % 2 === 0
                                        ? C.orange
                                        : C.pink,
                                opacity:
                                    0.55 +
                                    0.45 *
                                    Math.abs(
                                        Math.sin(
                                            frame *
                                            0.06 +
                                            i
                                        )
                                    ),
                                boxShadow: `0 0 10px ${i % 2 === 0
                                    ? C.orange
                                    : C.pink
                                    }`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* =====================================================
                BROKER → CONSUMERS
            ===================================================== */}

            <Connection
                x1={465}
                y1={1390}
                x2={200}
                y2={1510}
                color={C.cyan}
                width={3}
            />

            <Connection
                x1={540}
                y1={1465}
                x2={540}
                y2={1510}
                color={C.green}
                width={3}
            />

            <Connection
                x1={615}
                y1={1390}
                x2={880}
                y2={1510}
                color={C.purple}
                width={3}
            />

            <Packet
                x1={465}
                y1={1390}
                x2={200}
                y2={1510}
                color={C.cyan}
                label="EMAIL"
                speed={0.009}
                delay={0.1}
            />

            <Packet
                x1={540}
                y1={1465}
                x2={540}
                y2={1510}
                color={C.green}
                label="ANALYTICS"
                speed={0.012}
                delay={0.25}
            />

            <Packet
                x1={615}
                y1={1390}
                x2={880}
                y2={1510}
                color={C.purple}
                label="PUSH"
                speed={0.010}
                delay={0.4}
            />

            {/* =====================================================
                CONSUMER NODES
            ===================================================== */}

            <Node
                x={200}
                y={1580}
                label="Email Worker"
                color={C.cyan}
                size={100}
                icon="✉"
            />

            <Node
                x={540}
                y={1580}
                label="Analytics"
                color={C.green}
                size={100}
                icon="▥"
            />

            <Node
                x={880}
                y={1580}
                label="Notification"
                color={C.purple}
                size={100}
                icon="!"
            />

            {/* =====================================================
                FLOATING PROTOCOL LABELS
            ===================================================== */}

            <div
                style={{
                    position: "absolute",
                    left: 80,
                    top: 520,
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `1px solid ${C.cyan}45`,
                    background: `${C.cyan}10`,
                    color: C.cyan,
                    fontSize: 15,
                    fontWeight: 900,
                }}
            >
                REQUEST
            </div>

            <div
                style={{
                    position: "absolute",
                    right: 80,
                    top: 850,
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `1px solid ${C.orange}45`,
                    background: `${C.orange}10`,
                    color: C.orange,
                    fontSize: 15,
                    fontWeight: 900,
                }}
            >
                SERVICE CALL
            </div>

            {/* =====================================================
                BOTTOM MESSAGE
            ===================================================== */}

            <div
                style={{
                    position: "absolute",
                    left: 100,
                    right: 100,
                    bottom: 70,
                    textAlign: "center",
                    color: C.muted,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    opacity:
                        0.7 +
                        Math.sin(frame * 0.04) * 0.2,
                }}
            >
                One request can trigger multiple services
            </div>
        </AbsoluteFill>
    );
};

/* =========================================================
   REST
========================================================= */

const RestScene = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill>
            <Background />

            <SectionTitle
                eyebrow="01 · SYNCHRONOUS"
                title="REST"
                color={C.cyan}
            />

            <Node
                x={180}
                y={850}
                label="Client"
                color={C.green}
                size={120}
                icon="⌂"
            />

            <Node
                x={540}
                y={850}
                label="User API"
                color={C.cyan}
                size={140}
                icon="API"
            />

            <Node
                x={900}
                y={850}
                label="Database"
                color={C.purple}
                size={120}
                icon="DB"
            />

            <Connection
                x1={240}
                y1={850}
                x2={470}
                y2={850}
                color={C.cyan}
            />

            <Connection
                x1={610}
                y1={850}
                x2={840}
                y2={850}
                color={C.purple}
            />

            <Packet
                x1={240}
                y1={850}
                x2={470}
                y2={850}
                color={C.green}
                label="GET /users"
                speed={0.012}
            />

            <Packet
                x1={610}
                y1={850}
                x2={840}
                y2={850}
                color={C.purple}
                label="QUERY"
                speed={0.015}
                delay={0.35}
            />

            <Packet
                x1={470}
                y1={850}
                x2={240}
                y2={850}
                color={C.cyan}
                label="200 OK"
                speed={0.012}
                delay={0.55}
            />

            {/* JSON payload */}

            <div
                style={{
                    position: "absolute",
                    left: 180,
                    top: 1120,
                    width: 720,
                    padding: 28,
                    borderRadius: 22,
                    border: `1px solid ${C.cyan}45`,
                    background: `${C.panel}dd`,
                    boxShadow: `0 20px 60px ${C.cyan}12`,
                    transform: `translateY(${Math.sin(frame * 0.04) * 5
                        }px)`,
                }}
            >
                <div
                    style={{
                        color: C.cyan,
                        fontSize: 18,
                        fontWeight: 900,
                        marginBottom: 15,
                    }}
                >
                    HTTP RESPONSE
                </div>

                <div
                    style={{
                        fontFamily: "monospace",
                        fontSize: 25,
                        lineHeight: 1.55,
                        color: C.white,
                    }}
                >
                    {"{"}
                    <br />
                    {"  "}
                    <span style={{ color: C.green }}>
                        "id"
                    </span>
                    : 42,
                    <br />
                    {"  "}
                    <span style={{ color: C.green }}>
                        "name"
                    </span>
                    : <span style={{ color: C.orange }}>
                        "Tonny"
                    </span>
                    <br />
                    {"}"}
                </div>
            </div>

            <Chip x={190} y={1430} text="JSON" color={C.orange} />
            <Chip x={320} y={1430} text="HTTP" color={C.cyan} />
            <Chip x={450} y={1430} text="Simple" color={C.green} />
            <Chip x={590} y={1430} text="Public API" color={C.purple} />
        </AbsoluteFill>
    );
};

/* =========================================================
   GRPC
========================================================= */

const GrpcScene = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill>
            <Background intensity={1.15} />

            <SectionTitle
                eyebrow="02 · INTERNAL RPC"
                title="gRPC"
                color={C.green}
            />

            <Node
                x={220}
                y={820}
                label="Order Service"
                color={C.cyan}
                size={150}
                icon="O"
            />

            <Node
                x={860}
                y={820}
                label="Payment Service"
                color={C.orange}
                size={150}
                icon="$"
            />

            {[0, 1, 2, 3].map((i) => {
                const y = 700 + i * 80;

                return (
                    <React.Fragment key={i}>
                        <Connection
                            x1={300}
                            y1={y}
                            x2={780}
                            y2={y}
                            color={
                                i % 2 === 0
                                    ? C.green
                                    : C.cyan
                            }
                        />

                        <Packet
                            x1={300}
                            y1={y}
                            x2={780}
                            y2={y}
                            color={
                                i % 2 === 0
                                    ? C.green
                                    : C.cyan
                            }
                            label={
                                i === 0
                                    ? "PROTO"
                                    : undefined
                            }
                            speed={0.009 + i * 0.002}
                            delay={i * 0.2}
                        />
                    </React.Fragment>
                );
            })}

            {/* HTTP/2 */}
            <div
                style={{
                    position: "absolute",
                    left: 390,
                    top: 1060,
                    width: 300,
                    textAlign: "center",
                    padding: "16px 20px",
                    borderRadius: 16,
                    background: `${C.green}12`,
                    border: `1px solid ${C.green}45`,
                    color: C.green,
                    fontSize: 23,
                    fontWeight: 900,
                    boxShadow: `0 0 30px ${C.green}10`,
                    transform: `scale(${1 +
                        Math.sin(frame * 0.05) * 0.015
                        })`,
                }}
            >
                HTTP / 2
            </div>

            {/* Proto payload */}
            <div
                style={{
                    position: "absolute",
                    left: 120,
                    right: 120,
                    bottom: 180,
                    height: 190,
                    borderRadius: 24,
                    background: `${C.panel}dd`,
                    border: `1px solid ${C.green}30`,
                    padding: 26,
                }}
            >
                <div
                    style={{
                        color: C.green,
                        fontSize: 19,
                        fontWeight: 900,
                        marginBottom: 12,
                    }}
                >
                    PROTOCOL BUFFER
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: 14,
                        alignItems: "center",
                    }}
                >
                    {[
                        "order_id",
                        "amount",
                        "currency",
                        "status",
                    ].map((item, i) => (
                        <div
                            key={item}
                            style={{
                                padding: "13px 17px",
                                borderRadius: 12,
                                background:
                                    i % 2 === 0
                                        ? `${C.cyan}12`
                                        : `${C.green}12`,
                                border: `1px solid ${i % 2 === 0
                                    ? C.cyan
                                    : C.green
                                    }35`,
                                color: C.white,
                                fontSize: 17,
                                fontWeight: 700,
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* =========================================================
   WEBSOCKETS
========================================================= */

const WebSocketsScene = () => {
    const frame = useCurrentFrame();

    const pulse = 1 + Math.sin(frame * 0.08) * 0.04;

    return (
        <AbsoluteFill>
            <Background intensity={1.2} />

            <SectionTitle
                eyebrow="03 · REAL-TIME"
                title="WebSockets"
                color={C.purple}
            />

            <Node
                x={220}
                y={850}
                label="Browser"
                color={C.cyan}
                size={150}
                icon="⌘"
            />

            <Node
                x={860}
                y={850}
                label="Realtime Server"
                color={C.purple}
                size={170}
                icon="⚡"
            />

            {/* Persistent tunnel */}
            <div
                style={{
                    position: "absolute",
                    left: 300,
                    top: 805,
                    width: 480,
                    height: 90,
                    borderRadius: 50,
                    border: `3px solid ${C.purple}`,
                    background: `${C.purple}08`,
                    boxShadow: `
                        0 0 35px ${C.purple}25,
                        inset 0 0 30px ${C.purple}10
                    `,
                    transform: `scaleY(${pulse})`,
                }}
            />

            {/* Bidirectional packets */}
            <Packet
                x1={300}
                y1={825}
                x2={780}
                y2={825}
                color={C.cyan}
                label="CHAT"
                speed={0.009}
            />

            <Packet
                x1={780}
                y1={875}
                x2={300}
                y2={875}
                color={C.purple}
                label="EVENT"
                speed={0.012}
                delay={0.3}
            />

            <div
                style={{
                    position: "absolute",
                    left: 350,
                    top: 1020,
                    width: 380,
                    textAlign: "center",
                    color: C.purple,
                    fontSize: 25,
                    fontWeight: 900,
                    letterSpacing: 1,
                }}
            >
                PERSISTENT CONNECTION
            </div>

            {/* Live use cases */}
            <div
                style={{
                    position: "absolute",
                    left: 100,
                    right: 100,
                    bottom: 220,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                {[
                    ["💬", "Chat"],
                    ["🏟", "Live Scores"],
                    ["🔔", "Notifications"],
                ].map(([icon, label], i) => (
                    <div
                        key={label}
                        style={{
                            width: 260,
                            height: 150,
                            borderRadius: 22,
                            background: `${C.panel}dd`,
                            border: `1px solid ${C.purple}35`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            transform: `translateY(${Math.sin(
                                frame * 0.04 + i
                            ) * 8
                                }px)`,
                        }}
                    >
                        <div style={{ fontSize: 35 }}>
                            {icon}
                        </div>

                        <div
                            style={{
                                color: C.white,
                                fontSize: 20,
                                fontWeight: 800,
                            }}
                        >
                            {label}
                        </div>
                    </div>
                ))}
            </div>
        </AbsoluteFill>
    );
};

/* =========================================================
   MESSAGING
========================================================= */

const MessagingScene = () => {
    const frame = useCurrentFrame();

    const consumers = [
        {
            x: 220,
            y: 1170,
            label: "Email Worker",
            color: C.cyan,
        },
        {
            x: 540,
            y: 1170,
            label: "Analytics",
            color: C.green,
        },
        {
            x: 860,
            y: 1170,
            label: "Notifications",
            color: C.orange,
        },
    ];

    return (
        <AbsoluteFill>
            <Background intensity={1.3} />

            <SectionTitle
                eyebrow="04 · ASYNCHRONOUS"
                title="Event-Driven Messaging"
                color={C.orange}
            />

            <Node
                x={180}
                y={820}
                label="Order Service"
                color={C.cyan}
                size={145}
                icon="O"
            />

            {/* Broker */}
            <div
                style={{
                    position: "absolute",
                    left: 400,
                    top: 700,
                    width: 280,
                    height: 250,
                    borderRadius: 30,
                    background: `${C.orange}10`,
                    border: `2px solid ${C.orange}70`,
                    boxShadow: `0 0 45px ${C.orange}15`,
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        color: C.orange,
                        fontSize: 28,
                        fontWeight: 900,
                        marginTop: 28,
                    }}
                >
                    MESSAGE
                </div>

                <div
                    style={{
                        textAlign: "center",
                        color: C.white,
                        fontSize: 28,
                        fontWeight: 900,
                    }}
                >
                    BROKER
                </div>

                {/* Queue */}
                <div
                    style={{
                        position: "absolute",
                        left: 35,
                        right: 35,
                        bottom: 35,
                        height: 70,
                        display: "flex",
                        gap: 9,
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: 26,
                                height: 26,
                                borderRadius: 7,
                                background:
                                    i % 2 === 0
                                        ? C.orange
                                        : C.pink,
                                opacity:
                                    0.55 +
                                    0.45 *
                                    Math.abs(
                                        Math.sin(
                                            frame *
                                            0.05 +
                                            i
                                        )
                                    ),
                                boxShadow: `0 0 12px ${i % 2 === 0
                                    ? C.orange
                                    : C.pink
                                    }`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {consumers.map((consumer, i) => (
                <React.Fragment key={consumer.label}>
                    <Node
                        x={consumer.x}
                        y={consumer.y}
                        label={consumer.label}
                        color={consumer.color}
                        size={140}
                        icon={i === 0 ? "✉" : i === 1 ? "▥" : "!"}
                    />

                    <Connection
                        x1={540}
                        y1={950}
                        x2={consumer.x}
                        y2={consumer.y - 75}
                        color={consumer.color}
                    />

                    <Packet
                        x1={540}
                        y1={950}
                        x2={consumer.x}
                        y2={consumer.y - 75}
                        color={consumer.color}
                        label={i === 0 ? "EVENT" : undefined}
                        speed={0.008 + i * 0.002}
                        delay={i * 0.25}
                    />
                </React.Fragment>
            ))}

            <Connection
                x1={250}
                y1={820}
                x2={400}
                y2={820}
                color={C.orange}
            />

            <Packet
                x1={250}
                y1={820}
                x2={400}
                y2={820}
                color={C.orange}
                label="ORDER_CREATED"
                speed={0.009}
            />

            {/* Async badge */}
            <div
                style={{
                    position: "absolute",
                    left: 270,
                    bottom: 190,
                    padding: "15px 28px",
                    borderRadius: 999,
                    background: `${C.green}12`,
                    border: `1px solid ${C.green}40`,
                    color: C.green,
                    fontSize: 21,
                    fontWeight: 900,
                    letterSpacing: 1,
                }}
            >
                PRODUCER ≠ CONSUMER
            </div>
        </AbsoluteFill>
    );
};

const ComparisonScene = () => {
    const frame = useCurrentFrame();

    const protocols = [
        {
            name: "REST",
            subtitle: "Request → Response",
            color: C.cyan,
            icon: "HTTP",
            y: 480,
            type: "request",
        },
        {
            name: "gRPC",
            subtitle: "Service ↔ Service",
            color: C.green,
            icon: "RPC",
            y: 740,
            type: "grpc",
        },
        {
            name: "WebSockets",
            subtitle: "Persistent connection",
            color: C.purple,
            icon: "LIVE",
            y: 1000,
            type: "socket",
        },
        {
            name: "Messaging",
            subtitle: "Async events",
            color: C.orange,
            icon: "EVENT",
            y: 1260,
            type: "message",
        },
    ];

    const pulse = 1 + Math.sin(frame * 0.08) * 0.04;

    return (
        <AbsoluteFill>
            <Background intensity={1.6} />

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    position: "absolute",
                    top: 90,
                    left: 70,
                    right: 70,
                    zIndex: 50,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 14,
                    }}
                >
                    <div
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: C.cyan,
                            boxShadow: `0 0 18px ${C.cyan}`,
                        }}
                    />

                    <div
                        style={{
                            color: C.cyan,
                            fontSize: 19,
                            fontWeight: 900,
                            letterSpacing: 3,
                        }}
                    >
                        COMMUNICATION PATTERNS
                    </div>
                </div>

                <div
                    style={{
                        color: C.white,
                        fontSize: 52,
                        lineHeight: 1,
                        fontWeight: 900,
                        letterSpacing: -2,
                    }}
                >
                    Four ways services
                    <br />
                    <span style={{ color: C.cyan }}>
                        communicate
                    </span>
                </div>
            </div>

            {/* =================================================
                CENTRAL SERVICE HUB
            ================================================= */}

            <div
                style={{
                    position: "absolute",
                    left: 540,
                    top: 260,
                    transform: "translateX(-50%)",
                    zIndex: 20,
                }}
            >
                {/* outer rings */}

                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 210,
                        height: 210,
                        transform: `translate(-50%, -50%) scale(${pulse})`,
                        borderRadius: "50%",
                        border: `1px solid ${C.cyan}25`,
                        boxShadow: `0 0 70px ${C.cyan}12`,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 175,
                        height: 175,
                        transform: "translate(-50%, -50%)",
                        borderRadius: "50%",
                        border: `1px dashed ${C.cyan}45`,
                    }}
                />

                {/* hub */}

                <div
                    style={{
                        width: 125,
                        height: 125,
                        borderRadius: 32,
                        background: `
                            linear-gradient(
                                145deg,
                                ${C.cyan}25,
                                ${C.panel}
                            )
                        `,
                        border: `2px solid ${C.cyan}`,
                        boxShadow: `
                            0 0 40px ${C.cyan}30,
                            inset 0 0 30px ${C.cyan}10
                        `,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            color: C.cyan,
                            fontSize: 34,
                            fontWeight: 900,
                        }}
                    >
                        API
                    </div>

                    <div
                        style={{
                            color: C.muted,
                            fontSize: 15,
                            fontWeight: 800,
                            letterSpacing: 2,
                        }}
                    >
                        SERVICES
                    </div>
                </div>
            </div>

            {/* =================================================
                COMMUNICATION LANES
            ================================================= */}

            {protocols.map((protocol, index) => {
                const laneX1 = 180;
                const laneX2 = 900;
                const centerY = protocol.y;

                const wave =
                    Math.sin(
                        frame * 0.045 + index
                    ) * 4;

                return (
                    <React.Fragment key={protocol.name}>
                        {/* lane background */}

                        <div
                            style={{
                                position: "absolute",
                                left: 80,
                                right: 80,
                                top: centerY - 92,
                                height: 184,
                                borderRadius: 30,
                                background:
                                    `linear-gradient(
                                        90deg,
                                        ${protocol.color}05,
                                        ${C.panel}c8,
                                        ${protocol.color}05
                                    )`,
                                border: `1px solid ${protocol.color}22`,
                                overflow: "hidden",
                            }}
                        >
                            {/* animated glow */}

                            <div
                                style={{
                                    position: "absolute",
                                    left:
                                        ((frame *
                                            (2 +
                                                index)) %
                                            1200) -
                                        300,
                                    top: 0,
                                    width: 300,
                                    height: "100%",
                                    background: `linear-gradient(
                                        90deg,
                                        transparent,
                                        ${protocol.color}08,
                                        transparent
                                    )`,
                                }}
                            />
                        </div>

                        {/* LEFT SERVICE */}

                        <div
                            style={{
                                position: "absolute",
                                left: laneX1,
                                top: centerY - 42,
                                width: 85,
                                height: 85,
                                borderRadius: 22,
                                background: `${protocol.color}12`,
                                border: `2px solid ${protocol.color}65`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: protocol.color,
                                fontSize: 18,
                                fontWeight: 900,
                                boxShadow: `0 0 25px ${protocol.color}10`,
                                transform: `translateY(${wave}px)`,
                            }}
                        >
                            SVC
                        </div>

                        {/* RIGHT SERVICE */}

                        <div
                            style={{
                                position: "absolute",
                                left: laneX2,
                                top: centerY - 42,
                                width: 85,
                                height: 85,
                                borderRadius: 22,
                                background: `${protocol.color}12`,
                                border: `2px solid ${protocol.color}65`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: protocol.color,
                                fontSize: 18,
                                fontWeight: 900,
                                boxShadow: `0 0 25px ${protocol.color}10`,
                                transform: `translateY(${-wave}px)`,
                            }}
                        >
                            SVC
                        </div>

                        {/* =================================================
                            REST
                        ================================================= */}

                        {protocol.type === "request" && (
                            <>
                                <Connection
                                    x1={265}
                                    y1={centerY}
                                    x2={900}
                                    y2={centerY}
                                    color={protocol.color}
                                />

                                <Packet
                                    x1={270}
                                    y1={centerY}
                                    x2={895}
                                    y2={centerY}
                                    color={protocol.color}
                                    label="GET"
                                    speed={0.012}
                                    delay={0}
                                />

                                <Packet
                                    x1={895}
                                    y1={centerY + 25}
                                    x2={270}
                                    y2={centerY + 25}
                                    color={C.green}
                                    label="200"
                                    speed={0.010}
                                    delay={0.45}
                                />
                            </>
                        )}

                        {/* =================================================
                            GRPC
                        ================================================= */}

                        {protocol.type === "grpc" && (
                            <>
                                {[0, 1, 2].map((stream) => {
                                    const streamY =
                                        centerY -
                                        35 +
                                        stream * 35;

                                    return (
                                        <React.Fragment
                                            key={stream}
                                        >
                                            <Connection
                                                x1={265}
                                                y1={streamY}
                                                x2={900}
                                                y2={streamY}
                                                color={
                                                    protocol.color
                                                }
                                                width={2}
                                            />

                                            <Packet
                                                x1={270}
                                                y1={streamY}
                                                x2={895}
                                                y2={streamY}
                                                color={
                                                    protocol.color
                                                }
                                                label={
                                                    stream ===
                                                        1
                                                        ? "PROTO"
                                                        : undefined
                                                }
                                                speed={
                                                    0.012 +
                                                    stream *
                                                    0.002
                                                }
                                                delay={
                                                    stream *
                                                    0.2
                                                }
                                            />
                                        </React.Fragment>
                                    );
                                })}
                            </>
                        )}

                        {/* =================================================
                            WEBSOCKET
                        ================================================= */}

                        {protocol.type === "socket" && (
                            <>
                                <div
                                    style={{
                                        position:
                                            "absolute",
                                        left: 265,
                                        top:
                                            centerY -
                                            38,
                                        width: 635,
                                        height: 76,
                                        borderRadius: 50,
                                        border: `3px solid ${protocol.color}`,
                                        background: `${protocol.color}06`,
                                        boxShadow: `0 0 35px ${protocol.color}18`,
                                    }}
                                />

                                <Packet
                                    x1={270}
                                    y1={centerY - 18}
                                    x2={895}
                                    y2={centerY - 18}
                                    color={C.cyan}
                                    label="LIVE"
                                    speed={0.008}
                                />

                                <Packet
                                    x1={895}
                                    y1={centerY + 18}
                                    x2={270}
                                    y2={centerY + 18}
                                    color={C.purple}
                                    label="EVENT"
                                    speed={0.010}
                                    delay={0.35}
                                />
                            </>
                        )}

                        {/* =================================================
                            MESSAGING
                        ================================================= */}

                        {protocol.type === "message" && (
                            <>
                                <Connection
                                    x1={265}
                                    y1={centerY}
                                    x2={470}
                                    y2={centerY}
                                    color={protocol.color}
                                />

                                {/* broker */}

                                <div
                                    style={{
                                        position:
                                            "absolute",
                                        left: 465,
                                        top:
                                            centerY -
                                            48,
                                        width: 140,
                                        height: 96,
                                        borderRadius: 20,
                                        background: `${protocol.color}12`,
                                        border: `2px solid ${protocol.color}`,
                                        display: "flex",
                                        flexDirection:
                                            "column",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        color: protocol.color,
                                        fontSize: 16,
                                        fontWeight: 900,
                                        boxShadow: `0 0 30px ${protocol.color}18`,
                                    }}
                                >
                                    <div>
                                        BROKER
                                    </div>

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap: 5,
                                            marginTop: 8,
                                        }}
                                    >
                                        {[
                                            0,
                                            1,
                                            2,
                                            3,
                                        ].map((q) => (
                                            <div
                                                key={q}
                                                style={{
                                                    width: 9,
                                                    height: 9,
                                                    borderRadius:
                                                        3,
                                                    background:
                                                        q %
                                                            2 ===
                                                            0
                                                            ? protocol.color
                                                            : C.pink,
                                                    opacity:
                                                        0.6 +
                                                        0.4 *
                                                        Math.abs(
                                                            Math.sin(
                                                                frame *
                                                                0.06 +
                                                                q
                                                            )
                                                        ),
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Connection
                                    x1={605}
                                    y1={centerY}
                                    x2={900}
                                    y2={centerY}
                                    color={protocol.color}
                                />

                                <Packet
                                    x1={270}
                                    y1={centerY}
                                    x2={465}
                                    y2={centerY}
                                    color={protocol.color}
                                    label="EVENT"
                                    speed={0.012}
                                />

                                <Packet
                                    x1={605}
                                    y1={centerY}
                                    x2={895}
                                    y2={centerY}
                                    color={C.green}
                                    label="ASYNC"
                                    speed={0.009}
                                    delay={0.4}
                                />
                            </>
                        )}

                        {/* =================================================
                            LABEL
                        ================================================= */}

                        <div
                            style={{
                                position: "absolute",
                                left: 120,
                                top: centerY - 145,
                            }}
                        >
                            <div
                                style={{
                                    color: protocol.color,
                                    fontSize: 28,
                                    fontWeight: 900,
                                    letterSpacing: -0.5,
                                }}
                            >
                                {protocol.name}
                            </div>

                            <div
                                style={{
                                    color: C.muted,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    marginTop: 4,
                                }}
                            >
                                {protocol.subtitle}
                            </div>
                        </div>

                        {/* moving pulse marker */}

                        <div
                            style={{
                                position: "absolute",
                                left:
                                    300 +
                                    ((frame *
                                        (2.5 +
                                            index *
                                            0.5)) %
                                        560),
                                top:
                                    centerY +
                                    65,
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background:
                                    protocol.color,
                                boxShadow: `0 0 12px ${protocol.color}`,
                            }}
                        />
                    </React.Fragment>
                );
            })}

            {/* =================================================
                BOTTOM DECISION BAR
            ================================================= */}

            <div
                style={{
                    position: "absolute",
                    left: 90,
                    right: 90,
                    bottom: 90,
                    height: 85,
                    borderRadius: 24,
                    background: `${C.panel}ee`,
                    border: `1px solid ${C.line}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 15,
                    boxShadow:
                        "0 20px 60px rgba(0,0,0,0.25)",
                }}
            >
                <div
                    style={{
                        color: C.muted,
                        fontSize: 18,
                        fontWeight: 700,
                    }}
                >
                    Choose based on
                </div>

                {[
                    ["LATENCY", C.cyan],
                    ["REAL-TIME", C.purple],
                    ["COUPLING", C.green],
                    ["SCALE", C.orange],
                ].map(([text, color]) => (
                    <div
                        key={text}
                        style={{
                            padding:
                                "9px 14px",
                            borderRadius: 999,
                            border: `1px solid ${color}45`,
                            background: `${color}10`,
                            color,
                            fontSize: 15,
                            fontWeight: 900,
                        }}
                    >
                        {text}
                    </div>
                ))}
            </div>
        </AbsoluteFill>
    );
};

const EndingScene = () => {
    const frame = useCurrentFrame();

    const scale = interpolate(
        Math.sin(frame * 0.035),
        [-1, 1],
        [0.96, 1.03]
    );

    const nodes = [
        [540, 550, C.cyan],
        [250, 850, C.green],
        [830, 850, C.purple],
        [350, 1170, C.orange],
        [730, 1170, C.pink],
    ] as const;

    return (
        <AbsoluteFill>
            <Background intensity={1.5} />

            {/* Network */}
            {nodes.slice(1).map(([x, y, color], i) => (
                <Connection
                    key={i}
                    x1={540}
                    y1={550}
                    x2={x}
                    y2={y}
                    color={color}
                />
            ))}

            {nodes.map(([x, y, color], i) => (
                <Node
                    key={i}
                    x={x}
                    y={y}
                    label={
                        i === 0
                            ? "API Gateway"
                            : i === 1
                                ? "REST"
                                : i === 2
                                    ? "gRPC"
                                    : i === 3
                                        ? "Messaging"
                                        : "WebSockets"
                    }
                    color={color}
                    size={i === 0 ? 160 : 120}
                    icon={
                        i === 0
                            ? "⇄"
                            : i === 1
                                ? "R"
                                : i === 2
                                    ? "G"
                                    : i === 3
                                        ? "M"
                                        : "W"
                    }
                />
            ))}

            {/* CTA */}
            <div
                style={{
                    position: "absolute",
                    left: 80,
                    right: 80,
                    bottom: 250,
                    textAlign: "center",
                    transform: `scale(${scale})`,
                }}
            >
                <div
                    style={{
                        color: C.cyan,
                        fontSize: 22,
                        fontWeight: 900,
                        letterSpacing: 3,
                        marginBottom: 18,
                    }}
                >
                    AI HUB INSIDER
                </div>

                <div
                    style={{
                        color: C.white,
                        fontSize: 50,
                        lineHeight: 1.05,
                        fontWeight: 900,
                        letterSpacing: -1.5,
                    }}
                >
                    Choose the protocol
                    <br />
                    for the pattern.
                </div>

                <div
                    style={{
                        marginTop: 24,
                        color: C.muted,
                        fontSize: 23,
                        fontWeight: 600,
                    }}
                >
                    Follow for more system design.
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* =========================================================
   MAIN SCENE
========================================================= */

export const MicroservicesCommunicationScene: React.FC = () => {
    return (
        <AbsoluteFill
            style={{
                background: C.bg,
                fontFamily:
                    "Inter, Arial, sans-serif",
            }}
        >
            {timeline.sections.map((section) => {
                const duration =
                    section.duration;

                const Scene =
                    section.id === "hook"
                        ? HookScene
                        : section.id === "rest"
                            ? RestScene
                            : section.id === "grpc"
                                ? GrpcScene
                                : section.id ===
                                    "websockets"
                                    ? WebSocketsScene
                                    : section.id ===
                                        "messaging"
                                        ? MessagingScene
                                        : section.id ===
                                            "comparison"
                                            ? ComparisonScene
                                            : EndingScene;

                return (
                    <Sequence
                        key={section.id}
                        from={section.start}
                        durationInFrames={
                            duration
                        }
                    >
                        <Scene />

                        <Audio
                            src={staticFile(
                                section.audio
                            )}
                        />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};