import { VideoContent } from "./types";

export const databaseDeadlocks: VideoContent = {
    id: "database-deadlocks",
    title: "4 Ways to Handle Database Deadlocks",
    subtitle: "Prevent them, detect them, and recover safely",

    sections: [
        {
            id: "hook",
            audio: "audio/database-deadlocks/hook.mp3",
            text: "What happens when two database transactions block each other forever? That's a database deadlock."
        },

        {
            id: "overview",
            audio: "audio/database-deadlocks/overview.mp3",
            text: "So, here are four practical ways to handle database deadlocks: prevent them, fail fast, and recover safely."
        },

        {
            id: "locking-order",
            audio: "audio/database-deadlocks/locking-order.mp3",
            text: "Number one: consistent locking order. Always lock resources in the same order. Use this when multiple services update the same rows or tables."
        },

        {
            id: "short-transactions",
            audio: "audio/database-deadlocks/short-transactions.mp3",
            text: "Number two: keep transactions short. Move slow logic and external API calls outside the transaction. Use this when locks are held too long."
        },

        {
            id: "lock-timeouts",
            audio: "audio/database-deadlocks/lock-timeouts.mp3",
            text: "Number three: use lock timeouts. Fail fast instead of waiting forever. Use this when blocked requests can safely fail and retry."
        },

        {
            id: "retry-backoff",
            audio: "audio/database-deadlocks/retry-backoff.mp3",
            text: "Number four: retry with exponential backoff and jitter. Use this when the transaction is safe to retry and the deadlock is temporary."
        },

        {
            id: "comparison",
            audio: "audio/database-deadlocks/comparison.mp3",
            text: "Here's the idea. Locking order and short transactions prevent deadlocks. Timeouts and retries help you recover when they happen."
        },

        {
            id: "ending",
            audio: "audio/database-deadlocks/ending.mp3",
            text: "Deadlocks happen in real systems. Make them fail fast. Then recover safely."
        },

        {
            id: "cta",
            audio: "audio/database-deadlocks/cta.mp3",
            text: "Follow AI Hub Insider for more visual system design and backend engineering breakdowns."
        },
    ],
};