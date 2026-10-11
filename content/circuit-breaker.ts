import { VideoContent } from "./types";

export const circuitBreaker: VideoContent = {
    id: "circuit-breaker",
    title: "3 Circuit Breaker States in Microservices",
    subtitle: "Stop cascading failures and recover safely",

    sections: [
        {
            id: "hook",
            audio: "audio/circuit-breaker/hook.mp3",
            text: "How do you stop a single failing service from taking down your entire backend?"
        },

        {
            id: "overview",
            audio: "audio/circuit-breaker/overview.mp3",
            text: "Meet the Circuit Breaker. Three states. One mission: stop a failing service from taking down everything else."
        },

        {
            id: "closed",
            audio: "audio/circuit-breaker/closed.mp3",
            text: "First, Closed. Everything works normally. Requests flow through, and the breaker watches for failures and timeouts."
        },

        {
            id: "open",
            audio: "audio/circuit-breaker/open.mp3",
            text: "Then, failures spike. The breaker trips. Requests stop immediately. No more calls to the failing service. No wasted waiting. No endless pileup."
        },

        {
            id: "half-open",
            audio: "audio/circuit-breaker/half-open.mp3",
            text: "But when do you try again? Enter Half-Open. Let a few test requests through. Success? Close the breaker. Failure? Open it again."
        },

        {
            id: "comparison",
            audio: "audio/circuit-breaker/comparison.mp3",
            text: "Closed lets traffic through. Open blocks it. Half-Open tests recovery. Three states. One goal: stop one failure from taking down everything."
        },

        {
            id: "ending",
            audio: "audio/circuit-breaker/ending.mp3",
            text: "Pair circuit breakers with timeouts, bounded retries, and fallbacks. Resilience isn't about avoiding every failure. It's about containing the damage."
        },

        {
            id: "cta",
            audio: "audio/circuit-breaker/cta.mp3",
            text: "Follow AI Hub Insider for more system design breakdowns that actually matter in production."
        },
    ],
};