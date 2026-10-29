
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
import { cdn } from "../../content/cdn";

const FPS = 30;

const SECTIONS = [
    { id: "hook", audio: "audio/cdn/hook.mp3", duration: 4.643991 },
    { id: "problem", audio: "audio/cdn/problem.mp3", duration: 12.213696 },
    { id: "cdn-intro", audio: "audio/cdn/cdn-intro.mp3", duration: 9.845261 },
    { id: "edge-routing", audio: "audio/cdn/edge-routing.mp3", duration: 10.309660 },
    { id: "cache-miss", audio: "audio/cdn/cache-miss.mp3", duration: 10.820499 },
    { id: "benefits", audio: "audio/cdn/benefits.mp3", duration: 8.637823 },
    { id: "ending", audio: "audio/cdn/ending.mp3", duration: 4.504671 },
    { id: "cta", audio: "audio/cdn/cta.mp3", duration: 8.080544 },
];

const C = {
    bg: "#10172B",
    panel: "#19243B",
    blue: "#4DB8FF",
    cyan: "#7CE7FF",
    mint: "#1FD1A5",
    purple: "#9B7CFF",
    orange: "#FFB86C",
    red: "#FF6376",
    white: "#F4F7FB",
    muted: "#9DACC5",
};

const TOTAL_FRAMES = SECTIONS.reduce(
    (sum, section) => sum + Math.round(section.duration * FPS),
    0,
);

const SECTION_FRAMES = SECTIONS.map((section, index) => {
    const from = SECTIONS.slice(0, index).reduce(
        (sum, item) => sum + Math.round(item.duration * FPS),
        0,
    );

    return {
        ...section,
        from,
        frames: Math.round(section.duration * FPS),
    };
});

const NODES = [
    { x: 92, y: 175, label: "NORTH AMERICA" },
    { x: 254, y: 125, label: "EUROPE" },
    { x: 390, y: 180, label: "ASIA" },
    { x: 306, y: 300, label: "AFRICA" },
    { x: 450, y: 370, label: "OCEANIA" },
];

const ROUTES = [
    "M92 175 Q168 55 254 125",
    "M254 125 Q335 80 390 180",
    "M92 175 Q190 250 306 300",
    "M254 125 Q300 250 450 370",
    "M390 180 Q430 265 450 370",
    "M92 175 Q270 390 450 370",
];

const LABEL_STYLE: React.CSSProperties = {
    fontFamily: "Arial, Helvetica, sans-serif",
    color: C.white,
};

const SmallLabel: React.FC<{
    children: React.ReactNode;
    color?: string;
}> = ({ children, color = C.muted }) => (
    <div
        style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 2.2,
            color,
        }}
    >
        {children}
    </div>
);

const Heading: React.FC<{
    children: React.ReactNode;
    accent?: string;
}> = ({ children, accent = C.white }) => (
    <div
        style={{
            ...LABEL_STYLE,
            fontSize: 53,
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: -1.8,
            color: accent,
        }}
    >
        {children}
    </div>
);

const Panel: React.FC<{
    children: React.ReactNode;
    style?: React.CSSProperties;
}> = ({ children, style }) => (
    <div
        style={{
            background: "linear-gradient(145deg, #1B2943, #141E33)",
            border: "1px solid #354968",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 18px 55px #050B1680",
            ...style,
        }}
    >
        {children}
    </div>
);

const Server: React.FC<{
    x: number;
    y: number;
    label: string;
    color?: string;
    scale?: number;
    active?: boolean;
}> = ({ x, y, label, color = C.blue, scale = 1, active = true }) => (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
        {active && (
            <circle
                r="47"
                fill={color}
                opacity="0.09"
            />
        )}
        <rect
            x="-30"
            y="-32"
            width="60"
            height="64"
            rx="10"
            fill="#17243A"
            stroke={color}
            strokeWidth="2.5"
        />
        {[-17, 0, 17].map((yy) => (
            <g key={yy}>
                <rect
                    x="-20"
                    y={yy - 4}
                    width="40"
                    height="8"
                    rx="3"
                    fill={color}
                    opacity="0.18"
                />
                <circle cx="-12" cy={yy} r="2.7" fill={color} />
                <path
                    d={`M -4 ${yy} H 13`}
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </g>
        ))}
        <text
            x="0"
            y="55"
            fill={C.white}
            fontSize="13"
            fontWeight="800"
            textAnchor="middle"
        >
            {label}
        </text>
    </g>
);

const UserDevice: React.FC<{
    x: number;
    y: number;
    color?: string;
}> = ({ x, y, color = C.cyan }) => (
    <g transform={`translate(${x} ${y})`}>
        <circle r="33" fill={color} opacity=".12" />
        <rect
            x="-18"
            y="-27"
            width="36"
            height="54"
            rx="7"
            fill="#18263D"
            stroke={color}
            strokeWidth="2.5"
        />
        <rect
            x="-12"
            y="-18"
            width="24"
            height="33"
            rx="3"
            fill={color}
            opacity=".2"
        />
        <circle cy="20" r="2" fill={color} />
    </g>
);

const Packet: React.FC<{
    x: number;
    y: number;
    color?: string;
    size?: number;
}> = ({ x, y, color = C.cyan, size = 9 }) => (
    <g transform={`translate(${x} ${y})`}>
        <circle r={size * 2.3} fill={color} opacity=".18" />
        <circle r={size} fill={color} />
        <circle r={size * 0.4} fill={C.white} />
    </g>
);

const WorldNetwork: React.FC<{
    frame: number;
    mode: "far" | "overload" | "global" | "route" | "miss" | "benefits";
}> = ({ frame, mode }) => {
    const cycle = (frame * 1.7) % 100;
    const showGlobal = mode !== "far" && mode !== "overload";
    const activeColor = mode === "miss" ? C.orange : C.mint;

    return (
        <svg
            viewBox="0 0 540 470"
            width="100%"
            style={{ overflow: "visible" }}
        >
            <defs>
                <linearGradient id="cdn-map-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={C.blue} stopOpacity=".16" />
                    <stop offset="100%" stopColor={C.purple} stopOpacity=".03" />
                </linearGradient>
                <filter id="cdn-glow">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <rect
                x="8"
                y="8"
                width="524"
                height="454"
                rx="28"
                fill="url(#cdn-map-gradient)"
                stroke="#2B3D5A"
            />

            {Array.from({ length: 11 }).map((_, i) => (
                <line
                    key={`grid-x-${i}`}
                    x1={30 + i * 48}
                    y1="24"
                    x2={30 + i * 48}
                    y2="445"
                    stroke="#34435B"
                    strokeOpacity=".28"
                />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
                <line
                    key={`grid-y-${i}`}
                    x1="20"
                    y1={35 + i * 43}
                    x2="520"
                    y2={35 + i * 43}
                    stroke="#34435B"
                    strokeOpacity=".28"
                />
            ))}

            {showGlobal && (
                <g>
                    <ellipse
                        cx="270"
                        cy="235"
                        rx="205"
                        ry="155"
                        fill="none"
                        stroke={C.blue}
                        strokeOpacity=".18"
                        strokeWidth="1.5"
                    />
                    <ellipse
                        cx="270"
                        cy="235"
                        rx="130"
                        ry="155"
                        fill="none"
                        stroke={C.blue}
                        strokeOpacity=".14"
                        strokeWidth="1.5"
                    />
                    <ellipse
                        cx="270"
                        cy="235"
                        rx="205"
                        ry="70"
                        fill="none"
                        stroke={C.blue}
                        strokeOpacity=".13"
                        strokeWidth="1.5"
                    />
                </g>
            )}

            {ROUTES.map((path, i) => {
                const opacity = mode === "far"
                    ? 0.3
                    : mode === "overload"
                        ? 0.55
                        : 0.5;

                return (
                    <g key={path}>
                        <path
                            d={path}
                            fill="none"
                            stroke={C.blue}
                            strokeWidth="2"
                            strokeOpacity={opacity}
                            strokeDasharray={mode === "far" ? "5 9" : "3 8"}
                        />
                        {showGlobal && (
                            <circle
                                r="5"
                                fill={i % 2 === 0 ? C.cyan : C.purple}
                                filter="url(#cdn-glow)"
                            >
                                <animateMotion
                                    dur={`${2.6 + i * 0.35}s`}
                                    repeatCount="indefinite"
                                    path={path}
                                    keyPoints={i % 2 === 0 ? "0;1" : "1;0"}
                                    keyTimes="0;1"
                                />
                            </circle>
                        )}
                    </g>
                );
            })}

            {NODES.map((node, i) => {
                const highlighted =
                    mode === "route" ||
                    mode === "miss" ||
                    mode === "benefits";

                return (
                    <g key={node.label}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={highlighted ? 20 : 15}
                            fill={i === 2 ? activeColor : C.blue}
                            opacity=".13"
                        />
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="8"
                            fill={i === 2 ? activeColor : C.blue}
                        />
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="13"
                            fill="none"
                            stroke={i === 2 ? activeColor : C.blue}
                            strokeWidth="1.5"
                            strokeOpacity=".65"
                        />
                        <text
                            x={node.x}
                            y={node.y + 30}
                            fill={C.muted}
                            fontSize="10"
                            textAnchor="middle"
                            fontWeight="700"
                            letterSpacing=".6"
                        >
                            {node.label}
                        </text>
                    </g>
                );
            })}

            {mode === "far" && (
                <g>
                    <UserDevice x={70} y={370} />
                    <Server x={435} y={90} label="ORIGIN" color={C.red} scale={1.1} />
                    <path
                        d="M92 350 Q240 120 403 100"
                        stroke={C.red}
                        strokeWidth="3"
                        strokeDasharray="8 9"
                        fill="none"
                    />
                    <Packet
                        x={interpolate(cycle, [0, 100], [95, 400])}
                        y={interpolate(cycle, [0, 100], [345, 104])}
                        color={C.red}
                        size={7}
                    />
                    <text x="255" y="205" fill={C.red} fontSize="15" fontWeight="900">
                        LONG DISTANCE
                    </text>
                </g>
            )}

            {mode === "overload" && (
                <g>
                    <Server x={270} y={230} label="ORIGIN SERVER" color={C.red} scale={1.25} />
                    {Array.from({ length: 7 }).map((_, i) => {
                        const startX = 55 + (i % 4) * 135;
                        const startY = 65 + Math.floor(i / 4) * 300;
                        const p = (frame * 2.1 + i * 14) % 100;
                        const x = interpolate(p, [0, 100], [startX, 270]);
                        const y = interpolate(p, [0, 100], [startY, 230]);

                        return (
                            <g key={i}>
                                <circle cx={startX} cy={startY} r="9" fill={C.red} opacity=".85" />
                                <path
                                    d={`M${startX} ${startY} L270 230`}
                                    stroke={C.red}
                                    strokeOpacity=".3"
                                    strokeWidth="2"
                                    strokeDasharray="4 8"
                                />
                                <Packet x={x} y={y} color={C.red} size={5} />
                            </g>
                        );
                    })}
                    <rect x="110" y="365" width="320" height="42" rx="12" fill="#48263A" stroke={C.red} />
                    <text x="270" y="392" fill={C.red} fontSize="17" textAnchor="middle" fontWeight="900">
                        TRAFFIC OVERLOAD
                    </text>
                </g>
            )}

            {showGlobal && (
                <g>
                    <Server x={270} y={235} label="ORIGIN" color={C.purple} scale={0.9} />
                    {NODES.map((node, i) => (
                        <g key={`edge-${node.label}`}>
                            <rect
                                x={node.x - 18}
                                y={node.y - 18}
                                width="36"
                                height="36"
                                rx="10"
                                fill="#17243A"
                                stroke={i === 2 ? activeColor : C.blue}
                                strokeWidth="2"
                            />
                            <path
                                d={`M${node.x - 9} ${node.y - 7} H${node.x + 9} M${node.x - 9} ${node.y} H${node.x + 9} M${node.x - 9} ${node.y + 7} H${node.x + 9}`}
                                stroke={i === 2 ? activeColor : C.blue}
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </g>
                    ))}
                </g>
            )}

            {mode === "route" && (
                <g>
                    <UserDevice x={70} y={370} />
                    <path
                        d="M92 350 Q210 260 390 180"
                        stroke={C.mint}
                        strokeWidth="5"
                        strokeOpacity=".3"
                        fill="none"
                    />
                    <path
                        d="M92 350 Q210 260 390 180"
                        stroke={C.mint}
                        strokeWidth="2.5"
                        strokeDasharray="6 10"
                        fill="none"
                    />
                    <Packet
                        x={interpolate((frame * 2.2) % 100, [0, 100], [92, 390])}
                        y={interpolate((frame * 2.2) % 100, [0, 100], [350, 180])}
                        color={C.mint}
                        size={8}
                    />
                    <rect x="290" y="75" width="180" height="45" rx="13" fill="#153C3A" stroke={C.mint} />
                    <text x="380" y="103" fill={C.mint} fontSize="15" fontWeight="900" textAnchor="middle">
                        NEARBY EDGE
                    </text>
                </g>
            )}

            {mode === "miss" && (
                <g>
                    <path
                        d="M390 180 Q335 210 270 235"
                        stroke={C.orange}
                        strokeWidth="4"
                        strokeDasharray="7 7"
                        fill="none"
                    />
                    <Packet
                        x={interpolate((frame * 2) % 100, [0, 100], [390, 270])}
                        y={interpolate((frame * 2) % 100, [0, 100], [180, 235])}
                        color={C.orange}
                        size={8}
                    />
                    <rect x="300" y="235" width="155" height="44" rx="12" fill="#3C3028" stroke={C.orange} />
                    <text x="377" y="263" fill={C.orange} fontSize="14" fontWeight="900" textAnchor="middle">
                        CACHE MISS
                    </text>
                    <path
                        d="M270 270 Q310 335 390 210"
                        stroke={C.mint}
                        strokeWidth="3"
                        strokeDasharray="5 7"
                        fill="none"
                    />
                    <rect x="305" y="335" width="155" height="40" rx="12" fill="#153C3A" stroke={C.mint} />
                    <text x="382" y="360" fill={C.mint} fontSize="13" fontWeight="900" textAnchor="middle">
                        STORE FOR LATER
                    </text>
                </g>
            )}

            {mode === "benefits" && (
                <g>
                    <rect x="30" y="405" width="220" height="38" rx="12" fill="#153C3A" stroke={C.mint} />
                    <text x="140" y="429" fill={C.mint} fontSize="14" fontWeight="900" textAnchor="middle">
                        LESS ORIGIN TRAFFIC
                    </text>
                    <rect x="270" y="405" width="240" height="38" rx="12" fill="#252449" stroke={C.purple} />
                    <text x="390" y="429" fill={C.purple} fontSize="14" fontWeight="900" textAnchor="middle">
                        FASTER DELIVERY
                    </text>
                </g>
            )}
        </svg>
    );
};

const Metric: React.FC<{
    value: string;
    label: string;
    color: string;
}> = ({ value, label, color }) => (
    <Panel style={{ flex: 1, padding: 22 }}>
        <div style={{ color, fontSize: 35, fontWeight: 900 }}>{value}</div>
        <div style={{ color: C.muted, fontSize: 15, fontWeight: 700, marginTop: 7 }}>
            {label}
        </div>
    </Panel>
);

const CdnVisual: React.FC<{
    sectionId: string;
    frame: number;
    progress: number;
}> = ({ sectionId, frame, progress }) => {
    const pop = spring({
        frame,
        fps: FPS,
        config: { damping: 16, stiffness: 100 },
    });

    const reveal = interpolate(progress, [0, 0.2, 1], [0, 1, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const common: React.CSSProperties = {
        position: "absolute",
        left: 48,
        right: 48,
        top: 95,
        bottom: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 28,
        opacity: reveal,
        transform: `translateY(${(1 - pop) * 24}px)`,
    };

    if (sectionId === "hook") {
        return (
            <div style={common}>
                <SmallLabel color={C.cyan}>GLOBAL VIDEO DELIVERY</SmallLabel>
                <Heading>Why doesn't YouTube feel slow?</Heading>
                <div style={{ color: C.muted, fontSize: 25, lineHeight: 1.4 }}>
                    Even when its servers are thousands of miles away.
                </div>
                <WorldNetwork frame={frame} mode="far" />
                <Panel>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <SmallLabel>USER → ORIGIN</SmallLabel>
                        <span style={{ color: C.red, fontWeight: 900, fontSize: 19 }}>LONG ROUTE</span>
                    </div>
                </Panel>
            </div>
        );
    }

    if (sectionId === "problem") {
        return (
            <div style={common}>
                <SmallLabel color={C.red}>THE BOTTLENECK</SmallLabel>
                <Heading>Millions of requests.</Heading>
                <Heading accent={C.red}>One origin server.</Heading>
                <WorldNetwork frame={frame} mode="overload" />
                <div style={{ display: "flex", gap: 12 }}>
                    <Metric value="↑" label="TRAFFIC" color={C.red} />
                    <Metric value="99%" label="BANDWIDTH PRESSURE" color={C.orange} />
                </div>
            </div>
        );
    }

    if (sectionId === "cdn-intro") {
        return (
            <div style={common}>
                <SmallLabel color={C.purple}>THE SOLUTION</SmallLabel>
                <Heading>Content Delivery Network</Heading>
                <div style={{ color: C.muted, fontSize: 22 }}>
                    Cache content at edge locations around the world.
                </div>
                <WorldNetwork frame={frame} mode="global" />
                <Panel>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ color: C.white, fontWeight: 900, fontSize: 22 }}>One origin</div>
                            <div style={{ color: C.muted, fontSize: 16, marginTop: 6 }}>Source of truth</div>
                        </div>
                        <div style={{ color: C.blue, fontSize: 32 }}>→</div>
                        <div>
                            <div style={{ color: C.mint, fontWeight: 900, fontSize: 22 }}>Many edges</div>
                            <div style={{ color: C.muted, fontSize: 16, marginTop: 6 }}>Cached copies</div>
                        </div>
                    </div>
                </Panel>
            </div>
        );
    }

    if (sectionId === "edge-routing") {
        return (
            <div style={common}>
                <SmallLabel color={C.mint}>REQUEST ROUTING</SmallLabel>
                <Heading>Serve from the nearest suitable edge.</Heading>
                <WorldNetwork frame={frame} mode="route" />
                <Panel>
                    <div style={{ color: C.mint, fontSize: 24, fontWeight: 900 }}>
                        CACHE HIT ✓
                    </div>
                    <div style={{ color: C.muted, fontSize: 20, marginTop: 10, lineHeight: 1.4 }}>
                        Content is already cached. The edge responds without contacting the origin.
                    </div>
                </Panel>
            </div>
        );
    }

    if (sectionId === "cache-miss") {
        return (
            <div style={common}>
                <SmallLabel color={C.orange}>CACHE MISS</SmallLabel>
                <Heading>The edge doesn't have the video?</Heading>
                <WorldNetwork frame={frame} mode="miss" />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        ["01", "Fetch from origin or upstream cache", C.orange],
                        ["02", "Return the content to the viewer", C.blue],
                        ["03", "Cache it for future requests", C.mint],
                    ].map(([number, label, color]) => (
                        <Panel key={number} style={{ display: "flex", gap: 18, alignItems: "center", padding: 18 }}>
                            <div style={{ color, fontWeight: 900, fontSize: 23 }}>{number}</div>
                            <div style={{ color: C.white, fontWeight: 700, fontSize: 18 }}>{label}</div>
                        </Panel>
                    ))}
                </div>
            </div>
        );
    }

    if (sectionId === "benefits") {
        return (
            <div style={common}>
                <SmallLabel color={C.mint}>THE RESULT</SmallLabel>
                <Heading>Content closer to users.</Heading>
                <WorldNetwork frame={frame} mode="benefits" />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <Panel style={{ display: "flex", alignItems: "center", gap: 18 }}>
                        <div style={{ fontSize: 34 }}>⚡</div>
                        <div>
                            <div style={{ color: C.mint, fontSize: 23, fontWeight: 900 }}>Lower latency</div>
                            <div style={{ color: C.muted, fontSize: 17, marginTop: 5 }}>Shorter path to cached content</div>
                        </div>
                    </Panel>
                    <Panel style={{ display: "flex", alignItems: "center", gap: 18 }}>
                        <div style={{ fontSize: 34 }}>↘</div>
                        <div>
                            <div style={{ color: C.blue, fontSize: 23, fontWeight: 900 }}>Less origin load</div>
                            <div style={{ color: C.muted, fontSize: 17, marginTop: 5 }}>Fewer repeated origin requests</div>
                        </div>
                    </Panel>
                </div>
            </div>
        );
    }

    if (sectionId === "ending") {
        return (
            <div style={{ ...common, alignItems: "center", textAlign: "center", gap: 36 }}>
                <div style={{ fontSize: 86 }}>🌍</div>
                <Heading>Don't bring every user to your content.</Heading>
                <Heading accent={C.mint}>Bring content closer to users.</Heading>
                <WorldNetwork frame={frame} mode="global" />
            </div>
        );
    }

    return (
        <div style={{ ...common, alignItems: "center", textAlign: "center", gap: 32 }}>
            <div style={{ color: C.blue, fontSize: 24, fontWeight: 900, letterSpacing: 4 }}>
                AI HUB INSIDER
            </div>
            <Heading>Build systems that scale.</Heading>
            <WorldNetwork frame={frame} mode="benefits" />
            <Panel style={{ textAlign: "center" }}>
                <div style={{ color: C.white, fontSize: 24, fontWeight: 900 }}>
                    CDN in production?
                </div>
                <div style={{ color: C.muted, fontSize: 19, marginTop: 12 }}>
                    Tell us in the comments.
                </div>
                <div style={{ color: C.mint, fontSize: 20, fontWeight: 900, marginTop: 20 }}>
                    FOLLOW FOR MORE SYSTEM DESIGN
                </div>
            </Panel>
        </div>
    );
};

export const CdnScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const activeSection =
        SECTION_FRAMES.find(
            (section) => frame >= section.from && frame < section.from + section.frames,
        ) ?? SECTION_FRAMES[SECTION_FRAMES.length - 1];

    const localFrame = frame - activeSection.from;
    const progress = interpolate(
        localFrame,
        [0, activeSection.frames],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    return (
        <AbsoluteFill
            style={{
                background: C.bg,
                color: C.white,
                fontFamily: "Arial, Helvetica, sans-serif",
                overflow: "hidden",
            }}
        >
            <AbsoluteFill
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 32%, #25365A 0%, #141D33 42%, #10172B 78%)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    top: 38,
                    left: 42,
                    right: 42,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 5,
                }}
            >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 4,
                            background: C.blue,
                            boxShadow: `0 0 18px ${C.blue}`,
                        }}
                    />
                    <span style={{ ...LABEL_STYLE, fontSize: 17, fontWeight: 900, letterSpacing: 2 }}>
                        AI HUB INSIDER
                    </span>
                </div>
                <span style={{ color: C.muted, fontSize: 16, fontWeight: 800 }}>
                    SYSTEM DESIGN
                </span>
            </div>

            <CdnVisual
                sectionId={activeSection.id}
                frame={localFrame}
                progress={progress}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: 34,
                    left: 42,
                    right: 42,
                    height: 4,
                    background: "#34415A",
                    borderRadius: 99,
                    overflow: "hidden",
                    zIndex: 5,
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${(frame / TOTAL_FRAMES) * 100}%`,
                        background: `linear-gradient(90deg, ${C.blue}, ${C.mint}, ${C.purple})`,
                        borderRadius: 99,
                    }}
                />
            </div>

            {SECTION_FRAMES.map((section) => (
                <Sequence
                    key={section.id}
                    from={section.from}
                    durationInFrames={section.frames}
                >
                    <Audio src={staticFile(section.audio)} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
