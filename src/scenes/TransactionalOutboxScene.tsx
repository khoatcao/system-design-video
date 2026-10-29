
import React from "react";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    Easing,
    interpolate,
    staticFile,
    useCurrentFrame,
} from "remotion";

import { createTimeline } from "../timeline";
import { transactionalOutbox } from "../../content/transactional-outbox";

const timeline = createTimeline(transactionalOutbox);
const FPS = 30;

const C = {
    bg: "#07111F",
    panel: "#101E31",
    panel2: "#14263B",
    white: "#F4F7FB",
    muted: "#9FB1C8",
    cyan: "#4DB8FF",
    green: "#1FD1A5",
    purple: "#9B7CFF",
    orange: "#FFB86C",
    red: "#FF6376",
    border: "#29415D",
};

const clamp = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
};

const fadeUp = (frame: number, delay = 0, distance = 35) => {
    const progress = interpolate(
        frame,
        [delay, delay + 18],
        [0, 1],
        clamp,
    );

    return {
        opacity: progress,
        transform: `translateY(${interpolate(
            frame,
            [delay, delay + 18],
            [distance, 0],
            clamp,
        )}px)`,
    };
};

const appear = (frame: number, delay = 0) =>
    interpolate(frame, [delay, delay + 12], [0, 1], clamp);

const pulse = (frame: number, period = 42) =>
    0.75 + Math.sin((frame / period) * Math.PI * 2) * 0.25;

const progressAt = (frame: number, start: number, end: number) =>
    interpolate(frame, [start, end], [0, 1], clamp);

const Background: React.FC<{ frame: number }> = ({ frame }) => {
    const drift = (frame % 300) * 0.12;

    return (
        <AbsoluteFill
            style={{
                background: `radial-gradient(ellipse at 50% 15%, #142B49 0%, ${C.bg} 56%, #050B14 100%)`,
                overflow: "hidden",
            }}
        >
            {Array.from({ length: 8 }, (_, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        width: 280 + i * 38,
                        height: 280 + i * 38,
                        border: `1px solid ${i % 2 ? "#4DB8FF10" : "#9B7CFF0D"}`,
                        borderRadius: "50%",
                        left: `${-100 + i * 95}px`,
                        top: `${180 + i * 180 + drift}px`,
                    }}
                />
            ))}

            {Array.from({ length: 50 }, (_, i) => (
                <div
                    key={`dot-${i}`}
                    style={{
                        position: "absolute",
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        left: `${(i * 173 + 29) % 1080}px`,
                        top: `${(i * 241 + 53) % 1920}px`,
                        background: i % 3 === 0 ? C.cyan : C.purple,
                        opacity: 0.12 + (i % 4) * 0.05,
                    }}
                />
            ))}
        </AbsoluteFill>
    );
};

const Text: React.FC<{
    children: React.ReactNode;
    size?: number;
    color?: string;
    weight?: number;
    align?: React.CSSProperties["textAlign"];
    style?: React.CSSProperties;
}> = ({ children, size = 30, color = C.white, weight = 600, align = "center", style }) => (
    <div
        style={{
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: size,
            fontWeight: weight,
            color,
            textAlign: align,
            lineHeight: 1.3,
            ...style,
        }}
    >
        {children}
    </div>
);

const Header: React.FC<{
    frame: number;
    kicker: string;
    title: string;
    subtitle?: string;
}> = ({ frame, kicker, title, subtitle }) => (
    <div
        style={{
            position: "absolute",
            top: 105,
            left: 65,
            right: 65,
            ...fadeUp(frame, 0, 24),
        }}
    >
        <Text size={21} color={C.cyan} weight={800}>
            {kicker.toUpperCase()}
        </Text>
        <div style={{ height: 20 }} />
        <Text size={51} weight={850}>
            {title}
        </Text>
        {subtitle && (
            <>
                <div style={{ height: 16 }} />
                <Text size={25} color={C.muted} weight={450}>
                    {subtitle}
                </Text>
            </>
        )}
    </div>
);

const Card: React.FC<{
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    subtitle?: string;
    color?: string;
    frame: number;
    delay?: number;
    icon?: string;
    emphasis?: boolean;
}> = ({
    x,
    y,
    w,
    h,
    title,
    subtitle,
    color = C.cyan,
    frame,
    delay = 0,
    icon,
    emphasis = false,
}) => (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: w,
                height: h,
                boxSizing: "border-box",
                padding: 20,
                borderRadius: 22,
                background: emphasis
                    ? `linear-gradient(145deg, ${color}24, ${C.panel} 70%)`
                    : `linear-gradient(145deg, ${C.panel2}, ${C.panel})`,
                border: `2px solid ${color}${emphasis ? "CC" : "65"}`,
                boxShadow: emphasis ? `0 0 35px ${color}22` : "0 10px 28px #00000022",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                opacity: appear(frame, delay),
                transform: `translateY(${(1 - appear(frame, delay)) * 25}px) scale(${0.97 + appear(frame, delay) * 0.03})`,
            }}
        >
            {icon && (
                <div
                    style={{
                        width: 54,
                        height: 54,
                        borderRadius: 16,
                        background: `${color}20`,
                        border: `1px solid ${color}70`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        color,
                        fontWeight: 900,
                    }}
                >
                    {icon}
                </div>
            )}
            <Text size={25} weight={800}>
                {title}
            </Text>
            {subtitle && (
                <Text size={19} color={C.muted} weight={500}>
                    {subtitle}
                </Text>
            )}
        </div>
    );

const Tag: React.FC<{
    x: number;
    y: number;
    w: number;
    text: string;
    color: string;
    frame: number;
    delay?: number;
}> = ({ x, y, w, text, color, frame, delay = 0 }) => (
    <div
        style={{
            position: "absolute",
            left: x,
            top: y,
            width: w,
            padding: "13px 8px",
            boxSizing: "border-box",
            borderRadius: 13,
            background: `${color}18`,
            border: `1px solid ${color}95`,
            opacity: appear(frame, delay),
        }}
    >
        <Text size={18} color={color} weight={800}>
            {text}
        </Text>
    </div>
);

const Arrow: React.FC<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    frame: number;
    color?: string;
    delay?: number;
    dashed?: boolean;
    packet?: boolean;
}> = ({
    x1,
    y1,
    x2,
    y2,
    frame,
    color = C.cyan,
    delay = 0,
    dashed = false,
    packet = false,
}) => {
        const p = progressAt(frame, delay, delay + 15);
        const endX = x1 + (x2 - x1) * p;
        const endY = y1 + (y2 - y1) * p;
        const packetP = (frame - delay) % 40 / 40;

        return (
            <svg
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                    pointerEvents: "none",
                }}
            >
                <line
                    x1={x1}
                    y1={y1}
                    x2={endX}
                    y2={endY}
                    stroke={color}
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeDasharray={dashed ? "10 9" : undefined}
                    opacity={0.9}
                />
                {p > 0.92 && (
                    <polygon
                        points={`${x2},${y2} ${x2 - Math.sign(x2 - x1 || 1) * 16},${y2 - 9} ${x2 - Math.sign(x2 - x1 || 1) * 16},${y2 + 9}`}
                        fill={color}
                    />
                )}
                {packet && p > 0.95 && (
                    <circle
                        cx={x1 + (x2 - x1) * packetP}
                        cy={y1 + (y2 - y1) * packetP}
                        r={8}
                        fill={color}
                        stroke={C.white}
                        strokeWidth={2}
                    />
                )}
            </svg>
        );
    };

const Pill: React.FC<{
    frame: number;
    text: string;
    color: string;
    y: number;
    delay?: number;
}> = ({ frame, text, color, y, delay = 0 }) => (
    <div
        style={{
            position: "absolute",
            top: y,
            left: 100,
            right: 100,
            padding: 17,
            borderRadius: 18,
            background: `${color}18`,
            border: `1px solid ${color}80`,
            opacity: appear(frame, delay),
            boxShadow: `0 0 25px ${color}15`,
        }}
    >
        <Text size={23} color={color} weight={800}>
            {text}
        </Text>
    </div>
);

const TableCard: React.FC<{
    x: number;
    y: number;
    title: string;
    color: string;
    frame: number;
    delay: number;
    rows: string[];
    highlight?: number;
}> = ({ x, y, title, color, frame, delay, rows, highlight = -1 }) => (
    <div
        style={{
            position: "absolute",
            left: x,
            top: y,
            width: 395,
            borderRadius: 20,
            overflow: "hidden",
            border: `2px solid ${color}90`,
            background: C.panel,
            opacity: appear(frame, delay),
            transform: `translateY(${(1 - appear(frame, delay)) * 22}px)`,
            boxShadow: `0 0 30px ${color}12`,
        }}
    >
        <div
            style={{
                padding: 19,
                background: `${color}20`,
                borderBottom: `1px solid ${color}70`,
            }}
        >
            <Text size={24} color={color} weight={850}>
                {title}
            </Text>
        </div>
        {rows.map((row, i) => (
            <div
                key={row}
                style={{
                    padding: "16px 18px",
                    borderBottom: i === rows.length - 1 ? "none" : `1px solid ${C.border}`,
                    background: i === highlight && frame > delay + 25 ? `${color}18` : "transparent",
                }}
            >
                <Text
                    size={19}
                    color={i === highlight && frame > delay + 25 ? color : C.muted}
                    align="left"
                    weight={i === highlight ? 750 : 500}
                >
                    {row}
                </Text>
            </div>
        ))}
    </div>
);

// ------------------------------------------------------------
// 1. HOOK: order succeeds, but the event never reaches Kafka.
// ------------------------------------------------------------

const HookScene: React.FC<{ frame: number }> = ({ frame }) => {
    const crashed = frame > 58;
    const eventProgress = progressAt(frame, 28, 55);

    return (
        <AbsoluteFill>
            <Header
                frame={frame}
                kicker="Production incident"
                title="The order succeeded."
                subtitle="But the event never reached Kafka."
            />

            <Card
                x={75} y={485} w={280} h={190}
                title="Order API"
                subtitle="HTTP 201 Created"
                color={C.green}
                icon="✓"
                frame={frame}
                delay={5}
                emphasis
            />

            <Card
                x={400} y={485} w={280} h={190}
                title="PostgreSQL"
                subtitle="Order committed"
                color={C.cyan}
                icon="DB"
                frame={frame}
                delay={14}
                emphasis
            />

            <Card
                x={725} y={485} w={280} h={190}
                title="Kafka"
                subtitle={crashed ? "Event missing" : "Waiting for event"}
                color={crashed ? C.red : C.purple}
                icon={crashed ? "!" : "K"}
                frame={frame}
                delay={24}
                emphasis={crashed}
            />

            <Arrow
                x1={355} y1={580} x2={400} y2={580}
                frame={frame} color={C.green} delay={12}
            />

            <Arrow
                x1={680} y1={580} x2={725} y2={580}
                frame={frame} color={C.red} delay={28} dashed
            />

            {frame > 28 && frame < 58 && (
                <div
                    style={{
                        position: "absolute",
                        left: 675 + eventProgress * 30,
                        top: 548,
                        width: 48,
                        height: 48,
                        borderRadius: 13,
                        background: `${C.orange}20`,
                        border: `2px solid ${C.orange}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C.orange,
                        fontWeight: 900,
                        fontSize: 15,
                    }}
                >
                    EVT
                </div>
            )}

            {crashed && (
                <>
                    <div
                        style={{
                            position: "absolute",
                            left: 665,
                            top: 535,
                            width: 68,
                            height: 68,
                            borderRadius: "50%",
                            background: `${C.red}25`,
                            border: `3px solid ${C.red}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 37,
                            color: C.red,
                            fontWeight: 900,
                            opacity: appear(frame, 58),
                        }}
                    >
                        ×
                    </div>
                    <Pill
                        frame={frame}
                        text="SERVICE CRASHED BEFORE PUBLISH"
                        color={C.red}
                        y={760}
                        delay={60}
                    />
                </>
            )}

            <Card
                x={135} y={1000} w={350} h={150}
                title="Inventory"
                subtitle="Never received OrderCreated"
                color={C.orange}
                icon="!"
                frame={frame}
                delay={72}
            />

            <Card
                x={595} y={1000} w={350} h={150}
                title="Payment"
                subtitle="Never received OrderCreated"
                color={C.orange}
                icon="!"
                frame={frame}
                delay={82}
            />

            <Arrow x1={865} y1={675} x2={315} y2={1000} frame={frame} color={C.red} delay={75} dashed />
            <Arrow x1={865} y1={675} x2={770} y2={1000} frame={frame} color={C.red} delay={80} dashed />

            <Text
                size={32}
                color={C.white}
                weight={850}
                style={{ position: "absolute", top: 1300, left: 65, right: 65 }}
            >
                How do you prevent a lost event?
            </Text>

            <Pill
                frame={frame}
                text="TRANSACTIONAL OUTBOX PATTERN"
                color={C.cyan}
                y={1410}
                delay={105}
            />
        </AbsoluteFill>
    );
};

// ------------------------------------------------------------
// 2. PROBLEM: make the dual-write gap explicit.
// ------------------------------------------------------------

const ProblemScene: React.FC<{ frame: number }> = ({ frame }) => {
    const committed = frame > 28;
    const crashed = frame > 68;

    return (
        <AbsoluteFill>
            <Header
                frame={frame}
                kicker="The root cause"
                title="The dual-write problem"
                subtitle="Two systems. Two separate operations. One dangerous gap."
            />

            <Card
                x={90} y={470} w={400} h={180}
                title="Order Service"
                subtitle="Handle checkout"
                color={C.purple}
                icon="API"
                frame={frame}
                delay={4}
            />

            <TableCard
                x={95} y={760}
                title="orders"
                color={C.green}
                frame={frame}
                delay={15}
                rows={[
                    "order_id: ORD-1042",
                    "status: CREATED",
                    committed ? "COMMIT: SUCCESS ✓" : "Transaction: pending...",
                ]}
                highlight={2}
            />

            <Card
                x={600} y={470} w={390} h={180}
                title="Kafka publish"
                subtitle={crashed ? "Never executed" : "Second operation"}
                color={crashed ? C.red : C.orange}
                icon={crashed ? "×" : "→"}
                frame={frame}
                delay={35}
                emphasis={crashed}
            />

            <Arrow x1={290} y1={650} x2={290} y2={760} frame={frame} color={C.green} delay={20} />
            <Arrow x1={490} y1={555} x2={600} y2={555} frame={frame} color={C.orange} delay={40} dashed />

            {committed && (
                <Tag
                    x={130} y={990} w={320}
                    text="DATABASE COMMITTED"
                    color={C.green}
                    frame={frame}
                    delay={30}
                />
            )}

            {crashed && (
                <>
                    <Pill
                        frame={frame}
                        text="CRASH BETWEEN THE TWO WRITES"
                        color={C.red}
                        y={1100}
                        delay={68}
                    />
                    <Card
                        x={125} y={1260} w={830} h={140}
                        title="Blind retries can duplicate events"
                        subtitle="The publisher may not know whether the first attempt succeeded."
                        color={C.orange}
                        icon="!"
                        frame={frame}
                        delay={82}
                    />
                </>
            )}
        </AbsoluteFill>
    );
};

// ------------------------------------------------------------
// 3. ATOMIC WRITE: business row + event row in one transaction.
// ------------------------------------------------------------

const AtomicWriteScene: React.FC<{ frame: number }> = ({ frame }) => {
    const committed = frame > 88;
    const rollback = frame > 120;

    return (
        <AbsoluteFill>
            <Header
                frame={frame}
                kicker="The solution"
                title="One database transaction"
                subtitle="Store the business data and the event together."
            />

            <Card
                x={320} y={390} w={440} h={130}
                title="Order Service"
                subtitle="BEGIN TRANSACTION"
                color={C.purple}
                icon="TX"
                frame={frame}
                delay={5}
            />

            <div
                style={{
                    position: "absolute",
                    left: 65,
                    top: 575,
                    width: 950,
                    height: 560,
                    border: `3px solid ${rollback ? C.red : committed ? C.green : C.cyan}`,
                    borderRadius: 30,
                    background: `${C.cyan}05`,
                    opacity: appear(frame, 12),
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: -22,
                        left: 35,
                        padding: "9px 18px",
                        borderRadius: 12,
                        background: C.bg,
                        color: rollback ? C.red : committed ? C.green : C.cyan,
                        fontWeight: 850,
                        fontSize: 20,
                    }}
                >
                    {rollback ? "TRANSACTION ROLLED BACK" : committed ? "TRANSACTION COMMITTED ✓" : "SINGLE DB TRANSACTION"}
                </div>
            </div>

            <TableCard
                x={105} y={680}
                title="orders"
                color={C.green}
                frame={frame}
                delay={22}
                rows={[
                    "order_id: ORD-1042",
                    "status: CREATED",
                    "customer_id: C-89",
                ]}
                highlight={frame > 35 ? 0 : -1}
            />

            <TableCard
                x={580} y={680}
                title="outbox_events"
                color={C.cyan}
                frame={frame}
                delay={40}
                rows={[
                    "event_id: EVT-9001",
                    "type: OrderCreated",
                    "published: false",
                ]}
                highlight={frame > 58 ? 0 : -1}
            />

            <Arrow x1={320} y1={520} x2={300} y2={680} frame={frame} color={C.green} delay={20} />
            <Arrow x1={760} y1={520} x2={775} y2={680} frame={frame} color={C.cyan} delay={38} />

            <Text
                size={26}
                color={rollback ? C.red : committed ? C.green : C.muted}
                style={{ position: "absolute", top: 1190, left: 70, right: 70 }}
            >
                {rollback
                    ? "If either write fails, both writes roll back."
                    : committed
                        ? "Both records are now safely stored."
                        : "Both inserts succeed or both roll back."}
            </Text>

            <Pill
                frame={frame}
                text={rollback ? "NO PARTIAL DATABASE WRITE" : committed ? "EVENT READY FOR RELAY" : "ATOMIC DATABASE WRITE"}
                color={rollback ? C.red : committed ? C.green : C.cyan}
                y={1300}
                delay={65}
            />

            <Text
                size={21}
                color={C.muted}
                style={{ position: "absolute", top: 1450, left: 90, right: 90 }}
            >
                Kafka is not part of this database transaction.
            </Text>
        </AbsoluteFill>
    );
};

// ------------------------------------------------------------
// 4. RELAY: polling and CDC are two different approaches.
// ------------------------------------------------------------

const RelayScene: React.FC<{ frame: number }> = ({ frame }) => {
    const cdcActive = frame > 105;

    return (
        <AbsoluteFill>
            <Header
                frame={frame}
                kicker="Reliable event delivery"
                title="The relay delivers events"
                subtitle="Two common approaches to publish committed outbox records."
            />

            <TableCard
                x={60} y={455}
                title="outbox_events"
                color={C.cyan}
                frame={frame}
                delay={4}
                rows={[
                    "EVT-9001 · OrderCreated",
                    "EVT-9002 · PaymentRequested",
                    "EVT-9003 · InventoryReserved",
                ]}
                highlight={frame > 25 ? 0 : -1}
            />

            <Card
                x={590} y={455} w={425} h={170}
                title="Polling worker"
                subtitle="Query unpublished rows"
                color={C.orange}
                icon="↻"
                frame={frame}
                delay={20}
            />

            <Arrow x1={455} y1={565} x2={590} y2={550} frame={frame} color={C.orange} delay={25} packet />

            <Card
                x={590} y={680} w={425} h={145}
                title="Kafka"
                subtitle="Publish event records"
                color={C.purple}
                icon="K"
                frame={frame}
                delay={45}
            />

            <Arrow x1={800} y1={625} x2={800} y2={680} frame={frame} color={C.purple} delay={48} packet />

            <Tag
                x={605} y={850} w={395}
                text="POLL → PUBLISH → TRACK"
                color={C.orange}
                frame={frame}
                delay={55}
            />

            <div
                style={{
                    position: "absolute",
                    left: 75,
                    right: 75,
                    top: 980,
                    height: 2,
                    background: C.border,
                    opacity: appear(frame, 75),
                }}
            />

            <Card
                x={65} y={1030} w={400} h={170}
                title="PostgreSQL WAL"
                subtitle="Committed changes"
                color={C.green}
                icon="CDC"
                frame={frame}
                delay={80}
                emphasis={cdcActive}
            />

            <Card
                x={590} y={1030} w={425} h={170}
                title="Debezium"
                subtitle="Capture database changes"
                color={C.cyan}
                icon="↗"
                frame={frame}
                delay={95}
                emphasis={cdcActive}
            />

            <Arrow x1={465} y1={1115} x2={590} y2={1115} frame={frame} color={C.cyan} delay={98} packet />

            <Card
                x={310} y={1270} w={460} h={145}
                title="Kafka"
                subtitle="Change events delivered downstream"
                color={C.purple}
                icon="K"
                frame={frame}
                delay={115}
            />

            <Arrow x1={800} y1={1200} x2={700} y2={1270} frame={frame} color={C.purple} delay={120} packet />

            <Pill
                frame={frame}
                text="BOTH DECOUPLE DELIVERY FROM CHECKOUT"
                color={C.green}
                y={1470}
                delay={125}
            />
        </AbsoluteFill>
    );
};

// ------------------------------------------------------------
// 5. RELIABILITY: at-least-once delivery and idempotency.
// ------------------------------------------------------------

const ReliabilityScene: React.FC<{ frame: number }> = ({ frame }) => {
    const published = frame > 25;
    const crashed = frame > 58;
    const retried = frame > 88;
    const deduplicated = frame > 125;

    const steps = [
        { n: "01", text: "Relay publishes EVT-9001", color: C.green, active: published },
        { n: "02", text: "Relay crashes before recording success", color: C.red, active: crashed },
        { n: "03", text: "Relay restarts and publishes again", color: C.orange, active: retried },
        { n: "04", text: "Consumer recognizes duplicate event ID", color: C.cyan, active: deduplicated },
    ];

    return (
        <AbsoluteFill>
            <Header
                frame={frame}
                kicker="The delivery catch"
                title="One event. Two deliveries."
                subtitle="The relay can crash after Kafka accepts the event."
            />

            <Card
                x={65} y={440} w={280} h={160}
                title="Relay"
                subtitle={crashed ? "Restarting..." : "Publishing"}
                color={crashed ? C.red : C.orange}
                icon={crashed ? "!" : "↗"}
                frame={frame}
                delay={5}
                emphasis={crashed}
            />

            <Card
                x={400} y={440} w={280} h={160}
                title="Kafka"
                subtitle={retried ? "Event received twice" : published ? "Event received" : "Waiting"}
                color={C.purple}
                icon="K"
                frame={frame}
                delay={15}
                emphasis={retried}
            />

            <Card
                x={735} y={440} w={280} h={160}
                title="Consumer"
                subtitle={deduplicated ? "Duplicate ignored" : "Processing event"}
                color={C.cyan}
                icon="✓"
                frame={frame}
                delay={25}
                emphasis={deduplicated}
            />

            <Arrow x1={345} y1={520} x2={400} y2={520} frame={frame} color={C.green} delay={20} packet />
            <Arrow x1={680} y1={520} x2={735} y2={520} frame={frame} color={C.cyan} delay={38} packet />

            {retried && (
                <Tag
                    x={420} y={630} w={240}
                    text="EVT-9001 × 2"
                    color={C.orange}
                    frame={frame}
                    delay={88}
                />
            )}

            <div
                style={{
                    position: "absolute",
                    left: 80,
                    right: 80,
                    top: 745,
                    padding: 25,
                    borderRadius: 24,
                    border: `1px solid ${C.border}`,
                    background: `${C.panel}E8`,
                }}
            >
                {steps.map((step, i) => (
                    <div
                        key={step.n}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 18,
                            marginBottom: i === steps.length - 1 ? 0 : 22,
                            opacity: step.active ? 1 : 0.25,
                        }}
                    >
                        <div
                            style={{
                                width: 54,
                                height: 54,
                                flexShrink: 0,
                                borderRadius: 15,
                                background: `${step.color}20`,
                                border: `1px solid ${step.color}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: step.color,
                                fontWeight: 900,
                                fontSize: 20,
                            }}
                        >
                            {step.n}
                        </div>
                        <div style={{ flex: 1 }}>
                            <Text size={22} color={step.active ? C.white : C.muted} align="left">
                                {step.text}
                            </Text>
                        </div>
                        {step.active && (
                            <Text size={23} color={step.color}>✓</Text>
                        )}
                    </div>
                ))}
            </div>

            <Card
                x={110} y={1270} w={390} h={160}
                title="Business effect"
                subtitle={deduplicated ? "Applied once" : "Waiting"}
                color={C.green}
                icon="✓"
                frame={frame}
                delay={115}
                emphasis={deduplicated}
            />

            <Card
                x={580} y={1270} w={390} h={160}
                title="Event ID"
                subtitle="EVT-9001 · Already processed"
                color={C.cyan}
                icon="#"
                frame={frame}
                delay={125}
                emphasis={deduplicated}
            />

            <Pill
                frame={frame}
                text="AT-LEAST-ONCE DELIVERY + IDEMPOTENT CONSUMERS"
                color={C.green}
                y={1500}
                delay={130}
            />
        </AbsoluteFill>
    );
};

// ------------------------------------------------------------
// 6. ENDING: one concise architecture recap.
// ------------------------------------------------------------

const EndingScene: React.FC<{ frame: number }> = ({ frame }) => (
    <AbsoluteFill>
        <Header
            frame={frame}
            kicker="Remember this"
            title="Atomic storage. Reliable delivery."
            subtitle="The Outbox Pattern closes the dual-write gap."
        />

        <Card
            x={65} y={490} w={280} h={180}
            title="Order Service"
            subtitle="Business operation"
            color={C.purple}
            icon="API"
            frame={frame}
            delay={4}
        />

        <Card
            x={400} y={490} w={280} h={180}
            title="Outbox"
            subtitle="Atomic DB transaction"
            color={C.green}
            icon="DB"
            frame={frame}
            delay={18}
            emphasis
        />

        <Card
            x={735} y={490} w={280} h={180}
            title="Kafka"
            subtitle="Asynchronous events"
            color={C.cyan}
            icon="K"
            frame={frame}
            delay={32}
        />

        <Arrow x1={345} y1={580} x2={400} y2={580} frame={frame} color={C.green} delay={15} packet />
        <Arrow x1={680} y1={580} x2={735} y2={580} frame={frame} color={C.cyan} delay={32} packet />

        {[
            {
                n: "01",
                title: "Write together",
                desc: "Business row + event row",
                color: C.green,
            },
            {
                n: "02",
                title: "Relay separately",
                desc: "Polling or CDC",
                color: C.cyan,
            },
            {
                n: "03",
                title: "Handle duplicates",
                desc: "Unique IDs + idempotency",
                color: C.orange,
            },
        ].map((item, i) => (
            <div
                key={item.n}
                style={{
                    position: "absolute",
                    top: 830 + i * 165,
                    left: 100,
                    right: 100,
                    height: 125,
                    padding: 20,
                    boxSizing: "border-box",
                    borderRadius: 20,
                    border: `1px solid ${item.color}70`,
                    background: `${item.color}10`,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    ...fadeUp(frame, 48 + i * 16),
                }}
            >
                <div
                    style={{
                        width: 65,
                        height: 65,
                        borderRadius: 18,
                        background: `${item.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.color,
                        fontSize: 24,
                        fontWeight: 900,
                        flexShrink: 0,
                    }}
                >
                    {item.n}
                </div>
                <div style={{ flex: 1 }}>
                    <Text size={25} align="left" weight={850}>
                        {item.title}
                    </Text>
                    <div style={{ height: 6 }} />
                    <Text size={19} color={C.muted} align="left">
                        {item.desc}
                    </Text>
                </div>
            </div>
        ))}

        <Text
            size={22}
            color={C.orange}
            weight={750}
            style={{ position: "absolute", top: 1420, left: 70, right: 70 }}
        >
            Atomic database write ≠ exactly-once delivery
        </Text>
    </AbsoluteFill>
);

// ------------------------------------------------------------
// 7. CTA: separate from the technical recap.
// ------------------------------------------------------------

const CtaScene: React.FC<{ frame: number }> = ({ frame }) => {
    const glow = pulse(frame, 60);

    return (
        <AbsoluteFill>
            <Header
                frame={frame}
                kicker="Your turn"
                title="Polling or Debezium CDC?"
                subtitle="Which approach would you choose for your system?"
            />

            <div
                style={{
                    position: "absolute",
                    top: 465,
                    left: 240,
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    border: `2px solid ${C.cyan}45`,
                    boxShadow: `0 0 ${50 * glow}px ${C.cyan}22`,
                    opacity: appear(frame, 10),
                }}
            />

            <Card
                x={100} y={630} w={390} h={220}
                title="Polling"
                subtitle="Simple worker · Query rows"
                color={C.orange}
                icon="↻"
                frame={frame}
                delay={10}
                emphasis
            />

            <Card
                x={590} y={630} w={390} h={220}
                title="Debezium CDC"
                subtitle="Capture committed changes"
                color={C.cyan}
                icon="↗"
                frame={frame}
                delay={25}
                emphasis
            />

            <Text
                size={32}
                color={C.white}
                weight={850}
                style={{ position: "absolute", top: 1030, left: 75, right: 75 }}
            >
                Tell us why in the comments.
            </Text>

            <div
                style={{
                    position: "absolute",
                    top: 1160,
                    left: 150,
                    right: 150,
                    padding: 26,
                    borderRadius: 25,
                    background: `linear-gradient(110deg, ${C.cyan}24, ${C.purple}24)`,
                    border: `1px solid ${C.cyan}80`,
                    ...fadeUp(frame, 40),
                }}
            >
                <Text size={36} weight={900}>
                    AI HUB INSIDER
                </Text>
                <div style={{ height: 12 }} />
                <Text size={22} color={C.muted}>
                    Backend engineering · System design · Distributed systems
                </Text>
            </div>

            <Pill
                frame={frame}
                text="FOLLOW FOR MORE SYSTEM DESIGN"
                color={C.green}
                y={1450}
                delay={60}
            />
        </AbsoluteFill>
    );
};

// ------------------------------------------------------------
// Main composition
// ------------------------------------------------------------

export const TransactionalOutboxScene: React.FC = () => {
    const frame = useCurrentFrame();

    const activeSection =
        timeline.sections.find(
            (section) =>
                frame >= section.start &&
                frame < section.start + section.duration,
        ) ?? timeline.sections[timeline.sections.length - 1];

    const localFrame = activeSection
        ? frame - activeSection.start
        : frame;

    const sceneById: Record<string, React.ReactNode> = {
        hook: <HookScene frame={localFrame} />,
        problem: <ProblemScene frame={localFrame} />,
        "atomic-write": <AtomicWriteScene frame={localFrame} />,
        relay: <RelayScene frame={localFrame} />,
        reliability: <ReliabilityScene frame={localFrame} />,
        ending: <EndingScene frame={localFrame} />,
        cta: <CtaScene frame={localFrame} />,
    };

    const totalFrames = timeline.totalFrames;
    const overallProgress = interpolate(
        frame,
        [0, Math.max(1, totalFrames)],
        [0, 1],
        clamp,
    );

    return (
        <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
            <Background frame={frame} />

            {timeline.sections.map((section) => (
                <Sequence
                    key={section.id}
                    from={section.start}
                    durationInFrames={section.duration}
                >
                    <Audio src={staticFile(section.audio)} />
                </Sequence>
            ))}

            <AbsoluteFill>
                {activeSection && sceneById[activeSection.id]}
            </AbsoluteFill>

            {/* Brand footer */}
            <div
                style={{
                    position: "absolute",
                    bottom: 43,
                    left: 55,
                    right: 55,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: 0.9,
                }}
            >
                <Text size={18} color={C.muted} weight={750}>
                    AI HUB INSIDER
                </Text>
                <Text size={17} color={C.muted}>
                    BACKEND / SYSTEM DESIGN
                </Text>
            </div>

            {/* Playback progress */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 7,
                    background: "#FFFFFF10",
                }}
            >
                <div
                    style={{
                        width: `${overallProgress * 100}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${C.cyan}, ${C.purple}, ${C.green})`,
                    }}
                />
            </div>
        </AbsoluteFill>
    );
};
