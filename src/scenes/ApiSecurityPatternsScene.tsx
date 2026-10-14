import React, { useId } from "react";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    interpolate,
    staticFile,
    useCurrentFrame,
} from "remotion";

import { apiSecurityPatterns } from "../../content/api-security-patterns";
import { createTimeline } from "../timeline";

const C = {
    bg: "#080D20",
    panel: "rgba(16, 27, 55, 0.88)",
    panel2: "rgba(22, 38, 74, 0.88)",
    line: "rgba(112, 153, 224, 0.25)",
    white: "#F4F7FF",
    muted: "#9EAFD0",
    cyan: "#55E5FF",
    blue: "#548CFF",
    green: "#38F0B0",
    purple: "#B28AFF",
    orange: "#FFC078",
    pink: "#FF75C8",
    red: "#FF637F",
};

const { sections: TIMELINE } = createTimeline(apiSecurityPatterns);

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const fadeIn = (frame: number, delay = 0, duration = 12) =>
    interpolate(frame - delay, [0, duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

type NodeProps = {
    x: number;
    y: number;
    w?: number;
    h?: number;
    title: string;
    sub?: string;
    color?: string;
    icon?: string;
    compact?: boolean;
    active?: boolean;
    frame?: number;
    delay?: number;
    danger?: boolean;
};

const Node: React.FC<NodeProps> = ({
    x,
    y,
    w = 210,
    h = 118,
    title,
    sub,
    color = C.cyan,
    icon,
    compact = false,
    active = false,
    frame = 0,
    delay = 0,
    danger = false,
}) => {
    const opacity = fadeIn(frame, delay, 10);
    const lift = interpolate(frame - delay, [0, 10], [22, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const borderColor = danger ? C.red : color;

    return (
        <div
            style={{
                position: "absolute",
                left: `${x / 10}% `,
                top: `${y / 10}% `,
                width: `${w / 10}% `,
                height: `${h / 10}% `,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: compact ? 5 : 9,
                padding: compact ? 8 : 14,
                border: `2px solid ${borderColor}${active ? "" : "99"} `,
                borderRadius: compact ? 16 : 22,
                background: active
                    ? `linear - gradient(145deg, ${borderColor}32, #10213A)`
                    : "linear-gradient(145deg, #172C48, #0C1A2D)",
                boxShadow: active
                    ? `0 0 32px ${borderColor} 35, inset 0 0 18px ${borderColor} 12`
                    : "0 12px 30px #00000025",
                textAlign: "center",
                overflow: "hidden",
                zIndex: 3,
                opacity,
                transform: `translateY(${lift}px)`,
            }}
        >
            {icon && (
                <div
                    style={{
                        fontSize: compact ? 22 : 32,
                        lineHeight: 1,
                        color: borderColor,
                        fontWeight: 800,
                    }}
                >
                    {icon}
                </div>
            )}

            <div
                style={{
                    color: C.white,
                    fontSize: compact ? 18 : 23,
                    lineHeight: 1.15,
                    fontWeight: 800,
                    letterSpacing: -0.4,
                }}
            >
                {title}
            </div>

            {sub && (
                <div
                    style={{
                        color: C.muted,
                        fontSize: compact ? 13 : 16,
                        lineHeight: 1.25,
                        fontWeight: 500,
                    }}
                >
                    {sub}
                </div>
            )}
        </div>
    );
};

/**
 * Animated connection with a unique SVG marker.
 * Packets travel along the line, disappear, and restart deliberately.
 */
const LinkLine: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    frame?: number;
    duration?: number;
    delay?: number;
    dashed?: boolean;
    blocked?: boolean;
}> = ({
    x1,
    y1,
    x2,
    y2,
    color = C.cyan,
    frame = 0,
    duration = 45,
    delay = 0,
    dashed = false,
    blocked = false,
}) => {
        const rawId = useId();
        const markerId = `arrow - ${rawId.replace(/:/g, "")} `;
        const cycle = ((frame - delay) % duration + duration) % duration;
        const progress = interpolate(cycle, [0, duration * 0.72], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });

        const packetOpacity =
            frame < delay
                ? 0
                : interpolate(cycle, [0, 4, duration * 0.62, duration * 0.72], [0, 1, 1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                });

        const packetX = x1 + (x2 - x1) * progress;
        const packetY = y1 + (y2 - y1) * progress;
        const actualColor = blocked ? C.red : color;

        return (
            <svg
                viewBox="0 0 1000 1000"
                preserveAspectRatio="none"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                    zIndex: 1,
                    pointerEvents: "none",
                }}
            >
                <defs>
                    <marker
                        id={markerId}
                        markerWidth="9"
                        markerHeight="9"
                        refX="6"
                        refY="3"
                        orient="auto"
                    >
                        <path d="M0,0 L0,6 L7,3 z" fill={actualColor} />
                    </marker>
                </defs>

                <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={actualColor}
                    strokeWidth="3"
                    strokeOpacity="0.38"
                    strokeDasharray={dashed ? "9 10" : undefined}
                    markerEnd={`url(#${markerId})`}
                />

                {!blocked && (
                    <>
                        <circle
                            cx={packetX}
                            cy={packetY}
                            r="15"
                            fill={actualColor}
                            opacity={packetOpacity * 0.16}
                        />
                        <circle
                            cx={packetX}
                            cy={packetY}
                            r="7"
                            fill={actualColor}
                            opacity={packetOpacity}
                            style={{ filter: `drop - shadow(0 0 9px ${actualColor})` }}
                        />
                    </>
                )}
            </svg>
        );
    };

const Packet: React.FC<{
    x: number;
    y: number;
    color: string;
    frame: number;
    delay?: number;
    size?: number;
}> = ({ x, y, color, frame, delay = 0, size = 12 }) => {
    const cycle = ((frame - delay) % 36 + 36) % 36;
    const opacity =
        frame < delay
            ? 0
            : interpolate(cycle, [0, 3, 27, 34], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });

    const travel = interpolate(cycle, [0, 30], [-35, 35], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                left: `${x / 10}% `,
                top: `${y / 10}% `,
                width: size,
                height: size,
                borderRadius: 4,
                background: color,
                boxShadow: `0 0 20px ${color} `,
                opacity,
                transform: `translate(${travel}px, -8px) rotate(45deg)`,
                zIndex: 5,
            }}
        />
    );
};

const Status: React.FC<{
    label: string;
    detail: string;
    color: string;
    frame: number;
}> = ({ label, detail, color, frame }) => {
    const pulse = 0.75 + 0.25 * Math.sin(frame / 7);
    const opacity = fadeIn(frame, 0, 12);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                width: "100%",
                boxSizing: "border-box",
                padding: "22px 26px",
                borderRadius: 20,
                border: `1px solid ${color} 77`,
                background: `linear - gradient(100deg, ${color}18, #10213A)`,
                boxShadow: `0 0 30px ${color} 12`,
                opacity,
            }}
        >
            <div
                style={{
                    width: 15,
                    height: 15,
                    borderRadius: 99,
                    background: color,
                    boxShadow: `0 0 ${18 * pulse}px ${color} `,
                    flexShrink: 0,
                }}
            />
            <div style={{ flex: 1 }}>
                <div
                    style={{
                        color,
                        fontSize: 24,
                        fontWeight: 900,
                        letterSpacing: 0.5,
                    }}
                >
                    {label}
                </div>
                <div
                    style={{
                        color: C.white,
                        fontSize: 19,
                        marginTop: 5,
                        lineHeight: 1.35,
                    }}
                >
                    {detail}
                </div>
            </div>
        </div>
    );
};

const FrameLabel: React.FC<{
    eyebrow: string;
    title: string;
    frame: number;
}> = ({ eyebrow, title, frame }) => {
    const opacity = fadeIn(frame, 0, 12);
    const translateY = interpolate(frame, [0, 12], [24, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                left: 64,
                right: 64,
                top: 100,
                opacity,
                transform: `translateY(${translateY}px)`,
                zIndex: 10,
            }}
        >
            <div
                style={{
                    color: C.cyan,
                    fontSize: 20,
                    fontWeight: 900,
                    letterSpacing: 4,
                    marginBottom: 14,
                }}
            >
                {eyebrow}
            </div>

            <div
                style={{
                    color: C.white,
                    fontSize: 45,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    letterSpacing: -1.4,
                }}
            >
                {title}
            </div>
        </div>
    );
};

const Background: React.FC<{ frame: number }> = ({ frame }) => (
    <AbsoluteFill
        style={{
            background:
                "radial-gradient(ellipse at 50% 42%, #183455 0%, #0A172A 48%, #060D19 100%)",
        }}
    >
        <svg
            viewBox="0 0 1080 1920"
            style={{ width: "100%", height: "100%", position: "absolute" }}
        >
            <defs>
                <pattern
                    id="api-grid-background"
                    width="54"
                    height="54"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M54 0H0V54"
                        fill="none"
                        stroke="#75A5D8"
                        strokeOpacity="0.075"
                        strokeWidth="1"
                    />
                </pattern>
                <radialGradient id="api-glow-background">
                    <stop offset="0%" stopColor={C.cyan} stopOpacity="0.14" />
                    <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
                </radialGradient>
            </defs>

            <rect width="1080" height="1920" fill="url(#api-grid-background)" />

            <circle
                cx={540 + Math.sin(frame / 55) * 150}
                cy={900 + Math.cos(frame / 60) * 120}
                r="480"
                fill="url(#api-glow-background)"
            />

            {Array.from({ length: 25 }, (_, i) => {
                const x = (i * 173 + frame * (i % 3 + 0.2)) % 1080;
                const y = (i * 251 + frame * 0.8) % 1920;

                return (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={i % 4 === 0 ? 3 : 1.5}
                        fill={i % 3 === 0 ? C.purple : C.cyan}
                        opacity={0.2 + 0.25 * Math.sin(frame / 13 + i)}
                    />
                );
            })}
        </svg>
    </AbsoluteFill>
);

const DiagramArea: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
        style={{
            position: "absolute",
            left: 38,
            right: 38,
            top: 350,
            height: 930,
            borderRadius: 32,
            border: "1px solid #47719A55",
            background: "linear-gradient(150deg, #11243B99, #091628CC)",
            overflow: "hidden",
        }}
    >
        {children}
    </div>
);

const Footer: React.FC = () => (
    <div
        style={{
            position: "absolute",
            bottom: 55,
            left: 64,
            right: 64,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#7892AF",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 2,
        }}
    >
        <span>AI HUB INSIDER</span>
        <span>API SECURITY</span>
    </div>
);

/* -------------------------------------------------------
   HOOK: attacks arrive -> gateway inspects -> backend safe
-------------------------------------------------------- */

const HookVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const attack = Math.floor(frame / 24) % 3;
    const impact = frame % 24;
    const gatewayHit = impact >= 10 && impact <= 16;
    const attackColor = attack === 1 ? C.orange : C.red;

    return (
        <>
            <FrameLabel
                eyebrow="API SECURITY"
                title="One weak API. Three attack paths."
                frame={frame}
            />

            <DiagramArea>
                <LinkLine
                    x1={200}
                    y1={220}
                    x2={500}
                    y2={465}
                    color={attack === 0 ? C.red : C.orange}
                    frame={frame}
                    delay={2}
                    duration={24}
                />
                <LinkLine
                    x1={800}
                    y1={220}
                    x2={500}
                    y2={465}
                    color={attack === 1 ? C.red : C.orange}
                    frame={frame}
                    delay={8}
                    duration={24}
                />
                <LinkLine
                    x1={200}
                    y1={690}
                    x2={500}
                    y2={465}
                    color={attack === 2 ? C.red : C.purple}
                    frame={frame}
                    delay={14}
                    duration={24}
                />

                <Node
                    x={45}
                    y={100}
                    title="Stolen token"
                    sub="Impersonation"
                    icon="!"
                    color={C.red}
                    compact
                    active={attack === 0}
                    frame={frame}
                    delay={0}
                />
                <Node
                    x={740}
                    y={100}
                    title="SQL injection"
                    sub="Malicious input"
                    icon="!"
                    color={C.orange}
                    compact
                    active={attack === 1}
                    frame={frame}
                    delay={4}
                />
                <Node
                    x={45}
                    y={625}
                    title="Traffic flood"
                    sub="Request overload"
                    icon="↗"
                    color={C.purple}
                    compact
                    active={attack === 2}
                    frame={frame}
                    delay={8}
                />

                <Node
                    x={385}
                    y={380}
                    w={230}
                    h={170}
                    title="API Gateway"
                    sub={gatewayHit ? "Threat detected!" : "Inspect request"}
                    icon={gatewayHit ? "!" : "⬡"}
                    color={gatewayHit ? C.red : C.cyan}
                    active
                    frame={frame}
                    delay={0}
                    danger={gatewayHit}
                />

                <Node
                    x={385}
                    y={715}
                    w={230}
                    h={125}
                    title="Backend"
                    sub="Protected services"
                    icon="▤"
                    color={C.green}
                    active={!gatewayHit}
                    frame={frame}
                    delay={8}
                />

                <LinkLine
                    x1={500}
                    y1={550}
                    x2={500}
                    y2={715}
                    color={C.green}
                    frame={frame}
                    delay={18}
                    blocked
                />

                <div
                    style={{
                        position: "absolute",
                        left: "28%",
                        right: "28%",
                        bottom: 25,
                        textAlign: "center",
                        color: C.muted,
                        fontSize: 19,
                    }}
                >
                    Authenticate · Inspect · Limit
                </div>

                {gatewayHit && (
                    <div
                        style={{
                            position: "absolute",
                            left: "28%",
                            right: "28%",
                            top: "59%",
                            padding: "12px 8px",
                            borderRadius: 12,
                            textAlign: "center",
                            color: C.red,
                            background: "#321723",
                            border: `2px solid ${C.red} `,
                            fontSize: 23,
                            fontWeight: 900,
                            opacity: fadeIn(impact - 10, 0, 3),
                            zIndex: 6,
                        }}
                    >
                        REQUEST BLOCKED
                    </div>
                )}
            </DiagramArea>

            <div style={{ position: "absolute", left: 58, right: 58, bottom: 165 }}>
                <Status
                    label="DEFENSE IN DEPTH"
                    detail="Reject threats before they reach protected services."
                    color={attackColor}
                    frame={frame}
                />
            </div>
        </>
    );
};

/* -------------------------------------------------------
   OAUTH2 + JWT: token validation and authorization
-------------------------------------------------------- */

const OAuthVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const phase = Math.floor(frame / 36) % 4;
    const signatureValid = phase !== 1;
    const authorized = phase === 3;
    const rejected = phase === 1 || phase === 2;

    const tokenStatus =
        phase === 0
            ? "Checking signature..."
            : phase === 1
                ? "Invalid signature"
                : phase === 2
                    ? "Insufficient scope"
                    : "Authorized";

    const statusColor =
        phase === 1 || phase === 2 ? C.red : authorized ? C.green : C.orange;

    return (
        <>
            <FrameLabel
                eyebrow="01 / IDENTITY"
                title="Validate the token. Enforce permissions."
                frame={frame}
            />

            <DiagramArea>
                <LinkLine
                    x1={160}
                    y1={260}
                    x2={385}
                    y2={260}
                    frame={frame}
                    duration={32}
                    color={C.cyan}
                />
                <LinkLine
                    x1={615}
                    y1={260}
                    x2={825}
                    y2={260}
                    frame={frame}
                    delay={8}
                    duration={32}
                    color={authorized ? C.green : rejected ? C.red : C.orange}
                    blocked={rejected}
                />

                <Node
                    x={45}
                    y={170}
                    title="Client"
                    sub="Bearer token"
                    icon="◉"
                    color={C.blue}
                    frame={frame}
                />
                <Node
                    x={385}
                    y={170}
                    w={230}
                    title="JWT validation"
                    sub={phase === 1 ? "Signature failed" : "Signature + claims"}
                    icon={phase === 1 ? "×" : "✓"}
                    color={phase === 1 ? C.red : C.cyan}
                    active
                    frame={frame}
                />
                <Node
                    x={740}
                    y={170}
                    title="API"
                    sub={authorized ? "Access granted" : "Check scope"}
                    icon={authorized ? "✓" : rejected ? "×" : "◇"}
                    color={statusColor}
                    active={authorized || rejected}
                    frame={frame}
                />

                <div
                    style={{
                        position: "absolute",
                        left: "24%",
                        top: "43%",
                        width: "52%",
                        padding: 20,
                        borderRadius: 18,
                        background: "#0A1728",
                        border: `1px solid ${C.purple} 88`,
                    }}
                >
                    <div style={{ color: C.purple, fontSize: 19, fontWeight: 900 }}>
                        VALIDATE TOKEN CLAIMS
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 15 }}>
                        {[
                            { key: "Signature", valid: signatureValid },
                            { key: "Expiry", valid: phase !== 0 },
                            { key: "Issuer", valid: phase !== 1 },
                            { key: "Audience", valid: phase !== 1 },
                        ].map((item) => (
                            <div
                                key={item.key}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    textAlign: "center",
                                    padding: "12px 3px",
                                    borderRadius: 10,
                                    color: item.valid ? C.green : C.red,
                                    background: `${item.valid ? C.green : C.red} 15`,
                                    border: `1px solid ${item.valid ? C.green : C.red} 55`,
                                    fontSize: 13,
                                    fontWeight: 800,
                                }}
                            >
                                {item.key}
                            </div>
                        ))}
                    </div>
                </div>

                <Node
                    x={300}
                    y={650}
                    w={400}
                    h={135}
                    title={tokenStatus}
                    sub={
                        authorized
                            ? "Valid token + sufficient permissions"
                            : rejected
                                ? "Reject request before business logic"
                                : "Check scopes and resource permissions"
                    }
                    icon={authorized ? "✓" : rejected ? "×" : "⌕"}
                    color={statusColor}
                    active
                    frame={frame}
                />

                <LinkLine
                    x1={500}
                    y1={500}
                    x2={500}
                    y2={650}
                    color={statusColor}
                    frame={frame}
                    delay={8}
                    duration={32}
                    blocked={rejected}
                />
            </DiagramArea>

            <div style={{ position: "absolute", left: 58, right: 58, bottom: 165 }}>
                <Status
                    label={
                        authorized
                            ? "AUTHORIZED"
                            : rejected
                                ? "REQUEST REJECTED"
                                : "VERIFY FIRST"
                    }
                    detail={
                        authorized
                            ? "Authentication is not the same as authorization."
                            : rejected
                                ? "Reject invalid tokens or insufficient permissions."
                                : "Verify signature, expiry, issuer and audience."
                    }
                    color={statusColor}
                    frame={frame}
                />
            </div>
        </>
    );
};

/* -------------------------------------------------------
   mTLS: both identities must be verified
-------------------------------------------------------- */

const MtlsVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const phase = Math.floor(frame / 38) % 4;
    const clientVerified = phase >= 2;
    const serverVerified = phase === 1 || phase === 2;
    const connected = phase === 2;
    const failed = phase === 3;

    return (
        <>
            <FrameLabel
                eyebrow="02 / SERVICE IDENTITY"
                title="mTLS verifies both ends."
                frame={frame}
            />

            <DiagramArea>
                <Node
                    x={65}
                    y={200}
                    w={250}
                    h={170}
                    title="Service A"
                    sub={clientVerified ? "Certificate verified" : "Client certificate"}
                    icon={clientVerified ? "✓" : "▣"}
                    color={clientVerified ? C.green : C.blue}
                    active={clientVerified}
                    frame={frame}
                />
                <Node
                    x={685}
                    y={200}
                    w={250}
                    h={170}
                    title="Service B"
                    sub={serverVerified ? "Certificate verified" : "Server certificate"}
                    icon={serverVerified ? "✓" : "▣"}
                    color={serverVerified ? C.green : C.purple}
                    active={serverVerified}
                    frame={frame}
                />

                <LinkLine
                    x1={315}
                    y1={250}
                    x2={685}
                    y2={250}
                    frame={frame}
                    duration={38}
                    color={C.cyan}
                />
                <LinkLine
                    x1={685}
                    y1={330}
                    x2={315}
                    y2={330}
                    frame={frame}
                    delay={8}
                    duration={38}
                    color={C.purple}
                />

                <div
                    style={{
                        position: "absolute",
                        left: "35%",
                        top: "14%",
                        width: "30%",
                        textAlign: "center",
                        color: C.cyan,
                        fontWeight: 900,
                        fontSize: 20,
                    }}
                >
                    TLS HANDSHAKE
                </div>

                <Node
                    x={310}
                    y={475}
                    w={380}
                    h={160}
                    title="Certificate checks"
                    sub="CA trust · Identity · Validity"
                    icon="⌑"
                    color={C.orange}
                    active
                    frame={frame}
                />

                <LinkLine
                    x1={190}
                    y1={370}
                    x2={405}
                    y2={475}
                    frame={frame}
                    delay={5}
                    color={C.blue}
                />
                <LinkLine
                    x1={810}
                    y1={370}
                    x2={595}
                    y2={475}
                    frame={frame}
                    delay={12}
                    color={C.purple}
                />

                <Node
                    x={310}
                    y={720}
                    w={380}
                    h={115}
                    title={
                        connected
                            ? "Secure connection"
                            : failed
                                ? "Handshake failed"
                                : "Waiting for verification"
                    }
                    sub={
                        connected
                            ? "Encrypted service traffic"
                            : failed
                                ? "Do not establish the connection"
                                : "Both identities must pass"
                    }
                    icon={connected ? "✓" : failed ? "×" : "⇄"}
                    color={connected ? C.green : failed ? C.red : C.orange}
                    active
                    frame={frame}
                />

                <LinkLine
                    x1={500}
                    y1={635}
                    x2={500}
                    y2={720}
                    frame={frame}
                    delay={12}
                    color={connected ? C.green : failed ? C.red : C.orange}
                    blocked={!connected}
                />
            </DiagramArea>

            <div style={{ position: "absolute", left: 58, right: 58, bottom: 165 }}>
                <Status
                    label={
                        connected
                            ? "MUTUAL TRUST ESTABLISHED"
                            : failed
                                ? "CONNECTION REJECTED"
                                : "TWO-WAY VERIFICATION"
                    }
                    detail={
                        connected
                            ? "Both required certificate checks passed."
                            : failed
                                ? "A failed identity check prevents the handshake."
                                : "Verify both identities before trusting the connection."
                    }
                    color={connected ? C.green : failed ? C.red : C.purple}
                    frame={frame}
                />
            </div>
        </>
    );
};

/* -------------------------------------------------------
   WAF: demonstrate a malicious request and a safe request
-------------------------------------------------------- */

const WafVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const phase = Math.floor(frame / 32) % 4;
    const malicious = phase === 1 || phase === 2;
    const blocked = phase === 2;
    const color = blocked ? C.red : malicious ? C.orange : C.green;

    return (
        <>
            <FrameLabel
                eyebrow="03 / INPUT DEFENSE"
                title="Stop malicious input at the edge."
                frame={frame}
            />

            <DiagramArea>
                <Node
                    x={45}
                    y={225}
                    w={260}
                    h={145}
                    title={malicious ? "Malicious input" : "Normal request"}
                    sub={malicious ? "' OR 1=1 --" : "Search: headphones"}
                    icon={malicious ? "!" : "⌕"}
                    color={malicious ? C.red : C.cyan}
                    active
                    frame={frame}
                />

                <LinkLine
                    x1={305}
                    y1={295}
                    x2={400}
                    y2={295}
                    frame={frame}
                    duration={32}
                    color={malicious ? C.red : C.green}
                    blocked={blocked}
                />

                <Node
                    x={400}
                    y={220}
                    w={205}
                    h={155}
                    title="WAF"
                    sub="Inspect request"
                    icon="⛨"
                    color={C.orange}
                    active
                    frame={frame}
                />

                <LinkLine
                    x1={605}
                    y1={295}
                    x2={730}
                    y2={295}
                    frame={frame}
                    delay={8}
                    duration={32}
                    color={blocked ? C.red : C.green}
                    blocked={blocked}
                />

                <Node
                    x={730}
                    y={225}
                    w={220}
                    h={145}
                    title={blocked ? "BLOCKED" : "Allowed"}
                    sub={blocked ? "403 response" : "Continue"}
                    icon={blocked ? "×" : "✓"}
                    color={blocked ? C.red : C.green}
                    active
                    frame={frame}
                />

                {blocked && (
                    <div
                        style={{
                            position: "absolute",
                            left: "63%",
                            top: "39%",
                            color: C.red,
                            fontSize: 19,
                            fontWeight: 900,
                            zIndex: 5,
                        }}
                    >
                        ✕ REJECTED
                    </div>
                )}

                <div
                    style={{
                        position: "absolute",
                        left: "8%",
                        right: "8%",
                        top: "50%",
                        display: "flex",
                        justifyContent: "center",
                        gap: 10,
                    }}
                >
                    {[
                        "Validate input",
                        "Parameterized SQL",
                        "Least privilege",
                    ].map((label, i) => (
                        <div
                            key={label}
                            style={{
                                flex: 1,
                                padding: "17px 8px",
                                textAlign: "center",
                                borderRadius: 14,
                                border: `1px solid ${i === 0 ? C.orange : C.cyan} 66`,
                                background: "#0A1728",
                                color: C.white,
                                fontSize: 15,
                                fontWeight: 700,
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: "8%",
                        right: "8%",
                        bottom: "12%",
                        textAlign: "center",
                        color: C.muted,
                        fontSize: 18,
                        lineHeight: 1.4,
                    }}
                >
                    A WAF is one layer—not a replacement for safe database queries.
                </div>
            </DiagramArea>

            <div style={{ position: "absolute", left: 58, right: 58, bottom: 165 }}>
                <Status
                    label={blocked ? "MALICIOUS REQUEST BLOCKED" : "REQUEST INSPECTED"}
                    detail={
                        blocked
                            ? "Reject suspicious traffic before it reaches the application."
                            : "Combine edge filtering with secure application code."
                    }
                    color={color}
                    frame={frame}
                />
            </div>
        </>
    );
};

/* -------------------------------------------------------
   RATE LIMITING: quota -> 429 -> retry/reset
-------------------------------------------------------- */

const RateLimitVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const cycleLength = 180;
    const cycleFrame = frame % cycleLength;
    const requestCount = Math.min(10, Math.floor(cycleFrame / 10));
    const limited = cycleFrame >= 100 && cycleFrame < 150;
    const reset = cycleFrame >= 150;
    const displayedCount = reset ? 0 : requestCount;
    const statusColor = limited ? C.red : C.green;

    return (
        <>
            <FrameLabel
                eyebrow="04 / TRAFFIC CONTROL"
                title="Too many requests? Return 429."
                frame={frame}
            />

            <DiagramArea>
                <Node
                    x={60}
                    y={210}
                    w={220}
                    h={135}
                    title="Client"
                    sub="Repeated requests"
                    icon="↗"
                    color={C.blue}
                    frame={frame}
                />

                <LinkLine
                    x1={280}
                    y1={275}
                    x2={390}
                    y2={275}
                    frame={frame}
                    duration={24}
                    color={limited ? C.red : C.cyan}
                />

                <Node
                    x={390}
                    y={200}
                    w={240}
                    h={155}
                    title="Rate limiter"
                    sub="Requests / window"
                    icon="◷"
                    color={limited ? C.red : C.orange}
                    active
                    frame={frame}
                />

                <LinkLine
                    x1={630}
                    y1={275}
                    x2={750}
                    y2={275}
                    frame={frame}
                    delay={5}
                    duration={24}
                    color={limited ? C.red : C.green}
                    blocked={limited}
                />

                <Node
                    x={750}
                    y={210}
                    w={190}
                    h={135}
                    title={limited ? "HTTP 429" : "HTTP 200"}
                    sub={
                        limited
                            ? "Too many requests"
                            : reset
                                ? "Window reset"
                                : "Request allowed"
                    }
                    icon={limited ? "!" : "✓"}
                    color={limited ? C.red : C.green}
                    active
                    frame={frame}
                />

                <div
                    style={{
                        position: "absolute",
                        left: "10%",
                        right: "10%",
                        top: "48%",
                        padding: 26,
                        borderRadius: 22,
                        border: "1px solid #385571",
                        background: "#091628",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            color: C.white,
                            fontSize: 19,
                            fontWeight: 800,
                        }}
                    >
                        <span>REQUEST BUDGET</span>
                        <span style={{ color: statusColor }}>
                            {displayedCount} / 10
                        </span>
                    </div>

                    <div style={{ display: "flex", gap: 7, marginTop: 18 }}>
                        {Array.from({ length: 10 }, (_, i) => (
                            <div
                                key={i}
                                style={{
                                    height: 24,
                                    flex: 1,
                                    borderRadius: 5,
                                    background:
                                        i < displayedCount
                                            ? limited
                                                ? C.red
                                                : C.cyan
                                            : "#22374E",
                                    boxShadow:
                                        i < displayedCount
                                            ? `0 0 12px ${limited ? C.red : C.cyan} 44`
                                            : "none",
                                }}
                            />
                        ))}
                    </div>

                    <div
                        style={{
                            marginTop: 16,
                            color: C.muted,
                            fontSize: 17,
                        }}
                    >
                        Example quota: 10 requests per time window
                    </div>
                </div>

                <Node
                    x={300}
                    y={690}
                    w={400}
                    h={125}
                    title={
                        limited
                            ? "Wait before retrying"
                            : reset
                                ? "Quota reset"
                                : "Quota available"
                    }
                    sub={
                        limited
                            ? "Honor Retry-After when provided"
                            : reset
                                ? "A new window begins"
                                : "Continue to the backend"
                    }
                    icon={limited ? "↻" : "✓"}
                    color={limited ? C.orange : C.green}
                    active
                    frame={frame}
                />
            </DiagramArea>

            <div style={{ position: "absolute", left: 58, right: 58, bottom: 165 }}>
                <Status
                    label={
                        limited
                            ? "RATE LIMIT EXCEEDED"
                            : reset
                                ? "QUOTA RESET"
                                : "WITHIN THE LIMIT"
                    }
                    detail={
                        limited
                            ? "Protect capacity and slow abusive clients."
                            : reset
                                ? "Requests can use the new quota window."
                                : "Apply limits per user, key, or client."
                    }
                    color={statusColor}
                    frame={frame}
                />
            </div>
        </>
    );
};

/* -------------------------------------------------------
   COMPARISON: each control has a specific responsibility
-------------------------------------------------------- */

const ComparisonVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const items = [
        {
            title: "OAuth2 + JWT",
            sub: "Identity, token claims and permissions",
            color: C.cyan,
            icon: "01",
        },
        {
            title: "mTLS",
            sub: "Authenticate communicating services",
            color: C.purple,
            icon: "02",
        },
        {
            title: "WAF + validation",
            sub: "Inspect requests and reject malicious input",
            color: C.orange,
            icon: "03",
        },
        {
            title: "Rate limiting",
            sub: "Control request volume and protect capacity",
            color: C.green,
            icon: "04",
        },
    ];

    return (
        <>
            <FrameLabel
                eyebrow="THE SECURITY STACK"
                title="Different threats. Different controls."
                frame={frame}
            />

            <DiagramArea>
                <div
                    style={{
                        position: "absolute",
                        left: "8%",
                        right: "8%",
                        top: "7%",
                        height: "86%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    {items.map((item, i) => {
                        const active = Math.floor(frame / 22) % 4 === i;
                        const rowOpacity = fadeIn(frame, i * 4, 10);

                        return (
                            <div
                                key={item.title}
                                style={{
                                    minHeight: 135,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 22,
                                    padding: "20px 24px",
                                    boxSizing: "border-box",
                                    borderRadius: 22,
                                    border: `2px solid ${item.color}${active ? "" : "55"} `,
                                    background: active
                                        ? `linear - gradient(100deg, ${item.color}25, #10213A)`
                                        : "#0D1B2E",
                                    transform: `translateX(${active ? 8 : 0}px)`,
                                    boxShadow: active
                                        ? `0 0 25px ${item.color} 20`
                                        : "none",
                                    opacity: rowOpacity,
                                }}
                            >
                                <div
                                    style={{
                                        width: 76,
                                        height: 76,
                                        flexShrink: 0,
                                        borderRadius: 19,
                                        display: "grid",
                                        placeItems: "center",
                                        background: `${item.color} 20`,
                                        color: item.color,
                                        fontSize: 25,
                                        fontWeight: 900,
                                    }}
                                >
                                    {item.icon}
                                </div>

                                <div>
                                    <div
                                        style={{
                                            color: C.white,
                                            fontSize: 25,
                                            fontWeight: 900,
                                        }}
                                    >
                                        {item.title}
                                    </div>
                                    <div
                                        style={{
                                            color: C.muted,
                                            fontSize: 17,
                                            marginTop: 7,
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {item.sub}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DiagramArea>

            <div style={{ position: "absolute", left: 58, right: 58, bottom: 165 }}>
                <Status
                    label="LAYER YOUR DEFENSES"
                    detail="No single control protects against every threat."
                    color={C.cyan}
                    frame={frame}
                />
            </div>
        </>
    );
};

/* -------------------------------------------------------
   ENDING: combine the layers into one security strategy
-------------------------------------------------------- */

const EndingVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const items = [
        {
            title: "Authenticate",
            sub: "Validate identity and permissions",
            color: C.cyan,
        },
        {
            title: "Inspect",
            sub: "Reject malicious or invalid input",
            color: C.orange,
        },
        {
            title: "Control",
            sub: "Limit traffic and protect capacity",
            color: C.purple,
        },
    ];

    return (
        <>
            <FrameLabel
                eyebrow="THE TAKEAWAY"
                title="Secure the request at every layer."
                frame={frame}
            />

            <DiagramArea>
                <div
                    style={{
                        position: "absolute",
                        inset: "10% 10%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 20,
                    }}
                >
                    {items.map((item, i) => (
                        <div
                            key={item.title}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 22,
                                padding: 26,
                                borderRadius: 20,
                                border: `1px solid ${item.color} 88`,
                                background: `${item.color} 12`,
                                transform: `translateX(${Math.sin(frame / 12 + i) * 5}px)`,
                                opacity: fadeIn(frame, i * 6, 12),
                            }}
                        >
                            <div
                                style={{
                                    width: 16,
                                    height: 70,
                                    borderRadius: 20,
                                    background: item.color,
                                    boxShadow: `0 0 20px ${item.color} 77`,
                                    flexShrink: 0,
                                }}
                            />

                            <div>
                                <div
                                    style={{
                                        color: C.white,
                                        fontSize: 28,
                                        fontWeight: 900,
                                    }}
                                >
                                    {item.title}
                                </div>
                                <div
                                    style={{
                                        color: C.muted,
                                        fontSize: 19,
                                        marginTop: 8,
                                    }}
                                >
                                    {item.sub}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DiagramArea>

            <div style={{ position: "absolute", left: 58, right: 58, bottom: 165 }}>
                <Status
                    label="SECURITY IS A SYSTEM"
                    detail="Combine controls, monitor failures, and test them."
                    color={C.green}
                    frame={frame}
                />
            </div>
        </>
    );
};

/* -------------------------------------------------------
   CTA
-------------------------------------------------------- */

const CtaVisual: React.FC<{ frame: number }> = ({ frame }) => {
    const scale = interpolate(Math.sin(frame / 10), [-1, 1], [0.98, 1.02]);
    const opacity = fadeIn(frame, 0, 18);

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: 70,
                opacity,
            }}
        >
            <div
                style={{
                    width: 150,
                    height: 150,
                    borderRadius: 42,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 70,
                    fontWeight: 900,
                    color: C.cyan,
                    border: `2px solid ${C.cyan} `,
                    background: `${C.cyan} 15`,
                    boxShadow: `0 0 70px ${C.cyan} 30`,
                    transform: `scale(${scale})`,
                }}
            >
                AI
            </div>

            <div
                style={{
                    color: C.white,
                    fontSize: 48,
                    fontWeight: 900,
                    marginTop: 36,
                }}
            >
                AI Hub Insider
            </div>

            <div
                style={{
                    color: C.cyan,
                    fontSize: 24,
                    fontWeight: 800,
                    letterSpacing: 3,
                    marginTop: 18,
                }}
            >
                BACKEND · CLOUD · SYSTEM DESIGN
            </div>

            <div
                style={{
                    marginTop: 65,
                    color: C.white,
                    fontSize: 25,
                    lineHeight: 1.5,
                }}
            >
                Follow for practical engineering insights.
            </div>
        </div>
    );
};

const SectionVisual: React.FC<{
    id: string;
    frame: number;
}> = ({ id, frame }) => {
    switch (id) {
        case "hook":
            return <HookVisual frame={frame} />;
        case "oauth2-jwt":
            return <OAuthVisual frame={frame} />;
        case "mtls":
            return <MtlsVisual frame={frame} />;
        case "waf-sanitization":
            return <WafVisual frame={frame} />;
        case "rate-limiting":
            return <RateLimitVisual frame={frame} />;
        case "comparison":
            return <ComparisonVisual frame={frame} />;
        case "ending":
            return <EndingVisual frame={frame} />;
        case "cta":
            return <CtaVisual frame={frame} />;
        default:
            return <HookVisual frame={frame} />;
    }
};

const ApiSecuritySection: React.FC<{ id: string }> = ({ id }) => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill>
            <Background frame={frame} />
            <SectionVisual id={id} frame={frame} />
            <Footer />
        </AbsoluteFill>
    );
};

export const ApiSecurityPatternsScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            {TIMELINE.map((section) => (
                <Sequence
                    key={section.id}
                    from={section.start}
                    durationInFrames={section.duration}
                >
                    <ApiSecuritySection id={section.id} />
                    <Audio src={staticFile(section.audio)} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
}; 