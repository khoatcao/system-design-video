import React from "react";

import {
    AbsoluteFill,
    Audio,
    Easing,
    interpolate,
    Sequence,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";

import { createTimeline } from "../timeline";
import { systemDesign } from "../../content/system-design";

const timeline = createTimeline(systemDesign);

const TOTAL_FRAMES = timeline.totalFrames;

/* ============================================================
   TIMELINE
   ============================================================ */

const TIMELINE = Object.fromEntries(
    timeline.sections.map((section) => [section.id, section])
) as Record<
    string,
    {
        id: string;
        start: number;
        duration: number;
        audio: string;
    }
>;

/*
 * Original visual timeline was designed for 1800 frames (60s).
 *
 * The audio timeline is now dynamic (~89s).
 *
 * We map each real audio section back to the original
 * visual section timeline so all existing animations
 * keep their original timing and style.
 */

const ORIGINAL_SECTION_ENDS = [
    120,   // hook
    330,   // problem
    600,   // scalability
    870,   // reliability
    1140,  // maturity
    1320,  // interview
    1605,  // career
    1800,  // final
];

const SECTION_IDS = [
    "hook",
    "problem",
    "scalability",
    "reliability",
    "maturity",
    "interview",
    "career",
    "final",
] as const;

const getVisualFrame = (frame: number) => {
    for (let i = 0; i < SECTION_IDS.length; i++) {
        const id = SECTION_IDS[i];
        const section = TIMELINE[id];

        const realStart = section.start;
        const realEnd =
            section.start + section.duration;

        const visualStart =
            i === 0
                ? 0
                : ORIGINAL_SECTION_ENDS[i - 1];

        const visualEnd =
            ORIGINAL_SECTION_ENDS[i];

        if (
            frame <= realEnd ||
            i === SECTION_IDS.length - 1
        ) {
            const progress = interpolate(
                frame,
                [realStart, realEnd],
                [0, 1],
                {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                }
            );

            return (
                visualStart +
                (visualEnd - visualStart) * progress
            );
        }
    }

    return 1800;
};

/* ============================================================
   THEME
   ============================================================ */

const BG =
    "radial-gradient(circle at 50% 12%, #162B45 0%, #0B1626 48%, #060B12 100%)";

const GRID =
    "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), " +
    "linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)";

const COLORS = {
    cyan: "#4DB8FF",
    green: "#1FD1A5",
    purple: "#9B7CFF",
    orange: "#FFB86C",
    red: "#FF5268",
    pink: "#FF6B9D",
    white: "#F4F7FB",
    muted: "#8FA3B8",
    panel: "rgba(255,255,255,0.055)",
};

/* ============================================================
   ANIMATION HELPERS
   ============================================================ */

const fade = (
    frame: number,
    start: number,
    end: number
) =>
    interpolate(frame, [start, end], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
    });

const scaleIn = (
    frame: number,
    start: number,
    end: number
) =>
    interpolate(frame, [start, end], [0.82, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.back(1.5)),
    });

const slideUp = (
    frame: number,
    start: number,
    end: number
) =>
    interpolate(frame, [start, end], [45, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
    });

/* ============================================================
   ICONS
   ============================================================ */

type IconType =
    | "code"
    | "users"
    | "server"
    | "servers"
    | "load-balancer"
    | "database"
    | "shield"
    | "chart"
    | "network"
    | "queue"
    | "target"
    | "arrow";

const Icon: React.FC<{
    type: IconType;
    color: string;
    size?: number;
}> = ({ type, color, size = 70 }) => {
    const common = {
        fill: "none",
        stroke: color,
        strokeWidth: 3.5,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            style={{
                overflow: "visible",
                filter: `drop-shadow(0 0 12px ${color}45)`,
            }}
        >
            {type === "code" && (
                <>
                    <polyline points="38,25 18,50 38,75" {...common} />
                    <polyline points="62,25 82,50 62,75" {...common} />
                    <line x1="57" y1="18" x2="43" y2="82" {...common} />
                </>
            )}

            {type === "users" && (
                <>
                    <circle cx="50" cy="28" r="12" {...common} />

                    <path
                        d="M27 75c2-15 12-24 23-24s21 9 23 24"
                        {...common}
                    />

                    <circle
                        cx="20"
                        cy="40"
                        r="8"
                        {...common}
                        opacity={0.65}
                    />

                    <circle
                        cx="80"
                        cy="40"
                        r="8"
                        {...common}
                        opacity={0.65}
                    />

                    <path
                        d="M8 72c1-9 6-14 14-15"
                        {...common}
                        opacity={0.65}
                    />

                    <path
                        d="M92 72c-1-9-6-14-14-15"
                        {...common}
                        opacity={0.65}
                    />
                </>
            )}

            {type === "server" && (
                <>
                    <rect
                        x="22"
                        y="15"
                        width="56"
                        height="70"
                        rx="7"
                        {...common}
                    />

                    <line
                        x1="30"
                        y1="35"
                        x2="70"
                        y2="35"
                        {...common}
                    />

                    <line
                        x1="30"
                        y1="58"
                        x2="70"
                        y2="58"
                        {...common}
                    />

                    <circle
                        cx="35"
                        cy="26"
                        r="3"
                        fill={color}
                    />

                    <circle
                        cx="35"
                        cy="49"
                        r="3"
                        fill={color}
                    />

                    <circle
                        cx="35"
                        cy="72"
                        r="3"
                        fill={color}
                    />

                    <line
                        x1="45"
                        y1="26"
                        x2="65"
                        y2="26"
                        {...common}
                    />

                    <line
                        x1="45"
                        y1="49"
                        x2="65"
                        y2="49"
                        {...common}
                    />

                    <line
                        x1="45"
                        y1="72"
                        x2="65"
                        y2="72"
                        {...common}
                    />
                </>
            )}

            {type === "servers" && (
                <>
                    <rect
                        x="10"
                        y="28"
                        width="35"
                        height="48"
                        rx="5"
                        {...common}
                    />

                    <rect
                        x="33"
                        y="18"
                        width="35"
                        height="48"
                        rx="5"
                        {...common}
                    />

                    <rect
                        x="56"
                        y="28"
                        width="35"
                        height="48"
                        rx="5"
                        {...common}
                    />

                    <circle
                        cx="19"
                        cy="40"
                        r="2.5"
                        fill={color}
                    />

                    <circle
                        cx="42"
                        cy="30"
                        r="2.5"
                        fill={color}
                    />

                    <circle
                        cx="65"
                        cy="40"
                        r="2.5"
                        fill={color}
                    />

                    <line
                        x1="26"
                        y1="40"
                        x2="37"
                        y2="40"
                        {...common}
                    />

                    <line
                        x1="49"
                        y1="30"
                        x2="60"
                        y2="30"
                        {...common}
                    />

                    <line
                        x1="72"
                        y1="40"
                        x2="83"
                        y2="40"
                        {...common}
                    />
                </>
            )}

            {type === "load-balancer" && (
                <>
                    <rect
                        x="25"
                        y="35"
                        width="50"
                        height="30"
                        rx="7"
                        {...common}
                    />

                    <line
                        x1="50"
                        y1="12"
                        x2="50"
                        y2="35"
                        {...common}
                    />

                    <line
                        x1="50"
                        y1="65"
                        x2="50"
                        y2="88"
                        {...common}
                    />

                    <polyline
                        points="43,20 50,12 57,20"
                        {...common}
                    />

                    <polyline
                        points="43,80 50,88 57,80"
                        {...common}
                    />

                    <line
                        x1="35"
                        y1="45"
                        x2="65"
                        y2="45"
                        {...common}
                    />

                    <line
                        x1="35"
                        y1="55"
                        x2="65"
                        y2="55"
                        {...common}
                    />
                </>
            )}

            {type === "database" && (
                <>
                    <ellipse
                        cx="50"
                        cy="25"
                        rx="30"
                        ry="11"
                        {...common}
                    />

                    <path
                        d="M20 25v43c0 7 13 12 30 12s30-5 30-12V25"
                        {...common}
                    />

                    <path
                        d="M20 47c0 7 13 12 30 12s30-5 30-12"
                        {...common}
                    />
                </>
            )}

            {type === "shield" && (
                <>
                    <path
                        d="M50 12L78 23v23c0 20-12 31-28 41C34 77 22 66 22 46V23z"
                        {...common}
                    />

                    <polyline
                        points="35,49 45,59 66,36"
                        {...common}
                    />
                </>
            )}

            {type === "chart" && (
                <>
                    <line
                        x1="18"
                        y1="82"
                        x2="18"
                        y2="18"
                        {...common}
                    />

                    <line
                        x1="18"
                        y1="82"
                        x2="88"
                        y2="82"
                        {...common}
                    />

                    <polyline
                        points="25,68 42,55 54,61 71,37 86,44"
                        {...common}
                    />

                    <circle
                        cx="25"
                        cy="68"
                        r="3"
                        fill={color}
                    />

                    <circle
                        cx="42"
                        cy="55"
                        r="3"
                        fill={color}
                    />

                    <circle
                        cx="54"
                        cy="61"
                        r="3"
                        fill={color}
                    />

                    <circle
                        cx="71"
                        cy="37"
                        r="3"
                        fill={color}
                    />
                </>
            )}

            {type === "network" && (
                <>
                    <circle
                        cx="50"
                        cy="20"
                        r="9"
                        {...common}
                    />

                    <circle
                        cx="22"
                        cy="70"
                        r="9"
                        {...common}
                    />

                    <circle
                        cx="78"
                        cy="70"
                        r="9"
                        {...common}
                    />

                    <circle
                        cx="50"
                        cy="52"
                        r="9"
                        {...common}
                    />

                    <line
                        x1="44"
                        y1="27"
                        x2="42"
                        y2="44"
                        {...common}
                    />

                    <line
                        x1="56"
                        y1="27"
                        x2="58"
                        y2="44"
                        {...common}
                    />

                    <line
                        x1="43"
                        y1="58"
                        x2="29"
                        y2="65"
                        {...common}
                    />

                    <line
                        x1="57"
                        y1="58"
                        x2="71"
                        y2="65"
                        {...common}
                    />
                </>
            )}

            {type === "queue" && (
                <>
                    <rect
                        x="12"
                        y="25"
                        width="76"
                        height="50"
                        rx="8"
                        {...common}
                    />

                    <rect
                        x="21"
                        y="38"
                        width="13"
                        height="24"
                        rx="3"
                        fill={color}
                    />

                    <rect
                        x="43"
                        y="38"
                        width="13"
                        height="24"
                        rx="3"
                        fill={color}
                        opacity={0.75}
                    />

                    <rect
                        x="65"
                        y="38"
                        width="13"
                        height="24"
                        rx="3"
                        fill={color}
                        opacity={0.5}
                    />
                </>
            )}

            {type === "target" && (
                <>
                    <circle
                        cx="50"
                        cy="50"
                        r="31"
                        {...common}
                    />

                    <circle
                        cx="50"
                        cy="50"
                        r="19"
                        {...common}
                    />

                    <circle
                        cx="50"
                        cy="50"
                        r="6"
                        fill={color}
                    />
                </>
            )}

            {type === "arrow" && (
                <>
                    <line
                        x1="15"
                        y1="50"
                        x2="78"
                        y2="50"
                        {...common}
                    />

                    <polyline
                        points="63,35 78,50 63,65"
                        {...common}
                    />
                </>
            )}
        </svg>
    );
};

/* ============================================================
   TEXT
   ============================================================ */

const Label: React.FC<{
    children: React.ReactNode;
    color?: string;
    size?: number;
    weight?: number;
}> = ({
    children,
    color = COLORS.white,
    size = 24,
    weight = 700,
}) => (
        <div
            style={{
                color,
                fontSize: size,
                fontWeight: weight,
                letterSpacing: -0.3,
            }}
        >
            {children}
        </div>
    );

/* ============================================================
   PANEL
   ============================================================ */

const Panel: React.FC<{
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    children: React.ReactNode;
    frame: number;
    start: number;
    end?: number;
}> = ({
    x,
    y,
    width,
    height,
    color,
    children,
    frame,
    start,
    end,
}) => {
        const opacity = end
            ? interpolate(
                frame,
                [start, start + 10, end - 10, end],
                [0, 1, 1, 0],
                {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                }
            )
            : fade(frame, start, start + 10);

        const scale = scaleIn(
            frame,
            start,
            start + 10
        );

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width,
                    height,
                    opacity,
                    transform: `scale(${scale})`,
                    transformOrigin: "center",
                    border: `2px solid ${color}`,
                    borderRadius: 24,
                    background: "rgba(7,16,28,0.88)",
                    boxShadow: `0 0 35px ${color}18`,
                    boxSizing: "border-box",
                }}
            >
                {children}
            </div>
        );
    };

/* ============================================================
   FLOW ARROW
   ============================================================ */

const FlowArrow: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    frame: number;
    start: number;
    packet?: boolean;
}> = ({
    x1,
    y1,
    x2,
    y2,
    color,
    frame,
    start,
    packet = false,
}) => {
        const progress = fade(
            frame,
            start,
            start + 12
        );

        const px =
            x1 + (x2 - x1) * progress;

        const py =
            y1 + (y2 - y1) * progress;

        const packetProgress =
            ((frame - start) % 42) / 42;

        const packetX =
            x1 + (x2 - x1) * packetProgress;

        const packetY =
            y1 + (y2 - y1) * packetProgress;

        return (
            <>
                <svg
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        opacity: progress,
                    }}
                >
                    <line
                        x1={x1}
                        y1={y1}
                        x2={px}
                        y2={py}
                        stroke={color}
                        strokeWidth={4}
                        strokeLinecap="round"
                    />

                    {progress > 0.9 && (
                        <>
                            <circle
                                cx={x2}
                                cy={y2}
                                r={5}
                                fill={color}
                            />

                            <polyline
                                points={`${x2 - 12},${y2 - 7} ${x2},${y2} ${x2 - 12},${y2 + 7}`}
                                fill="none"
                                stroke={color}
                                strokeWidth={3}
                                strokeLinecap="round"
                            />
                        </>
                    )}
                </svg>

                {packet && frame >= start + 15 && (
                    <div
                        style={{
                            position: "absolute",
                            left: packetX - 7,
                            top: packetY - 7,
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: color,
                            boxShadow: `0 0 18px ${color}`,
                        }}
                    />
                )}
            </>
        );
    };

/* ============================================================
   SECTION HEADER
   ============================================================ */

const SectionHeader: React.FC<{
    title: string;
    subtitle?: string;
    number?: string;
    color: string;
    frame: number;
    start: number;
}> = ({
    title,
    subtitle,
    number,
    color,
    frame,
    start,
}) => {
        const opacity = fade(
            frame,
            start,
            start + 10
        );

        const y = slideUp(
            frame,
            start,
            start + 10
        );

        return (
            <div
                style={{
                    position: "absolute",
                    top: 205,
                    left: 45,
                    right: 45,
                    textAlign: "center",
                    opacity,
                    transform: `translateY(${y}px)`,
                }}
            >
                <div
                    style={{
                        fontSize: 48,
                        fontWeight: 900,
                        color: COLORS.white,
                    }}
                >
                    {number && (
                        <span style={{ color }}>
                            {number}.{" "}
                        </span>
                    )}
                    {title}
                </div>

                {subtitle && (
                    <div
                        style={{
                            marginTop: 14,
                            fontSize: 23,
                            color: COLORS.muted,
                        }}
                    >
                        {subtitle}
                    </div>
                )}
            </div>
        );
    };

/* ============================================================
   SERVER NODE
   ============================================================ */

const ServerNode: React.FC<{
    x: number;
    y: number;
    label: string;
    color: string;
    frame: number;
    start: number;
    failed?: boolean;
}> = ({
    x,
    y,
    label,
    color,
    frame,
    start,
    failed = false,
}) => {
        const opacity = fade(
            frame,
            start,
            start + 8
        );

        const pulse =
            1 +
            Math.sin(
                (frame - start) * 0.18
            ) *
            0.025;

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 170,
                    height: 155,
                    opacity,
                    transform: `scale(${pulse})`,
                    border: `2px solid ${failed
                        ? COLORS.red
                        : color
                        }`,
                    borderRadius: 20,
                    background: "rgba(7,16,28,0.95)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    boxShadow: failed
                        ? `0 0 35px ${COLORS.red}35`
                        : `0 0 25px ${color}18`,
                }}
            >
                <Icon
                    type="server"
                    color={
                        failed
                            ? COLORS.red
                            : color
                    }
                    size={58}
                />

                <Label
                    size={18}
                    weight={800}
                    color={
                        failed
                            ? COLORS.red
                            : COLORS.white
                    }
                >
                    {failed ? "FAILED" : label}
                </Label>
            </div>
        );
    };

/* ============================================================
   AUDIO
   ============================================================ */

const AudioTrack: React.FC = () => (
    <>
        <Sequence
            from={TIMELINE.hook.start}
            durationInFrames={TIMELINE.hook.duration}
        >
            <Audio
                src={staticFile(
                    "audio/hook.mp3"
                )}
            />
        </Sequence>

        <Sequence
            from={TIMELINE.problem.start}
            durationInFrames={TIMELINE.problem.duration}
        >
            <Audio
                src={staticFile(
                    "audio/problem.mp3"
                )}
            />
        </Sequence>

        <Sequence
            from={TIMELINE.scalability.start}
            durationInFrames={TIMELINE.scalability.duration}
        >
            <Audio
                src={staticFile(
                    "audio/scalability.mp3"
                )}
            />
        </Sequence>

        <Sequence
            from={TIMELINE.reliability.start}
            durationInFrames={TIMELINE.reliability.duration}
        >
            <Audio
                src={staticFile(
                    "audio/reliability.mp3"
                )}
            />
        </Sequence>

        <Sequence
            from={TIMELINE.maturity.start}
            durationInFrames={TIMELINE.maturity.duration}
        >
            <Audio
                src={staticFile(
                    "audio/maturity.mp3"
                )}
            />
        </Sequence>

        <Sequence
            from={TIMELINE.interview.start}
            durationInFrames={TIMELINE.interview.duration}
        >
            <Audio
                src={staticFile(
                    "audio/interview.mp3"
                )}
            />
        </Sequence>

        <Sequence
            from={TIMELINE.career.start}
            durationInFrames={TIMELINE.career.duration}
        >
            <Audio
                src={staticFile(
                    "audio/career.mp3"
                )}
            />
        </Sequence>

        <Sequence
            from={TIMELINE.final.start}
            durationInFrames={TIMELINE.final.duration}
        >
            <Audio
                src={staticFile(
                    "audio/final.mp3"
                )}
            />
        </Sequence>
    </>
);

/* ============================================================
   MAIN SCENE
   ============================================================ */

export const WhySystemDesignMattersScene: React.FC =
    () => {
        /*
         * realFrame:
         * Actual frame from the ~89s audio timeline.
         *
         * visualFrame:
         * Mapped frame from the original 1800-frame
         * visual timeline.
         *
         * `frame` is intentionally aliased to visualFrame
         * so all existing animation code below keeps working.
         */
        const realFrame = useCurrentFrame();
        const visualFrame =
            getVisualFrame(realFrame);

        const frame = visualFrame;

        const { width } = useVideoConfig();

        const backgroundGlow = interpolate(
            realFrame,
            [0, TOTAL_FRAMES / 2, TOTAL_FRAMES],
            [0.8, 1.1, 0.8],
            {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            }
        );

        return (
            <AbsoluteFill
                style={{
                    background: BG,
                    color: COLORS.white,
                    fontFamily:
                        "Arial, Helvetica, sans-serif",
                    overflow: "hidden",
                }}
            >
                {/* AUDIO */}

                <AudioTrack />

                {/* GRID */}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: GRID,
                        backgroundSize: "48px 48px",
                        opacity: 0.8,
                    }}
                />

                {/* TOP GRADIENT */}

                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 7,
                        background:
                            "linear-gradient(90deg, #4DB8FF, #1FD1A5, #9B7CFF)",
                    }}
                />

                {/* GLOW */}

                <div
                    style={{
                        position: "absolute",
                        width: 700,
                        height: 700,
                        left: -350,
                        top: 350,
                        borderRadius: "50%",
                        background: COLORS.cyan,
                        opacity:
                            0.035 *
                            backgroundGlow,
                        filter: "blur(100px)",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        width: 650,
                        height: 650,
                        right: -320,
                        bottom: 250,
                        borderRadius: "50%",
                        background: COLORS.purple,
                        opacity:
                            0.04 *
                            backgroundGlow,
                        filter: "blur(100px)",
                    }}
                />

                {/* ====================================================
                   0-4s
                   HOOK
                   ==================================================== */}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: interpolate(
                            visualFrame,
                            [0, 10, 105, 120],
                            [0, 1, 1, 0],
                            {
                                extrapolateLeft:
                                    "clamp",
                                extrapolateRight:
                                    "clamp",
                            }
                        ),
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 300,
                            left: 50,
                            right: 50,
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                opacity: fade(
                                    frame,
                                    5,
                                    15
                                ),
                                transform: `scale(${scaleIn(
                                    frame,
                                    5,
                                    15
                                )})`,
                            }}
                        >
                            <Icon
                                type="code"
                                color={
                                    COLORS.cyan
                                }
                                size={120}
                            />
                        </div>

                        <div
                            style={{
                                marginTop: 30,
                                fontSize: 58,
                                lineHeight: 1.05,
                                fontWeight: 900,
                                opacity: fade(
                                    frame,
                                    15,
                                    28
                                ),
                                transform: `translateY(${slideUp(
                                    frame,
                                    15,
                                    28
                                )}px)`,
                            }}
                        >
                            Why System Design
                            <br />
                            Is Important
                        </div>

                        <div
                            style={{
                                marginTop: 32,
                                fontSize: 28,
                                color: COLORS.muted,
                                opacity: fade(
                                    frame,
                                    35,
                                    50
                                ),
                            }}
                        >
                            What happens when
                            <span
                                style={{
                                    color: COLORS.cyan,
                                    fontWeight: 800,
                                }}
                            >
                                {" "}
                                millions
                            </span>{" "}
                            use it?
                        </div>
                    </div>
                </div>

                {/* ====================================================
                   4-11s
                   THE PROBLEM
                   ==================================================== */}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: interpolate(
                            frame,
                            [105, 120, 315, 330],
                            [0, 1, 1, 0],
                            {
                                extrapolateLeft:
                                    "clamp",
                                extrapolateRight:
                                    "clamp",
                            }
                        ),
                    }}
                >
                    <SectionHeader
                        title="The Problem"
                        subtitle="A system must grow with its users."
                        color={COLORS.cyan}
                        frame={frame}
                        start={115}
                    />

                    <div
                        style={{
                            position: "absolute",
                            left: 115,
                            top: 520,
                            width: 230,
                            height: 220,
                            textAlign: "center",
                            opacity: fade(
                                frame,
                                135,
                                150
                            ),
                            transform: `scale(${scaleIn(
                                frame,
                                135,
                                150
                            )})`,
                        }}
                    >
                        <Icon
                            type="users"
                            color={
                                COLORS.green
                            }
                            size={90}
                        />

                        <Label
                            size={30}
                            weight={900}
                        >
                            1 user
                        </Label>
                    </div>

                    <FlowArrow
                        x1={350}
                        y1={625}
                        x2={455}
                        y2={625}
                        color={COLORS.green}
                        frame={frame}
                        start={165}
                        packet
                    />

                    <div
                        style={{
                            position: "absolute",
                            left: 425,
                            top: 520,
                            width: 230,
                            height: 220,
                            textAlign: "center",
                            opacity: fade(
                                frame,
                                180,
                                195
                            ),
                            transform: `scale(${scaleIn(
                                frame,
                                180,
                                195
                            )})`,
                        }}
                    >
                        <Icon
                            type="users"
                            color={
                                COLORS.orange
                            }
                            size={90}
                        />

                        <Label
                            size={30}
                            weight={900}
                            color={
                                COLORS.orange
                            }
                        >
                            1,000 users
                        </Label>
                    </div>

                    <FlowArrow
                        x1={660}
                        y1={625}
                        x2={765}
                        y2={625}
                        color={COLORS.orange}
                        frame={frame}
                        start={210}
                        packet
                    />

                    <div
                        style={{
                            position: "absolute",
                            left: 735,
                            top: 520,
                            width: 230,
                            height: 220,
                            textAlign: "center",
                            opacity: fade(
                                frame,
                                225,
                                240
                            ),
                            transform: `scale(${scaleIn(
                                frame,
                                225,
                                240
                            )})`,
                        }}
                    >
                        <Icon
                            type="users"
                            color={COLORS.red}
                            size={90}
                        />

                        <Label
                            size={30}
                            weight={900}
                            color={
                                COLORS.red
                            }
                        >
                            1,000,000
                        </Label>

                        <div
                            style={{
                                marginTop: 5,
                                fontSize: 19,
                                color: COLORS.muted,
                            }}
                        >
                            users
                        </div>
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 830,
                            left: 80,
                            right: 80,
                            textAlign: "center",
                            fontSize: 27,
                            fontWeight: 800,
                            color: COLORS.white,
                            opacity: fade(
                                frame,
                                260,
                                275
                            ),
                        }}
                    >
                        The architecture has to evolve.
                    </div>
                </div>

                {/* ====================================================
                   11-20s
                   SCALABILITY
                   ==================================================== */}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: interpolate(
                            frame,
                            [315, 330, 585, 600],
                            [0, 1, 1, 0],
                            {
                                extrapolateLeft:
                                    "clamp",
                                extrapolateRight:
                                    "clamp",
                            }
                        ),
                    }}
                >
                    <SectionHeader
                        number="1"
                        title="Scalability"
                        subtitle="Handle more traffic without breaking."
                        color={COLORS.cyan}
                        frame={frame}
                        start={330}
                    />

                    <Panel
                        x={70}
                        y={500}
                        width={200}
                        height={180}
                        color={COLORS.green}
                        frame={frame}
                        start={350}
                    >
                        <div
                            style={{
                                height: "100%",
                                display: "flex",
                                flexDirection:
                                    "column",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                gap: 8,
                            }}
                        >
                            <Icon
                                type="users"
                                color={
                                    COLORS.green
                                }
                                size={70}
                            />

                            <Label size={20}>
                                Users
                            </Label>
                        </div>
                    </Panel>

                    <Panel
                        x={440}
                        y={500}
                        width={200}
                        height={180}
                        color={COLORS.cyan}
                        frame={frame}
                        start={370}
                    >
                        <div
                            style={{
                                height: "100%",
                                display: "flex",
                                flexDirection:
                                    "column",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                gap: 8,
                            }}
                        >
                            <Icon
                                type="load-balancer"
                                color={
                                    COLORS.cyan
                                }
                                size={70}
                            />

                            <Label size={18}>
                                Load Balancer
                            </Label>
                        </div>
                    </Panel>

                    <ServerNode
                        x={800}
                        y={430}
                        label="Server A"
                        color={COLORS.purple}
                        frame={frame}
                        start={390}
                    />

                    <ServerNode
                        x={800}
                        y={625}
                        label="Server B"
                        color={COLORS.purple}
                        frame={frame}
                        start={410}
                    />

                    <ServerNode
                        x={800}
                        y={820}
                        label="Server C"
                        color={COLORS.purple}
                        frame={frame}
                        start={430}
                    />

                    <FlowArrow
                        x1={270}
                        y1={590}
                        x2={440}
                        y2={590}
                        color={COLORS.green}
                        frame={frame}
                        start={430}
                        packet
                    />

                    <FlowArrow
                        x1={640}
                        y1={590}
                        x2={800}
                        y2={510}
                        color={COLORS.cyan}
                        frame={frame}
                        start={450}
                        packet
                    />

                    <FlowArrow
                        x1={640}
                        y1={590}
                        x2={800}
                        y2={700}
                        color={COLORS.cyan}
                        frame={frame}
                        start={465}
                        packet
                    />

                    <FlowArrow
                        x1={640}
                        y1={590}
                        x2={800}
                        y2={895}
                        color={COLORS.cyan}
                        frame={frame}
                        start={480}
                        packet
                    />

                    <div
                        style={{
                            position: "absolute",
                            bottom: 220,
                            left: 70,
                            right: 70,
                            textAlign: "center",
                            opacity: fade(
                                frame,
                                505,
                                520
                            ),
                        }}
                    >
                        <Label
                            size={25}
                            color={
                                COLORS.green
                            }
                            weight={900}
                        >
                            Scale Out
                        </Label>

                        <div
                            style={{
                                marginTop: 8,
                                fontSize: 20,
                                color: COLORS.muted,
                            }}
                        >
                            Add more machines instead of
                            relying on one giant server.
                        </div>
                    </div>
                </div>

                {/* ====================================================
                   20-29s
                   RELIABILITY
                   ==================================================== */}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: interpolate(
                            frame,
                            [585, 600, 855, 870],
                            [0, 1, 1, 0],
                            {
                                extrapolateLeft:
                                    "clamp",
                                extrapolateRight:
                                    "clamp",
                            }
                        ),
                    }}
                >
                    <SectionHeader
                        number="2"
                        title="Reliability"
                        subtitle="What happens when something fails?"
                        color={
                            COLORS.purple
                        }
                        frame={frame}
                        start={600}
                    />

                    <Panel
                        x={100}
                        y={500}
                        width={190}
                        height={170}
                        color={COLORS.cyan}
                        frame={frame}
                        start={620}
                    >
                        <div
                            style={{
                                height: "100%",
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                flexDirection:
                                    "column",
                                gap: 8,
                            }}
                        >
                            <Icon
                                type="load-balancer"
                                color={
                                    COLORS.cyan
                                }
                                size={65}
                            />

                            <Label size={17}>
                                Load Balancer
                            </Label>
                        </div>
                    </Panel>

                    <ServerNode
                        x={520}
                        y={460}
                        label="Primary"
                        color={COLORS.green}
                        frame={frame}
                        start={640}
                        failed={
                            frame >= 735
                        }
                    />

                    <ServerNode
                        x={520}
                        y={680}
                        label="Replica"
                        color={COLORS.green}
                        frame={frame}
                        start={660}
                    />

                    {frame < 735 && (
                        <FlowArrow
                            x1={290}
                            y1={585}
                            x2={520}
                            y2={535}
                            color={
                                COLORS.green
                            }
                            frame={frame}
                            start={680}
                            packet
                        />
                    )}

                    {frame >= 705 && (
                        <div
                            style={{
                                position:
                                    "absolute",
                                left: 725,
                                top: 475,
                                opacity: fade(
                                    frame,
                                    705,
                                    720
                                ),
                                transform: `scale(${scaleIn(
                                    frame,
                                    705,
                                    720
                                )})`,
                            }}
                        >
                            <div
                                style={{
                                    width: 110,
                                    height: 110,
                                    borderRadius:
                                        "50%",
                                    border: `4px solid ${COLORS.red}`,
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    color:
                                        COLORS.red,
                                    fontSize: 60,
                                    fontWeight: 900,
                                    boxShadow:
                                        `0 0 40px ${COLORS.red}45`,
                                }}
                            >
                                ×
                            </div>

                            <div
                                style={{
                                    marginTop: 12,
                                    textAlign:
                                        "center",
                                    color:
                                        COLORS.red,
                                    fontSize: 20,
                                    fontWeight: 900,
                                }}
                            >
                                SERVER FAILS
                            </div>
                        </div>
                    )}

                    {frame >= 735 && (
                        <>
                            <FlowArrow
                                x1={290}
                                y1={585}
                                x2={520}
                                y2={755}
                                color={
                                    COLORS.orange
                                }
                                frame={frame}
                                start={750}
                                packet
                            />

                            <div
                                style={{
                                    position:
                                        "absolute",
                                    left: 730,
                                    top: 730,
                                    opacity: fade(
                                        frame,
                                        760,
                                        775
                                    ),
                                    textAlign:
                                        "center",
                                }}
                            >
                                <Icon
                                    type="shield"
                                    color={
                                        COLORS.green
                                    }
                                    size={70}
                                />

                                <Label
                                    size={21}
                                    color={
                                        COLORS.green
                                    }
                                    weight={900}
                                >
                                    System stays alive
                                </Label>
                            </div>
                        </>
                    )}

                    <div
                        style={{
                            position: "absolute",
                            bottom: 220,
                            left: 70,
                            right: 70,
                            textAlign: "center",
                            opacity: fade(
                                frame,
                                800,
                                815
                            ),
                        }}
                    >
                        <Label
                            size={26}
                            color={
                                COLORS.purple
                            }
                            weight={900}
                        >
                            Redundancy + Failover
                        </Label>
                    </div>
                </div>

                {/* ====================================================
                   29-38s
                   ENGINEERING MATURITY
                   ==================================================== */}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: interpolate(
                            frame,
                            [855, 870, 1125, 1140],
                            [0, 1, 1, 0],
                            {
                                extrapolateLeft:
                                    "clamp",
                                extrapolateRight:
                                    "clamp",
                            }
                        ),
                    }}
                >
                    <SectionHeader
                        number="3"
                        title="Engineering Maturity"
                        subtitle="Think beyond individual functions."
                        color={
                            COLORS.orange
                        }
                        frame={frame}
                        start={870}
                    />

                    <Panel
                        x={65}
                        y={475}
                        width={205}
                        height={180}
                        color={COLORS.cyan}
                        frame={frame}
                        start={890}
                    >
                        <div
                            style={{
                                height: "100%",
                                display: "flex",
                                flexDirection:
                                    "column",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                gap: 8,
                            }}
                        >
                            <Icon
                                type="code"
                                color={
                                    COLORS.cyan
                                }
                                size={65}
                            />

                            <Label size={20}>
                                Code
                            </Label>
                        </div>
                    </Panel>

                    <Panel
                        x={315}
                        y={475}
                        width={205}
                        height={180}
                        color={COLORS.green}
                        frame={frame}
                        start={920}
                    >
                        <div
                            style={{
                                height: "100%",
                                display: "flex",
                                flexDirection:
                                    "column",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                gap: 8,
                            }}
                        >
                            <Icon
                                type="server"
                                color={
                                    COLORS.green
                                }
                                size={65}
                            />

                            <Label size={20}>
                                Service
                            </Label>
                        </div>
                    </Panel>

                    <Panel
                        x={565}
                        y={475}
                        width={205}
                        height={180}
                        color={COLORS.purple}
                        frame={frame}
                        start={950}
                    >
                        <div
                            style={{
                                height: "100%",
                                display: "flex",
                                flexDirection:
                                    "column",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                gap: 8,
                            }}
                        >
                            <Icon
                                type="network"
                                color={
                                    COLORS.purple
                                }
                                size={65}
                            />

                            <Label size={20}>
                                System
                            </Label>
                        </div>
                    </Panel>

                    <Panel
                        x={815}
                        y={475}
                        width={200}
                        height={180}
                        color={COLORS.orange}
                        frame={frame}
                        start={980}
                    >
                        <div
                            style={{
                                height: "100%",
                                display: "flex",
                                flexDirection:
                                    "column",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                gap: 8,
                            }}
                        >
                            <Icon
                                type="servers"
                                color={
                                    COLORS.orange
                                }
                                size={65}
                            />

                            <Label size={20}>
                                Platform
                            </Label>
                        </div>
                    </Panel>

                    <FlowArrow
                        x1={270}
                        y1={565}
                        x2={315}
                        y2={565}
                        color={COLORS.white}
                        frame={frame}
                        start={1000}
                    />

                    <FlowArrow
                        x1={520}
                        y1={565}
                        x2={565}
                        y2={565}
                        color={COLORS.white}
                        frame={frame}
                        start={1010}
                    />

                    <FlowArrow
                        x1={770}
                        y1={565}
                        x2={815}
                        y2={565}
                        color={COLORS.white}
                        frame={frame}
                        start={1020}
                    />

                    <div
                        style={{
                            position: "absolute",
                            top: 760,
                            left: 80,
                            right: 80,
                            display: "flex",
                            justifyContent:
                                "center",
                            gap: 14,
                            opacity: fade(
                                frame,
                                1035,
                                1050
                            ),
                        }}
                    >
                        {[
                            [
                                "SCALE",
                                COLORS.cyan,
                            ],
                            [
                                "LATENCY",
                                COLORS.green,
                            ],
                            [
                                "COST",
                                COLORS.orange,
                            ],
                            [
                                "FAILURE",
                                COLORS.red,
                            ],
                        ].map(
                            ([text, color]) => (
                                <div
                                    key={text}
                                    style={{
                                        padding:
                                            "14px 22px",
                                        borderRadius:
                                            15,
                                        border: `2px solid ${color}`,
                                        color,
                                        fontSize: 19,
                                        fontWeight: 900,
                                        background:
                                            "rgba(7,16,28,0.9)",
                                    }}
                                >
                                    {text}
                                </div>
                            )
                        )}
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            bottom: 220,
                            left: 80,
                            right: 80,
                            textAlign: "center",
                            fontSize: 25,
                            color: COLORS.white,
                            fontWeight: 800,
                            opacity: fade(
                                frame,
                                1070,
                                1085
                            ),
                        }}
                    >
                        System Design teaches you to think
                        in trade-offs.
                    </div>
                </div>

                {/* ====================================================
                   38-44s
                   INTERVIEW
                   ==================================================== */}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: interpolate(
                            frame,
                            [1125, 1140, 1305, 1320],
                            [0, 1, 1, 0],
                            {
                                extrapolateLeft:
                                    "clamp",
                                extrapolateRight:
                                    "clamp",
                            }
                        ),
                    }}
                >
                    <SectionHeader
                        number="4"
                        title="The Interview Question"
                        color={COLORS.pink}
                        frame={frame}
                        start={1140}
                    />

                    <div
                        style={{
                            position: "absolute",
                            top: 440,
                            left: 80,
                            right: 80,
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 42,
                                fontWeight: 900,
                                color: COLORS.white,
                                opacity: fade(
                                    frame,
                                    1160,
                                    1180
                                ),
                                transform: `translateY(${slideUp(
                                    frame,
                                    1160,
                                    1180
                                )}px)`,
                            }}
                        >
                            "Design a system that
                            <br />
                            serves millions of users."
                        </div>

                        <div
                            style={{
                                marginTop: 55,
                                display: "flex",
                                justifyContent:
                                    "center",
                                gap: 18,
                            }}
                        >
                            {[
                                [
                                    "Scale",
                                    "servers",
                                    COLORS.cyan,
                                ],
                                [
                                    "Reliability",
                                    "shield",
                                    COLORS.green,
                                ],
                                [
                                    "Performance",
                                    "chart",
                                    COLORS.orange,
                                ],
                            ].map(
                                (
                                    [
                                        title,
                                        icon,
                                        color,
                                    ],
                                    i
                                ) => (
                                    <div
                                        key={title}
                                        style={{
                                            width: 250,
                                            height: 170,
                                            border: `2px solid ${color}`,
                                            borderRadius: 20,
                                            background:
                                                "rgba(7,16,28,0.9)",
                                            display:
                                                "flex",
                                            flexDirection:
                                                "column",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            opacity: fade(
                                                frame,
                                                1190 +
                                                i *
                                                12,
                                                1202 +
                                                i *
                                                12
                                            ),
                                            transform: `scale(${scaleIn(
                                                frame,
                                                1190 +
                                                i *
                                                12,
                                                1202 +
                                                i *
                                                12
                                            )})`,
                                        }}
                                    >
                                        <Icon
                                            type={
                                                icon as IconType
                                            }
                                            color={
                                                color as string
                                            }
                                            size={55}
                                        />

                                        <Label
                                            size={19}
                                            weight={900}
                                        >
                                            {title}
                                        </Label>
                                    </div>
                                )
                            )}
                        </div>

                        <div
                            style={{
                                marginTop: 55,
                                fontSize: 24,
                                color: COLORS.muted,
                                opacity: fade(
                                    frame,
                                    1250,
                                    1265
                                ),
                            }}
                        >
                            It's not about writing more code.
                            <br />
                            It's about making the right decisions.
                        </div>
                    </div>
                </div>

                {/* ====================================================
                   44-53s
                   CAREER
                   ==================================================== */}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: interpolate(
                            frame,
                            [1305, 1320, 1590, 1605],
                            [0, 1, 1, 0],
                            {
                                extrapolateLeft:
                                    "clamp",
                                extrapolateRight:
                                    "clamp",
                            }
                        ),
                    }}
                >
                    <SectionHeader
                        number="5"
                        title="Career Growth"
                        subtitle="Your scope gets bigger."
                        color={COLORS.green}
                        frame={frame}
                        start={1320}
                    />

                    <div
                        style={{
                            position: "absolute",
                            top: 470,
                            left: 70,
                            right: 70,
                        }}
                    >
                        <div
                            style={{
                                position:
                                    "absolute",
                                left: 80,
                                right: 80,
                                top: 80,
                                height: 4,
                                background:
                                    "rgba(255,255,255,0.15)",
                            }}
                        />

                        <div
                            style={{
                                position:
                                    "absolute",
                                left: 80,
                                top: 80,
                                width: `${Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        ((frame -
                                            1350) /
                                            150) *
                                        100
                                    )
                                )}%`,
                                height: 4,
                                background:
                                    COLORS.green,
                                boxShadow:
                                    `0 0 15px ${COLORS.green}`,
                            }}
                        />

                        {[
                            {
                                x: 20,
                                title: "Developer",
                                icon: "code" as IconType,
                                color:
                                    COLORS.cyan,
                                start: 1350,
                            },
                            {
                                x: 275,
                                title: "Senior Engineer",
                                icon: "server" as IconType,
                                color:
                                    COLORS.green,
                                start: 1390,
                            },
                            {
                                x: 530,
                                title: "Tech Lead",
                                icon: "network" as IconType,
                                color:
                                    COLORS.purple,
                                start: 1430,
                            },
                            {
                                x: 785,
                                title: "Architect",
                                icon: "servers" as IconType,
                                color:
                                    COLORS.orange,
                                start: 1470,
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                style={{
                                    position:
                                        "absolute",
                                    left: item.x,
                                    top: 0,
                                    width: 200,
                                    textAlign:
                                        "center",
                                    opacity: fade(
                                        frame,
                                        item.start,
                                        item.start +
                                        12
                                    ),
                                    transform: `translateY(${slideUp(
                                        frame,
                                        item.start,
                                        item.start +
                                        12
                                    )}px)`,
                                }}
                            >
                                <div
                                    style={{
                                        width: 120,
                                        height: 120,
                                        margin:
                                            "0 auto",
                                        borderRadius:
                                            "50%",
                                        border: `3px solid ${item.color}`,
                                        background:
                                            "rgba(7,16,28,0.95)",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        boxShadow:
                                            `0 0 30px ${item.color}22`,
                                    }}
                                >
                                    <Icon
                                        type={
                                            item.icon
                                        }
                                        color={
                                            item.color
                                        }
                                        size={65}
                                    />
                                </div>

                                <div
                                    style={{
                                        marginTop: 22,
                                        fontSize: 20,
                                        fontWeight: 900,
                                        color: COLORS.white,
                                    }}
                                >
                                    {item.title}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 850,
                            left: 80,
                            right: 80,
                            textAlign: "center",
                            opacity: fade(
                                frame,
                                1510,
                                1530
                            ),
                        }}
                    >
                        <div
                            style={{
                                fontSize: 30,
                                fontWeight: 900,
                            }}
                        >
                            Your responsibility grows from
                        </div>

                        <div
                            style={{
                                marginTop: 15,
                                fontSize: 38,
                                fontWeight: 900,
                                color:
                                    COLORS.green,
                            }}
                        >
                            FEATURES → SERVICES → SYSTEMS
                        </div>
                    </div>
                </div>

                {/* ====================================================
                   53-60s
                   FINAL PAYOFF
                   ==================================================== */}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: fade(
                            frame,
                            1590,
                            1620
                        ),
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 170,
                            left: 50,
                            right: 50,
                            textAlign: "center",
                        }}
                    >
                        <Icon
                            type="network"
                            color={
                                COLORS.cyan
                            }
                            size={90}
                        />

                        <div
                            style={{
                                marginTop: 15,
                                fontSize: 52,
                                fontWeight: 900,
                            }}
                        >
                            SYSTEM DESIGN
                        </div>

                        <div
                            style={{
                                marginTop: 8,
                                fontSize: 22,
                                color: COLORS.muted,
                            }}
                        >
                            changes how you think about software.
                        </div>
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 430,
                            left: 70,
                            right: 70,
                            display: "flex",
                            flexDirection:
                                "column",
                            alignItems: "center",
                        }}
                    >
                        {[
                            {
                                title: "CODE",
                                icon: "code" as IconType,
                                color:
                                    COLORS.cyan,
                                start: 1630,
                            },
                            {
                                title: "ARCHITECTURE",
                                icon: "network" as IconType,
                                color:
                                    COLORS.green,
                                start: 1660,
                            },
                            {
                                title: "SYSTEMS",
                                icon: "servers" as IconType,
                                color:
                                    COLORS.purple,
                                start: 1690,
                            },
                            {
                                title: "REAL WORLD",
                                icon: "users" as IconType,
                                color:
                                    COLORS.orange,
                                start: 1720,
                            },
                        ].map(
                            (
                                item,
                                index
                            ) => (
                                <React.Fragment
                                    key={
                                        item.title
                                    }
                                >
                                    <div
                                        style={{
                                            width: 500,
                                            height: 125,
                                            border: `2px solid ${item.color}`,
                                            borderRadius: 22,
                                            background:
                                                "rgba(7,16,28,0.92)",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            padding:
                                                "0 30px",
                                            boxSizing:
                                                "border-box",
                                            opacity:
                                                fade(
                                                    frame,
                                                    item.start,
                                                    item.start +
                                                    12
                                                ),
                                            transform: `scale(${scaleIn(
                                                frame,
                                                item.start,
                                                item.start +
                                                12
                                            )})`,
                                            boxShadow:
                                                `0 0 30px ${item.color}18`,
                                        }}
                                    >
                                        <Icon
                                            type={
                                                item.icon
                                            }
                                            color={
                                                item.color
                                            }
                                            size={
                                                62
                                            }
                                        />

                                        <div
                                            style={{
                                                marginLeft: 25,
                                                fontSize: 30,
                                                fontWeight: 900,
                                                color:
                                                    COLORS.white,
                                            }}
                                        >
                                            {
                                                item.title
                                            }
                                        </div>
                                    </div>

                                    {index <
                                        3 && (
                                            <div
                                                style={{
                                                    width: 4,
                                                    height: 48,
                                                    background:
                                                        COLORS.white,
                                                    opacity:
                                                        fade(
                                                            frame,
                                                            item.start +
                                                            12,
                                                            item.start +
                                                            22
                                                        ),
                                                }}
                                            />
                                        )}
                                </React.Fragment>
                            )
                        )}
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            bottom: 190,
                            left: 50,
                            right: 50,
                            textAlign: "center",
                            opacity: fade(
                                frame,
                                1760,
                                1780
                            ),
                        }}
                    >
                        <div
                            style={{
                                fontSize: 29,
                                fontWeight: 900,
                                color:
                                    COLORS.white,
                            }}
                        >
                            Learn the concepts.
                        </div>

                        <div
                            style={{
                                marginTop: 8,
                                fontSize: 22,
                                color:
                                    COLORS.green,
                                fontWeight: 800,
                            }}
                        >
                            Then design the system.
                        </div>
                    </div>
                </div>

                {/* ====================================================
                   PROGRESS BAR
                   ==================================================== */}

                <div
                    style={{
                        position: "absolute",
                        left: 70,
                        right: 70,
                        bottom: 65,
                        height: 5,
                        borderRadius: 10,
                        background:
                            "rgba(255,255,255,0.12)",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${Math.min(
                                100,
                                (realFrame /
                                    TOTAL_FRAMES) *
                                100
                            )}%`,
                            borderRadius: 10,
                            background:
                                "linear-gradient(90deg, #4DB8FF, #1FD1A5, #9B7CFF)",
                        }}
                    />
                </div>

                <div
                    style={{
                        position: "absolute",
                        bottom: 20,
                        width,
                        textAlign: "center",
                        color: COLORS.muted,
                        fontSize: 15,
                        letterSpacing: 1.5,
                        opacity: 0.7,
                    }}
                >
                    SYSTEM DESIGN • BACKEND • CLOUD
                </div>
            </AbsoluteFill>
        );
    };