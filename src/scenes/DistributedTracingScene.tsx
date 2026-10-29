
import React from "react";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";

import { distributedTracing } from "../../content/distributed-tracing";
import { createTimeline } from "../timeline";

// IMPORTANT: createTimeline returns the sections array.
const { sections: TIMELINE } = createTimeline(distributedTracing);
const C = {
    bg: "#0A1426",
    panel: "#11243B",
    panel2: "#182E49",
    white: "#F4F7FF",
    muted: "#A7BCD2",
    cyan: "#43D9FF",
    blue: "#5795FF",
    purple: "#B39AFF",
    green: "#42E6B0",
    orange: "#FFBF69",
    red: "#FF647C",
    pink: "#FF83C5",
};

const clamp = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
};

const fade = (f: number, delay = 0, duration = 12) =>
    interpolate(f - delay, [0, duration], [0, 1], clamp);

const slideY = (f: number, delay = 0, distance = 35) =>
    interpolate(f - delay, [0, 16], [distance, 0], clamp);

const slideX = (f: number, delay = 0, distance = 45) =>
    interpolate(f - delay, [0, 16], [distance, 0], clamp);

const pop = (f: number, delay = 0) =>
    spring({
        frame: Math.max(0, f - delay),
        fps: 30,
        config: { damping: 15, stiffness: 120, mass: 0.7 },
    });

const Glow: React.FC<{ frame: number; color?: string }> = ({
    frame,
    color = C.cyan,
}) => (
    <AbsoluteFill style={{ overflow: "hidden", background: C.bg }}>
        <div
            style={{
                position: "absolute",
                width: 750,
                height: 750,
                left: -330 + Math.sin(frame / 55) * 40,
                top: 150,
                borderRadius: "50%",
                background: color,
                opacity: 0.14,
                filter: "blur(120px)",
            }}
        />
        <div
            style={{
                position: "absolute",
                width: 650,
                height: 650,
                right: -300,
                bottom: 80 + Math.cos(frame / 45) * 35,
                borderRadius: "50%",
                background: C.purple,
                opacity: 0.15,
                filter: "blur(110px)",
            }}
        />
        <svg
            viewBox="0 0 1080 1920"
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0, opacity: 0.12 }}
        >
            {Array.from({ length: 15 }, (_, i) => (
                <line
                    key={`v${i}`}
                    x1={i * 80}
                    y1="0"
                    x2={i * 80}
                    y2="1920"
                    stroke="#8DB9E7"
                    strokeDasharray="3 16"
                />
            ))}
            {Array.from({ length: 25 }, (_, i) => (
                <line
                    key={`h${i}`}
                    x1="0"
                    y1={i * 80}
                    x2="1080"
                    y2={i * 80}
                    stroke="#8DB9E7"
                    strokeDasharray="3 16"
                />
            ))}
        </svg>
    </AbsoluteFill>
);

const Heading: React.FC<{
    frame: number;
    eyebrow: string;
    title: string;
    subtitle: string;
    accent?: string;
}> = ({ frame, eyebrow, title, subtitle, accent = C.cyan }) => (
    <div
        style={{
            position: "absolute",
            top: 130,
            left: 66,
            right: 66,
            opacity: fade(frame),
            transform: `translateY(${slideY(frame)}px)`,
        }}
    >
        <div
            style={{
                display: "inline-block",
                padding: "10px 18px",
                borderRadius: 999,
                color: accent,
                background: `${accent}18`,
                border: `1px solid ${accent}80`,
                fontSize: 21,
                fontWeight: 900,
                letterSpacing: 2,
            }}
        >
            {eyebrow.toUpperCase()}
        </div>

        <div
            style={{
                marginTop: 25,
                color: C.white,
                fontSize: 62,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1.05,
            }}
        >
            {title}
        </div>

        <div
            style={{
                marginTop: 22,
                color: C.muted,
                fontSize: 27,
                lineHeight: 1.4,
            }}
        >
            {subtitle}
        </div>
    </div>
);

const Service: React.FC<{
    x: number;
    y: number;
    title: string;
    subtitle: string;
    color: string;
    frame: number;
    delay?: number;
    error?: boolean;
    width?: number;
}> = ({
    x,
    y,
    title,
    subtitle,
    color,
    frame,
    delay = 0,
    error = false,
    width = 245,
}) => {
        const scale = pop(frame, delay);
        const opacity = fade(frame, delay);

        return (
            <g
                opacity={opacity}
                transform={`translate(${x} ${y}) scale(${scale})`}
            >
                <rect
                    x={-width / 2 - 7}
                    y="-63"
                    width={width + 14}
                    height="135"
                    rx="25"
                    fill={color}
                    opacity="0.10"
                />
                <rect
                    x={-width / 2}
                    y="-56"
                    width={width}
                    height="122"
                    rx="20"
                    fill={error ? "#321F35" : C.panel}
                    stroke={error ? C.red : color}
                    strokeWidth="2.5"
                />

                <rect
                    x={-width / 2 + 17}
                    y="-37"
                    width="36"
                    height="34"
                    rx="9"
                    fill={color}
                    opacity="0.2"
                />
                <path
                    d={`M ${-width / 2 + 26} -26 h18 M ${-width / 2 + 26} -17 h18`}
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                <text
                    x="0"
                    y="16"
                    fill={C.white}
                    fontSize="23"
                    fontWeight="800"
                    textAnchor="middle"
                >
                    {title}
                </text>

                <text
                    x="0"
                    y="43"
                    fill={error ? C.red : C.muted}
                    fontSize="16"
                    fontWeight="600"
                    textAnchor="middle"
                >
                    {subtitle}
                </text>

                {error && (
                    <g>
                        <circle cx={width / 2 - 5} cy="-50" r="16" fill={C.red} />
                        <text
                            x={width / 2 - 5}
                            y="-44"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize="21"
                            fontWeight="900"
                        >
                            !
                        </text>
                    </g>
                )}
            </g>
        );
    };

const Connection: React.FC<{
    d: string;
    frame: number;
    color?: string;
    delay?: number;
}> = ({ d, frame, color = C.cyan, delay = 0 }) => (
    <g opacity={fade(frame, delay)}>
        <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth="12"
            opacity="0.10"
        />
        <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="9 12"
            strokeDashoffset={-frame * 2.5}
        />
    </g>
);

const Packet: React.FC<{
    frame: number;
    start: number;
    end: number;
    y: number;
    color: string;
}> = ({ frame, start, end, y, color }) => {
    const x = interpolate(frame, [0, 60], [start, end], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <g>
            <circle cx={x} cy={y} r="15" fill={color} opacity="0.15" />
            <circle cx={x} cy={y} r="7" fill={color} />
        </g>
    );
};

const Tag: React.FC<{
    frame: number;
    x: number;
    y: number;
    width: number;
    text: string;
    color: string;
    delay?: number;
}> = ({ frame, x, y, width, text, color, delay = 0 }) => (
    <g opacity={fade(frame, delay)}>
        <rect
            x={x}
            y={y}
            width={width}
            height="54"
            rx="16"
            fill={color}
            fillOpacity="0.12"
            stroke={color}
            strokeOpacity="0.85"
            strokeWidth="1.5"
        />
        <text
            x={x + width / 2}
            y={y + 34}
            textAnchor="middle"
            fill={C.white}
            fontSize="20"
            fontWeight="800"
        >
            {text}
        </text>
    </g>
);

// -----------------------------------------------------
// 1. HOOK — follow a failing request
// -----------------------------------------------------

const Hook: React.FC<{ frame: number }> = ({ frame }) => (
    <>
        <Heading
            frame={frame}
            eyebrow="Production incident"
            title="Where did the request fail?"
            subtitle="One user request. Multiple services. One hidden bottleneck."
            accent={C.orange}
        />

        <svg
            viewBox="0 0 1080 1000"
            width="100%"
            style={{ position: "absolute", top: 590 }}
        >
            <Connection
                frame={frame}
                d="M540 140 V230 H260 V340 M540 230 H820 V340"
                color={C.cyan}
            />
            <Connection
                frame={frame}
                d="M260 455 V555 H540 V680 M820 455 V555 H540"
                color={C.blue}
                delay={4}
            />

            <Service
                x={540}
                y={140}
                title="API Gateway"
                subtitle="incoming request"
                color={C.orange}
                frame={frame}
                width={300}
            />
            <Service
                x={260}
                y={340}
                title="Order Service"
                subtitle="creates order"
                color={C.blue}
                frame={frame}
                delay={5}
            />
            <Service
                x={820}
                y={340}
                title="Inventory"
                subtitle="checks stock"
                color={C.green}
                frame={frame}
                delay={9}
            />
            <Service
                x={540}
                y={680}
                title="Payment Service"
                subtitle="request timed out"
                color={C.red}
                frame={frame}
                delay={14}
                error
                width={310}
            />

            <Packet
                frame={frame % 60}
                start={540}
                end={260}
                y={230}
                color={C.orange}
            />

            <Tag
                frame={frame}
                x={110}
                y={825}
                width={860}
                text="Logs alone may not reveal the entire journey"
                color={C.orange}
                delay={18}
            />
        </svg>
    </>
);

// -----------------------------------------------------
// 2. CORRELATION ID — link logs across services
// -----------------------------------------------------

const Correlation: React.FC<{ frame: number }> = ({ frame }) => (
    <>
        <Heading
            frame={frame}
            eyebrow="Step 01"
            title="Connect logs with one ID"
            subtitle="Propagate a correlation ID through every service."
        />

        <svg
            viewBox="0 0 1080 1030"
            width="100%"
            style={{ position: "absolute", top: 590 }}
        >
            <Connection
                frame={frame}
                d="M540 145 V250 H205 V360 M540 250 V360 M540 250 H875 V360"
            />

            <Service
                x={540}
                y={145}
                title="API Gateway"
                subtitle="sets request context"
                color={C.cyan}
                frame={frame}
                width={300}
            />
            <Service
                x={205}
                y={360}
                title="Orders"
                subtitle="structured log"
                color={C.blue}
                frame={frame}
                delay={4}
                width={205}
            />
            <Service
                x={540}
                y={360}
                title="Inventory"
                subtitle="structured log"
                color={C.green}
                frame={frame}
                delay={8}
                width={205}
            />
            <Service
                x={875}
                y={360}
                title="Payments"
                subtitle="structured log"
                color={C.purple}
                frame={frame}
                delay={12}
                width={205}
            />

            <Tag
                frame={frame}
                x={95}
                y={485}
                width={890}
                text="X-Correlation-ID: req_7f3a91"
                color={C.cyan}
                delay={16}
            />

            {[C.blue, C.green, C.purple].map((color, i) => (
                <g key={color} opacity={fade(frame, 20 + i * 4)}>
                    <rect
                        x={75 + i * 310}
                        y="605"
                        width="310"
                        height="135"
                        rx="18"
                        fill={C.panel}
                        stroke={color}
                        strokeWidth="2"
                    />
                    <circle
                        cx={105 + i * 310}
                        cy="638"
                        r="7"
                        fill={color}
                    />
                    <text
                        x={230 + i * 310}
                        y="645"
                        fill={C.muted}
                        fontSize="18"
                        textAnchor="middle"
                    >
                        SERVICE LOG
                    </text>
                    <text
                        x={230 + i * 310}
                        y="690"
                        fill={C.white}
                        fontSize="19"
                        fontWeight="800"
                        textAnchor="middle"
                    >
                        req_7f3a91
                    </text>
                    <text
                        x={230 + i * 310}
                        y="718"
                        fill={color}
                        fontSize="17"
                        textAnchor="middle"
                    >
                        searchable
                    </text>
                </g>
            ))}

            <text
                x="540"
                y="835"
                fill={C.green}
                fontSize="26"
                fontWeight="900"
                textAnchor="middle"
            >
                One ID → related log entries
            </text>
        </svg>
    </>
);

// -----------------------------------------------------
// 3. TRACE ID — full request hierarchy
// -----------------------------------------------------

const Trace: React.FC<{ frame: number }> = ({ frame }) => {
    const spans = [
        { name: "API Gateway", time: "12 ms", color: C.cyan, x: 125, w: 820 },
        { name: "Order Service", time: "34 ms", color: C.blue, x: 180, w: 690 },
        { name: "Inventory", time: "18 ms", color: C.green, x: 245, w: 560 },
        { name: "Payment Service", time: "TIMEOUT", color: C.red, x: 310, w: 470 },
    ];

    return (
        <>
            <Heading
                frame={frame}
                eyebrow="Step 02"
                title="Trace ID vs. Span ID"
                subtitle="The trace is the journey. Spans represent individual operations."
                accent={C.purple}
            />

            <svg
                viewBox="0 0 1080 1080"
                width="100%"
                style={{ position: "absolute", top: 570 }}
            >
                <rect
                    x="65"
                    y="35"
                    width="950"
                    height="900"
                    rx="32"
                    fill="#0B192B"
                    stroke={C.purple}
                    strokeOpacity="0.7"
                    strokeWidth="2"
                />

                <rect
                    x="105"
                    y="75"
                    width="870"
                    height="120"
                    rx="22"
                    fill="#29214B"
                    stroke={C.purple}
                    strokeWidth="2"
                />

                <text
                    x="140"
                    y="115"
                    fill={C.purple}
                    fontSize="20"
                    fontWeight="900"
                >
                    TRACE ID
                </text>
                <text
                    x="140"
                    y="160"
                    fill={C.white}
                    fontSize="29"
                    fontWeight="900"
                >
                    trace_8ac21
                </text>
                <text
                    x="940"
                    y="145"
                    fill={C.muted}
                    fontSize="19"
                    textAnchor="end"
                >
                    end-to-end request
                </text>

                {spans.map((span, i) => {
                    const progress = interpolate(
                        frame - i * 5,
                        [0, 24],
                        [0, span.w],
                        clamp
                    );

                    return (
                        <g key={span.name} opacity={fade(frame, i * 5)}>
                            <rect
                                x={span.x}
                                y={250 + i * 145}
                                width={span.w}
                                height="88"
                                rx="18"
                                fill={span.color}
                                fillOpacity="0.12"
                                stroke={span.color}
                                strokeWidth="2"
                            />
                            <rect
                                x={span.x}
                                y={250 + i * 145}
                                width={progress}
                                height="88"
                                rx="18"
                                fill={span.color}
                                fillOpacity="0.10"
                            />
                            <text
                                x={span.x + 22}
                                y={284 + i * 145}
                                fill={C.white}
                                fontSize="22"
                                fontWeight="800"
                            >
                                {span.name}
                            </text>
                            <text
                                x={span.x + span.w - 20}
                                y={316 + i * 145}
                                fill={span.color}
                                fontSize="20"
                                fontWeight="900"
                                textAnchor="end"
                            >
                                {span.time}
                            </text>
                        </g>
                    );
                })}

                <text
                    x="540"
                    y="890"
                    textAnchor="middle"
                    fill={C.purple}
                    fontSize="25"
                    fontWeight="900"
                >
                    Shared Trace ID • Unique Span IDs
                </text>
            </svg>
        </>
    );
};

// -----------------------------------------------------
// 4. SPAN WATERFALL — pinpoint the slow service
// -----------------------------------------------------

const Waterfall: React.FC<{ frame: number }> = ({ frame }) => {
    const rows = [
        { name: "API Gateway", y: 190, start: 0, width: 650, color: C.cyan },
        { name: "Order Service", y: 325, start: 55, width: 420, color: C.blue },
        { name: "Inventory", y: 460, start: 110, width: 240, color: C.green },
        { name: "Payment Service", y: 595, start: 140, width: 510, color: C.red },
        { name: "Database", y: 730, start: 190, width: 165, color: C.purple },
    ];

    return (
        <>
            <Heading
                frame={frame}
                eyebrow="Find the bottleneck"
                title="Read the trace waterfall"
                subtitle="Compare span durations to identify the slow operation."
                accent={C.red}
            />

            <svg
                viewBox="0 0 1080 1100"
                width="100%"
                style={{ position: "absolute", top: 560 }}
            >
                <rect
                    x="55"
                    y="35"
                    width="970"
                    height="875"
                    rx="28"
                    fill="#0B192B"
                    stroke="#304B67"
                    strokeWidth="2"
                />

                {Array.from({ length: 8 }, (_, i) => (
                    <g key={i}>
                        <line
                            x1={300 + i * 90}
                            y1="115"
                            x2={300 + i * 90}
                            y2="830"
                            stroke="#54708C"
                            strokeDasharray="5 10"
                            opacity="0.55"
                        />
                        <text
                            x={300 + i * 90}
                            y="100"
                            textAnchor="middle"
                            fill={C.muted}
                            fontSize="17"
                        >
                            {i * 50}ms
                        </text>
                    </g>
                ))}

                {rows.map((r, i) => {
                    const w = interpolate(
                        frame - i * 4,
                        [0, 25],
                        [0, r.width],
                        clamp
                    );

                    return (
                        <g key={r.name} opacity={fade(frame, i * 4)}>
                            <text
                                x="85"
                                y={r.y + 28}
                                fill={C.white}
                                fontSize="20"
                                fontWeight="800"
                            >
                                {r.name}
                            </text>
                            <rect
                                x={300 + r.start}
                                y={r.y}
                                width={w}
                                height="48"
                                rx="10"
                                fill={r.color}
                                fillOpacity="0.9"
                            />
                            {i === 3 && w > 250 && (
                                <text
                                    x={300 + r.start + w - 12}
                                    y={r.y + 31}
                                    textAnchor="end"
                                    fill="#FFFFFF"
                                    fontSize="18"
                                    fontWeight="900"
                                >
                                    TIMEOUT
                                </text>
                            )}
                        </g>
                    );
                })}

                <g opacity={fade(frame, 20)}>
                    <path
                        d="M780 570 L825 525 L870 570 L825 615 Z"
                        fill={C.red}
                    />
                    <text
                        x="540"
                        y="970"
                        textAnchor="middle"
                        fill={C.red}
                        fontSize="26"
                        fontWeight="900"
                    >
                        Investigate the slow span first
                    </text>
                </g>
            </svg>
        </>
    );
};

// -----------------------------------------------------
// 5. COMPARISON — clarify each identifier
// -----------------------------------------------------

const Comparison: React.FC<{ frame: number }> = ({ frame }) => {
    const items = [
        {
            title: "Correlation ID",
            desc: "Connect related log entries",
            example: "req_7f3a91",
            color: C.cyan,
        },
        {
            title: "Trace ID",
            desc: "Identify the whole request journey",
            example: "trace_8ac21",
            color: C.purple,
        },
        {
            title: "Span ID",
            desc: "Identify one operation within a trace",
            example: "span_04bd",
            color: C.green,
        },
    ];

    return (
        <>
            <Heading
                frame={frame}
                eyebrow="Quick recap"
                title="Three IDs. Three jobs."
                subtitle="Know which identifier helps answer your debugging question."
                accent={C.orange}
            />

            <div
                style={{
                    position: "absolute",
                    top: 630,
                    left: 65,
                    right: 65,
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                }}
            >
                {items.map((item, i) => (
                    <div
                        key={item.title}
                        style={{
                            opacity: fade(frame, i * 7),
                            transform: `translateX(${slideX(frame, i * 7)}px)`,
                            padding: 25,
                            borderRadius: 24,
                            background: `linear-gradient(105deg, ${C.panel}, #101A2C)`,
                            border: `1px solid ${item.color}90`,
                            boxShadow: `0 12px 35px ${item.color}12`,
                        }}
                    >
                        <div
                            style={{
                                color: item.color,
                                fontSize: 27,
                                fontWeight: 900,
                            }}
                        >
                            {item.title}
                        </div>
                        <div
                            style={{
                                marginTop: 12,
                                color: C.white,
                                fontSize: 23,
                                fontWeight: 700,
                            }}
                        >
                            {item.desc}
                        </div>
                        <div
                            style={{
                                marginTop: 12,
                                color: item.color,
                                fontSize: 21,
                                fontFamily: "monospace",
                            }}
                        >
                            {item.example}
                        </div>
                    </div>
                ))}

                <div
                    style={{
                        opacity: fade(frame, 25),
                        padding: 24,
                        textAlign: "center",
                        borderRadius: 22,
                        border: `1px solid ${C.orange}`,
                        background: "#292136",
                        color: C.white,
                        fontSize: 24,
                        fontWeight: 800,
                    }}
                >
                    Logs show events. Traces reveal the journey.
                </div>
            </div>
        </>
    );
};

// -----------------------------------------------------
// 6. ENDING — production debugging workflow
// -----------------------------------------------------

const Ending: React.FC<{ frame: number }> = ({ frame }) => {
    const steps = [
        { x: 180, y: 230, title: "Propagate", color: C.cyan },
        { x: 540, y: 390, title: "Instrument", color: C.purple },
        { x: 900, y: 550, title: "Investigate", color: C.green },
    ];

    return (
        <>
            <Heading
                frame={frame}
                eyebrow="Production debugging"
                title="Make every request traceable"
                subtitle="Propagate context. Instrument services. Inspect slow spans."
                accent={C.green}
            />

            <svg
                viewBox="0 0 1080 1050"
                width="100%"
                style={{ position: "absolute", top: 600 }}
            >
                <Connection
                    frame={frame}
                    d="M180 230 L360 310 L540 390 L720 470 L900 550"
                    color={C.green}
                />

                {steps.map((step, i) => (
                    <g key={step.title} opacity={fade(frame, i * 7)}>
                        <circle
                            cx={step.x}
                            cy={step.y}
                            r="78"
                            fill={step.color}
                            fillOpacity="0.12"
                        />
                        <circle
                            cx={step.x}
                            cy={step.y}
                            r="53"
                            fill={C.panel}
                            stroke={step.color}
                            strokeWidth="4"
                        />
                        <path
                            d={`M ${step.x - 19} ${step.y} l13 14 l27 -30`}
                            fill="none"
                            stroke={step.color}
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <text
                            x={step.x}
                            y={step.y + 105}
                            textAnchor="middle"
                            fill={C.white}
                            fontSize="23"
                            fontWeight="900"
                        >
                            {step.title}
                        </text>
                    </g>
                ))}

                <rect
                    x="140"
                    y="755"
                    width="800"
                    height="90"
                    rx="24"
                    fill="#102B34"
                    stroke={C.green}
                    strokeWidth="2"
                />
                <text
                    x="540"
                    y="810"
                    textAnchor="middle"
                    fill={C.green}
                    fontSize="28"
                    fontWeight="900"
                >
                    Replace guesswork with evidence
                </text>
            </svg>
        </>
    );
};

// -----------------------------------------------------
// 7. CTA — AI Hub Insider
// -----------------------------------------------------

const CTA: React.FC<{ frame: number }> = ({ frame }) => (
    <>
        <div
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: 65,
            }}
        >
            <div
                style={{
                    width: 230,
                    height: 230,
                    borderRadius: 65,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #163C55, #30245A)",
                    border: `2px solid ${C.cyan}`,
                    boxShadow: `0 0 85px ${C.cyan}30`,
                    transform: `scale(${0.96 + Math.sin(frame / 8) * 0.025})`,
                    opacity: fade(frame),
                }}
            >
                <svg viewBox="0 0 160 160" width="150">
                    <path
                        d="M80 20 L130 50 V110 L80 140 L30 110 V50 Z"
                        fill="none"
                        stroke={C.cyan}
                        strokeWidth="5"
                    />
                    <circle cx="80" cy="80" r="17" fill={C.purple} />
                    <path
                        d="M80 63 V40 M95 87 L120 102 M65 87 L43 102"
                        stroke={C.green}
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div
                style={{
                    marginTop: 52,
                    color: C.white,
                    fontSize: 61,
                    fontWeight: 900,
                    lineHeight: 1.08,
                    opacity: fade(frame, 5),
                }}
            >
                Debug systems
                <br />
                with evidence.
            </div>

            <div
                style={{
                    marginTop: 28,
                    color: C.muted,
                    fontSize: 28,
                    lineHeight: 1.4,
                    opacity: fade(frame, 10),
                }}
            >
                Follow AI Hub Insider
                <br />
                for more backend &amp; system design.
            </div>

            <div
                style={{
                    marginTop: 42,
                    padding: "17px 30px",
                    borderRadius: 999,
                    background: `${C.cyan}18`,
                    border: `1px solid ${C.cyan}`,
                    color: C.cyan,
                    fontSize: 24,
                    fontWeight: 900,
                    opacity: fade(frame, 15),
                }}
            >
                SAVE • FOLLOW • BUILD
            </div>
        </div>
    </>
);

// -----------------------------------------------------
// Section router — never leave a section visually empty
// -----------------------------------------------------

const VisualForSection: React.FC<{ id: string }> = ({ id }) => {
    const frame = useCurrentFrame();

    let accent = C.cyan;
    if (id === "hook") accent = C.orange;
    if (id === "trace-id") accent = C.purple;
    if (id === "span-id") accent = C.red;
    if (id === "comparison") accent = C.orange;
    if (id === "ending") accent = C.green;
    if (id === "cta") accent = C.purple;

    let visual: React.ReactNode;

    switch (id) {
        case "hook":
            visual = <Hook frame={frame} />;
            break;

        case "correlation-id":
            visual = <Correlation frame={frame} />;
            break;

        case "trace-id":
            visual = <Trace frame={frame} />;
            break;

        case "span-id":
            visual = <Waterfall frame={frame} />;
            break;

        case "comparison":
            visual = <Comparison frame={frame} />;
            break;

        case "ending":
            visual = <Ending frame={frame} />;
            break;

        case "cta":
            visual = <CTA frame={frame} />;
            break;

        default:
            // A visible fallback for any unexpected section ID.
            visual = <Hook frame={frame} />;
            break;
    }

    return (
        <AbsoluteFill
            style={{
                overflow: "hidden",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Arial, sans-serif",
                color: C.white,
            }}
        >
            {id !== "cta" && <Glow frame={frame} color={accent} />}
            {visual}
        </AbsoluteFill>
    );
};

// -----------------------------------------------------
// Main Remotion scene
// -----------------------------------------------------

export const DistributedTracingScene: React.FC = () => {
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            {TIMELINE.map((section) => (
                <Sequence
                    key={section.id}
                    from={section.start}
                    durationInFrames={section.duration}
                    name={section.id}
                >
                    <VisualForSection id={section.id} />

                    <Audio
                        src={staticFile(
                            String(section.audio).replace(/^public\//, "")
                        )}
                        startFrom={0}
                    />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};

export default DistributedTracingScene;
