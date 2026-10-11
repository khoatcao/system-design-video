import { VideoContent } from "./types";

export const apiRateLimiting: VideoContent = {
    id: "api-rate-limiting",

    title: "API Rate Limiting Algorithms",
    subtitle:
        "Token Bucket, Leaky Bucket, Fixed Window, and Sliding Window",

    sections: [
        {
            id: "hook",
            audio: "audio/api-rate-limiting/hook.mp3",
            text:
                "One hundred thousand requests just hit your API. Can it survive? Here are four rate limiting algorithms you need to know to protect your backend.",
        },

        {
            id: "token-bucket",
            audio: "audio/api-rate-limiting/token-bucket.mp3",
            text:
                "First, Token Bucket. Tokens refill at a steady rate, and every request spends one. This lets your API handle short bursts while still controlling the average request rate. Use it when you expect bursty traffic, like user actions or sudden traffic spikes.",
        },

        {
            id: "leaky-bucket",
            audio: "audio/api-rate-limiting/leaky-bucket.mp3",
            text:
                "Next, Leaky Bucket. Requests wait in a queue, then flow out at a steady rate. It smooths sudden traffic spikes and protects your backend from overload. Use it when you need predictable, steady traffic downstream.",
        },

        {
            id: "fixed-window",
            audio: "audio/api-rate-limiting/fixed-window.mp3",
            text:
                "Fixed Window is the simplest. Count requests in each time window and reject anything over the limit. It’s easy to implement, but the window boundary can create sudden bursts. Use it when you need simple, predictable quotas and implementation simplicity matters more than precision.",
        },

        {
            id: "sliding-window",
            audio: "audio/api-rate-limiting/sliding-window.mp3",
            text:
                "Sliding Window fixes that boundary problem. It tracks requests across a rolling time window, giving you more precise control over traffic. Use it when accurate rate limiting matters more than simplicity.",
        },

        {
            id: "comparison",
            audio: "audio/api-rate-limiting/comparison.mp3",
            text:
                "So, use Token Bucket for bursts, Leaky Bucket for smooth traffic, Fixed Window for simple quotas, and Sliding Window when precision matters.",
        },

        {
            id: "ending",
            audio: "audio/api-rate-limiting/ending.mp3",
            text:
                "So which rate limiting algorithm would you choose for your API?",
        },

        {
            id: "cta",
            audio: "audio/api-rate-limiting/cta.mp3",
            text:
                "Follow AI Hub Insider for daily backend and system design tips.",
        },
    ],
};
