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

import { cachingStrategies } from "../../content/caching-strategies";
import { createTimeline, FPS } from "../timeline";

const timeline = createTimeline(cachingStrategies);

// =====================================================
// DESIGN
// =====================================================

const BG = "#07111F";
const GRID = "#17304A";

const BLUE = "#4DB8FF";
const GREEN = "#1FD1A5";
const PURPLE = "#9B7CFF";
const ORANGE = "#FFB86C";
const RED = "#FF5C7A";

const WHITE = "#F4F7FB";
const MUTED = "#8298AE";

const NODE = "#0D1B2C";
const NODE_2 = "#102338";
const BORDER = "#27435D";

// =====================================================
// HELPERS
// =====================================================

const clamp = (v: number) =>
    Math.max(0, Math.min(1, v));

const fadeIn = (
    frame: number,
    start: number,
    duration = 15,
) =>
    interpolate(
        frame,
        [start, start + duration],
        [0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        },
    );

const fadeOut = (
    frame: number,
    duration: number,
    frames = 18,
) =>
    interpolate(
        frame,
        [
            Math.max(0, duration - frames),
            duration,
        ],
        [1, 0],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        },
    );

const pop = (
    frame: number,
    delay = 0,
) =>
    spring({
        frame: Math.max(0, frame - delay),
        fps: FPS,
        config: {
            damping: 14,
            stiffness: 160,
            mass: 0.8,
        },
    });

const getSection = (id: string) => {
    const section = timeline.sections.find(
        (s) => s.id === id,
    );

    if (!section) {
        throw new Error(
            `Missing section: ${id}`,
        );
    }

    return section;
};

// =====================================================
// BACKGROUND
// =====================================================

const Background: React.FC = () => {
    const frame = useCurrentFrame();

    const offset =
        (frame * 0.25) % 64;

    return (
        <AbsoluteFill
            style={{
                background: BG,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
                        linear-gradient(
                            ${GRID}55 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            ${GRID}55 1px,
                            transparent 1px
                        )
                    `,
                    backgroundSize: "64px 64px",
                    backgroundPosition:
                        `${offset}px ${offset}px`,
                    opacity: 0.32,
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: 600,
                    height: 600,
                    left: -350,
                    top: 300,
                    borderRadius: "50%",
                    background: `${BLUE}08`,
                    filter: "blur(100px)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: 600,
                    height: 600,
                    right: -350,
                    bottom: 100,
                    borderRadius: "50%",
                    background: `${PURPLE}08`,
                    filter: "blur(100px)",
                }}
            />
        </AbsoluteFill>
    );
};

// =====================================================
// SECTION TITLE
// =====================================================

const SectionTitle: React.FC<{
    title: string;
    subtitle?: string;
    color?: string;
    start?: number;
}> = ({
    title,
    subtitle,
    color = BLUE,
    start = 0,
}) => {
        const frame = useCurrentFrame();

        const opacity = fadeIn(
            frame,
            start,
            12,
        );

        const y = interpolate(
            pop(frame, start),
            [0, 1],
            [25, 0],
        );

        return (
            <div
                style={{
                    position: "absolute",
                    top: 95,
                    left: 70,
                    right: 70,
                    opacity,
                    transform: `translateY(${y}px)`,
                    zIndex: 100,
                }}
            >
                <div
                    style={{
                        color,
                        fontSize: 18,
                        fontWeight: 800,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        marginBottom: 10,
                    }}
                >
                    SYSTEM DESIGN
                </div>

                <div
                    style={{
                        color: WHITE,
                        fontSize: 42,
                        fontWeight: 900,
                        letterSpacing: -1,
                    }}
                >
                    {title}
                </div>

                {subtitle && (
                    <div
                        style={{
                            marginTop: 8,
                            color: MUTED,
                            fontSize: 19,
                            fontWeight: 600,
                        }}
                    >
                        {subtitle}
                    </div>
                )}

                <div
                    style={{
                        marginTop: 18,
                        width: 80,
                        height: 3,
                        background: color,
                        boxShadow:
                            `0 0 14px ${color}`,
                    }}
                />
            </div>
        );
    };

// =====================================================
// NODE
// =====================================================

type NodeProps = {
    x: number;
    y: number;
    width?: number;
    height?: number;
    title: string;
    subtitle?: string;
    color: string;
    icon?: string;
    active?: boolean;
    appear?: number;
};

const Node: React.FC<NodeProps> = ({
    x,
    y,
    width = 210,
    height = 125,
    title,
    subtitle,
    color,
    icon = "◆",
    active = false,
    appear = 0,
}) => {
    const frame = useCurrentFrame();

    const scale = pop(
        frame,
        appear,
    );

    const pulse = active
        ? 1 +
        Math.sin(frame / 5) *
        0.018
        : 1;

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width,
                height,
                opacity: fadeIn(
                    frame,
                    appear,
                    8,
                ),
                transform:
                    `scale(${scale * pulse})`,
                transformOrigin:
                    "center",
                zIndex: active ? 20 : 10,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 18,
                    background:
                        `linear-gradient(145deg, ${NODE_2}, ${NODE})`,
                    border:
                        `2px solid ${active
                            ? color
                            : BORDER
                        }`,
                    boxShadow: active
                        ? `
                            0 0 0 1px ${color}22,
                            0 0 30px ${color}33,
                            0 20px 50px #00000055
                        `
                        : "0 15px 40px #00000044",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: 18,
                    top: 18,
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background:
                        `${color}16`,
                    border:
                        `1px solid ${color}66`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                    fontSize: 21,
                    fontWeight: 900,
                }}
            >
                {icon}
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 72,
                    top: 19,
                    color: WHITE,
                    fontSize: 20,
                    fontWeight: 900,
                }}
            >
                {title}
            </div>

            {subtitle && (
                <div
                    style={{
                        position: "absolute",
                        left: 72,
                        top: 50,
                        color: MUTED,
                        fontSize: 13,
                        fontWeight: 700,
                    }}
                >
                    {subtitle}
                </div>
            )}

            <div
                style={{
                    position: "absolute",
                    left: 20,
                    right: 20,
                    bottom: 18,
                    height: 5,
                    borderRadius: 5,
                    background:
                        `${color}16`,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: active
                            ? "100%"
                            : "30%",
                        height: "100%",
                        borderRadius: 5,
                        background:
                            color,
                        opacity: active
                            ? 1
                            : 0.35,
                        transition:
                            "width 0.2s",
                    }}
                />
            </div>
        </div>
    );
};

// =====================================================
// CACHE NODE
// =====================================================

const CacheNode: React.FC<{
    x: number;
    y: number;
    active?: boolean;
    miss?: boolean;
    hit?: boolean;
    appear?: number;
}> = ({
    x,
    y,
    active = false,
    miss = false,
    hit = false,
    appear = 0,
}) => {
        const frame = useCurrentFrame();

        const color = miss
            ? ORANGE
            : hit
                ? GREEN
                : GREEN;

        const scale = pop(
            frame,
            appear,
        );

        const flash =
            active &&
                Math.sin(frame / 4) > 0
                ? 1
                : 0.75;

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 230,
                    height: 150,
                    transform: `scale(${scale})`,
                    opacity: fadeIn(
                        frame,
                        appear,
                        8,
                    ),
                    zIndex: 15,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 20,
                        background:
                            `linear-gradient(145deg, #10283A, #091725)`,
                        border:
                            `2px solid ${color}${active ? "CC" : "55"}`,
                        boxShadow: active
                            ? `0 0 40px ${color}44`
                            : "0 20px 50px #00000044",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 18,
                        top: 18,
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        border:
                            `2px solid ${color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color,
                        fontSize: 22,
                        fontWeight: 900,
                        boxShadow:
                            `0 0 18px ${color}44`,
                        opacity: flash,
                    }}
                >
                    ⚡
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 78,
                        top: 21,
                        color: WHITE,
                        fontSize: 22,
                        fontWeight: 900,
                    }}
                >
                    CACHE
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 78,
                        top: 53,
                        color: MUTED,
                        fontSize: 13,
                        fontWeight: 700,
                    }}
                >
                    REDIS / MEMORY
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 18,
                        right: 18,
                        bottom: 20,
                        display: "flex",
                        gap: 7,
                    }}
                >
                    {[0, 1, 2, 3, 4].map(
                        (i) => (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    height: 9,
                                    borderRadius: 4,
                                    background:
                                        i <
                                            (active
                                                ? 5
                                                : 2)
                                            ? color
                                            : `${color}18`,
                                    boxShadow:
                                        i <
                                            (active
                                                ? 5
                                                : 2)
                                            ? `0 0 8px ${color}`
                                            : "none",
                                }}
                            />
                        ),
                    )}
                </div>
            </div>
        );
    };

// =====================================================
// DATABASE NODE
// =====================================================

const DatabaseNode: React.FC<{
    x: number;
    y: number;
    active?: boolean;
    appear?: number;
}> = ({
    x,
    y,
    active = false,
    appear = 0,
}) => {
        const frame = useCurrentFrame();

        const scale = pop(
            frame,
            appear,
        );

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 230,
                    height: 155,
                    transform: `scale(${scale})`,
                    opacity: fadeIn(
                        frame,
                        appear,
                        8,
                    ),
                    zIndex: 15,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 20,
                        background:
                            `linear-gradient(145deg, #17152C, #0B0A18)`,
                        border:
                            `2px solid ${active
                                ? PURPLE
                                : `${PURPLE}55`
                            }`,
                        boxShadow: active
                            ? `0 0 40px ${PURPLE}44`
                            : "0 20px 50px #00000044",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 20,
                        top: 20,
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background:
                            `${PURPLE}18`,
                        border:
                            `1px solid ${PURPLE}66`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: PURPLE,
                        fontSize: 22,
                    }}
                >
                    DB
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 80,
                        top: 22,
                        color: WHITE,
                        fontSize: 21,
                        fontWeight: 900,
                    }}
                >
                    DATABASE
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 80,
                        top: 53,
                        color: MUTED,
                        fontSize: 13,
                        fontWeight: 700,
                    }}
                >
                    SOURCE OF TRUTH
                </div>

                {[0, 1, 2].map(
                    (i) => (
                        <div
                            key={i}
                            style={{
                                position:
                                    "absolute",
                                left: 20,
                                right: 20,
                                top:
                                    86 +
                                    i * 18,
                                height: 7,
                                borderRadius: 4,
                                background:
                                    active
                                        ? `${PURPLE}${55 - i * 10}`
                                        : `${PURPLE}20`,
                            }}
                        />
                    ),
                )}
            </div>
        );
    };

// =====================================================
// CLIENT NODE
// =====================================================

const ClientNode: React.FC<{
    x: number;
    y: number;
    active?: boolean;
    appear?: number;
}> = ({
    x,
    y,
    active = false,
    appear = 0,
}) => (
        <Node
            x={x}
            y={y}
            title="CLIENT"
            subtitle="Browser / Mobile"
            color={BLUE}
            icon="●"
            active={active}
            appear={appear}
            width={200}
            height={120}
        />
    );

// =====================================================
// API NODE
// =====================================================

const ApiNode: React.FC<{
    x: number;
    y: number;
    active?: boolean;
    appear?: number;
}> = ({
    x,
    y,
    active = false,
    appear = 0,
}) => (
        <Node
            x={x}
            y={y}
            title="API"
            subtitle="Application Server"
            color={BLUE}
            icon="λ"
            active={active}
            appear={appear}
            width={220}
            height={125}
        />
    );

// =====================================================
// ARROW
// =====================================================

const Arrow: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    progress?: number;
    label?: string;
    active?: boolean;
}> = ({
    x1,
    y1,
    x2,
    y2,
    color,
    progress = 1,
    label,
    active = false,
}) => {
        const frame = useCurrentFrame();

        const p = clamp(progress);

        const dx = x2 - x1;
        const dy = y2 - y1;

        const length =
            Math.sqrt(
                dx * dx + dy * dy,
            );

        const angle =
            Math.atan2(dy, dx) *
            (180 / Math.PI);

        return (
            <div
                style={{
                    position: "absolute",
                    left: x1,
                    top: y1,
                    width: length,
                    height: 4,
                    transformOrigin:
                        "left center",
                    transform:
                        `rotate(${angle}deg)`,
                    opacity: 0.9,
                    zIndex: 5,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: `${p * 100}%`,
                        height: "100%",
                        borderRadius: 5,
                        background:
                            `linear-gradient(90deg, ${color}30, ${color})`,
                        boxShadow: active
                            ? `0 0 12px ${color}`
                            : "none",
                    }}
                />

                {p > 0.96 && (
                    <div
                        style={{
                            position:
                                "absolute",
                            right: -2,
                            top: -6,
                            width: 0,
                            height: 0,
                            borderTop:
                                "8px solid transparent",
                            borderBottom:
                                "8px solid transparent",
                            borderLeft:
                                `12px solid ${color}`,
                        }}
                    />
                )}

                {label && (
                    <div
                        style={{
                            position:
                                "absolute",
                            left: "50%",
                            top: -34,
                            transform:
                                "translateX(-50%)",
                            color,
                            fontSize: 13,
                            fontWeight: 900,
                            whiteSpace:
                                "nowrap",
                            letterSpacing: 1,
                        }}
                    >
                        {label}
                    </div>
                )}
            </div>
        );
    };

// =====================================================
// PACKET
// =====================================================

const Packet: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    progress: number;
    color: string;
    label?: string;
}> = ({
    x1,
    y1,
    x2,
    y2,
    progress,
    color,
    label,
}) => {
        const p = clamp(progress);

        const x = interpolate(
            p,
            [0, 1],
            [x1, x2],
        );

        const y = interpolate(
            p,
            [0, 1],
            [y1, y2],
        );

        const scale =
            1 +
            Math.sin(p * Math.PI * 8) *
            0.12;

        return (
            <>
                <div
                    style={{
                        position: "absolute",
                        left: x,
                        top: y,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: color,
                        transform:
                            `translate(-50%, -50%) scale(${scale})`,
                        boxShadow: `
                        0 0 12px ${color},
                        0 0 28px ${color}88
                    `,
                        zIndex: 50,
                    }}
                />

                {label && (
                    <div
                        style={{
                            position: "absolute",
                            left: x,
                            top: y + 16,
                            transform:
                                "translateX(-50%)",
                            color: WHITE,
                            fontSize: 12,
                            fontWeight: 800,
                            whiteSpace:
                                "nowrap",
                            zIndex: 51,
                        }}
                    >
                        {label}
                    </div>
                )}
            </>
        );
    };

// =====================================================
// STATUS
// =====================================================

const Status: React.FC<{
    text: string;
    color: string;
    start: number;
}> = ({
    text,
    color,
    start,
}) => {
        const frame = useCurrentFrame();

        const opacity = fadeIn(
            frame,
            start,
            8,
        );

        const scale = pop(
            frame,
            start,
        );

        return (
            <div
                style={{
                    position: "absolute",
                    left: 50,
                    right: 50,
                    bottom: 150,
                    display: "flex",
                    justifyContent:
                        "center",
                    opacity,
                    transform:
                        `scale(${scale})`,
                    zIndex: 100,
                }}
            >
                <div
                    style={{
                        padding:
                            "13px 26px",
                        borderRadius: 100,
                        background:
                            `${color}12`,
                        border:
                            `1px solid ${color}77`,
                        color,
                        fontSize: 18,
                        fontWeight: 900,
                        letterSpacing: 1,
                        boxShadow:
                            `0 0 25px ${color}18`,
                    }}
                >
                    {text}
                </div>
            </div>
        );
    };

// =====================================================
// DATA CARD
// =====================================================

const DataPacket: React.FC<{
    x: number;
    y: number;
    progress: number;
    color?: string;
}> = ({
    x,
    y,
    progress,
    color = GREEN,
}) => {
        const p = clamp(progress);

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 125,
                    height: 72,
                    borderRadius: 12,
                    background:
                        "#091827",
                    border:
                        `1px solid ${color}88`,
                    boxShadow:
                        `0 0 22px ${color}22`,
                    opacity: p,
                    transform:
                        `scale(${0.75 + p * 0.25})`,
                    zIndex: 40,
                }}
            >
                <div
                    style={{
                        color,
                        fontSize: 12,
                        fontWeight: 900,
                        padding: 10,
                    }}
                >
                    JSON
                </div>

                <div
                    style={{
                        margin:
                            "0 10px",
                        height: 5,
                        borderRadius: 4,
                        background:
                            `${color}35`,
                    }}
                />

                <div
                    style={{
                        margin:
                            "7px 10px",
                        width: "55%",
                        height: 5,
                        borderRadius: 4,
                        background:
                            `${WHITE}20`,
                    }}
                />
            </div>
        );
    };

// =====================================================
// HOOK
// =====================================================

const Hook: React.FC<{
    duration: number;
}> = ({ duration }) => {
    const frame = useCurrentFrame();

    const opacity = fadeOut(
        frame,
        duration,
    );

    const p =
        (frame / 42) % 1;

    return (
        <AbsoluteFill style={{ opacity }}>
            <SectionTitle
                title="Caching"
                subtitle="How do we avoid hitting the database for every request?"
            />

            <ClientNode
                x={55}
                y={520}
                appear={5}
                active
            />

            <ApiNode
                x={390}
                y={510}
                appear={15}
                active
            />

            <CacheNode
                x={750}
                y={495}
                appear={25}
                active
            />

            <Arrow
                x1={255}
                y1={580}
                x2={390}
                y2={580}
                color={BLUE}
                progress={1}
            />

            <Arrow
                x1={610}
                y1={575}
                x2={750}
                y2={575}
                color={GREEN}
                progress={1}
            />

            <Packet
                x1={255}
                y1={580}
                x2={750}
                y2={575}
                progress={p}
                color={BLUE}
                label="GET /movie"
            />

            <div
                style={{
                    position: "absolute",
                    top: 820,
                    left: 50,
                    right: 50,
                    textAlign: "center",
                    color: WHITE,
                    fontSize: 30,
                    fontWeight: 800,
                    opacity:
                        fadeIn(
                            frame,
                            25,
                            12,
                        ),
                }}
            >
                Cache keeps frequently-used
                data close to the application.
            </div>
        </AbsoluteFill>
    );
};

// =====================================================
// INTRO
// =====================================================

const Intro: React.FC<{
    duration: number;
}> = ({ duration }) => {
    const frame = useCurrentFrame();

    const opacity = fadeOut(
        frame,
        duration,
    );

    const p =
        (frame / 45) % 1;

    return (
        <AbsoluteFill style={{ opacity }}>
            <SectionTitle
                title="The basic architecture"
                subtitle="Application → Cache → Database"
            />

            <ClientNode
                x={50}
                y={470}
                appear={0}
            />

            <ApiNode
                x={330}
                y={465}
                appear={12}
            />

            <CacheNode
                x={620}
                y={450}
                appear={24}
            />

            <DatabaseNode
                x={620}
                y={760}
                appear={36}
            />

            <Arrow
                x1={250}
                y1={530}
                x2={330}
                y2={530}
                color={BLUE}
            />

            <Arrow
                x1={550}
                y1={530}
                x2={620}
                y2={530}
                color={GREEN}
            />

            <Arrow
                x1={735}
                y1={600}
                x2={735}
                y2={760}
                color={PURPLE}
            />

            <Packet
                x1={250}
                y1={530}
                x2={620}
                y2={530}
                progress={p}
                color={BLUE}
            />

            <div
                style={{
                    position: "absolute",
                    top: 690,
                    left: 50,
                    right: 50,
                    textAlign: "center",
                    color: MUTED,
                    fontSize: 18,
                    fontWeight: 700,
                }}
            >
                The interesting part is:
                <span
                    style={{
                        color: WHITE,
                        marginLeft: 7,
                    }}
                >
                    who manages the cache?
                </span>
            </div>
        </AbsoluteFill>
    );
};

// =====================================================
// CACHE ASIDE
// =====================================================

const CacheAside: React.FC<{
    duration: number;
}> = ({ duration }) => {
    const frame = useCurrentFrame();

    const opacity = fadeOut(
        frame,
        duration,
    );

    // timeline
    const request =
        clamp(frame / 28);

    const miss =
        clamp((frame - 38) / 12);

    const dbRequest =
        clamp((frame - 52) / 32);

    const dbResponse =
        clamp((frame - 90) / 32);

    const populate =
        clamp((frame - 132) / 28);

    const finalResponse =
        clamp((frame - 165) / 30);

    const dbActive =
        frame > 52 &&
        frame < 145;

    const cacheActive =
        frame > 20;

    return (
        <AbsoluteFill style={{ opacity }}>
            <SectionTitle
                title="Cache-Aside"
                subtitle="The application explicitly manages the cache"
                color={BLUE}
            />

            <ClientNode
                x={35}
                y={455}
                appear={0}
                active={
                    frame > 0 &&
                    frame < 200
                }
            />

            <ApiNode
                x={320}
                y={450}
                appear={8}
                active={
                    frame > 20
                }
            />

            <CacheNode
                x={650}
                y={420}
                appear={16}
                active={cacheActive}
                miss={
                    frame > 35 &&
                    frame < 70
                }
            />

            <DatabaseNode
                x={650}
                y={750}
                appear={25}
                active={dbActive}
            />

            {/* client -> API */}

            <Arrow
                x1={235}
                y1={515}
                x2={320}
                y2={515}
                color={BLUE}
                label="GET"
            />

            <Packet
                x1={235}
                y1={515}
                x2={320}
                y2={515}
                progress={request}
                color={BLUE}
            />

            {/* API -> CACHE */}

            <Arrow
                x1={540}
                y1={515}
                x2={650}
                y2={515}
                color={GREEN}
                label="LOOKUP"
            />

            <Packet
                x1={540}
                y1={515}
                x2={650}
                y2={515}
                progress={request}
                color={GREEN}
            />

            {/* MISS */}

            {frame > 35 && (
                <Status
                    text="CACHE MISS"
                    color={ORANGE}
                    start={35}
                />
            )}

            {/* API -> DB */}

            <Arrow
                x1={430}
                y1={575}
                x2={720}
                y2={750}
                color={PURPLE}
                progress={
                    frame > 52
                        ? 1
                        : 0
                }
                label="QUERY"
                active={dbActive}
            />

            <Packet
                x1={430}
                y1={575}
                x2={720}
                y2={750}
                progress={dbRequest}
                color={PURPLE}
                label="SQL"
            />

            {/* DB -> API */}

            <Packet
                x1={720}
                y1={750}
                x2={430}
                y2={575}
                progress={dbResponse}
                color={GREEN}
                label="DATA"
            />

            <DataPacket
                x={500}
                y={650}
                progress={dbResponse}
                color={PURPLE}
            />

            {/* API -> CACHE populate */}

            <Arrow
                x1={540}
                y1={610}
                x2={650}
                y2={590}
                color={GREEN}
                progress={populate}
                label="SET"
                active={frame > 132}
            />

            <Packet
                x1={540}
                y1={610}
                x2={650}
                y2={590}
                progress={populate}
                color={GREEN}
                label="STORE"
            />

            {/* final response */}

            <Arrow
                x1={320}
                y1={640}
                x2={235}
                y2={640}
                color={BLUE}
                progress={finalResponse}
                label="RESPONSE"
            />

            <Packet
                x1={320}
                y1={640}
                x2={235}
                y2={640}
                progress={finalResponse}
                color={BLUE}
            />

            {frame > 185 && (
                <Status
                    text="NEXT REQUEST → CACHE HIT"
                    color={GREEN}
                    start={185}
                />
            )}
        </AbsoluteFill>
    );
};

// =====================================================
// READ THROUGH
// =====================================================

const ReadThrough: React.FC<{
    duration: number;
}> = ({ duration }) => {
    const frame = useCurrentFrame();

    const opacity = fadeOut(
        frame,
        duration,
    );

    const first =
        clamp(frame / 28);

    const cacheToDb =
        clamp((frame - 40) / 35);

    const dataBack =
        clamp((frame - 82) / 35);

    const second =
        clamp((frame - 140) / 28);

    const hitResponse =
        clamp((frame - 175) / 28);

    const cacheActive =
        frame > 30;

    const dbActive =
        frame > 40 &&
        frame < 130;

    return (
        <AbsoluteFill style={{ opacity }}>
            <SectionTitle
                title="Read-Through"
                subtitle="The cache handles the database lookup"
                color={PURPLE}
            />

            <ClientNode
                x={45}
                y={490}
                appear={0}
            />

            <ApiNode
                x={330}
                y={485}
                appear={10}
                active={frame > 20}
            />

            <CacheNode
                x={650}
                y={460}
                appear={20}
                active={cacheActive}
                hit={frame > 150}
            />

            <DatabaseNode
                x={650}
                y={760}
                appear={30}
                active={dbActive}
            />

            {/* first request */}

            <Arrow
                x1={245}
                y1={550}
                x2={330}
                y2={550}
                color={BLUE}
                label="GET"
            />

            <Packet
                x1={245}
                y1={550}
                x2={330}
                y2={550}
                progress={first}
                color={BLUE}
            />

            <Arrow
                x1={550}
                y1={550}
                x2={650}
                y2={550}
                color={PURPLE}
                label="LOOKUP"
            />

            <Packet
                x1={550}
                y1={550}
                x2={650}
                y2={550}
                progress={first}
                color={PURPLE}
            />

            {frame > 35 &&
                frame < 75 && (
                    <Status
                        text="CACHE MISS"
                        color={ORANGE}
                        start={35}
                    />
                )}

            {/* cache -> db */}

            <Arrow
                x1={765}
                y1={610}
                x2={765}
                y2={760}
                color={PURPLE}
                label="FETCH"
                progress={
                    frame > 40
                        ? 1
                        : 0
                }
                active={dbActive}
            />

            <Packet
                x1={765}
                y1={610}
                x2={765}
                y2={760}
                progress={cacheToDb}
                color={PURPLE}
                label="QUERY"
            />

            {/* data back */}

            <Packet
                x1={765}
                y1={760}
                x2={765}
                y2={610}
                progress={dataBack}
                color={GREEN}
                label="DATA"
            />

            <DataPacket
                x={700}
                y={680}
                progress={dataBack}
                color={GREEN}
            />

            {/* second request */}

            {frame > 135 && (
                <>
                    <Arrow
                        x1={245}
                        y1={550}
                        x2={650}
                        y2={550}
                        color={GREEN}
                        label="CACHE HIT ⚡"
                    />

                    <Packet
                        x1={245}
                        y1={550}
                        x2={650}
                        y2={550}
                        progress={second}
                        color={GREEN}
                    />

                    <Packet
                        x1={650}
                        y1={620}
                        x2={245}
                        y2={620}
                        progress={
                            hitResponse
                        }
                        color={GREEN}
                        label="RESPONSE"
                    />
                </>
            )}

            {frame > 145 && (
                <Status
                    text="APPLICATION NEVER TALKS TO DB"
                    color={GREEN}
                    start={145}
                />
            )}
        </AbsoluteFill>
    );
};

// =====================================================
// WRITE THROUGH
// =====================================================

const WriteThrough: React.FC<{
    duration: number;
}> = ({ duration }) => {
    const frame = useCurrentFrame();

    const opacity = fadeOut(
        frame,
        duration,
    );

    const write =
        clamp(frame / 30);

    const cacheWrite =
        clamp((frame - 35) / 30);

    const dbWrite =
        clamp((frame - 65) / 35);

    const response =
        clamp((frame - 115) / 30);

    return (
        <AbsoluteFill style={{ opacity }}>
            <SectionTitle
                title="Write-Through"
                subtitle="A write updates cache and database together"
                color={ORANGE}
            />

            <ClientNode
                x={45}
                y={500}
                appear={0}
            />

            <ApiNode
                x={330}
                y={495}
                appear={10}
                active={frame > 20}
            />

            <CacheNode
                x={650}
                y={420}
                appear={20}
                active={
                    frame > 35 &&
                    frame < 120
                }
            />

            <DatabaseNode
                x={650}
                y={750}
                appear={30}
                active={frame > 65}
            />

            <Arrow
                x1={245}
                y1={560}
                x2={330}
                y2={560}
                color={ORANGE}
                label="WRITE"
            />

            <Packet
                x1={245}
                y1={560}
                x2={330}
                y2={560}
                progress={write}
                color={ORANGE}
                label="UPDATE"
            />

            {/* cache */}

            <Arrow
                x1={550}
                y1={540}
                x2={650}
                y2={540}
                color={ORANGE}
                label="UPDATE"
                progress={cacheWrite}
                active
            />

            <Packet
                x1={550}
                y1={540}
                x2={650}
                y2={540}
                progress={cacheWrite}
                color={ORANGE}
                label="CACHE"
            />

            {/* database */}

            <Arrow
                x1={550}
                y1={610}
                x2={735}
                y2={750}
                color={PURPLE}
                label="PERSIST"
                progress={dbWrite}
            />

            <Packet
                x1={550}
                y1={610}
                x2={735}
                y2={750}
                progress={dbWrite}
                color={PURPLE}
                label="DB"
            />

            {frame > 95 && (
                <Status
                    text="CACHE + DATABASE STAY CONSISTENT"
                    color={GREEN}
                    start={95}
                />
            )}

            <Packet
                x1={330}
                y1={650}
                x2={245}
                y2={650}
                progress={response}
                color={GREEN}
                label="OK"
            />
        </AbsoluteFill>
    );
};

// =====================================================
// STRATEGY MINI DIAGRAM
// =====================================================

const StrategyDiagram: React.FC<{
    x: number;
    y: number;
    title: string;
    color: string;
    type: "aside" | "read" | "write";
    delay: number;
}> = ({
    x,
    y,
    title,
    color,
    type,
    delay,
}) => {
        const frame = useCurrentFrame();

        const scale = pop(
            frame,
            delay,
        );

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 310,
                    height: 360,
                    transform: `scale(${scale})`,
                    opacity: fadeIn(
                        frame,
                        delay,
                        10,
                    ),
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 22,
                        background:
                            NODE,
                        border:
                            `1px solid ${color}66`,
                        boxShadow:
                            `0 20px 50px #00000055`,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 25,
                        left: 25,
                        color,
                        fontSize: 15,
                        fontWeight: 900,
                        letterSpacing: 1.5,
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 45,
                        top: 100,
                        width: 220,
                        height: 3,
                        background:
                            `${color}33`,
                    }}
                />

                <MiniNode
                    x={25}
                    y={145}
                    text="APP"
                    color={BLUE}
                />

                <MiniNode
                    x={120}
                    y={145}
                    text="CACHE"
                    color={GREEN}
                />

                <MiniNode
                    x={120}
                    y={245}
                    text="DB"
                    color={PURPLE}
                />

                {type === "aside" && (
                    <>
                        <MiniArrow
                            x1={82}
                            y1={165}
                            x2={120}
                            y2={165}
                            color={BLUE}
                        />
                        <MiniArrow
                            x1={180}
                            y1={185}
                            x2={180}
                            y2={245}
                            color={PURPLE}
                        />
                    </>
                )}

                {type === "read" && (
                    <>
                        <MiniArrow
                            x1={82}
                            y1={165}
                            x2={120}
                            y2={165}
                            color={BLUE}
                        />
                        <MiniArrow
                            x1={180}
                            y1={185}
                            x2={180}
                            y2={245}
                            color={PURPLE}
                        />
                        <MiniArrow
                            x1={180}
                            y1={245}
                            x2={180}
                            y2={185}
                            color={GREEN}
                        />
                    </>
                )}

                {type === "write" && (
                    <>
                        <MiniArrow
                            x1={82}
                            y1={165}
                            x2={120}
                            y2={165}
                            color={ORANGE}
                        />
                        <MiniArrow
                            x1={82}
                            y1={180}
                            x2={180}
                            y2={245}
                            color={PURPLE}
                        />
                    </>
                )}
            </div>
        );
    };

const MiniNode: React.FC<{
    x: number;
    y: number;
    text: string;
    color: string;
}> = ({
    x,
    y,
    text,
    color,
}) => (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 80,
                height: 55,
                borderRadius: 12,
                border:
                    `1px solid ${color}66`,
                background:
                    `${color}0D`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color,
                fontSize: 12,
                fontWeight: 900,
            }}
        >
            {text}
        </div>
    );

const MiniArrow: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
}> = ({
    x1,
    y1,
    x2,
    y2,
    color,
}) => {
        const dx = x2 - x1;
        const dy = y2 - y1;

        const length =
            Math.sqrt(
                dx * dx + dy * dy,
            );

        const angle =
            Math.atan2(dy, dx) *
            (180 / Math.PI);

        return (
            <div
                style={{
                    position: "absolute",
                    left: x1,
                    top: y1,
                    width: length,
                    height: 2,
                    background: color,
                    transformOrigin:
                        "left center",
                    transform:
                        `rotate(${angle}deg)`,
                }}
            />
        );
    };

// =====================================================
// SUMMARY
// =====================================================

const Summary: React.FC<{
    duration: number;
}> = ({ duration }) => {
    const frame = useCurrentFrame();

    const opacity = fadeOut(
        frame,
        duration,
    );

    return (
        <AbsoluteFill style={{ opacity }}>
            <SectionTitle
                title="Three common strategies"
                subtitle="The difference is who owns the cache logic"
            />

            <StrategyDiagram
                x={25}
                y={390}
                title="CACHE-ASIDE"
                color={BLUE}
                type="aside"
                delay={0}
            />

            <StrategyDiagram
                x={385}
                y={390}
                title="READ-THROUGH"
                color={PURPLE}
                type="read"
                delay={15}
            />

            <StrategyDiagram
                x={745}
                y={390}
                title="WRITE-THROUGH"
                color={ORANGE}
                type="write"
                delay={30}
            />

            <div
                style={{
                    position: "absolute",
                    left: 50,
                    right: 50,
                    bottom: 120,
                    textAlign: "center",
                    color: WHITE,
                    fontSize: 24,
                    fontWeight: 800,
                    opacity: fadeIn(
                        frame,
                        65,
                        12,
                    ),
                }}
            >
                Same components.
                <span
                    style={{
                        color: GREEN,
                        marginLeft: 8,
                    }}
                >
                    Different responsibility.
                </span>
            </div>
        </AbsoluteFill>
    );
};

// =====================================================
// CTA
// =====================================================

const CTA: React.FC<{
    duration: number;
}> = ({ duration }) => {
    const frame = useCurrentFrame();

    const opacity = fadeIn(
        frame,
        0,
        12,
    );

    const scale = pop(
        frame,
        10,
    );

    return (
        <AbsoluteFill
            style={{
                opacity,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 70,
                    right: 70,
                    top: 230,
                    textAlign: "center",
                    color: MUTED,
                    fontSize: 17,
                    fontWeight: 800,
                    letterSpacing: 3,
                }}
            >
                CACHING STRATEGIES
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 50,
                    right: 50,
                    top: 310,
                    textAlign: "center",
                    color: WHITE,
                    fontSize: 48,
                    fontWeight: 950,
                    lineHeight: 1.1,
                    transform:
                        `scale(${scale})`,
                }}
            >
                Cache isn't just
                <br />
                <span
                    style={{
                        color: GREEN,
                    }}
                >
                    "put Redis here."
                </span>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 150,
                    right: 150,
                    top: 520,
                    height: 2,
                    background:
                        `linear-gradient(90deg, transparent, ${BLUE}, transparent)`,
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: 90,
                    right: 90,
                    top: 590,
                    textAlign: "center",
                    color: MUTED,
                    fontSize: 21,
                    fontWeight: 700,
                    opacity: fadeIn(
                        frame,
                        30,
                        15,
                    ),
                }}
            >
                The strategy determines
                <br />
                <span
                    style={{
                        color: WHITE,
                    }}
                >
                    how your system reads and writes data.
                </span>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 220,
                    right: 220,
                    top: 800,
                    height: 75,
                    borderRadius: 18,
                    background:
                        `${GREEN}12`,
                    border:
                        `1px solid ${GREEN}66`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: GREEN,
                    fontSize: 21,
                    fontWeight: 900,
                    transform:
                        `scale(${pop(
                            frame,
                            45,
                        )})`,
                }}
            >
                AI HUB INSIDER
            </div>
        </AbsoluteFill>
    );
};

// =====================================================
// MAIN
// =====================================================

export const CachingStrategiesScene: React.FC =
    () => {
        const hook = getSection("hook");
        const intro = getSection("intro");
        const cacheAside =
            getSection("cache-aside");
        const readThrough =
            getSection("read-through");
        const writeThrough =
            getSection("write-through");
        const summary =
            getSection("summary");
        const cta =
            getSection("cta");

        return (
            <AbsoluteFill>
                <Background />

                <Sequence
                    from={hook.start}
                    durationInFrames={
                        hook.duration
                    }
                >
                    <Audio
                        src={staticFile(
                            hook.audio,
                        )}
                    />

                    <Hook
                        duration={
                            hook.duration
                        }
                    />
                </Sequence>

                <Sequence
                    from={intro.start}
                    durationInFrames={
                        intro.duration
                    }
                >
                    <Audio
                        src={staticFile(
                            intro.audio,
                        )}
                    />

                    <Intro
                        duration={
                            intro.duration
                        }
                    />
                </Sequence>

                <Sequence
                    from={cacheAside.start}
                    durationInFrames={
                        cacheAside.duration
                    }
                >
                    <Audio
                        src={staticFile(
                            cacheAside.audio,
                        )}
                    />

                    <CacheAside
                        duration={
                            cacheAside.duration
                        }
                    />
                </Sequence>

                <Sequence
                    from={readThrough.start}
                    durationInFrames={
                        readThrough.duration
                    }
                >
                    <Audio
                        src={staticFile(
                            readThrough.audio,
                        )}
                    />

                    <ReadThrough
                        duration={
                            readThrough.duration
                        }
                    />
                </Sequence>

                <Sequence
                    from={writeThrough.start}
                    durationInFrames={
                        writeThrough.duration
                    }
                >
                    <Audio
                        src={staticFile(
                            writeThrough.audio,
                        )}
                    />

                    <WriteThrough
                        duration={
                            writeThrough.duration
                        }
                    />
                </Sequence>

                <Sequence
                    from={summary.start}
                    durationInFrames={
                        summary.duration
                    }
                >
                    <Audio
                        src={staticFile(
                            summary.audio,
                        )}
                    />

                    <Summary
                        duration={
                            summary.duration
                        }
                    />
                </Sequence>

                <Sequence
                    from={cta.start}
                    durationInFrames={
                        cta.duration
                    }
                >
                    <Audio
                        src={staticFile(
                            cta.audio,
                        )}
                    />

                    <CTA
                        duration={
                            cta.duration
                        }
                    />
                </Sequence>
            </AbsoluteFill>
        );
    };

export const CACHING_STRATEGIES_DURATION =
    timeline.totalFrames;