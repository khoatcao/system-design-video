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

const FPS = 30;

const getAudioPath = (path: string) => {
    return path.replace(/^\/?public\//, "");
};

const fade = (
    frame: number,
    start: number,
    end: number,
    from = 0,
    to = 1
) =>
    interpolate(frame, [start, end], [from, to], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.ease),
    });

/* =========================================================
   HELPERS
========================================================= */

type NodeProps = {
    x: number;
    y: number;
    title: string;
    subtitle?: string;
    active?: boolean;
    small?: boolean;
};

const Node = ({
    x,
    y,
    title,
    subtitle,
    active = false,
    small = false,
}: NodeProps) => {
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",

                width: small ? 180 : 270,
                minHeight: small ? 80 : 110,

                padding: small ? "16px 12px" : "22px 18px",

                borderRadius: 20,

                background: active
                    ? "rgba(255,255,255,0.96)"
                    : "rgba(23,23,23,0.95)",

                border: `3px solid ${active ? "#ffffff" : "rgba(255,255,255,0.18)"
                    }`,

                color: active ? "#111" : "#fff",

                textAlign: "center",

                boxShadow: active
                    ? "0 0 40px rgba(255,255,255,0.35)"
                    : "0 10px 30px rgba(0,0,0,0.25)",

                zIndex: 3,
            }}
        >
            <div
                style={{
                    fontSize: small ? 23 : 30,
                    fontWeight: 800,
                    lineHeight: 1.1,
                }}
            >
                {title}
            </div>

            {subtitle && (
                <div
                    style={{
                        marginTop: 8,
                        fontSize: small ? 16 : 19,
                        opacity: active ? 0.65 : 0.5,
                    }}
                >
                    {subtitle}
                </div>
            )}
        </div>
    );
};

type ArrowProps = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    active?: boolean;
};

const Arrow = ({
    x1,
    y1,
    x2,
    y2,
    active = false,
}: ArrowProps) => {
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
                height: active ? 6 : 4,

                background: active ? "#ffffff" : "#444",

                opacity: active ? 0.9 : 0.55,

                transformOrigin: "left center",

                transform: `rotate(${angle}deg)`,

                boxShadow: active
                    ? "0 0 12px rgba(255,255,255,0.6)"
                    : "none",

                zIndex: 1,
            }}
        />
    );
};

type PacketProps = {
    progress: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

const Packet = ({
    progress,
    x1,
    y1,
    x2,
    y2,
}: PacketProps) => {
    const x = interpolate(progress, [0, 1], [x1, x2]);
    const y = interpolate(progress, [0, 1], [y1, y2]);

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,

                width: 26,
                height: 26,

                borderRadius: "50%",

                background: "#ffffff",

                transform: "translate(-50%, -50%)",

                boxShadow:
                    "0 0 12px #ffffff, 0 0 35px rgba(255,255,255,0.7)",

                zIndex: 10,
            }}
        />
    );
};

/* =========================================================
   TIMELINE
========================================================= */

const getSection = (index: number) => {
    return timeline.sections[index];
};

const hookSection = getSection(0);
const dnsSection = getSection(1);
const tcpSection = getSection(2);
const tlsSection = getSection(3);
const httpSection = getSection(4);
const loadBalancerSection = getSection(5);
const cacheSection = getSection(6);
const responseSection = getSection(7);

/* =========================================================
   MAIN SCENE
========================================================= */

export const URLRequestScene: React.FC = () => {
    const frame = useCurrentFrame();

    /*
     * Keep your existing audio timeline.
     */
    const sections = timeline.sections;

    /*
     * Hook ends when DNS starts.
     */
    const architectureStart = dnsSection?.start ?? 150;

    /*
     * Determine which section is currently playing.
     */
    const isInSection = (section: any) => {
        if (!section) return false;

        return (
            frame >= section.start &&
            frame < section.start + section.duration
        );
    };

    const dnsActive = isInSection(dnsSection);
    const tcpActive = isInSection(tcpSection);
    const tlsActive = isInSection(tlsSection);
    const httpActive = isInSection(httpSection);
    const loadBalancerActive = isInSection(loadBalancerSection);
    const cacheActive = isInSection(cacheSection);
    const responseActive = isInSection(responseSection);

    /*
     * =====================================================
     * PACKET PATH
     *
     * One continuous path through the architecture.
     * =====================================================
     */

    const path = [
        { x: 540, y: 430 }, // Browser
        { x: 540, y: 580 }, // DNS
        { x: 540, y: 730 }, // TCP
        { x: 540, y: 880 }, // TLS
        { x: 540, y: 1030 }, // HTTP
        { x: 540, y: 1180 }, // Load Balancer
        { x: 540, y: 1325 }, // API
        { x: 540, y: 1470 }, // Cache
        { x: 540, y: 1615 }, // Database
    ];

    /*
     * Map each section to a segment of the packet path.
     */

    const segmentProgress = (
        section: any,
        from: number,
        to: number
    ) => {
        if (!section) return 0;

        return interpolate(
            frame,
            [
                section.start + section.duration * 0.18,
                section.start + section.duration * 0.82,
            ],
            [from, to],
            {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            }
        );
    };

    let packetProgress = 0;

    if (dnsActive) {
        packetProgress = segmentProgress(dnsSection, 0, 1);
    } else if (tcpActive) {
        packetProgress = segmentProgress(tcpSection, 1, 2);
    } else if (tlsActive) {
        packetProgress = segmentProgress(tlsSection, 2, 3);
    } else if (httpActive) {
        packetProgress = segmentProgress(httpSection, 3, 4);
    } else if (loadBalancerActive) {
        packetProgress = segmentProgress(loadBalancerSection, 4, 5);
    } else if (cacheActive) {
        packetProgress = segmentProgress(cacheSection, 6, 7);
    } else if (responseActive) {
        packetProgress = segmentProgress(responseSection, 8, 0);
    }

    /*
     * Convert a path index into coordinates.
     */
    const getPathPoint = (index: number) => {
        return path[index];
    };

    const getPacketPosition = () => {
        if (dnsActive) {
            const a = getPathPoint(0);
            const b = getPathPoint(1);

            return {
                x: interpolate(packetProgress, [0, 1], [a.x, b.x]),
                y: interpolate(packetProgress, [0, 1], [a.y, b.y]),
            };
        }

        if (tcpActive) {
            const a = getPathPoint(1);
            const b = getPathPoint(2);

            return {
                x: interpolate(packetProgress, [0, 1], [a.x, b.x]),
                y: interpolate(packetProgress, [0, 1], [a.y, b.y]),
            };
        }

        if (tlsActive) {
            const a = getPathPoint(2);
            const b = getPathPoint(3);

            return {
                x: interpolate(packetProgress, [0, 1], [a.x, b.x]),
                y: interpolate(packetProgress, [0, 1], [a.y, b.y]),
            };
        }

        if (httpActive) {
            const a = getPathPoint(3);
            const b = getPathPoint(4);

            return {
                x: interpolate(packetProgress, [0, 1], [a.x, b.x]),
                y: interpolate(packetProgress, [0, 1], [a.y, b.y]),
            };
        }

        if (loadBalancerActive) {
            const a = getPathPoint(4);
            const b = getPathPoint(5);

            return {
                x: interpolate(packetProgress, [0, 1], [a.x, b.x]),
                y: interpolate(packetProgress, [0, 1], [a.y, b.y]),
            };
        }

        if (cacheActive) {
            const a = getPathPoint(6);
            const b = getPathPoint(7);

            return {
                x: interpolate(packetProgress, [0, 1], [a.x, b.x]),
                y: interpolate(packetProgress, [0, 1], [a.y, b.y]),
            };
        }

        if (responseActive) {
            const a = getPathPoint(8);
            const b = getPathPoint(0);

            return {
                x: interpolate(packetProgress, [0, 1], [a.x, b.x]),
                y: interpolate(packetProgress, [0, 1], [a.y, b.y]),
            };
        }

        return getPathPoint(0);
    };

    const packet = getPacketPosition();

    /*
     * =====================================================
     * BACKGROUND
     * =====================================================
     */

    const backgroundOpacity = fade(
        frame,
        architectureStart,
        architectureStart + 30
    );

    return (
        <AbsoluteFill
            style={{
                background:
                    "radial-gradient(circle at 50% 35%, #17202b 0%, #080808 55%, #030303 100%)",

                color: "#fff",

                fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, sans-serif",

                overflow: "hidden",
            }}
        >
            {/* =================================================
                AUDIO
            ================================================= */}

            {sections.map((section) => (
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

            {/* =================================================
                HOOK
            ================================================= */}

            {frame < architectureStart + 30 && (
                <AbsoluteFill
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        padding: 80,

                        opacity:
                            frame < architectureStart
                                ? 1
                                : fade(
                                    frame,
                                    architectureStart,
                                    architectureStart + 30,
                                    1,
                                    0
                                ),
                    }}
                >
                    <div>
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
                                fontSize: 70,
                                fontWeight: 800,
                            }}
                        >
                            google.com
                        </div>

                        <div
                            style={{
                                marginTop: 40,
                                fontSize: 32,
                                opacity: fade(
                                    frame,
                                    45,
                                    70
                                ),
                            }}
                        >
                            and hit Enter?
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {/* =================================================
                CONTINUOUS ARCHITECTURE
            ================================================= */}

            {frame >= architectureStart && (
                <AbsoluteFill
                    style={{
                        opacity: backgroundOpacity,
                    }}
                >
                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <div
                        style={{
                            position: "absolute",
                            top: 105,
                            width: "100%",
                            textAlign: "center",

                            zIndex: 20,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 48,
                                fontWeight: 800,
                            }}
                        >
                            What Happens When You Type a URL?
                        </div>

                        <div
                            style={{
                                marginTop: 12,
                                fontSize: 24,
                                opacity: 0.5,
                            }}
                        >
                            Browser → Server → Database → Response
                        </div>
                    </div>

                    {/* =================================================
                        STEP INDICATOR
                    ================================================= */}

                    <div
                        style={{
                            position: "absolute",
                            top: 205,
                            width: "100%",
                            textAlign: "center",

                            fontSize: 25,
                            fontWeight: 700,

                            opacity: 0.75,

                            zIndex: 20,
                        }}
                    >
                        {dnsActive && "1 · DNS"}
                        {tcpActive && "2 · TCP Connection"}
                        {tlsActive && "3 · TLS"}
                        {httpActive && "4 · HTTP Request"}
                        {loadBalancerActive && "5 · Load Balancer"}
                        {cacheActive && "6 · Cache & Database"}
                        {responseActive && "7 · Response"}
                    </div>

                    {/* =================================================
                        CONNECTION LINES
                    ================================================= */}

                    <Arrow
                        x1={540}
                        y1={485}
                        x2={540}
                        y2={525}
                        active={dnsActive}
                    />

                    <Arrow
                        x1={540}
                        y1={635}
                        x2={540}
                        y2={675}
                        active={tcpActive}
                    />

                    <Arrow
                        x1={540}
                        y1={785}
                        x2={540}
                        y2={825}
                        active={tlsActive}
                    />

                    <Arrow
                        x1={540}
                        y1={935}
                        x2={540}
                        y2={975}
                        active={httpActive}
                    />

                    <Arrow
                        x1={540}
                        y1={1085}
                        x2={540}
                        y2={1125}
                        active={loadBalancerActive}
                    />

                    <Arrow
                        x1={540}
                        y1={1235}
                        x2={540}
                        y2={1270}
                        active={cacheActive}
                    />

                    <Arrow
                        x1={540}
                        y1={1380}
                        x2={540}
                        y2={1415}
                        active={cacheActive}
                    />

                    <Arrow
                        x1={540}
                        y1={1525}
                        x2={540}
                        y2={1560}
                        active={cacheActive}
                    />

                    {/* =================================================
                        NODES
                    ================================================= */}

                    <Node
                        x={540}
                        y={430}
                        title="Browser"
                        subtitle="google.com"
                        active={
                            frame < architectureStart + 45 ||
                            responseActive
                        }
                    />

                    <Node
                        x={540}
                        y={580}
                        title="DNS"
                        subtitle="Domain → IP"
                        active={dnsActive}
                    />

                    <Node
                        x={540}
                        y={730}
                        title="TCP"
                        subtitle="Reliable connection"
                        active={tcpActive}
                    />

                    <Node
                        x={540}
                        y={880}
                        title="TLS"
                        subtitle="Encrypted connection"
                        active={tlsActive}
                    />

                    <Node
                        x={540}
                        y={1030}
                        title="HTTP"
                        subtitle="GET /"
                        active={httpActive}
                    />

                    <Node
                        x={540}
                        y={1180}
                        title="Load Balancer"
                        subtitle="Route request"
                        active={loadBalancerActive}
                    />

                    {/* =================================================
                        API SERVERS
                    ================================================= */}

                    <Node
                        x={250}
                        y={1325}
                        title="API 1"
                        small
                        active={loadBalancerActive}
                    />

                    <Node
                        x={540}
                        y={1325}
                        title="API 2"
                        small
                        active={
                            loadBalancerActive || cacheActive
                        }
                    />

                    <Node
                        x={830}
                        y={1325}
                        title="API 3"
                        small
                        active={loadBalancerActive}
                    />

                    {/* =================================================
                        CACHE
                    ================================================= */}

                    <Node
                        x={540}
                        y={1470}
                        title="Redis"
                        subtitle="Fast cache"
                        active={cacheActive}
                    />

                    {/* =================================================
                        DATABASE
                    ================================================= */}

                    <Node
                        x={540}
                        y={1615}
                        title="PostgreSQL"
                        subtitle="Persistent data"
                        active={cacheActive}
                    />

                    {/* =================================================
                        LOAD BALANCER → API SERVERS
                    ================================================= */}

                    <Arrow
                        x1={470}
                        y1={1235}
                        x2={250}
                        y2={1280}
                        active={loadBalancerActive}
                    />

                    <Arrow
                        x1={540}
                        y1={1235}
                        x2={540}
                        y2={1270}
                        active={loadBalancerActive}
                    />

                    <Arrow
                        x1={610}
                        y1={1235}
                        x2={830}
                        y2={1280}
                        active={loadBalancerActive}
                    />

                    {/* =================================================
                        API → REDIS
                    ================================================= */}

                    <Arrow
                        x1={540}
                        y1={1380}
                        x2={540}
                        y2={1415}
                        active={cacheActive}
                    />

                    {/* =================================================
                        REDIS → DATABASE
                    ================================================= */}

                    <Arrow
                        x1={540}
                        y1={1525}
                        x2={540}
                        y2={1560}
                        active={cacheActive}
                    />

                    {/* =================================================
                        HTTP REQUEST LABEL
                    ================================================= */}

                    {httpActive && (
                        <div
                            style={{
                                position: "absolute",

                                top: 970,

                                left: 580,

                                fontFamily: "monospace",

                                fontSize: 24,

                                fontWeight: 700,

                                opacity: fade(
                                    frame,
                                    httpSection?.start ?? 780,
                                    (httpSection?.start ?? 780) +
                                    20
                                ),

                                zIndex: 20,
                            }}
                        >
                            GET / HTTP/1.1
                        </div>
                    )}

                    {/* =================================================
                        DNS RESULT
                    ================================================= */}

                    {dnsActive && (
                        <div
                            style={{
                                position: "absolute",

                                top: 625,

                                left: 590,

                                fontFamily: "monospace",

                                fontSize: 22,

                                opacity: 0.65,

                                zIndex: 20,
                            }}
                        >
                            142.250.x.x
                        </div>
                    )}

                    {/* =================================================
                        TLS LABEL
                    ================================================= */}

                    {tlsActive && (
                        <div
                            style={{
                                position: "absolute",

                                top: 835,

                                left: 600,

                                fontSize: 22,

                                fontWeight: 700,

                                opacity: 0.65,

                                zIndex: 20,
                            }}
                        >
                            🔒 HTTPS
                        </div>
                    )}

                    {/* =================================================
                        PACKET
                    ================================================= */}

                    {!responseActive && (
                        <Packet
                            progress={0}
                            x1={packet.x}
                            y1={packet.y}
                            x2={packet.x}
                            y2={packet.y}
                        />
                    )}

                    {/* =================================================
                        RESPONSE PACKET
                    ================================================= */}

                    {responseActive && (
                        <Packet
                            progress={0}
                            x1={packet.x}
                            y1={packet.y}
                            x2={packet.x}
                            y2={packet.y}
                        />
                    )}

                    {/* =================================================
                        RESPONSE MESSAGE
                    ================================================= */}

                    {responseActive && (
                        <div
                            style={{
                                position: "absolute",

                                bottom: 120,

                                width: "100%",

                                textAlign: "center",

                                zIndex: 20,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 46,
                                    fontWeight: 800,

                                    opacity: fade(
                                        frame,
                                        responseSection?.start ??
                                        1530,
                                        (responseSection?.start ??
                                            1530) + 25
                                    ),
                                }}
                            >
                                Response → Browser
                            </div>

                            <div
                                style={{
                                    marginTop: 15,

                                    fontSize: 28,

                                    opacity: fade(
                                        frame,
                                        (responseSection?.start ??
                                            1530) + 20,
                                        (responseSection?.start ??
                                            1530) + 45
                                    ),
                                }}
                            >
                                The website is rendered.
                            </div>
                        </div>
                    )}
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};