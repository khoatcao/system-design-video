
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

import { mtls } from "../../content/mtls";
import { createTimeline } from "../timeline";

const { sections: TIMELINE } = createTimeline(mtls);

const W = 1080;
const H = 1920;
const FONT = "Inter, -apple-system, BlinkMacSystemFont, Arial, sans-serif";

const C = {
    bg: "#070B17",
    white: "#F4F7FF",
    muted: "#91A6C7",
    cyan: "#4CE5FF",
    blue: "#648EFF",
    purple: "#B38BFF",
    green: "#4DF2B1",
    red: "#FF526F",
    orange: "#FFB86B",
    grid: "#233858",
};

const clamp = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
};

const fade = (f: number, start = 0, duration = 12) =>
    interpolate(f, [start, start + duration], [0, 1], clamp);

const enterY = (f: number, start = 0, distance = 36) =>
    interpolate(f, [start, start + 16], [distance, 0], {
        ...clamp,
        easing: Easing.out(Easing.cubic),
    });

const pulse = (f: number, offset = 0) =>
    0.5 + 0.5 * Math.sin((f + offset) * 0.105);

const glow = (color: string, blur = 20) =>
    `0 0 ${blur}px ${color}66, 0 0 ${blur * 2}px ${color}25`;

const assetPath = (path: string) =>
    String(path)
        .replace(/\\/g, "/")
        .replace(/^\/+/, "")
        .replace(/^public\//i, "");

// ------------------------------------------------------
// BACKGROUND: animated grid + ambient light
// ------------------------------------------------------

const Background: React.FC = () => {
    const f = useCurrentFrame();

    return (
        <AbsoluteFill
            style={{
                overflow: "hidden",
                background:
                    "radial-gradient(ellipse at 10% 22%, #123858 0%, transparent 35%), radial-gradient(ellipse at 90% 47%, #332052 0%, transparent 33%), radial-gradient(ellipse at 48% 95%, #073A42 0%, transparent 38%), #070B17",
            }}
        >
            <AbsoluteFill
                style={{
                    opacity: 0.17,
                    backgroundImage: `
                        linear-gradient(${C.grid} 1px, transparent 1px),
                        linear-gradient(90deg, ${C.grid} 1px, transparent 1px)
                    `,
                    backgroundSize: "64px 64px",
                    transform: `translate(${-(f * 0.24) % 64}px, ${-(f * 0.15) % 64}px)`,
                }}
            />

            {Array.from({ length: 26 }, (_, i) => {
                const x = (i * 173 + 49) % W;
                const y = (i * 283 + 113) % H;
                const color =
                    i % 3 === 0
                        ? C.cyan
                        : i % 3 === 1
                            ? C.purple
                            : C.green;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x,
                            top: y,
                            width: i % 4 === 0 ? 5 : 3,
                            height: i % 4 === 0 ? 5 : 3,
                            borderRadius: "50%",
                            background: color,
                            opacity: 0.12 + pulse(f, i * 7) * 0.42,
                            boxShadow: glow(color, 8),
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};

// ------------------------------------------------------
// TYPE: deliberately minimal
// ------------------------------------------------------

const Eyebrow: React.FC<{
    children: React.ReactNode;
    color?: string;
    f: number;
}> = ({ children, color = C.cyan, f }) => (
    <div
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: FONT,
            fontSize: 17,
            fontWeight: 900,
            letterSpacing: 2.4,
            color,
            opacity: fade(f),
        }}
    >
        <div
            style={{
                width: 24,
                height: 3,
                background: color,
                boxShadow: glow(color, 8),
            }}
        />
        {children}
    </div>
);

const Heading: React.FC<{
    f: number;
    eyebrow: string;
    title: string;
    subtitle?: string;
    color?: string;
}> = ({ f, eyebrow, title, subtitle, color = C.cyan }) => (
    <div
        style={{
            position: "absolute",
            top: 100,
            left: 66,
            right: 66,
            zIndex: 20,
            opacity: fade(f),
            transform: `translateY(${enterY(f)}px)`,
        }}
    >
        <Eyebrow f={f} color={color}>
            {eyebrow}
        </Eyebrow>

        <div
            style={{
                marginTop: 24,
                maxWidth: 950,
                fontFamily: FONT,
                fontSize: 57,
                fontWeight: 950,
                lineHeight: 1.06,
                letterSpacing: -2,
                color: C.white,
                textShadow: `0 0 34px ${color}22`,
            }}
        >
            {title}
        </div>

        {subtitle && (
            <div
                style={{
                    marginTop: 16,
                    maxWidth: 850,
                    fontFamily: FONT,
                    fontSize: 22,
                    fontWeight: 500,
                    lineHeight: 1.4,
                    color: C.muted,
                }}
            >
                {subtitle}
            </div>
        )}

        <div
            style={{
                marginTop: 23,
                height: 4,
                width: interpolate(f, [3, 25], [0, 150], clamp),
                borderRadius: 99,
                background: `linear-gradient(90deg, ${color}, ${C.purple})`,
                boxShadow: glow(color, 8),
            }}
        />
    </div>
);

const Caption: React.FC<{
    children: React.ReactNode;
    f: number;
    top: number;
    color?: string;
    size?: number;
}> = ({ children, f, top, color = C.white, size = 23 }) => (
    <div
        style={{
            position: "absolute",
            top,
            left: 75,
            right: 75,
            zIndex: 15,
            textAlign: "center",
            fontFamily: FONT,
            fontSize: size,
            fontWeight: 900,
            letterSpacing: 0.3,
            color,
            opacity: fade(f, 15),
        }}
    >
        {children}
    </div>
);

// ------------------------------------------------------
// SVG NETWORK CONNECTIONS
// ------------------------------------------------------

const LinkLine: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    f: number;
    start?: number;
    dashed?: boolean;
    width?: number;
}> = ({
    x1,
    y1,
    x2,
    y2,
    color = C.cyan,
    f,
    start = 0,
    dashed = false,
    width = 4,
}) => {
        const progress = interpolate(f, [start, start + 18], [0, 1], clamp);
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angle = Math.atan2(dy, dx);
        const head = 13;
        const ex = x1 + dx * progress;
        const ey = y1 + dy * progress;

        return (
            <svg
                width={W}
                height={H}
                viewBox={`0 0 ${W} ${H}`}
                style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "visible",
                    pointerEvents: "none",
                }}
            >
                <defs>
                    <filter id="mtls-line-glow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <line
                    x1={x1}
                    y1={y1}
                    x2={ex}
                    y2={ey}
                    stroke={color}
                    strokeWidth={width}
                    strokeLinecap="round"
                    strokeDasharray={dashed ? "9 13" : undefined}
                    opacity={fade(f, start, 5)}
                    filter="url(#mtls-line-glow)"
                />

                {progress > 0.94 && (
                    <polygon
                        points={[
                            `${ex},${ey}`,
                            `${ex - head * Math.cos(angle - 0.5)},${ey - head * Math.sin(angle - 0.5)}`,
                            `${ex - head * Math.cos(angle + 0.5)},${ey - head * Math.sin(angle + 0.5)}`,
                        ].join(" ")}
                        fill={color}
                    />
                )}
            </svg>
        );
    };

const MovingPacket: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    f: number;
    start?: number;
    duration?: number;
    size?: number;
}> = ({
    x1,
    y1,
    x2,
    y2,
    color = C.cyan,
    f,
    start = 0,
    duration = 70,
    size = 11,
}) => {
        const elapsed = Math.max(0, f - start);
        const t = (elapsed % duration) / duration;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;

        return (
            <div
                style={{
                    position: "absolute",
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    borderRadius: size / 3,
                    background: color,
                    boxShadow: glow(color, 15),
                    transform: `rotate(${t * 360}deg)`,
                    opacity: fade(f, start, 4),
                    zIndex: 10,
                }}
            />
        );
    };

// ------------------------------------------------------
// SERVICE NODE: icons first, text second
// ------------------------------------------------------

const ServiceNode: React.FC<{
    x: number;
    y: number;
    size?: number;
    name: string;
    sub?: string;
    color?: string;
    icon?: string;
    f: number;
    start?: number;
    danger?: boolean;
    pulseOffset?: number;
}> = ({
    x,
    y,
    size = 190,
    name,
    sub,
    color = C.cyan,
    icon = "▤",
    f,
    start = 0,
    danger = false,
    pulseOffset = 0,
}) => {
        const actualColor = danger ? C.red : color;
        const p = pulse(f, pulseOffset);

        return (
            <div
                style={{
                    position: "absolute",
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    boxSizing: "border-box",
                    borderRadius: 34,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: `radial-gradient(circle at 50% 20%, ${actualColor}30, #10182C 72%)`,
                    border: `2px solid ${actualColor}`,
                    boxShadow: `0 0 ${18 + p * 12}px ${actualColor}55, inset 0 0 25px ${actualColor}12`,
                    opacity: fade(f, start),
                    transform: `translateY(${enterY(f, start)}px) scale(${interpolate(f, [start, start + 14], [0.85, 1], clamp)})`,
                    zIndex: 8,
                }}
            >
                <div
                    style={{
                        width: size * 0.34,
                        height: size * 0.34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 23,
                        background: `${actualColor}18`,
                        border: `1px solid ${actualColor}88`,
                        color: actualColor,
                        fontFamily: FONT,
                        fontSize: size * 0.22,
                        fontWeight: 950,
                        textShadow: glow(actualColor, 12),
                    }}
                >
                    {icon}
                </div>

                <div
                    style={{
                        marginTop: 15,
                        color: C.white,
                        fontFamily: FONT,
                        fontSize: size > 170 ? 21 : 18,
                        fontWeight: 950,
                        textAlign: "center",
                        letterSpacing: 0.3,
                    }}
                >
                    {name}
                </div>

                {sub && (
                    <div
                        style={{
                            marginTop: 7,
                            color: danger ? "#FFB3C0" : C.muted,
                            fontFamily: FONT,
                            fontSize: 14,
                            fontWeight: 700,
                            textAlign: "center",
                        }}
                    >
                        {sub}
                    </div>
                )}
            </div>
        );
    };

// ------------------------------------------------------
// CERTIFICATE: visual object, not a text card
// ------------------------------------------------------

const Cert: React.FC<{
    x: number;
    y: number;
    f: number;
    color?: string;
    start?: number;
    label?: string;
    invalid?: boolean;
    scale?: number;
}> = ({
    x,
    y,
    f,
    color = C.cyan,
    start = 0,
    label = "CERT",
    invalid = false,
    scale = 1,
}) => {
        const actualColor = invalid ? C.red : color;
        const float = Math.sin((f + start) * 0.07) * 9;

        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: y + float,
                    width: 145 * scale,
                    height: 180 * scale,
                    boxSizing: "border-box",
                    padding: 15 * scale,
                    borderRadius: 18 * scale,
                    border: `2px solid ${actualColor}`,
                    background: `linear-gradient(145deg, ${actualColor}2C, #0B1427 78%)`,
                    boxShadow: glow(actualColor, 17),
                    opacity: fade(f, start),
                    transform: `rotate(${Math.sin((f + start) * 0.035) * 4}deg) scale(${interpolate(f, [start, start + 14], [0.75, 1], clamp)})`,
                    zIndex: 12,
                }}
            >
                <svg
                    width={100 * scale}
                    height={94 * scale}
                    viewBox="0 0 100 94"
                >
                    <path
                        d="M20 8 H68 L84 24 V77 H20 Z"
                        fill={`${actualColor}18`}
                        stroke={actualColor}
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M68 8 V24 H84"
                        fill="none"
                        stroke={actualColor}
                        strokeWidth="3"
                    />
                    <path
                        d="M32 39 H70 M32 49 H64 M32 59 H55"
                        stroke={actualColor}
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <circle
                        cx="71"
                        cy="70"
                        r="13"
                        fill="#0B1427"
                        stroke={actualColor}
                        strokeWidth="3"
                    />
                    <path
                        d="M64 70 L69 75 L78 64"
                        fill="none"
                        stroke={actualColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <div
                    style={{
                        marginTop: 5,
                        fontFamily: FONT,
                        fontSize: 14 * scale,
                        fontWeight: 950,
                        color: actualColor,
                        textAlign: "center",
                        letterSpacing: 1,
                    }}
                >
                    {invalid ? "INVALID" : label}
                </div>
            </div>
        );
    };

// ------------------------------------------------------
// SHIELD / CHECK / X VISUALS
// ------------------------------------------------------

const Shield: React.FC<{
    x: number;
    y: number;
    f: number;
    color?: string;
    start?: number;
    size?: number;
    crossed?: boolean;
}> = ({
    x,
    y,
    f,
    color = C.green,
    start = 0,
    size = 110,
    crossed = false,
}) => {
        const p = pulse(f, start);

        return (
            <div
                style={{
                    position: "absolute",
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: fade(f, start),
                    transform: `scale(${interpolate(f, [start, start + 14], [0.5, 1], clamp)})`,
                    filter: `drop-shadow(0 0 ${10 + p * 16}px ${color})`,
                    zIndex: 15,
                }}
            >
                <svg width={size} height={size} viewBox="0 0 100 110">
                    <path
                        d="M50 5 L88 20 V50 C88 76 72 94 50 105 C28 94 12 76 12 50 V20 Z"
                        fill={`${color}20`}
                        stroke={color}
                        strokeWidth="5"
                        strokeLinejoin="round"
                    />
                    {crossed ? (
                        <path
                            d="M35 38 L65 68 M65 38 L35 68"
                            stroke={color}
                            strokeWidth="7"
                            strokeLinecap="round"
                        />
                    ) : (
                        <path
                            d="M30 53 L44 67 L70 38"
                            fill="none"
                            stroke={color}
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}
                </svg>
            </div>
        );
    };

// ------------------------------------------------------
// SECTION 1: UNKNOWN SERVICE ATTACK
// ------------------------------------------------------

const HookVisual: React.FC = () => {
    const f = useCurrentFrame();
    const danger = f > 35;

    return (
        <AbsoluteFill>
            <Heading
                f={f}
                eyebrow="ZERO TRUST"
                title="Would you trust this service?"
                subtitle="An internal connection does not prove identity."
                color={C.red}
            />

            <LinkLine x1={260} y1={830} x2={820} y2={830} color={C.red} f={f} start={8} dashed />
            <MovingPacket x1={260} y1={830} x2={820} y2={830} color={C.red} f={f} start={12} duration={44} />

            <ServiceNode
                x={190} y={830} name="PAYMENT" sub="Legitimate workload"
                color={C.cyan} f={f} start={3} icon="▤"
            />

            <ServiceNode
                x={540} y={830} name="API" sub="Protected service"
                color={C.purple} f={f} start={8} icon="◇"
            />

            <ServiceNode
                x={890} y={830} name="UNKNOWN" sub="No trusted identity"
                color={C.red} f={f} start={15} danger={danger} icon="!"
            />

            <Cert x={380} y={590} f={f} start={18} color={C.red} invalid />

            <Shield
                x={720} y={830}
                f={f}
                start={34}
                color={C.red}
                crossed
                size={125}
            />

            <Caption f={f} top={1130} color={C.red}>
                {danger ? "IDENTITY NOT VERIFIED" : "REQUEST IN TRANSIT"}
            </Caption>

            <div
                style={{
                    position: "absolute",
                    left: 120,
                    right: 120,
                    top: 1220,
                    height: 5,
                    borderRadius: 99,
                    background: "#24324B",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${interpolate(f, [8, 42], [0, 100], clamp)}%`,
                        background: C.red,
                        boxShadow: glow(C.red, 12),
                    }}
                />
            </div>

            <Caption f={f} top={1290} color={C.white} size={20}>
                NETWORK ACCESS IS NOT TRUST
            </Caption>
        </AbsoluteFill>
    );
};

// ------------------------------------------------------
// SECTION 2: TLS VS MUTUAL TLS
// ------------------------------------------------------

const TlsVsMtlsVisual: React.FC = () => {
    const f = useCurrentFrame();
    const mutual = f > 48;

    return (
        <AbsoluteFill>
            <Heading
                f={f}
                eyebrow="THE HANDSHAKE"
                title="Who proves their identity?"
                subtitle="The difference is who must present a certificate."
                color={C.cyan}
            />

            <div
                style={{
                    position: "absolute",
                    left: 85,
                    top: 490,
                    width: 910,
                    height: 370,
                    borderRadius: 34,
                    border: `1px solid ${C.blue}66`,
                    background: `linear-gradient(130deg, ${C.blue}12, transparent)`,
                    opacity: fade(f),
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: 85,
                    top: 930,
                    width: 910,
                    height: 470,
                    borderRadius: 34,
                    border: `1px solid ${C.purple}77`,
                    background: `linear-gradient(130deg, ${C.purple}15, transparent)`,
                    opacity: fade(f, 42),
                }}
            />

            <Caption f={f} top={515} color={C.blue} size={20}>
                TLS
            </Caption>

            <ServiceNode
                x={245} y={690} size={175}
                name="CLIENT" sub="Verifies server"
                color={C.blue} f={f} start={4}
            />

            <ServiceNode
                x={835} y={690} size={175}
                name="SERVER" sub="Proves identity"
                color={C.green} f={f} start={6}
            />

            <LinkLine x1={335} y1={690} x2={745} y2={690} color={C.green} f={f} start={10} />
            <MovingPacket x1={345} y1={690} x2={740} y2={690} color={C.green} f={f} start={12} duration={55} />
            <Cert x={495} y={540} f={f} start={14} color={C.green} label="SERVER CERT" scale={0.8} />

            <Caption f={f} top={970} color={C.purple} size={20}>
                MUTUAL TLS
            </Caption>

            <ServiceNode
                x={245} y={1170} size={175}
                name="CLIENT" sub="Has certificate"
                color={C.cyan} f={f} start={44}
            />

            <ServiceNode
                x={835} y={1170} size={175}
                name="SERVER" sub="Has certificate"
                color={C.purple} f={f} start={47}
            />

            <LinkLine x1={335} y1={1135} x2={745} y2={1135} color={C.cyan} f={f} start={48} />
            <LinkLine x1={745} y1={1230} x2={335} y2={1230} color={C.purple} f={f} start={60} />

            <MovingPacket x1={345} y1={1135} x2={735} y2={1135} color={C.cyan} f={f} start={50} duration={55} />
            <MovingPacket x1={735} y1={1230} x2={345} y2={1230} color={C.purple} f={f} start={63} duration={55} />

            <Cert x={440} y={1015} f={f} start={51} color={C.cyan} label="CLIENT CERT" scale={0.72} />
            <Cert x={535} y={1255} f={f} start={63} color={C.purple} label="SERVER CERT" scale={0.72} />

            <Shield
                x={540} y={1175}
                f={f}
                start={74}
                color={C.green}
                size={92}
            />

            <Caption
                f={f}
                top={1440}
                color={mutual ? C.green : C.muted}
                size={21}
            >
                {mutual ? "BOTH SIDES VERIFIED" : "SERVER AUTHENTICATION"}
            </Caption>
        </AbsoluteFill>
    );
};

// ------------------------------------------------------
// SECTION 3: WORKLOAD IDENTITY
// ------------------------------------------------------

const ServiceIdentityVisual: React.FC = () => {
    const f = useCurrentFrame();

    return (
        <AbsoluteFill>
            <Heading
                f={f}
                eyebrow="IDENTITY"
                title="Every workload has an identity"
                subtitle="Certificates bind a trusted identity to a public key."
                color={C.purple}
            />

            <ServiceNode
                x={210} y={800} name="PAYMENT" sub="Workload A"
                color={C.cyan} f={f} start={4}
            />

            <ServiceNode
                x={870} y={800} name="INVENTORY" sub="Workload B"
                color={C.purple} f={f} start={8}
            />

            <LinkLine x1={300} y1={800} x2={780} y2={800} color={C.cyan} f={f} start={12} />
            <MovingPacket x1={300} y1={800} x2={780} y2={800} color={C.cyan} f={f} start={16} duration={58} />

            <Cert x={95} y={565} f={f} start={13} color={C.cyan} label="IDENTITY A" />
            <Cert x={835} y={565} f={f} start={18} color={C.purple} label="IDENTITY B" />

            <LinkLine x1={210} y1={680} x2={445} y2={1085} color={C.cyan} f={f} start={22} dashed />
            <LinkLine x1={870} y1={680} x2={635} y2={1085} color={C.purple} f={f} start={27} dashed />

            <div
                style={{
                    position: "absolute",
                    left: 320,
                    top: 1040,
                    width: 440,
                    height: 230,
                    borderRadius: 35,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${C.green}`,
                    background: "radial-gradient(circle, #174C45, #0B1528 76%)",
                    boxShadow: glow(C.green, 22),
                    opacity: fade(f, 28),
                    transform: `scale(${interpolate(f, [28, 45], [0.85, 1], clamp)})`,
                }}
            >
                <Shield x={540} y={1110} f={f} start={33} color={C.green} size={90} />
                <div
                    style={{
                        marginTop: 105,
                        fontFamily: FONT,
                        fontSize: 24,
                        fontWeight: 950,
                        color: C.green,
                    }}
                >
                    TRUSTED CA
                </div>
                <div
                    style={{
                        marginTop: 9,
                        fontFamily: FONT,
                        fontSize: 16,
                        fontWeight: 700,
                        color: C.muted,
                    }}
                >
                    Certificate authority
                </div>
            </div>

            <Caption f={f} top={1400} color={C.green}>
                VERIFY THE CHAIN. VERIFY THE IDENTITY.
            </Caption>
        </AbsoluteFill>
    );
};

// ------------------------------------------------------
// SECTION 4: CERTIFICATE REJECTION
// ------------------------------------------------------

const CertificateRejectionVisual: React.FC = () => {
    const f = useCurrentFrame();
    const rejected = f > 30;

    return (
        <AbsoluteFill>
            <Heading
                f={f}
                eyebrow="FAIL CLOSED"
                title="Invalid certificate?"
                subtitle="The handshake must stop before the connection is trusted."
                color={C.red}
            />

            <ServiceNode
                x={190} y={820} name="CLIENT" sub="Requesting access"
                color={C.cyan} f={f} start={3}
            />

            <ServiceNode
                x={890} y={820} name="SERVER" sub="Protected service"
                color={C.red} f={f} start={6} danger={rejected}
            />

            <LinkLine
                x1={280} y1={820} x2={800} y2={820}
                color={rejected ? C.red : C.orange}
                f={f} start={9} dashed
            />

            <MovingPacket
                x1={280} y1={820} x2={800} y2={820}
                color={C.orange} f={f} start={12} duration={44}
            />

            <Cert
                x={440} y={570} f={f} start={14}
                color={C.red} invalid scale={1.1}
            />

            <Shield
                x={650} y={820}
                f={f}
                start={28}
                color={C.red}
                crossed
                size={150}
            />

            <div
                style={{
                    position: "absolute",
                    left: 145,
                    right: 145,
                    top: 1090,
                    height: 4,
                    background: "#2A3348",
                    borderRadius: 99,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${interpolate(f, [8, 34], [0, 100], clamp)}%`,
                        background: C.red,
                        boxShadow: glow(C.red, 12),
                    }}
                />
            </div>

            <Caption f={f} top={1160} color={C.red} size={28}>
                {rejected ? "HANDSHAKE REJECTED" : "VALIDATING CERTIFICATE"}
            </Caption>

            <div
                style={{
                    position: "absolute",
                    left: 160,
                    right: 160,
                    top: 1280,
                    display: "flex",
                    justifyContent: "center",
                    gap: 18,
                    opacity: fade(f, 35),
                }}
            >
                {["EXPIRED", "UNTRUSTED", "INVALID"].map((word, i) => (
                    <div
                        key={word}
                        style={{
                            padding: "13px 16px",
                            borderRadius: 13,
                            border: `1px solid ${C.red}88`,
                            background: `${C.red}15`,
                            color: "#FFB4C0",
                            fontFamily: FONT,
                            fontSize: 15,
                            fontWeight: 900,
                        }}
                    >
                        {word}
                    </div>
                ))}
            </div>
        </AbsoluteFill>
    );
};

// ------------------------------------------------------
// SECTION 5: AUTOMATIC ROTATION
// ------------------------------------------------------

const AutoRotationVisual: React.FC = () => {
    const f = useCurrentFrame();

    const steps = [
        { x: 540, y: 600, label: "ISSUE", color: C.cyan },
        { x: 790, y: 830, label: "DEPLOY", color: C.purple },
        { x: 540, y: 1080, label: "ROTATE", color: C.green },
        { x: 290, y: 830, label: "RENEW", color: C.orange },
    ];

    const radius = 255;

    return (
        <AbsoluteFill>
            <Heading
                f={f}
                eyebrow="AUTOMATION"
                title="Rotate certificates automatically"
                subtitle="A service mesh can automate workload certificate lifecycle."
                color={C.green}
            />

            <svg
                width={W}
                height={H}
                viewBox={`0 0 ${W} ${H}`}
                style={{ position: "absolute", inset: 0 }}
            >
                <circle
                    cx={540}
                    cy={845}
                    r={radius}
                    fill="none"
                    stroke={C.green}
                    strokeWidth="3"
                    strokeDasharray="10 14"
                    opacity="0.55"
                />

                <circle
                    cx={540}
                    cy={845}
                    r={radius + 27}
                    fill="none"
                    stroke={C.cyan}
                    strokeWidth="1"
                    strokeDasharray="3 18"
                    opacity="0.3"
                />
            </svg>

            {steps.map((step, i) => {
                const active = ((f + i * 17) % 80) < 24;

                return (
                    <React.Fragment key={step.label}>
                        <div
                            style={{
                                position: "absolute",
                                left: step.x - 75,
                                top: step.y - 75,
                                width: 150,
                                height: 150,
                                borderRadius: 35,
                                border: `2px solid ${step.color}`,
                                background: `radial-gradient(circle, ${step.color}35, #10182B 78%)`,
                                boxShadow: active ? glow(step.color, 22) : glow(step.color, 8),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: step.color,
                                fontFamily: FONT,
                                fontSize: 24,
                                fontWeight: 950,
                                opacity: fade(f, 8 + i * 5),
                                transform: `scale(${active ? 1.05 : 1})`,
                            }}
                        >
                            {step.label}
                        </div>

                        <div
                            style={{
                                position: "absolute",
                                left: step.x - 10,
                                top: step.y - 112,
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: step.color,
                                boxShadow: glow(step.color, 14),
                                opacity: fade(f, 10 + i * 5),
                            }}
                        />
                    </React.Fragment>
                );
            })}

            <div
                style={{
                    position: "absolute",
                    left: 355,
                    top: 660,
                    width: 370,
                    height: 370,
                    borderRadius: "50%",
                    border: `2px solid ${C.cyan}88`,
                    background: "radial-gradient(circle, #193B52, #10152A 72%)",
                    boxShadow: glow(C.cyan, 20),
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: fade(f, 12),
                }}
            >
                <div
                    style={{
                        fontFamily: FONT,
                        fontSize: 70,
                        color: C.cyan,
                        fontWeight: 950,
                        textShadow: glow(C.cyan, 14),
                    }}
                >
                    mTLS
                </div>
                <div
                    style={{
                        marginTop: 10,
                        fontFamily: FONT,
                        fontSize: 18,
                        fontWeight: 800,
                        color: C.muted,
                    }}
                >
                    SERVICE MESH
                </div>
            </div>

            <MovingPacket
                x1={540} y1={600} x2={790} y2={830}
                color={C.cyan} f={f} start={8} duration={72} size={13}
            />
            <MovingPacket
                x1={790} y1={830} x2={540} y2={1080}
                color={C.purple} f={f} start={24} duration={72} size={13}
            />
            <MovingPacket
                x1={540} y1={1080} x2={290} y2={830}
                color={C.green} f={f} start={40} duration={72} size={13}
            />
            <MovingPacket
                x1={290} y1={830} x2={540} y2={600}
                color={C.orange} f={f} start={56} duration={72} size={13}
            />

            <Caption f={f} top={1250} color={C.green}>
                NO MANUAL CERTIFICATE HANDLING
            </Caption>

            <Caption f={f} top={1320} color={C.muted} size={19}>
                Monitor expiry. Automate renewal. Verify configuration.
            </Caption>
        </AbsoluteFill>
    );
};

// ------------------------------------------------------
// SECTION 6: DEFENSE IN DEPTH
// ------------------------------------------------------

const DefenseLayersVisual: React.FC = () => {
    const f = useCurrentFrame();

    const layers = [
        { label: "mTLS", color: C.cyan, icon: "01" },
        { label: "AUTHORIZATION", color: C.purple, icon: "02" },
        { label: "RATE LIMITING", color: C.green, icon: "03" },
    ];

    return (
        <AbsoluteFill>
            <Heading
                f={f}
                eyebrow="DEFENSE IN DEPTH"
                title="Identity is only layer one"
                subtitle="Authenticate the caller, then decide what it can do."
                color={C.purple}
            />

            <ServiceNode
                x={160} y={870} size={160}
                name="CLIENT" sub="Request"
                color={C.cyan} f={f} start={4}
            />

            <LinkLine x1={240} y1={870} x2={395} y2={870} color={C.cyan} f={f} start={10} />
            <MovingPacket x1={240} y1={870} x2={395} y2={870} color={C.cyan} f={f} start={12} duration={40} />

            {layers.map((layer, i) => {
                const y = 650 + i * 220;
                const delay = 10 + i * 13;

                return (
                    <React.Fragment key={layer.label}>
                        <div
                            style={{
                                position: "absolute",
                                left: 420,
                                top: y,
                                width: 390,
                                height: 145,
                                boxSizing: "border-box",
                                borderRadius: 26,
                                border: `2px solid ${layer.color}`,
                                background: `linear-gradient(110deg, ${layer.color}25, #10182B)`,
                                boxShadow: glow(layer.color, 12),
                                display: "flex",
                                alignItems: "center",
                                gap: 24,
                                padding: 24,
                                opacity: fade(f, delay),
                                transform: `translateX(${interpolate(f, [delay, delay + 15], [35, 0], clamp)}px)`,
                            }}
                        >
                            <div
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: layer.color,
                                    border: `1px solid ${layer.color}`,
                                    fontFamily: FONT,
                                    fontSize: 23,
                                    fontWeight: 950,
                                }}
                            >
                                {layer.icon}
                            </div>

                            <div
                                style={{
                                    fontFamily: FONT,
                                    fontSize: layer.label.length > 8 ? 18 : 25,
                                    fontWeight: 950,
                                    color: layer.color,
                                }}
                            >
                                {layer.label}
                            </div>
                        </div>

                        <Shield
                            x={850}
                            y={y + 72}
                            f={f}
                            start={delay + 5}
                            color={layer.color}
                            size={66}
                        />
                    </React.Fragment>
                );
            })}

            <LinkLine x1={810} y1={870} x2={910} y2={870} color={C.green} f={f} start={48} />

            <ServiceNode
                x={960} y={870} size={150}
                name="API" sub="Protected"
                color={C.green} f={f} start={52}
            />

            <Caption f={f} top={1450} color={C.green}>
                AUTHENTICATE → AUTHORIZE → PROTECT
            </Caption>
        </AbsoluteFill>
    );
};

// ------------------------------------------------------
// SECTION 7: CTA
// ------------------------------------------------------

const CtaVisual: React.FC = () => {
    const f = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame: f,
        fps,
        config: { damping: 14, stiffness: 90 },
    });

    return (
        <AbsoluteFill>
            <div
                style={{
                    position: "absolute",
                    left: 90,
                    right: 90,
                    top: 240,
                    textAlign: "center",
                    opacity: fade(f),
                    transform: `translateY(${enterY(f)}px)`,
                }}
            >
                <Eyebrow f={f} color={C.cyan}>
                    AI HUB INSIDER
                </Eyebrow>

                <div
                    style={{
                        marginTop: 38,
                        fontFamily: FONT,
                        fontSize: 64,
                        fontWeight: 950,
                        lineHeight: 1.07,
                        letterSpacing: -2,
                        color: C.white,
                    }}
                >
                    Trust the identity.
                    <br />
                    Not the network.
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 235,
                    top: 650,
                    width: 610,
                    height: 610,
                    borderRadius: "50%",
                    border: `2px solid ${C.cyan}66`,
                    boxShadow: glow(C.cyan, 20),
                    opacity: fade(f, 6),
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: 300,
                    top: 715,
                    width: 480,
                    height: 480,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #173B54, #101329 70%)",
                    border: `2px solid ${C.purple}`,
                    boxShadow: glow(C.purple, 24),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${scale})`,
                }}
            >
                <Shield
                    x={540}
                    y={955}
                    f={f}
                    start={8}
                    color={C.green}
                    size={220}
                />
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 100,
                    right: 100,
                    top: 1330,
                    textAlign: "center",
                    opacity: fade(f, 18),
                }}
            >
                <div
                    style={{
                        fontFamily: FONT,
                        fontSize: 27,
                        fontWeight: 950,
                        color: C.green,
                    }}
                >
                    STRICT mTLS OR PERMISSIVE MODE?
                </div>

                <div
                    style={{
                        marginTop: 25,
                        fontFamily: FONT,
                        fontSize: 22,
                        fontWeight: 650,
                        color: C.muted,
                    }}
                >
                    Share your approach in the comments.
                </div>

                <div
                    style={{
                        marginTop: 54,
                        fontFamily: FONT,
                        fontSize: 25,
                        fontWeight: 950,
                        color: C.white,
                    }}
                >
                    FOLLOW AI HUB INSIDER
                </div>

                <div
                    style={{
                        marginTop: 12,
                        fontFamily: FONT,
                        fontSize: 18,
                        fontWeight: 650,
                        color: C.muted,
                    }}
                >
                    Backend engineering · System design
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ------------------------------------------------------
// ROUTER
// Keep these IDs aligned with content/mtls.ts.
// ------------------------------------------------------

const VisualForSection: React.FC<{ id: string }> = ({ id }) => {
    switch (id) {
        case "hook":
            return <HookVisual />;

        case "tls-vs-mtls":
            return <TlsVsMtlsVisual />;

        case "service-identity":
            return <ServiceIdentityVisual />;

        case "certificate-rejection":
            return <CertificateRejectionVisual />;

        case "auto-rotation":
            return <AutoRotationVisual />;

        case "ending":
            return <DefenseLayersVisual />;

        case "cta":
            return <CtaVisual />;

        default:
            return <HookVisual />;
    }
};

// ------------------------------------------------------
// MAIN SCENE
// ------------------------------------------------------

export const MtlsScene: React.FC = () => {
    return (
        <AbsoluteFill
            style={{
                overflow: "hidden",
                backgroundColor: C.bg,
                fontFamily: FONT,
            }}
        >
            <Background />

            {TIMELINE.map((section) => (
                <Sequence
                    key={section.id}
                    from={section.start}
                    durationInFrames={section.duration}
                    name={section.id}
                >
                    <VisualForSection id={section.id} />

                    <Audio
                        src={staticFile(assetPath(section.audio))}
                        volume={1}
                    />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};

export default MtlsScene;
