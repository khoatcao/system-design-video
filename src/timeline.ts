import { VideoContent } from "../content/types";

export const FPS = 30;

export type TimelineSection = {
    id: string;
    start: number;
    duration: number;
    audio: string;
};

type AudioDuration = {
    [key: string]: number;
};

const AUDIO_DURATIONS: AudioDuration = {
    // =====================================================
    // System Design
    // =====================================================
    "audio/system-design/hook.mp3": 7.123456,
    "audio/system-design/problem.mp3": 5.804989,
    "audio/system-design/scalability.mp3": 13.328254,
    "audio/system-design/reliability.mp3": 13.467574,
    "audio/system-design/maturity.mp3": 13.328254,
    "audio/system-design/interview.mp3": 10.309660,
    "audio/system-design/career.mp3": 11.192018,
    "audio/system-design/final.mp3": 13.235374,

    // =====================================================
    // URL Request
    // =====================================================
    "audio/url-request/hook.mp3": 2.925714,
    "audio/url-request/dns.mp3": 7.523265,
    "audio/url-request/tcp.mp3": 7.198186,
    "audio/url-request/tls.mp3": 5.758549,
    "audio/url-request/http.mp3": 4.922630,
    "audio/url-request/backend.mp3": 5.294150,
    "audio/url-request/database.mp3": 9.148662,
    "audio/url-request/response.mp3": 8.034104,

    // =====================================================
    // Load Balancer
    // =====================================================
    "audio/load-balancer/hook.mp3": 2.972154,
    "audio/load-balancer/problem.mp3": 8.126984,
    "audio/load-balancer/bottleneck.mp3": 9.473741,
    "audio/load-balancer/solution.mp3": 4.226032,
    "audio/load-balancer/traffic.mp3": 6.222948,
    "audio/load-balancer/algorithms.mp3": 6.315828,
    "audio/load-balancer/health.mp3": 6.733787,
    "audio/load-balancer/failure.mp3": 9.659501,
    "audio/load-balancer/final.mp3": 5.897868,

    // =====================================================
    // Load Balancing Algorithms
    // =====================================================
    "audio/load-balancing_algorithms/hook.mp3": 10.774059,
    "audio/load-balancing_algorithms/round-robin.mp3": 15.789569,
    "audio/load-balancing_algorithms/weighted-round-robin.mp3": 15.836009,
    "audio/load-balancing_algorithms/least-connections.mp3": 14.953651,
    "audio/load-balancing_algorithms/ip-hash.mp3": 20.015601,
    "audio/load-balancing_algorithms/random.mp3": 11.981497,
    "audio/load-balancing_algorithms/least-response-time.mp3": 14.767891,
    "audio/load-balancing_algorithms/final.mp3": 25.170431,

    // =====================================================
    // Caching Strategies
    // =====================================================
    "audio/caching-strategies/hook.mp3": 4.133152,
    "audio/caching-strategies/intro.mp3": 8.544943,
    "audio/caching-strategies/cache-aside.mp3": 9.102222,
    "audio/caching-strategies/read-through.mp3": 9.752381,
    "audio/caching-strategies/write-through.mp3": 8.452063,
    "audio/caching-strategies/summary.mp3": 10.031020,
    "audio/caching-strategies/cta.mp3": 6.687347,

    // =====================================================
    // Database Indexing
    // =====================================================
    "audio/database-indexing/hook.mp3": 7.383946,
    "audio/database-indexing/query.mp3": 6.919546,
    "audio/database-indexing/access-pattern.mp3": 7.151746,
    "audio/database-indexing/choose-index.mp3": 7.894785,
    "audio/database-indexing/composite-index.mp3": 7.801905,
    "audio/database-indexing/explain.mp3": 8.034104,
    "audio/database-indexing/measure.mp3": 8.126984,
    "audio/database-indexing/tradeoff.mp3": 9.520181,
    "audio/database-indexing/final.mp3": 7.105306,

    // =====================================================
    // Database Scaling
    // =====================================================
    "audio/database-scaling/hook.mp3": 7.569705,
    "audio/database-scaling/indexing.mp3": 13.096054,
    "audio/database-scaling/materialized.mp3": 17.925805,
    "audio/database-scaling/denormalization.mp3": 14.675011,
    "audio/database-scaling/vertical.mp3": 14.582132,
    "audio/database-scaling/caching.mp3": 16.021769,
    "audio/database-scaling/replication.mp3": 12.306576,
    "audio/database-scaling/sharding.mp3": 15.185850,
    "audio/database-scaling/ending.mp3": 10.866939,

    // =====================================================
    // Microservices Communication
    // =====================================================
    "audio/microservices-communication/hook.mp3": 8.405624,
    "audio/microservices-communication/rest.mp3": 15.696689,
    "audio/microservices-communication/grpc.mp3": 19.551202,
    "audio/microservices-communication/websockets.mp3": 19.876281,
    "audio/microservices-communication/messaging.mp3": 21.362358,
    "audio/microservices-communication/comparison.mp3": 20.526440,
    "audio/microservices-communication/ending.mp3": 10.402540,

    // =====================================================
    // API Rate Limiting
    // =====================================================

    "audio/api-rate-limiting/hook.mp3": 8.870023,

    "audio/api-rate-limiting/token-bucket.mp3": 18.065125,

    "audio/api-rate-limiting/leaky-bucket.mp3": 14.535692,

    "audio/api-rate-limiting/fixed-window.mp3": 16.718367,

    "audio/api-rate-limiting/sliding-window.mp3": 14.349932,

    "audio/api-rate-limiting/comparison.mp3": 10.077460,

    "audio/api-rate-limiting/ending.mp3": 3.297234,

    "audio/api-rate-limiting/cta.mp3": 4.551111,


    // =====================================================
    // Database Deadlocks
    // =====================================================
    "audio/database-deadlocks/hook.mp3": 6.037188,
    "audio/database-deadlocks/overview.mp3": 6.594467,
    "audio/database-deadlocks/locking-order.mp3": 10.634739,
    "audio/database-deadlocks/short-transactions.mp3": 9.241542,
    "audio/database-deadlocks/lock-timeouts.mp3": 9.102222,
    "audio/database-deadlocks/retry-backoff.mp3": 8.405624,
    "audio/database-deadlocks/comparison.mp3": 8.823583,
    "audio/database-deadlocks/ending.mp3": 5.340590,
    "audio/database-deadlocks/cta.mp3": 4.969070,




    // =====================================================
    // Circuit Breaker
    // =====================================================
    "audio/circuit-breaker/hook.mp3": 4.829751,
    "audio/circuit-breaker/overview.mp3": 6.269388,
    "audio/circuit-breaker/closed.mp3": 6.548027,
    "audio/circuit-breaker/open.mp3": 7.987664,
    "audio/circuit-breaker/half-open.mp3": 8.173424,
    "audio/circuit-breaker/comparison.mp3": 10.077460,
    "audio/circuit-breaker/ending.mp3": 9.473741,
    "audio/circuit-breaker/cta.mp3": 4.829751,

    // =====================================================
    // Microservice Patterns
    // =====================================================
    "audio/microservice-patterns/hook.mp3": 9.148662,
    "audio/microservice-patterns/api-gateway.mp3": 21.269478,
    "audio/microservice-patterns/circuit-breaker.mp3": 15.371610,
    "audio/microservice-patterns/bulkhead.mp3": 18.668844,
    "audio/microservice-patterns/saga.mp3": 20.712200,
    "audio/microservice-patterns/serverless.mp3": 20.526440,
    "audio/microservice-patterns/loose-coupling.mp3": 21.408798,
    "audio/microservice-patterns/transactional-outbox.mp3": 20.108481,
    "audio/microservice-patterns/recap.mp3": 23.312834,
    "audio/microservice-patterns/ending.mp3": 13.328254,
    "audio/microservice-patterns/cta.mp3": 13.885533,


    // =====================================================
    // Saga vs. Two-Phase Commit
    // =====================================================
    "audio/saga-vs-2pc/hook.mp3": 15.789569,
    "audio/saga-vs-2pc/two-phase-commit.mp3": 21.966077,
    "audio/saga-vs-2pc/saga-pattern.mp3": 25.588390,
    "audio/saga-vs-2pc/comparison.mp3": 22.523356,
    "audio/saga-vs-2pc/ending.mp3": 7.894785,
    "audio/saga-vs-2pc/cta.mp3": 10.959819,

    // =====================================================
    // API Security Patterns
    // =====================================================
    "audio/api-security-patterns/hook.mp3": 17.600726,
    "audio/api-security-patterns/oauth2-jwt.mp3": 27.445986,
    "audio/api-security-patterns/mtls.mp3": 23.498594,
    "audio/api-security-patterns/waf-sanitization.mp3": 24.613152,
    "audio/api-security-patterns/rate-limiting.mp3": 21.594558,
    "audio/api-security-patterns/comparison.mp3": 23.452154,
    "audio/api-security-patterns/ending.mp3": 9.798821,
    "audio/api-security-patterns/cta.mp3": 4.736871,

    // =====================================================
    // Observability Pillars
    // =====================================================
    "audio/observability-pillars/hook.mp3": 11.424218,
    "audio/observability-pillars/metrics.mp3": 14.164172,
    "audio/observability-pillars/logs.mp3": 15.603810,
    "audio/observability-pillars/distributed-tracing.mp3": 14.257052,
    "audio/observability-pillars/comparison.mp3": 12.910295,
    "audio/observability-pillars/ending.mp3": 7.058866,
    "audio/observability-pillars/cta.mp3": 10.123900,


};

export function createTimeline(content: VideoContent) {
    let currentFrame = 0;

    const sections: TimelineSection[] = content.sections.map((section) => {
        const audioPath = section.audio;

        const durationSeconds = AUDIO_DURATIONS[audioPath];

        if (
            durationSeconds === undefined ||
            durationSeconds <= 0
        ) {
            throw new Error(
                `Audio duration not found for "${audioPath}". ` +
                `Add the real duration to AUDIO_DURATIONS in src / timeline.ts`
            );
        }

        const duration = Math.ceil(durationSeconds * FPS);

        const item: TimelineSection = {
            id: section.id,
            start: currentFrame,
            duration,
            audio: section.audio,
        };

        currentFrame += duration;

        return item;
    });

    return {
        sections,
        totalFrames: currentFrame,
        totalDurationSeconds: currentFrame / FPS,
    };
}