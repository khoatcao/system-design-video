
import React from "react";
import {
    AbsoluteFill,
    Audio,
    Easing,
    Sequence,
    interpolate,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";

import { pollingVsWebhooks } from "../../content/polling-vs-webhooks";
import { createTimeline } from "../timeline";

const { sections: TIMELINE } = createTimeline(pollingVsWebhooks);

const C = {
    bg: "#10172B",
    panel: "#192641",
    white: "#F4F7FB",
    muted: "#A7B4D0",
    cyan: "#4DB8FF",
    mint: "#1FD1A5",
    purple: "#9B7CFF",
    orange: "#FFB86C",
    red: "#FF6376",
    line: "#40516F",
};

const FONT = "Inter, Arial, sans-serif";
const clamp = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
};

const fade = (f: number, start = 0, duration = 12) =>
    interpolate(f, [start, start + duration], [0, 1], clamp);

const move = (
    f: number,
    start: number,
    duration: number,
    from: number,
    to: number
) =>
    interpolate(f, [start, start + duration], [from, to], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
    });

const pop = (f: number, fps: number, start = 0) =>
    spring({
        frame: Math.max(0, f - start),
        fps,
        config: { damping: 14, stiffness: 150, mass: 0.7 },
    });

const glow = (color: string, blur = 18) =>
    `0 0 ${blur}px ${color}55, 0 0 ${blur * 2}px ${color}20`;

const Txt: React.FC<{
    children: React.ReactNode;
    size?: number;
    color?: string;
    weight?: number;
    align?: React.CSSProperties["textAlign"];
    style?: React.CSSProperties;
}> = ({
    children,
    size = 28,
    color = C.white,
    weight = 800,
    align,
    style,
}) => (
        <div
            style={{
                fontFamily: FONT,
                fontSize: size,
                color,
                fontWeight: weight,
                textAlign: align,
                lineHeight: 1.2,
                ...style,
            }}
        >
            {children}
        </div>
    );

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const f = useCurrentFrame();
    const drift = (f * 0.22) % 60;

    return (
        <AbsoluteFill
            style={{
                overflow: "hidden",
                background:
                    "radial-gradient(ellipse at 15% 20%, #193D60 0%, transparent 38%), radial-gradient(ellipse at 90% 78%, #39264F 0%, transparent 35%), #10172B",
                fontFamily: FONT,
            }}
        >
            <AbsoluteFill
                style={{
                    opacity: 0.1,
                    backgroundImage:
                        "linear-gradient(rgba(110,165,230,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(110,165,230,.35) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    transform: `translate(${-drift}px, ${-drift}px)`,
                }}
            />
            {Array.from({ length: 24 }, (_, i) => {
                const x = (i * 173 + 47) % 1080;
                const y = (i * 271 + 91) % 1920;
                const color = [C.cyan, C.mint, C.purple, C.orange][i % 4];

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x,
                            top: y,
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: color,
                            opacity: 0.2 + 0.45 * ((Math.sin(f * 0.07 + i) + 1) / 2),
                            boxShadow: glow(color, 7),
                        }}
                    />
                );
            })}
            {children}
        </AbsoluteFill>
    );
};

const Header: React.FC<{
    frame: number;
    eyebrow: string;
    title: string;
    subtitle?: string;
    color?: string;
    size?: number;
}> = ({ frame, eyebrow, title, subtitle, color = C.cyan, size = 60 }) => (
    <div
        style={{
            position: "absolute",
            top: 105,
            left: 58,
            right: 58,
            opacity: fade(frame, 0, 9),
            transform: `translateY(${move(frame, 0, 14, 28, 0)}px)`,
        }}
    >
        <Txt size={21} color={color} weight={950} style={{ letterSpacing: 3 }}>
            {eyebrow}
        </Txt>
        <Txt
            size={size}
            weight={950}
            style={{
                marginTop: 20,
                letterSpacing: -2,
                lineHeight: 1.05,
                textShadow: glow(color, 20),
            }}
        >
            {title}
        </Txt>
        {subtitle && (
            <Txt
                size={23}
                color={C.muted}
                style={{ marginTop: 18, lineHeight: 1.4 }}
            >
                {subtitle}
            </Txt>
        )}
        <div
            style={{
                marginTop: 24,
                width: move(frame, 3, 20, 0, 240),
                height: 5,
                borderRadius: 99,
                background: `linear-gradient(90deg, ${color}, ${C.purple})`,
                boxShadow: glow(color, 10),
            }}
        />
    </div>
);

const Panel: React.FC<{
    left: number;
    top: number;
    width: number;
    height: number;
    color?: string;
    children: React.ReactNode;
}> = ({ left, top, width, height, color = C.line, children }) => (
    <div
        style={{
            position: "absolute",
            left,
            top,
            width,
            height,
            boxSizing: "border-box",
            overflow: "hidden",
            borderRadius: 28,
            background: "linear-gradient(145deg, #1C2B49, #111B31)",
            border: `1px solid ${color}99`,
            boxShadow: "0 24px 70px rgba(0,0,0,.22)",
        }}
    >
        {children}
    </div>
);

const Node: React.FC<{
    x: number;
    y: number;
    width?: number;
    height?: number;
    color: string;
    title: string;
    subtitle?: string;
    frame: number;
    start?: number;
}> = ({
    x,
    y,
    width = 220,
    height = 150,
    color,
    title,
    subtitle,
    frame,
    start = 0,
}) => {
        const { fps } = useVideoConfig();

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width,
                    height,
                    boxSizing: "border-box",
                    padding: 16,
                    borderRadius: 23,
                    border: `2px solid ${color}`,
                    background: `linear-gradient(145deg, ${color}22, #111B31)`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    opacity: fade(frame, start, 8),
                    transform: `scale(${pop(frame, fps, start)})`,
                    boxShadow: glow(color, 12),
                }}
            >
                <div
                    style={{
                        width: 36,
                        height: 5,
                        borderRadius: 9,
                        background: color,
                        marginBottom: 16,
                    }}
                />
                <Txt size={23} color={color} weight={950}>
                    {title}
                </Txt>
                {subtitle && (
                    <Txt size={17} color={C.muted} style={{ marginTop: 10 }}>
                        {subtitle}
                    </Txt>
                )}
            </div>
        );
    };

const Packet: React.FC<{
    frame: number;
    start: number;
    duration?: number;
    x1: number;
    x2: number;
    y: number;
    color: string;
    size?: number;
}> = ({
    frame,
    start,
    duration = 20,
    x1,
    x2,
    y,
    color,
    size = 18,
}) => {
        const x = move(frame, start, duration, x1, x2);
        const opacity =
            frame < start || frame > start + duration + 4
                ? 0
                : interpolate(
                    frame,
                    [start, start + 3, start + duration, start + duration + 4],
                    [0, 1, 1, 0],
                    clamp
                );

        return (
            <>
                <div
                    style={{
                        position: "absolute",
                        left: Math.min(x1, x2),
                        top: y,
                        width: Math.abs(x2 - x1),
                        height: 3,
                        background: `${color}44`,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        left: x - size / 2,
                        top: y - size / 2,
                        width: size,
                        height: size,
                        borderRadius: 6,
                        background: color,
                        opacity,
                        boxShadow: glow(color, 15),
                    }}
                />
            </>
        );
    };

// HOOK: show a successful payment and a client that is still waiting.
const Hook: React.FC = () => {
    const f = useCurrentFrame();
    const { fps } = useVideoConfig();
    const waiting = f < 4.7 * fps;
    const seconds = Math.max(0, 5 - Math.floor(Math.max(0, f - 12) / fps));

    return (
        <Shell>
            <Header
                frame={f}
                eyebrow="THE FIVE-SECOND PROBLEM"
                title="Payment complete."
                subtitle="Why is your app still waiting?"
                color={C.orange}
                size={64}
            />

            <Panel left={65} top={465} width={950} height={760} color={C.orange}>
                <Node
                    x={40}
                    y={110}
                    width={245}
                    color={C.mint}
                    title="PAYMENT API"
                    subtitle="Transaction approved"
                    frame={f}
                    start={0}
                />
                <Node
                    x={665}
                    y={110}
                    width={245}
                    color={C.orange}
                    title="YOUR APP"
                    subtitle={waiting ? "Waiting for update..." : "Checking again..."}
                    frame={f}
                    start={0}
                />

                <svg
                    width="950"
                    height="760"
                    style={{ position: "absolute", inset: 0 }}
                >
                    <path
                        d="M 285 185 H 665"
                        stroke={C.line}
                        strokeWidth="4"
                        strokeDasharray="10 12"
                        fill="none"
                    />
                </svg>

                <Packet
                    frame={f}
                    start={12}
                    duration={28}
                    x1={300}
                    x2={650}
                    y={650}
                    color={C.orange}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 325,
                        top: 300,
                        width: 300,
                        textAlign: "center",
                        opacity: fade(f, 5, 10),
                    }}
                >
                    <div
                        style={{
                            margin: "0 auto",
                            width: 130,
                            height: 130,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: `${C.mint}20`,
                            border: `3px solid ${C.mint}`,
                            boxShadow: glow(C.mint, 25),
                            transform: `scale(${pop(f, fps, 4)})`,
                        }}
                    >
                        <Txt size={76} color={C.mint} weight={950}>
                            ✓
                        </Txt>
                    </div>
                    <Txt size={22} color={C.mint} style={{ marginTop: 20 }}>
                        PAYMENT SUCCEEDED
                    </Txt>
                    <Txt size={19} color={C.muted} style={{ marginTop: 10 }}>
                        The provider already knows.
                    </Txt>
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 45,
                        right: 45,
                        bottom: 45,
                        padding: 22,
                        borderRadius: 22,
                        background: "#0D1629",
                        border: `1px solid ${C.orange}88`,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Txt size={20} color={C.muted}>
                            NEXT POLL
                        </Txt>
                        <Txt size={25} color={C.orange} weight={950}>
                            {seconds}s
                        </Txt>
                    </div>
                    <div
                        style={{
                            marginTop: 15,
                            height: 12,
                            borderRadius: 99,
                            background: "#263550",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: `${((f * 2.5) % 100)}%`,
                                background: C.orange,
                                boxShadow: glow(C.orange, 10),
                            }}
                        />
                    </div>
                </div>
            </Panel>

            <Txt
                size={27}
                weight={950}
                align="center"
                style={{
                    position: "absolute",
                    top: 1300,
                    left: 60,
                    right: 60,
                    opacity: fade(f, 32, 10),
                }}
            >
                The event happened. Your app hasn't seen it.
            </Txt>
        </Shell>
    );
};

// POLLING: animate repeated requests and responses.
const Problem: React.FC = () => {
    const f = useCurrentFrame();
    const { fps } = useVideoConfig();
    const cycle = 48;
    const local = f % cycle;
    const requestCount = Math.floor(f / cycle) + 1;
    const requestActive = local < 22;
    const packetX = requestActive
        ? move(local, 0, 20, 330, 700)
        : move(local, 22, 18, 700, 330);
    const packetColor = requestActive ? C.cyan : C.purple;

    return (
        <Shell>
            <Header
                frame={f}
                eyebrow="APPROACH 01"
                title="POLLING"
                subtitle="The client keeps asking."
                color={C.orange}
                size={74}
            />

            <Panel left={45} top={440} width={990} height={820} color={C.orange}>
                <Node
                    x={40}
                    y={90}
                    width={250}
                    color={C.cyan}
                    title="CLIENT"
                    subtitle="GET /status"
                    frame={f}
                />
                <Node
                    x={700}
                    y={90}
                    width={250}
                    color={C.purple}
                    title="SERVER"
                    subtitle="Job not ready"
                    frame={f}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 330,
                        top: 105,
                        width: 330,
                        textAlign: "center",
                    }}
                >
                    <Txt size={18} color={packetColor} weight={950}>
                        {requestActive ? "HTTP REQUEST →" : "← HTTP RESPONSE"}
                    </Txt>
                    <Txt size={16} color={C.muted} style={{ marginTop: 8 }}>
                        {requestActive ? "GET /status" : "200 OK · processing"}
                    </Txt>
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 290,
                        top: 275,
                        width: 410,
                        height: 350,
                        border: `2px dashed ${C.line}`,
                        borderRadius: 26,
                        opacity: 0.8,
                    }}
                />
                {Array.from({ length: 5 }, (_, i) => {
                    const y = 310 + i * 62;
                    const active = i === requestCount % 5;

                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: 320,
                                top: y,
                                width: 350,
                                height: 42,
                                borderRadius: 12,
                                padding: "0 14px",
                                boxSizing: "border-box",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: active ? `${C.orange}20` : "#0D1629",
                                border: `1px solid ${active ? C.orange : C.line}`,
                                opacity: fade(f, i * 3, 6),
                            }}
                        >
                            <Txt size={17} color={C.muted}>
                                REQUEST #{String(i + 1).padStart(2, "0")}
                            </Txt>
                            <Txt size={17} color={active ? C.orange : C.red}>
                                {active ? "IN FLIGHT" : "NO CHANGE"}
                            </Txt>
                        </div>
                    );
                })}

                <div
                    style={{
                        position: "absolute",
                        left: 50,
                        right: 50,
                        bottom: 45,
                        padding: 24,
                        borderRadius: 22,
                        background: "#0D1629",
                        border: `1px solid ${C.orange}77`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <Txt size={18} color={C.muted}>
                            REPEATED REQUESTS
                        </Txt>
                        <Txt size={53} color={C.orange} weight={950}>
                            {String(requestCount).padStart(3, "0")}
                        </Txt>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <Txt size={21} color={C.red} weight={950}>
                            NO NEW DATA
                        </Txt>
                        <Txt size={17} color={C.muted} style={{ marginTop: 8 }}>
                            But the server still does work.
                        </Txt>
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: packetX,
                        top: 255,
                        width: 19,
                        height: 19,
                        borderRadius: 6,
                        background: packetColor,
                        boxShadow: glow(packetColor, 16),
                        opacity: 0.95,
                    }}
                />
            </Panel>

            <Txt
                size={28}
                color={C.orange}
                weight={950}
                align="center"
                style={{
                    position: "absolute",
                    top: 1320,
                    left: 60,
                    right: 60,
                    opacity: fade(f, 25, 10),
                }}
            >
                ASK → WAIT → ASK AGAIN
            </Txt>
        </Shell>
    );
};

// POLLING USE CASES: rotate a visual focus across examples.
const Polling: React.FC = () => {
    const f = useCurrentFrame();
    const items = [
        {
            title: "BACKGROUND JOB",
            subtitle: "Check whether processing has finished",
            icon: "↻",
            color: C.cyan,
        },
        {
            title: "BATCH REPORT",
            subtitle: "Refresh results every few minutes",
            icon: "▤",
            color: C.purple,
        },
        {
            title: "STATUS DASHBOARD",
            subtitle: "Periodic updates are acceptable",
            icon: "◷",
            color: C.orange,
        },
    ];

    return (
        <Shell>
            <Header
                frame={f}
                eyebrow="WHEN POLLING MAKES SENSE"
                title="Sometimes, checking is fine."
                subtitle="Use polling when periodic updates are enough."
                color={C.orange}
                size={51}
            />

            <div
                style={{
                    position: "absolute",
                    left: 85,
                    top: 435,
                    width: 910,
                    height: 660,
                    borderRadius: 30,
                    border: `1px solid ${C.line}`,
                    background: "#111B31",
                }}
            />

            {items.map((item, i) => {
                const y = 475 + i * 205;
                const active = Math.floor(f / 24) % items.length === i;

                return (
                    <div
                        key={item.title}
                        style={{
                            position: "absolute",
                            left: 110,
                            top: y,
                            width: 860,
                            height: 160,
                            boxSizing: "border-box",
                            display: "flex",
                            alignItems: "center",
                            gap: 25,
                            padding: 25,
                            borderRadius: 24,
                            background: active ? `${item.color}20` : C.panel,
                            border: `2px solid ${active ? item.color : C.line}`,
                            transform: `translateX(${move(f, i * 7, 14, 35, 0)}px)`,
                            opacity: fade(f, i * 6, 10),
                            boxShadow: active ? glow(item.color, 16) : "none",
                        }}
                    >
                        <div
                            style={{
                                width: 95,
                                height: 95,
                                flexShrink: 0,
                                borderRadius: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: `${item.color}20`,
                                color: item.color,
                                fontSize: 48,
                                fontWeight: 950,
                            }}
                        >
                            {item.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <Txt size={23} color={item.color} weight={950}>
                                {item.title}
                            </Txt>
                            <Txt size={19} color={C.muted} style={{ marginTop: 12 }}>
                                {item.subtitle}
                            </Txt>
                        </div>
                        <Txt size={30} color={item.color}>
                            {active ? "●" : "○"}
                        </Txt>
                    </div>
                );
            })}

            <div
                style={{
                    position: "absolute",
                    left: 90,
                    right: 90,
                    top: 1180,
                    padding: 30,
                    borderRadius: 24,
                    background: `${C.orange}15`,
                    border: `1px solid ${C.orange}66`,
                    opacity: fade(f, 25, 10),
                }}
            >
                <Txt size={25} weight={950} align="center">
                    Simple to implement. Easy to control.
                </Txt>
                <Txt size={18} color={C.muted} align="center" style={{ marginTop: 12 }}>
                    Trade faster updates for repeated checks.
                </Txt>
            </div>
        </Shell>
    );
};

// WEBHOOKS: animate a real event payload from provider to API.
const Webhooks: React.FC = () => {
    const f = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = move(f, 12, 65, 0, 1);
    const payloadX = 85 + progress * 790;
    const arrived = progress > 0.93;

    const nodes = [
        { x: 35, color: C.mint, title: "PAYMENT", sub: "Event occurs" },
        { x: 375, color: C.cyan, title: "HTTP POST", sub: "Webhook delivery" },
        { x: 715, color: C.purple, title: "YOUR API", sub: "Process event" },
    ];

    return (
        <Shell>
            <Header
                frame={f}
                eyebrow="APPROACH 02"
                title="WEBHOOKS"
                subtitle="The provider notifies you when an event happens."
                color={C.mint}
                size={72}
            />

            <Panel left={45} top={465} width={990} height={760} color={C.mint}>
                <svg
                    width="990"
                    height="760"
                    style={{ position: "absolute", inset: 0 }}
                >
                    <path
                        d="M 280 220 H 710"
                        stroke={C.line}
                        strokeWidth="5"
                        strokeDasharray="12 12"
                        fill="none"
                    />
                    <path
                        d="M 280 220 H 710"
                        stroke={C.mint}
                        strokeWidth="2"
                        strokeDasharray="8 16"
                        strokeDashoffset={-f * 2}
                        fill="none"
                        opacity={0.8}
                    />
                </svg>

                {nodes.map((node, i) => (
                    <Node
                        key={node.title}
                        x={node.x}
                        y={140}
                        width={240}
                        height={160}
                        color={node.color}
                        title={node.title}
                        subtitle={node.sub}
                        frame={f}
                        start={i * 9}
                    />
                ))}

                <div
                    style={{
                        position: "absolute",
                        left: payloadX,
                        top: 208,
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background: C.white,
                        border: `4px solid ${C.mint}`,
                        boxShadow: glow(C.mint, 20),
                        opacity: fade(f, 12, 6),
                        transform: `translateX(-13px) rotate(${f * 3}deg)`,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 60,
                        right: 60,
                        top: 365,
                        height: 200,
                        borderRadius: 24,
                        padding: 24,
                        boxSizing: "border-box",
                        background: "#0D1629",
                        border: `1px solid ${C.cyan}88`,
                        opacity: fade(f, 18, 10),
                    }}
                >
                    <Txt size={19} color={C.cyan} weight={950}>
                        EVENT PAYLOAD
                    </Txt>
                    <Txt
                        size={18}
                        color={C.white}
                        style={{
                            marginTop: 17,
                            fontFamily: "monospace",
                            lineHeight: 1.65,
                        }}
                    >
                        {`{`}
                        <br />
                        {`  "event": "payment.succeeded",`}
                        <br />
                        {`  "orderId": "8241"`}
                        <br />
                        {`}`}
                    </Txt>
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: 60,
                        right: 60,
                        bottom: 35,
                        padding: 23,
                        borderRadius: 22,
                        background: arrived ? `${C.mint}20` : `${C.purple}16`,
                        border: `1px solid ${arrived ? C.mint : C.purple}88`,
                    }}
                >
                    <Txt
                        size={22}
                        color={arrived ? C.mint : C.purple}
                        weight={950}
                        align="center"
                    >
                        {arrived ? "✓ EVENT RECEIVED" : "DELIVERING EVENT..."}
                    </Txt>
                    <Txt size={17} color={C.muted} align="center" style={{ marginTop: 8 }}>
                        Provider sends an HTTP request to your registered endpoint.
                    </Txt>
                </div>
            </Panel>

            <Txt
                size={27}
                color={C.mint}
                weight={950}
                align="center"
                style={{
                    position: "absolute",
                    top: 1290,
                    left: 55,
                    right: 55,
                    opacity: fade(f, 35, 10),
                }}
            >
                EVENT → NOTIFICATION → ACTION
            </Txt>
        </Shell>
    );
};

// COMPARISON: separate visual motion for polling and webhooks.
const Comparison: React.FC = () => {
    const f = useCurrentFrame();
    const pollCycle = f % 40;
    const webhookProgress = move(f, 20, 35, 0, 1);

    return (
        <Shell>
            <Header
                frame={f}
                eyebrow="THE TRADE-OFF"
                title="Two ways to get updates."
                subtitle="Choose how your system should react."
                color={C.purple}
                size={54}
            />

            <Panel left={45} top={465} width={475} height={710} color={C.orange}>
                <Txt
                    size={30}
                    color={C.orange}
                    weight={950}
                    align="center"
                    style={{ marginTop: 35 }}
                >
                    POLLING
                </Txt>
                <Txt size={18} color={C.muted} align="center" style={{ marginTop: 10 }}>
                    Client asks repeatedly
                </Txt>

                <div
                    style={{
                        position: "absolute",
                        left: 35,
                        right: 35,
                        top: 150,
                        height: 300,
                        borderRadius: 24,
                        background: "#0D1629",
                        border: `1px solid ${C.line}`,
                    }}
                >
                    <Node
                        x={35}
                        y={45}
                        width={125}
                        height={105}
                        color={C.cyan}
                        title="CLIENT"
                        frame={f}
                    />
                    <Node
                        x={245}
                        y={45}
                        width={125}
                        height={105}
                        color={C.purple}
                        title="SERVER"
                        frame={f}
                    />
                    <Packet
                        frame={pollCycle}
                        start={0}
                        duration={18}
                        x1={160}
                        x2={245}
                        y={225}
                        color={C.orange}
                        size={14}
                    />
                    <Packet
                        frame={pollCycle}
                        start={20}
                        duration={16}
                        x1={245}
                        x2={160}
                        y={260}
                        color={C.purple}
                        size={14}
                    />
                    <Txt
                        size={16}
                        color={C.orange}
                        align="center"
                        style={{ position: "absolute", left: 0, right: 0, top: 215 }}
                    >
                        REPEATED CHECKS
                    </Txt>
                </div>

                <div style={{ position: "absolute", left: 30, right: 30, top: 500 }}>
                    {["Periodic detection", "Repeated requests", "Simple to implement"].map(
                        (text, i) => (
                            <Txt
                                key={text}
                                size={19}
                                color={C.white}
                                style={{
                                    marginTop: 15,
                                    opacity: fade(f, 5 + i * 7, 8),
                                }}
                            >
                                <span style={{ color: C.orange }}>●</span> {text}
                            </Txt>
                        )
                    )}
                </div>
            </Panel>

            <Panel left={560} top={465} width={475} height={710} color={C.mint}>
                <Txt
                    size={30}
                    color={C.mint}
                    weight={950}
                    align="center"
                    style={{ marginTop: 35 }}
                >
                    WEBHOOKS
                </Txt>
                <Txt size={18} color={C.muted} align="center" style={{ marginTop: 10 }}>
                    Provider pushes an event
                </Txt>

                <div
                    style={{
                        position: "absolute",
                        left: 35,
                        right: 35,
                        top: 150,
                        height: 300,
                        borderRadius: 24,
                        background: "#0D1629",
                        border: `1px solid ${C.line}`,
                    }}
                >
                    <Node
                        x={15}
                        y={45}
                        width={125}
                        height={105}
                        color={C.mint}
                        title="EVENT"
                        frame={f}
                    />
                    <Node
                        x={245}
                        y={45}
                        width={125}
                        height={105}
                        color={C.purple}
                        title="API"
                        frame={f}
                    />
                    <Packet
                        frame={f}
                        start={20}
                        duration={35}
                        x1={140}
                        x2={245}
                        y={225}
                        color={C.mint}
                        size={16}
                    />
                    <Txt
                        size={16}
                        color={C.mint}
                        align="center"
                        style={{ position: "absolute", left: 0, right: 0, top: 215 }}
                    >
                        {webhookProgress > 0.9 ? "EVENT DELIVERED" : "EVENT DELIVERY"}
                    </Txt>
                </div>

                <div style={{ position: "absolute", left: 30, right: 30, top: 500 }}>
                    {["Event-triggered", "Can react faster", "Needs delivery handling"].map(
                        (text, i) => (
                            <Txt
                                key={text}
                                size={19}
                                color={C.white}
                                style={{
                                    marginTop: 15,
                                    opacity: fade(f, 8 + i * 7, 8),
                                }}
                            >
                                <span style={{ color: C.mint }}>●</span> {text}
                            </Txt>
                        )
                    )}
                </div>
            </Panel>

            <div
                style={{
                    position: "absolute",
                    left: 60,
                    right: 60,
                    top: 1225,
                    padding: 25,
                    borderRadius: 22,
                    background: `${C.red}15`,
                    border: `1px solid ${C.red}77`,
                    opacity: fade(f, 25, 10),
                }}
            >
                <Txt size={22} color={C.red} weight={950} align="center">
                    WEBHOOKS STILL NEED RELIABILITY
                </Txt>
                <Txt size={17} color={C.muted} align="center" style={{ marginTop: 10 }}>
                    Verify signatures, retry failures, and handle duplicates.
                </Txt>
            </div>
        </Shell>
    );
};

// USE CASES: events trigger recognizable actions.
const UseCases: React.FC = () => {
    const f = useCurrentFrame();
    const events = [
        {
            icon: "$",
            title: "PAYMENT SUCCEEDED",
            subtitle: "Fulfill the order",
            color: C.mint,
        },
        {
            icon: "✉",
            title: "MESSAGE RECEIVED",
            subtitle: "Notify the recipient",
            color: C.cyan,
        },
        {
            icon: "↻",
            title: "DEPLOYMENT FINISHED",
            subtitle: "Start the next workflow",
            color: C.purple,
        },
    ];

    return (
        <Shell>
            <Header
                frame={f}
                eyebrow="WEBHOOKS IN PRODUCTION"
                title="Events trigger real work."
                subtitle="Connect a business event to its next action."
                color={C.mint}
                size={55}
            />

            {events.map((event, i) => {
                const y = 465 + i * 225;
                const p = move(f, i * 12, 22, 0, 1);

                return (
                    <div
                        key={event.title}
                        style={{
                            position: "absolute",
                            left: 60,
                            right: 60,
                            top: y,
                            height: 175,
                            boxSizing: "border-box",
                            padding: 25,
                            borderRadius: 26,
                            display: "flex",
                            alignItems: "center",
                            gap: 22,
                            background: `${event.color}12`,
                            border: `1px solid ${event.color}88`,
                            opacity: fade(f, i * 8, 10),
                            transform: `translateX(${move(f, i * 8, 15, 45, 0)}px)`,
                        }}
                    >
                        <div
                            style={{
                                width: 90,
                                height: 90,
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 24,
                                background: `${event.color}20`,
                                color: event.color,
                                fontSize: 42,
                                fontWeight: 950,
                                boxShadow: glow(event.color, 12),
                            }}
                        >
                            {event.icon}
                        </div>

                        <div style={{ flex: 1 }}>
                            <Txt size={22} color={event.color} weight={950}>
                                {event.title}
                            </Txt>
                            <Txt size={19} color={C.muted} style={{ marginTop: 12 }}>
                                {event.subtitle}
                            </Txt>
                        </div>

                        <div style={{ width: 90, textAlign: "center" }}>
                            <div
                                style={{
                                    width: 65,
                                    height: 5,
                                    margin: "0 auto 12px",
                                    borderRadius: 9,
                                    background: event.color,
                                    transform: `scaleX(${p})`,
                                }}
                            />
                            <Txt size={32} color={event.color}>
                                →
                            </Txt>
                        </div>
                    </div>
                );
            })}

            <div
                style={{
                    position: "absolute",
                    left: 75,
                    right: 75,
                    top: 1240,
                    textAlign: "center",
                    opacity: fade(f, 30, 10),
                }}
            >
                <Txt size={25} color={C.mint} weight={950}>
                    React when events arrive.
                </Txt>
            </div>
        </Shell>
    );
};

// TAKEAWAY: two memorable visual rules.
const Ending: React.FC = () => {
    const f = useCurrentFrame();

    return (
        <Shell>
            <div
                style={{
                    position: "absolute",
                    top: 250,
                    left: 65,
                    right: 65,
                    textAlign: "center",
                    opacity: fade(f, 0, 12),
                }}
            >
                <Txt size={22} color={C.cyan} weight={950} style={{ letterSpacing: 3 }}>
                    REMEMBER THIS
                </Txt>

                <div
                    style={{
                        marginTop: 65,
                        padding: 35,
                        borderRadius: 30,
                        background: `${C.orange}12`,
                        border: `2px solid ${C.orange}88`,
                        transform: `translateY(${move(f, 0, 16, 30, 0)}px)`,
                    }}
                >
                    <Txt size={26} color={C.muted}>
                        Need periodic updates?
                    </Txt>
                    <Txt
                        size={64}
                        color={C.orange}
                        weight={950}
                        style={{ marginTop: 18 }}
                    >
                        POLL.
                    </Txt>
                    <div
                        style={{
                            marginTop: 28,
                            display: "flex",
                            justifyContent: "center",
                            gap: 10,
                        }}
                    >
                        {Array.from({ length: 5 }, (_, i) => (
                            <div
                                key={i}
                                style={{
                                    width: 35,
                                    height: 12,
                                    borderRadius: 9,
                                    background: C.orange,
                                    opacity: 0.3 + 0.7 * ((Math.sin(f * 0.2 + i) + 1) / 2),
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        marginTop: 40,
                        padding: 35,
                        borderRadius: 30,
                        background: `${C.mint}12`,
                        border: `2px solid ${C.mint}88`,
                        transform: `translateY(${move(f, 8, 16, 30, 0)}px)`,
                    }}
                >
                    <Txt size={26} color={C.muted}>
                        Need to react to an event?
                    </Txt>
                    <Txt
                        size={64}
                        color={C.mint}
                        weight={950}
                        style={{ marginTop: 18 }}
                    >
                        WEBHOOK.
                    </Txt>
                    <div
                        style={{
                            marginTop: 28,
                            display: "flex",
                            justifyContent: "center",
                            gap: 18,
                        }}
                    >
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 13,
                                    background: `${C.mint}25`,
                                    border: `2px solid ${C.mint}`,
                                    transform: `scale(${pop(f, 30, 12 + i * 5)})`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Txt
                size={20}
                color={C.muted}
                align="center"
                style={{
                    position: "absolute",
                    top: 1330,
                    left: 70,
                    right: 70,
                    opacity: fade(f, 28, 10),
                }}
            >
                Choose the communication pattern that fits your use case.
            </Txt>
        </Shell>
    );
};

// CTA: direct question and channel branding.
const CTA: React.FC = () => {
    const f = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pulse = 1 + Math.sin(f * 0.12) * 0.018;

    return (
        <Shell>
            <div
                style={{
                    position: "absolute",
                    left: 55,
                    right: 55,
                    top: 400,
                    padding: "55px 30px",
                    boxSizing: "border-box",
                    borderRadius: 35,
                    textAlign: "center",
                    background:
                        "linear-gradient(145deg, rgba(27,54,92,.96), rgba(16,27,50,.96))",
                    border: `1px solid ${C.cyan}77`,
                    boxShadow: glow(C.cyan, 24),
                    transform: `scale(${pop(f, fps, 0) * pulse})`,
                }}
            >
                <Txt size={22} color={C.cyan} weight={950} style={{ letterSpacing: 3 }}>
                    QUICK QUESTION
                </Txt>

                <Txt size={54} weight={950} style={{ marginTop: 40 }}>
                    POLLING OR
                </Txt>
                <Txt size={67} color={C.mint} weight={950} style={{ marginTop: 8 }}>
                    WEBHOOKS?
                </Txt>

                <Txt size={22} color={C.muted} style={{ marginTop: 28 }}>
                    Which would you choose in production?
                </Txt>

                <div style={{ marginTop: 45 }}>
                    <div
                        style={{
                            display: "inline-flex",
                            padding: "15px 24px",
                            borderRadius: 999,
                            background: `${C.cyan}20`,
                            border: `1px solid ${C.cyan}88`,
                        }}
                    >
                        <Txt size={19} color={C.cyan} weight={950}>
                            FOLLOW AI HUB INSIDER
                        </Txt>
                    </div>
                </div>

                <Txt
                    size={17}
                    color={C.muted}
                    weight={800}
                    style={{ marginTop: 24, letterSpacing: 2 }}
                >
                    BACKEND ENGINEERING · SYSTEM DESIGN
                </Txt>
            </div>
        </Shell>
    );
};

const SectionVisual: React.FC<{ id: string }> = ({ id }) => {
    switch (id) {
        case "hook":
            return <Hook />;
        case "problem":
            return <Problem />;
        case "polling":
            return <Polling />;
        case "webhooks":
            return <Webhooks />;
        case "comparison":
            return <Comparison />;
        case "use-cases":
            return <UseCases />;
        case "ending":
        case "outro":
            return <Ending />;
        case "cta":
            return <CTA />;
        default:
            return (
                <Shell>
                    <Txt
                        size={28}
                        color={C.red}
                        align="center"
                        style={{ position: "absolute", top: 850, left: 40, right: 40 }}
                    >
                        Unknown section: {id}
                    </Txt>
                </Shell>
            );
    }
};

export const PollingVsWebhooksScene: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
        {TIMELINE.map((section) => (
            <Sequence
                key={section.id}
                from={section.start}
                durationInFrames={section.duration}
                name={section.id}
            >
                <SectionVisual id={section.id} />
                <Audio src={staticFile(section.audio)} />
            </Sequence>
        ))}
    </AbsoluteFill>
);
