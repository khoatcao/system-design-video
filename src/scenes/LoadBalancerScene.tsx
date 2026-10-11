import React from "react";
import {
    AbsoluteFill,
    Audio,
    Easing,
    Sequence,
    interpolate,
    staticFile,
    useCurrentFrame,
} from "remotion";

import { createTimeline, FPS } from "../timeline";
import { loadBalancer } from "../../content/load-balancer";

const timeline = createTimeline(loadBalancer);

const W = 1080;
const H = 1920;

const COLORS = {
    bg: "#081522",
    bg2: "#102B3F",
    white: "#F4F7FB",
    muted: "#8FA3B8",
    cyan: "#4DB8FF",
    green: "#1FD1A5",
    mint: "#76F7D4",
    purple: "#9B7CFF",
    orange: "#FFB86C",
    pink: "#FF6B9D",
    red: "#FF5C70",
    yellow: "#FFD166",
};

const clamp = (v: number) => Math.max(0, Math.min(1, v));

const ease = (v: number) =>
    Easing.out(Easing.cubic)(clamp(v));

const localProgress = (
    frame: number,
    sectionId: string
) => {
    const section = timeline.sections.find(
        (s) => s.id === sectionId
    );

    if (!section) return 0;

    return clamp(
        (frame - section.start) / section.duration
    );
};

const sectionFrame = (
    frame: number,
    sectionId: string
) => {
    const section = timeline.sections.find(
        (s) => s.id === sectionId
    );

    if (!section) return 0;

    return frame - section.start;
};

/* =====================================================
   Background
===================================================== */

const Background = ({
    frame,
}: {
    frame: number;
}) => {
    const drift = Math.sin(frame / 90) * 20;

    return (
        <AbsoluteFill
            style={{
                background: `
                    radial-gradient(
                        circle at ${50 + drift / 10}% 20%,
                        #173A52 0%,
                        #0B2032 35%,
                        ${COLORS.bg} 75%
                    )
                `,
            }}
        >
            {/* ambient glow */}
            <div
                style={{
                    position: "absolute",
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    left: -250 + drift,
                    top: 250,
                    background: COLORS.cyan,
                    opacity: 0.045,
                    filter: "blur(100px)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    right: -250 - drift,
                    bottom: 150,
                    background: COLORS.purple,
                    opacity: 0.05,
                    filter: "blur(100px)",
                }}
            />

            {/* grid */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.08,
                    backgroundImage: `
                        linear-gradient(
                            rgba(255,255,255,0.08) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(255,255,255,0.08) 1px,
                            transparent 1px
                        )
                    `,
                    backgroundSize: "54px 54px",
                    transform: `translateY(${(frame * 0.15) % 54}px)`,
                }}
            />
        </AbsoluteFill>
    );
};

/* =====================================================
   Text
===================================================== */

const Label = ({
    children,
    x,
    y,
    size = 30,
    color = COLORS.white,
    opacity = 1,
    weight = 700,
}: {
    children: React.ReactNode;
    x: number;
    y: number;
    size?: number;
    color?: string;
    opacity?: number;
    weight?: number;
}) => (
    <div
        style={{
            position: "absolute",
            left: x,
            top: y,
            color,
            fontSize: size,
            fontWeight: weight,
            opacity,
            fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: "-0.5px",
        }}
    >
        {children}
    </div>
);

/* =====================================================
   Request packet
===================================================== */

const Packet = ({
    x,
    y,
    color = COLORS.cyan,
    size = 16,
    opacity = 1,
}: {
    x: number;
    y: number;
    color?: string;
    size?: number;
    opacity?: number;
}) => (
    <div
        style={{
            position: "absolute",
            left: x - size / 2,
            top: y - size / 2,
            width: size,
            height: size,
            borderRadius: 5,
            background: color,
            opacity,
            boxShadow: `
                0 0 12px ${color},
                0 0 30px ${color}
            `,
        }}
    />
);

/* =====================================================
   Request stream
===================================================== */

const RequestStream = ({
    frame,
    startX,
    startY,
    endX,
    endY,
    count = 8,
    speed = 22,
    color = COLORS.cyan,
    delay = 0,
}: {
    frame: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    count?: number;
    speed?: number;
    color?: string;
    delay?: number;
}) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => {
                const progress =
                    ((frame * speed + i * 90 + delay) %
                        1000) /
                    1000;

                const x = interpolate(
                    progress,
                    [0, 1],
                    [startX, endX]
                );

                const y = interpolate(
                    progress,
                    [0, 1],
                    [startY, endY]
                );

                return (
                    <Packet
                        key={i}
                        x={x}
                        y={y}
                        color={color}
                        size={i % 3 === 0 ? 18 : 12}
                    />
                );
            })}
        </>
    );
};

/* =====================================================
   Server
===================================================== */

const Server = ({
    x,
    y,
    label,
    frame,
    status = "healthy",
    load = 0.35,
    scale = 1,
}: {
    x: number;
    y: number;
    label: string;
    frame: number;
    status?: "healthy" | "warning" | "dead";
    load?: number;
    scale?: number;
}) => {
    const isDead = status === "dead";
    const isWarning = status === "warning";

    const pulse =
        1 + Math.sin(frame / 8) * 0.025;

    const shake =
        isDead
            ? Math.sin(frame * 1.8) * 5
            : 0;

    const statusColor = isDead
        ? COLORS.red
        : isWarning
            ? COLORS.orange
            : COLORS.green;

    const loadWidth = isDead
        ? 100
        : Math.min(load * 100, 100);

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 270,
                height: 230,
                transform: `
                    translate(${shake}px, 0)
                    scale(${scale * pulse})
                `,
                transformOrigin: "center",
            }}
        >
            {/* glow */}
            <div
                style={{
                    position: "absolute",
                    inset: -25,
                    borderRadius: 28,
                    background: statusColor,
                    opacity: isDead ? 0.14 : 0.05,
                    filter: "blur(25px)",
                }}
            />

            {/* server body */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 24,
                    background:
                        "linear-gradient(145deg, #17344A, #0C2031)",
                    border: `2px solid ${statusColor}`,
                    boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,.08),
                        0 12px 40px rgba(0,0,0,.35)
                    `,
                    overflow: "hidden",
                }}
            >
                {/* top lights */}
                <div
                    style={{
                        position: "absolute",
                        left: 24,
                        top: 22,
                        display: "flex",
                        gap: 9,
                    }}
                >
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: 9,
                                height: 9,
                                borderRadius: "50%",
                                background:
                                    i === 0
                                        ? statusColor
                                        : "#486174",
                                boxShadow:
                                    i === 0
                                        ? `0 0 12px ${statusColor}`
                                        : "none",
                            }}
                        />
                    ))}
                </div>

                <Label
                    x={24}
                    y={52}
                    size={25}
                    weight={700}
                >
                    {label}
                </Label>

                {/* CPU */}
                <Label
                    x={24}
                    y={98}
                    size={16}
                    color={COLORS.muted}
                    weight={600}
                >
                    CPU
                </Label>

                <div
                    style={{
                        position: "absolute",
                        left: 75,
                        right: 24,
                        top: 101,
                        height: 9,
                        borderRadius: 9,
                        background: "#203A4E",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${loadWidth}%`,
                            height: "100%",
                            borderRadius: 9,
                            background: statusColor,
                            boxShadow: `0 0 10px ${statusColor}`,
                        }}
                    />
                </div>

                {/* memory */}
                <Label
                    x={24}
                    y={135}
                    size={16}
                    color={COLORS.muted}
                    weight={600}
                >
                    RAM
                </Label>

                <div
                    style={{
                        position: "absolute",
                        left: 75,
                        right: 24,
                        top: 138,
                        height: 9,
                        borderRadius: 9,
                        background: "#203A4E",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${Math.min(
                                load * 0.85 * 100,
                                100
                            )}%`,
                            height: "100%",
                            borderRadius: 9,
                            background: statusColor,
                        }}
                    />
                </div>

                {/* status */}
                <div
                    style={{
                        position: "absolute",
                        left: 24,
                        bottom: 22,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: statusColor,
                            boxShadow: `0 0 12px ${statusColor}`,
                        }}
                    />

                    <span
                        style={{
                            color: statusColor,
                            fontSize: 17,
                            fontWeight: 700,
                        }}
                    >
                        {isDead
                            ? "OFFLINE"
                            : isWarning
                                ? "HIGH LOAD"
                                : "HEALTHY"}
                    </span>
                </div>

                {/* dead X */}
                {isDead && (
                    <>
                        <div
                            style={{
                                position: "absolute",
                                width: 180,
                                height: 12,
                                background: COLORS.red,
                                left: 45,
                                top: 108,
                                transform: "rotate(45deg)",
                                borderRadius: 10,
                                boxShadow: `0 0 20px ${COLORS.red}`,
                            }}
                        />

                        <div
                            style={{
                                position: "absolute",
                                width: 180,
                                height: 12,
                                background: COLORS.red,
                                left: 45,
                                top: 108,
                                transform: "rotate(-45deg)",
                                borderRadius: 10,
                                boxShadow: `0 0 20px ${COLORS.red}`,
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

/* =====================================================
   Users
===================================================== */

const Users = ({
    frame,
    x = 100,
    y = 750,
}: {
    frame: number;
    x?: number;
    y?: number;
}) => {
    const bounce =
        Math.sin(frame / 8) * 3;

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y + bounce,
            }}
        >
            {[
                [0, 0],
                [65, 30],
                [10, 80],
                [75, 100],
                [38, 155],
            ].map(([dx, dy], i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: dx,
                        top: dy,
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background:
                            "linear-gradient(145deg,#284B62,#142B3C)",
                        border: `2px solid ${COLORS.cyan}`,
                        boxShadow:
                            "0 0 18px rgba(77,184,255,.2)",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: COLORS.cyan,
                            left: 13,
                            top: 7,
                        }}
                    />

                    <div
                        style={{
                            position: "absolute",
                            width: 23,
                            height: 12,
                            borderRadius:
                                "12px 12px 4px 4px",
                            background: COLORS.cyan,
                            left: 8,
                            bottom: 6,
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

/* =====================================================
   Load Balancer
===================================================== */

const LoadBalancer = ({
    frame,
    x = 405,
    y = 720,
    active = true,
}: {
    frame: number;
    x?: number;
    y?: number;
    active?: boolean;
}) => {
    const pulse =
        1 + Math.sin(frame / 7) * 0.04;

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 270,
                height: 180,
                transform: `scale(${pulse})`,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: -35,
                    borderRadius: 50,
                    background: COLORS.purple,
                    opacity: active ? 0.1 : 0,
                    filter: "blur(30px)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 30,
                    background:
                        "linear-gradient(145deg,#342D62,#1C2142)",
                    border: `2px solid ${COLORS.purple}`,
                    boxShadow: `
                        0 0 35px rgba(155,124,255,.18),
                        inset 0 1px rgba(255,255,255,.1)
                    `,
                }}
            >
                {/* balance icon */}
                <div
                    style={{
                        position: "absolute",
                        left: 52,
                        top: 35,
                        width: 165,
                        height: 70,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            left: 79,
                            top: 0,
                            width: 7,
                            height: 62,
                            background: COLORS.mint,
                            borderRadius: 5,
                        }}
                    />

                    <div
                        style={{
                            position: "absolute",
                            left: 30,
                            top: 15,
                            width: 105,
                            height: 7,
                            background: COLORS.mint,
                            borderRadius: 5,
                        }}
                    />

                    {[20, 112].map((left) => (
                        <div
                            key={left}
                            style={{
                                position: "absolute",
                                left,
                                top: 22,
                                width: 35,
                                height: 35,
                                border: `3px solid ${COLORS.mint}`,
                                borderRadius:
                                    "0 0 18px 18px",
                            }}
                        />
                    ))}
                </div>

                <Label
                    x={48}
                    y={112}
                    size={23}
                    color={COLORS.white}
                >
                    LOAD BALANCER
                </Label>

                <div
                    style={{
                        position: "absolute",
                        left: 91,
                        bottom: 18,
                        width: 88,
                        height: 5,
                        borderRadius: 5,
                        background: COLORS.mint,
                        boxShadow: `0 0 12px ${COLORS.mint}`,
                    }}
                />
            </div>
        </div>
    );
};

/* =====================================================
   Connection line
===================================================== */

const Line = ({
    x1,
    y1,
    x2,
    y2,
    opacity = 1,
    color = COLORS.cyan,
    width = 4,
    dashed = false,
}: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    opacity?: number;
    color?: string;
    width?: number;
    dashed?: boolean;
}) => {
    const length = Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2)
    );

    const angle =
        Math.atan2(y2 - y1, x2 - x1) *
        (180 / Math.PI);

    return (
        <div
            style={{
                position: "absolute",
                left: x1,
                top: y1,
                width: length,
                height: width,
                opacity,
                background: dashed
                    ? "transparent"
                    : color,
                backgroundImage: dashed
                    ? `repeating-linear-gradient(
                        90deg,
                        ${color} 0px,
                        ${color} 10px,
                        transparent 10px,
                        transparent 20px
                    )`
                    : undefined,
                boxShadow: dashed
                    ? "none"
                    : `0 0 10px ${color}`,
                transformOrigin: "left center",
                transform: `rotate(${angle}deg)`,
                borderRadius: width,
            }}
        />
    );
};

/* =====================================================
   SECTION 1 — HOOK
===================================================== */

const Hook = ({ frame }: { frame: number }) => {
    const p = localProgress(frame, "hook");

    const shake =
        p > 0.45
            ? Math.sin(frame * 2.8) *
            interpolate(p, [0.45, 1], [0, 9])
            : 0;

    const load = interpolate(
        p,
        [0, 0.45, 1],
        [0.2, 0.75, 1]
    );

    return (
        <>
            <Label
                x={70}
                y={170}
                size={52}
                weight={800}
                opacity={ease(
                    interpolate(p, [0, 0.3], [0, 1])
                )}
            >
                One server.
            </Label>

            <Label
                x={70}
                y={235}
                size={52}
                weight={800}
                color={COLORS.red}
                opacity={ease(
                    interpolate(p, [0.1, 0.4], [0, 1])
                )}
            >
                Too much traffic.
            </Label>

            <Users
                frame={frame}
                x={100}
                y={780}
            />

            <Line
                x1={230}
                y1={850}
                x2={540}
                y2={850}
                color={COLORS.cyan}
                opacity={0.35}
                width={5}
            />

            <RequestStream
                frame={frame}
                startX={240}
                startY={850}
                endX={690}
                endY={850}
                count={12}
                speed={30}
                color={COLORS.cyan}
            />

            <div
                style={{
                    position: "absolute",
                    left: 660 + shake,
                    top: 720,
                }}
            >
                <Server
                    x={0}
                    y={0}
                    label="SERVER"
                    frame={frame}
                    status="warning"
                    load={load}
                    scale={1.05}
                />
            </div>

            <Label
                x={670}
                y={990}
                size={23}
                color={COLORS.red}
                opacity={ease(
                    interpolate(p, [0.45, 0.75], [0, 1])
                )}
            >
                OVERLOADED
            </Label>
        </>
    );
};

/* =====================================================
   SECTION 2 — PROBLEM
===================================================== */

const Problem = ({ frame }: { frame: number }) => {
    const p = localProgress(frame, "problem");

    const requests =
        8 +
        Math.floor(
            interpolate(p, [0, 1], [0, 18])
        );

    return (
        <>
            <Label
                x={70}
                y={150}
                size={48}
                weight={800}
            >
                Thousands of requests
            </Label>

            <Label
                x={70}
                y={210}
                size={24}
                color={COLORS.muted}
            >
                all hitting the same machine
            </Label>

            <Users
                frame={frame}
                x={80}
                y={700}
            />

            <Line
                x1={220}
                y1={820}
                x2={690}
                y2={820}
                color={COLORS.red}
                opacity={0.35}
                width={5}
            />

            {Array.from({
                length: requests,
            }).map((_, i) => {
                const t =
                    ((frame * 0.035 +
                        i * 0.071) %
                        1);

                return (
                    <Packet
                        key={i}
                        x={220 + t * 470}
                        y={
                            790 +
                            Math.sin(i * 4) *
                            80 *
                            t
                        }
                        color={
                            i % 4 === 0
                                ? COLORS.orange
                                : COLORS.cyan
                        }
                        size={10 + (i % 3) * 3}
                    />
                );
            })}

            <Server
                x={675}
                y={690}
                label="SERVER 01"
                frame={frame}
                status="warning"
                load={0.9}
            />

            <div
                style={{
                    position: "absolute",
                    left: 650,
                    top: 650,
                    width: 320,
                    height: 320,
                    borderRadius: "50%",
                    border: `3px solid ${COLORS.red}`,
                    opacity:
                        0.15 +
                        Math.sin(frame / 4) *
                        0.08,
                    transform: `scale(${1 +
                        Math.sin(frame / 4) *
                        0.04
                        })`,
                }}
            />
        </>
    );
};

/* =====================================================
   SECTION 3 — BOTTLENECK
===================================================== */

const Bottleneck = ({
    frame,
}: {
    frame: number;
}) => {
    const p = localProgress(frame, "bottleneck");

    const load = interpolate(
        p,
        [0, 0.35, 0.65, 1],
        [0.55, 0.8, 0.96, 1]
    );

    const redFlash =
        p > 0.7
            ? interpolate(
                p,
                [0.7, 0.85, 1],
                [0, 0.7, 0.2]
            )
            : 0;

    return (
        <>
            <Label
                x={70}
                y={140}
                size={48}
                weight={800}
            >
                The bottleneck
            </Label>

            <Label
                x={70}
                y={205}
                size={23}
                color={COLORS.muted}
            >
                CPU • memory • network
            </Label>

            <Server
                x={405}
                y={540}
                label="SERVER 01"
                frame={frame}
                status="warning"
                load={load}
                scale={1.18}
            />

            {/* gauges */}
            {[
                ["CPU", 820, load],
                ["RAM", 900, load * 0.92],
                ["NET", 980, load * 0.97],
            ].map(([name, y, value], i) => (
                <React.Fragment key={String(name)}>
                    <Label
                        x={180}
                        y={Number(y)}
                        size={21}
                        color={COLORS.muted}
                    >
                        {name}
                    </Label>

                    <div
                        style={{
                            position: "absolute",
                            left: 280,
                            top: Number(y) + 7,
                            width: 610,
                            height: 18,
                            borderRadius: 20,
                            background: "#1B3447",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${Number(value) *
                                    100
                                    }%`,
                                height: "100%",
                                background:
                                    Number(value) >
                                        0.85
                                        ? COLORS.red
                                        : COLORS.orange,
                                boxShadow: `0 0 15px ${Number(value) >
                                        0.85
                                        ? COLORS.red
                                        : COLORS.orange
                                    }`,
                            }}
                        />
                    </div>
                </React.Fragment>
            ))}

            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: COLORS.red,
                    opacity: redFlash * 0.08,
                    pointerEvents: "none",
                }}
            />

            <Label
                x={335}
                y={1090}
                size={30}
                color={COLORS.red}
                weight={800}
                opacity={ease(
                    interpolate(
                        p,
                        [0.55, 0.75],
                        [0, 1]
                    )
                )}
            >
                SYSTEM AT ITS LIMIT
            </Label>
        </>
    );
};

/* =====================================================
   SECTION 4 — SOLUTION
===================================================== */

const Solution = ({
    frame,
}: {
    frame: number;
}) => {
    const p = localProgress(frame, "solution");

    const scale = interpolate(
        ease(p),
        [0, 1],
        [0.3, 1]
    );

    return (
        <>
            <Label
                x={70}
                y={140}
                size={48}
                weight={800}
            >
                A load balancer steps in.
            </Label>

            <Label
                x={70}
                y={205}
                size={23}
                color={COLORS.muted}
            >
                One entry point. Multiple servers.
            </Label>

            <Users
                frame={frame}
                x={70}
                y={760}
            />

            <LoadBalancer
                frame={frame}
                x={405}
                y={760}
                active
            />

            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "center",
                }}
            >
                <Server
                    x={150}
                    y={1080}
                    label="SERVER 01"
                    frame={frame}
                    load={0.3}
                />

                <Server
                    x={405}
                    y={1080}
                    label="SERVER 02"
                    frame={frame}
                    load={0.28}
                />

                <Server
                    x={660}
                    y={1080}
                    label="SERVER 03"
                    frame={frame}
                    load={0.32}
                />
            </div>
        </>
    );
};

/* =====================================================
   SECTION 5 — TRAFFIC
===================================================== */

const Traffic = ({
    frame,
}: {
    frame: number;
}) => {
    return (
        <>
            <Label
                x={70}
                y={130}
                size={48}
                weight={800}
            >
                Traffic gets distributed.
            </Label>

            <Users
                frame={frame}
                x={80}
                y={740}
            />

            <LoadBalancer
                frame={frame}
                x={405}
                y={700}
            />

            <Server
                x={60}
                y={1110}
                label="SERVER 01"
                frame={frame}
                load={0.32}
            />

            <Server
                x={405}
                y={1110}
                label="SERVER 02"
                frame={frame}
                load={0.28}
            />

            <Server
                x={750}
                y={1110}
                label="SERVER 03"
                frame={frame}
                load={0.31}
            />

            {/* incoming */}
            <Line
                x1={240}
                y1={840}
                x2={520}
                y2={790}
                color={COLORS.cyan}
                opacity={0.35}
            />

            {/* outgoing */}
            <Line
                x1={540}
                y1={880}
                x2={195}
                y2={1110}
                color={COLORS.green}
                opacity={0.35}
            />

            <Line
                x1={540}
                y1={880}
                x2={540}
                y2={1110}
                color={COLORS.green}
                opacity={0.35}
            />

            <Line
                x1={540}
                y1={880}
                x2={885}
                y2={1110}
                color={COLORS.green}
                opacity={0.35}
            />

            {/* packets */}
            <RequestStream
                frame={frame}
                startX={240}
                startY={840}
                endX={510}
                endY={790}
                count={10}
                speed={24}
            />

            <RequestStream
                frame={frame}
                startX={530}
                startY={870}
                endX={195}
                endY={1110}
                count={5}
                speed={18}
                color={COLORS.green}
            />

            <RequestStream
                frame={frame + 35}
                startX={530}
                startY={870}
                endX={540}
                endY={1110}
                count={5}
                speed={18}
                color={COLORS.green}
            />

            <RequestStream
                frame={frame + 70}
                startX={530}
                startY={870}
                endX={885}
                endY={1110}
                count={5}
                speed={18}
                color={COLORS.green}
            />
        </>
    );
};

/* =====================================================
   SECTION 6 — ALGORITHMS
===================================================== */

const Algorithms = ({
    frame,
}: {
    frame: number;
}) => {
    const p = localProgress(frame, "algorithms");

    const step =
        Math.floor(frame / 16) % 3;

    const servers = [
        { x: 70, label: "01" },
        { x: 405, label: "02" },
        { x: 740, label: "03" },
    ];

    return (
        <>
            <Label
                x={70}
                y={130}
                size={46}
                weight={800}
            >
                Smart routing
            </Label>

            <Label
                x={70}
                y={195}
                size={23}
                color={COLORS.muted}
            >
                Round robin • least connections • weighted
            </Label>

            <LoadBalancer
                frame={frame}
                x={405}
                y={500}
            />

            {servers.map((server, i) => (
                <React.Fragment key={server.label}>
                    <Server
                        x={server.x}
                        y={930}
                        label={`SERVER ${server.label}`}
                        frame={frame}
                        load={
                            i === step
                                ? 0.5
                                : 0.25
                        }
                        status={
                            i === step
                                ? "warning"
                                : "healthy"
                        }
                    />

                    <Line
                        x1={540}
                        y1={680}
                        x2={server.x + 135}
                        y2={930}
                        color={
                            i === step
                                ? COLORS.orange
                                : COLORS.green
                        }
                        opacity={
                            i === step ? 0.9 : 0.2
                        }
                        width={
                            i === step ? 6 : 3
                        }
                    />
                </React.Fragment>
            ))}

            <div
                style={{
                    position: "absolute",
                    left:
                        servers[step].x + 100,
                    top: 840,
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    border: `4px solid ${COLORS.orange}`,
                    boxShadow: `0 0 25px ${COLORS.orange}`,
                    opacity:
                        0.7 +
                        Math.sin(frame / 5) *
                        0.2,
                }}
            />
        </>
    );
};

/* =====================================================
   SECTION 7 — HEALTH
===================================================== */

const Health = ({
    frame,
}: {
    frame: number;
}) => {
    const p = localProgress(frame, "health");

    const ping =
        Math.floor(frame / 18) % 3;

    return (
        <>
            <Label
                x={70}
                y={130}
                size={48}
                weight={800}
            >
                The load balancer watches.
            </Label>

            <Label
                x={70}
                y={195}
                size={23}
                color={COLORS.muted}
            >
                Health checks keep traffic safe.
            </Label>

            <LoadBalancer
                frame={frame}
                x={405}
                y={460}
            />

            {[
                {
                    x: 60,
                    label: "SERVER 01",
                    status: "healthy" as const,
                },
                {
                    x: 405,
                    label: "SERVER 02",
                    status: "healthy" as const,
                },
                {
                    x: 750,
                    label: "SERVER 03",
                    status: "healthy" as const,
                },
            ].map((server, i) => (
                <React.Fragment key={server.label}>
                    <Server
                        x={server.x}
                        y={930}
                        label={server.label}
                        frame={frame}
                        status={server.status}
                        load={0.3}
                    />

                    {i === ping && (
                        <div
                            style={{
                                position:
                                    "absolute",
                                left:
                                    server.x +
                                    135,
                                top: 880,
                                width: 100,
                                height: 100,
                                borderRadius:
                                    "50%",
                                border: `3px solid ${COLORS.mint}`,
                                opacity:
                                    1 -
                                    ((frame %
                                        18) /
                                        18),
                                transform: `scale(${0.4 +
                                    ((frame %
                                        18) /
                                        18) *
                                    1.2
                                    })`,
                            }}
                        />
                    )}
                </React.Fragment>
            ))}

            <Label
                x={410}
                y={790}
                size={22}
                color={COLORS.mint}
                weight={700}
            >
                HEALTH CHECK
            </Label>
        </>
    );
};

/* =====================================================
   SECTION 8 — FAILURE
===================================================== */

const Failure = ({
    frame,
}: {
    frame: number;
}) => {
    const p = localProgress(frame, "failure");

    const failed =
        p > 0.25;

    const reroute =
        p > 0.48
            ? ease(
                interpolate(
                    p,
                    [0.48, 0.8],
                    [0, 1]
                )
            )
            : 0;

    return (
        <>
            <Label
                x={70}
                y={120}
                size={48}
                weight={800}
            >
                One server dies.
            </Label>

            <Label
                x={70}
                y={185}
                size={23}
                color={COLORS.muted}
            >
                The system reroutes automatically.
            </Label>

            <LoadBalancer
                frame={frame}
                x={405}
                y={450}
            />

            <Server
                x={60}
                y={940}
                label="SERVER 01"
                frame={frame}
                load={0.42}
            />

            <Server
                x={405}
                y={940}
                label="SERVER 02"
                frame={frame}
                status={failed ? "dead" : "healthy"}
                load={failed ? 1 : 0.35}
            />

            <Server
                x={750}
                y={940}
                label="SERVER 03"
                frame={frame}
                load={0.45}
            />

            {/* normal paths */}
            <Line
                x1={540}
                y1={630}
                x2={195}
                y2={940}
                color={COLORS.green}
                opacity={0.55}
            />

            <Line
                x1={540}
                y1={630}
                x2={885}
                y2={940}
                color={COLORS.green}
                opacity={0.55}
            />

            <Line
                x1={540}
                y1={630}
                x2={540}
                y2={940}
                color={COLORS.red}
                opacity={failed ? 0.12 : 0.55}
            />

            {/* rerouted traffic */}
            <RequestStream
                frame={frame}
                startX={540}
                startY={630}
                endX={195}
                endY={940}
                count={5}
                speed={20}
                color={COLORS.mint}
                delay={100}
            />

            <RequestStream
                frame={frame + 50}
                startX={540}
                startY={630}
                endX={885}
                endY={940}
                count={5}
                speed={20}
                color={COLORS.mint}
                delay={150}
            />

            {failed && (
                <Label
                    x={420}
                    y={860}
                    size={24}
                    color={COLORS.red}
                    weight={800}
                    opacity={ease(
                        interpolate(
                            p,
                            [0.25, 0.4],
                            [0, 1]
                        )
                    )}
                >
                    SERVER DOWN
                </Label>
            )}

            {reroute > 0 && (
                <div
                    style={{
                        position: "absolute",
                        left: 315,
                        top: 730,
                        width: 450,
                        height: 150,
                        borderRadius: "50%",
                        border: `3px solid ${COLORS.mint}`,
                        opacity: reroute * 0.45,
                        transform: `scale(${0.8 +
                            reroute * 0.3
                            })`,
                        filter: "blur(1px)",
                    }}
                />
            )}
        </>
    );
};

/* =====================================================
   SECTION 9 — FINAL
===================================================== */

const Final = ({
    frame,
}: {
    frame: number;
}) => {
    const p = localProgress(frame, "final");

    const glow = interpolate(
        ease(p),
        [0, 1],
        [0, 1]
    );

    return (
        <>
            <Label
                x={70}
                y={130}
                size={50}
                weight={800}
            >
                Scale. Stay available.
            </Label>

            <Label
                x={70}
                y={200}
                size={25}
                color={COLORS.mint}
                weight={700}
            >
                Keep serving traffic.
            </Label>

            <Users
                frame={frame}
                x={60}
                y={710}
            />

            <LoadBalancer
                frame={frame}
                x={405}
                y={650}
            />

            <Server
                x={60}
                y={1030}
                label="SERVER 01"
                frame={frame}
                load={0.34}
            />

            <Server
                x={405}
                y={1030}
                label="SERVER 02"
                frame={frame}
                load={0.31}
            />

            <Server
                x={750}
                y={1030}
                label="SERVER 03"
                frame={frame}
                load={0.33}
            />

            {/* traffic paths */}
            <Line
                x1={235}
                y1={800}
                x2={540}
                y2={740}
                color={COLORS.cyan}
                opacity={0.5}
            />

            {[195, 540, 885].map((x) => (
                <Line
                    key={x}
                    x1={540}
                    y1={830}
                    x2={x}
                    y2={1030}
                    color={COLORS.green}
                    opacity={0.55}
                />
            ))}

            <RequestStream
                frame={frame}
                startX={235}
                startY={800}
                endX={540}
                endY={740}
                count={8}
                speed={20}
            />

            {[195, 540, 885].map((x, i) => (
                <RequestStream
                    key={x}
                    frame={frame + i * 25}
                    startX={540}
                    startY={820}
                    endX={x}
                    endY={1030}
                    count={5}
                    speed={15}
                    color={COLORS.mint}
                />
            ))}

            {/* final glow */}
            <div
                style={{
                    position: "absolute",
                    left: 190,
                    top: 1370,
                    width: 700,
                    height: 260,
                    borderRadius: "50%",
                    background: COLORS.green,
                    opacity: glow * 0.06,
                    filter: "blur(80px)",
                }}
            />

            {/* success indicators */}
            {[
                ["SCALE", 180],
                ["AVAILABILITY", 450],
                ["TRAFFIC", 760],
            ].map(([text, x]) => (
                <div
                    key={String(text)}
                    style={{
                        position: "absolute",
                        left: Number(x),
                        top: 1450,
                        padding:
                            "15px 22px",
                        borderRadius: 40,
                        border: `2px solid ${COLORS.green}`,
                        background:
                            "rgba(31,209,165,.08)",
                        color: COLORS.mint,
                        fontSize: 20,
                        fontWeight: 800,
                        opacity: glow,
                        boxShadow: `0 0 20px rgba(31,209,165,.15)`,
                    }}
                >
                    ✓ {text}
                </div>
            ))}
        </>
    );
};

/* =====================================================
   MAIN SCENE
===================================================== */

export const LoadBalancerScene = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill
            style={{
                width: W,
                height: H,
                overflow: "hidden",
                fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
        >
            <Background frame={frame} />

            {/* audio follows exact timeline */}
            {timeline.sections.map((section) => (
                <Sequence
                    key={section.id}
                    from={section.start}
                    durationInFrames={section.duration}
                >
                    <Audio
                        src={staticFile(section.audio)}
                    />
                </Sequence>
            ))}

            {/* visual sections */}
            {timeline.sections.map((section) => {
                const from = section.start;
                const duration = section.duration;

                return (
                    <Sequence
                        key={`visual-${section.id}`}
                        from={from}
                        durationInFrames={duration}
                    >
                        {section.id === "hook" && (
                            <Hook frame={frame} />
                        )}

                        {section.id === "problem" && (
                            <Problem frame={frame} />
                        )}

                        {section.id === "bottleneck" && (
                            <Bottleneck frame={frame} />
                        )}

                        {section.id === "solution" && (
                            <Solution frame={frame} />
                        )}

                        {section.id === "traffic" && (
                            <Traffic frame={frame} />
                        )}

                        {section.id === "algorithms" && (
                            <Algorithms frame={frame} />
                        )}

                        {section.id === "health" && (
                            <Health frame={frame} />
                        )}

                        {section.id === "failure" && (
                            <Failure frame={frame} />
                        )}

                        {section.id === "final" && (
                            <Final frame={frame} />
                        )}
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};