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

import { createTimeline } from "../timeline";
import { urlRequest } from "../../content/url-request";

const timeline = createTimeline(urlRequest);

const getAudioPath = (path: string) => {
    return path.replace(/^\/?public\//, "");
};

const fade = (frame: number, start: number, end: number) =>
    interpolate(frame, [start, end], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.ease),
    });

const slideUp = (frame: number, start: number, end: number) =>
    interpolate(frame, [start, end], [40, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.ease),
    });

const Node = ({
    x,
    y,
    title,
    subtitle,
    active = false,
}: {
    x: number;
    y: number;
    title: string;
    subtitle?: string;
    active?: boolean;
}) => {
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                width: 270,
                padding: "28px 24px",
                borderRadius: 24,
                background: active ? "#ffffff" : "#171717",
                border: `3px solid ${active ? "#ffffff" : "#444"}`,
                color: active ? "#111" : "#fff",
                textAlign: "center",
                boxShadow: active
                    ? "0 0 35px rgba(255,255,255,0.25)"
                    : "none",
            }}
        >
            <div
                style={{
                    fontSize: 30,
                    fontWeight: 700,
                }}
            >
                {title}
            </div>

            {subtitle && (
                <div
                    style={{
                        marginTop: 10,
                        fontSize: 20,
                        opacity: 0.65,
                    }}
                >
                    {subtitle}
                </div>
            )}
        </div>
    );
};

const Arrow = ({
    x1,
    y1,
    x2,
    y2,
    opacity = 1,
}: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    opacity?: number;
}) => {
    const length = Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
    );

    const angle =
        Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    return (
        <div
            style={{
                position: "absolute",
                left: x1,
                top: y1,
                width: length,
                height: 4,
                background: "#666",
                opacity,
                transformOrigin: "left center",
                transform: `rotate(${angle}deg)`,
            }}
        />
    );
};

const Packet = ({
    progress,
    x1,
    y1,
    x2,
    y2,
}: {
    progress: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}) => {
    const x = interpolate(progress, [0, 1], [x1, x2]);
    const y = interpolate(progress, [0, 1], [y1, y2]);

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#fff",
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 25px rgba(255,255,255,0.7)",
            }}
        />
    );
};

const Title = ({
    frame,
    start,
    title,
    subtitle,
}: {
    frame: number;
    start: number;
    title: string;
    subtitle: string;
}) => {
    return (
        <div
            style={{
                position: "absolute",
                top: 220,
                width: "100%",
                textAlign: "center",
                opacity: fade(frame, start, start + 20),
                transform: `translateY(${slideUp(
                    frame,
                    start,
                    start + 20
                )}px)`,
            }}
        >
            <div
                style={{
                    fontSize: 50,
                    fontWeight: 800,
                }}
            >
                {title}
            </div>

            <div
                style={{
                    marginTop: 20,
                    fontSize: 28,
                    opacity: 0.55,
                }}
            >
                {subtitle}
            </div>
        </div>
    );
};

export const URLRequestScene: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill
            style={{
                background: "#080808",
                color: "#fff",
                fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                overflow: "hidden",
            }}
        >
            {/* ================= AUDIO ================= */}

            {timeline.sections.map((section) => (
                <Sequence
                    key={section.id}
                    from={section.start}
                    durationInFrames={section.duration}
                >
                    <Audio
                        src={staticFile(
                            getAudioPath(section.audio)
                        )}
                    />
                </Sequence>
            ))}

            {/* ================= HOOK ================= */}

            {frame < 180 && (
                <AbsoluteFill
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        padding: 80,
                    }}
                >
                    <div
                        style={{
                            opacity: fade(frame, 10, 35),
                            transform: `translateY(${slideUp(
                                frame,
                                10,
                                35
                            )}px)`,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 42,
                                opacity: 0.65,
                                marginBottom: 25,
                            }}
                        >
                            What happens when you type
                        </div>

                        <div
                            style={{
                                fontSize: 64,
                                fontWeight: 800,
                            }}
                        >
                            google.com
                        </div>

                        <div
                            style={{
                                marginTop: 40,
                                fontSize: 32,
                                opacity: fade(frame, 45, 70),
                            }}
                        >
                            and hit Enter?
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {/* ================= DNS ================= */}

            {frame >= 150 && frame < 390 && (
                <AbsoluteFill>
                    <Title
                        frame={frame}
                        start={155}
                        title="1. DNS"
                        subtitle="Find the server's IP address"
                    />

                    <Node
                        x={540}
                        y={650}
                        title="Browser"
                        subtitle="google.com"
                    />

                    <Node
                        x={540}
                        y={1050}
                        title="DNS"
                        subtitle="Domain → IP"
                        active
                    />

                    <Arrow
                        x1={540}
                        y1={790}
                        x2={540}
                        y2={910}
                    />

                    <Packet
                        progress={interpolate(
                            frame,
                            [190, 260],
                            [0, 1],
                            {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                            }
                        )}
                        x1={540}
                        y1={790}
                        x2={540}
                        y2={910}
                    />

                    <div
                        style={{
                            position: "absolute",
                            top: 1210,
                            width: "100%",
                            textAlign: "center",
                            fontSize: 30,
                            opacity: fade(frame, 270, 300),
                        }}
                    >
                        142.250.x.x
                    </div>
                </AbsoluteFill>
            )}

            {/* ================= TCP ================= */}

            {frame >= 360 && frame < 600 && (
                <AbsoluteFill>
                    <Title
                        frame={frame}
                        start={365}
                        title="2. TCP Connection"
                        subtitle="Establish a reliable connection"
                    />

                    <Node
                        x={300}
                        y={800}
                        title="Browser"
                    />

                    <Node
                        x={780}
                        y={800}
                        title="Server"
                    />

                    <Arrow
                        x1={440}
                        y1={770}
                        x2={640}
                        y2={770}
                    />

                    <Arrow
                        x1={640}
                        y1={830}
                        x2={440}
                        y2={830}
                    />

                    <div
                        style={{
                            position: "absolute",
                            top: 735,
                            left: 0,
                            width: "100%",
                            textAlign: "center",
                            fontSize: 24,
                            opacity: 0.7,
                        }}
                    >
                        SYN
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 850,
                            left: 0,
                            width: "100%",
                            textAlign: "center",
                            fontSize: 24,
                            opacity: 0.7,
                        }}
                    >
                        SYN-ACK
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 920,
                            left: 0,
                            width: "100%",
                            textAlign: "center",
                            fontSize: 26,
                        }}
                    >
                        ACK ✓
                    </div>
                </AbsoluteFill>
            )}

            {/* ================= TLS ================= */}

            {frame >= 570 && frame < 810 && (
                <AbsoluteFill>
                    <Title
                        frame={frame}
                        start={575}
                        title="3. TLS"
                        subtitle="Secure the connection"
                    />

                    <div
                        style={{
                            position: "absolute",
                            left: 540,
                            top: 800,
                            transform: "translate(-50%, -50%)",
                            fontSize: 100,
                        }}
                    >
                        🔒
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 980,
                            width: "100%",
                            textAlign: "center",
                            fontSize: 34,
                            fontWeight: 700,
                        }}
                    >
                        HTTPS
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 1040,
                            width: "100%",
                            textAlign: "center",
                            fontSize: 25,
                            opacity: 0.6,
                        }}
                    >
                        Encrypted communication
                    </div>
                </AbsoluteFill>
            )}

            {/* ================= HTTP ================= */}

            {frame >= 780 && frame < 1050 && (
                <AbsoluteFill>
                    <Title
                        frame={frame}
                        start={785}
                        title="4. HTTP Request"
                        subtitle="The browser sends a request"
                    />

                    <Node
                        x={280}
                        y={800}
                        title="Browser"
                    />

                    <Node
                        x={800}
                        y={800}
                        title="Server"
                    />

                    <Arrow
                        x1={420}
                        y1={800}
                        x2={660}
                        y2={800}
                    />

                    <div
                        style={{
                            position: "absolute",
                            left: 540,
                            top: 690,
                            transform: "translateX(-50%)",
                            fontFamily: "monospace",
                            fontSize: 34,
                            fontWeight: 700,
                        }}
                    >
                        GET /
                    </div>

                    <Packet
                        progress={interpolate(
                            frame,
                            [850, 940],
                            [0, 1],
                            {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                            }
                        )}
                        x1={420}
                        y1={800}
                        x2={660}
                        y2={800}
                    />
                </AbsoluteFill>
            )}

            {/* ================= LOAD BALANCER ================= */}

            {frame >= 1020 && frame < 1290 && (
                <AbsoluteFill>
                    <Title
                        frame={frame}
                        start={1025}
                        title="5. Load Balancer"
                        subtitle="Route the request"
                    />

                    <Node
                        x={540}
                        y={600}
                        title="Load Balancer"
                        active
                    />

                    <Node
                        x={250}
                        y={1050}
                        title="API Server 1"
                    />

                    <Node
                        x={540}
                        y={1050}
                        title="API Server 2"
                    />

                    <Node
                        x={830}
                        y={1050}
                        title="API Server 3"
                    />

                    <Arrow
                        x1={540}
                        y1={700}
                        x2={250}
                        y2={900}
                    />

                    <Arrow
                        x1={540}
                        y1={700}
                        x2={540}
                        y2={900}
                    />

                    <Arrow
                        x1={540}
                        y1={700}
                        x2={830}
                        y2={900}
                    />

                    <Packet
                        progress={interpolate(
                            frame,
                            [1090, 1170],
                            [0, 1],
                            {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                            }
                        )}
                        x1={540}
                        y1={700}
                        x2={540}
                        y2={900}
                    />
                </AbsoluteFill>
            )}

            {/* ================= CACHE / DB ================= */}

            {frame >= 1260 && frame < 1560 && (
                <AbsoluteFill>
                    <Title
                        frame={frame}
                        start={1265}
                        title="6. Cache & Database"
                        subtitle="The backend fetches the data"
                    />

                    <Node
                        x={540}
                        y={600}
                        title="API Server"
                    />

                    <Node
                        x={300}
                        y={1050}
                        title="Redis"
                        subtitle="Fast cache"
                        active
                    />

                    <Node
                        x={780}
                        y={1050}
                        title="PostgreSQL"
                        subtitle="Persistent data"
                    />

                    <Arrow
                        x1={500}
                        y1={700}
                        x2={330}
                        y2={900}
                    />

                    <Arrow
                        x1={580}
                        y1={700}
                        x2={750}
                        y2={900}
                    />
                </AbsoluteFill>
            )}

            {/* ================= RESPONSE ================= */}

            {frame >= 1530 && frame < 1800 && (
                <AbsoluteFill>
                    <Title
                        frame={frame}
                        start={1535}
                        title="7. The Response"
                        subtitle="The data travels back"
                    />

                    <Node
                        x={540}
                        y={600}
                        title="Server"
                    />

                    <Node
                        x={540}
                        y={1100}
                        title="Browser"
                        subtitle="✨ Website"
                        active
                    />

                    <Arrow
                        x1={540}
                        y1={700}
                        x2={540}
                        y2={1000}
                    />

                    <Packet
                        progress={interpolate(
                            frame,
                            [1600, 1690],
                            [0, 1],
                            {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                            }
                        )}
                        x1={540}
                        y1={700}
                        x2={540}
                        y2={1000}
                    />

                    <div
                        style={{
                            position: "absolute",
                            bottom: 250,
                            width: "100%",
                            textAlign: "center",
                            fontSize: 46,
                            fontWeight: 800,
                            opacity: fade(frame, 1700, 1740),
                        }}
                    >
                        One click.
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            bottom: 180,
                            width: "100%",
                            textAlign: "center",
                            fontSize: 36,
                            opacity: fade(frame, 1740, 1770),
                        }}
                    >
                        Dozens of operations.
                    </div>
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};