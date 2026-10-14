

import type { VideoContent } from "./types";

export const observabilityPillars: VideoContent = {
    id: "observability-pillars",
    title: "The 3 Pillars of Observability",
    subtitle: "Find the failure. Follow the request. Fix the bottleneck.",
    sections: [
        {
            id: "hook",
            audio: "audio/observability-pillars/hook.mp3",
            text: `Your checkout just slowed to a crawl. Fifty microservices. Hundreds of requests. And you have no idea where the failure started. Here's how engineers investigate a production outage using three signals.`,
        },
        {
            id: "metrics",
            audio: "audio/observability-pillars/metrics.mp3",
            text: `First, metrics expose the symptoms. Error rates are climbing. Latency is exploding. Metrics tell you something is wrong, but not exactly why.`,
        },
        {
            id: "logs",
            audio: "audio/observability-pillars/logs.mp3",
            text: `Next, inspect the logs. You find database timeouts and failed queries. Now you have clues about what went wrong, but you still need to connect them to the failing request.`,
        },
        {
            id: "distributed-tracing",
            audio: "audio/observability-pillars/distributed-tracing.mp3",
            text: `This is where distributed tracing helps. Follow one request across multiple services. The payment service responds in milliseconds, but a database call takes three seconds. You've found the bottleneck to investigate. A trace reveals where the time was spent, helping you narrow down the cause.`,
        },
        {
            id: "comparison",
            audio: "audio/observability-pillars/comparison.mp3",
            text: `Remember this. Metrics tell you something is wrong. Logs show what happened. Traces reveal where a request spent its time. Each signal answers a different question. Together, they turn guesswork into a focused investigation.`,
        },
        {
            id: "ending",
            audio: "audio/observability-pillars/ending.mp3",
            text: `In production, you rarely solve an incident with one signal alone. Correlate metrics, logs, and traces to understand the full picture.`,
        },
        {
            id: "cta",
            audio: "audio/observability-pillars/cta.mp3",
            text: `Which signal would you check first? Follow AI Hub Insider for more backend engineering breakdowns.`,
        },
    ],
};