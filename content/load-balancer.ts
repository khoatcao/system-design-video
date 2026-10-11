import { VideoContent } from "./types";

export const loadBalancer: VideoContent = {
    id: "load-balancer",

    title: "What Is a Load Balancer?",
    subtitle:
        "How systems handle thousands of requests",

    sections: [
        {
            id: "hook",
            audio: "audio/load-balancer/hook.mp3",
            text:
                "What happens when one server can't handle all the traffic?",
        },

        {
            id: "problem",
            audio: "audio/load-balancer/problem.mp3",
            text:
                "Imagine your application suddenly gets thousands of requests. With only one server, all that traffic goes to the same machine.",
        },

        {
            id: "bottleneck",
            audio: "audio/load-balancer/bottleneck.mp3",
            text:
                "Eventually, CPU, memory, or network capacity becomes the bottleneck. And when that server goes down, your entire application goes down with it.",
        },

        {
            id: "solution",
            audio: "audio/load-balancer/solution.mp3",
            text:
                "That's where a load balancer comes in. It sits between your users and your servers.",
        },

        {
            id: "traffic",
            audio: "audio/load-balancer/traffic.mp3",
            text:
                "Instead of sending every request to one server, it distributes traffic across multiple servers.",
        },

        {
            id: "algorithms",
            audio: "audio/load-balancer/algorithms.mp3",
            text:
                "Depending on the configuration, it can use strategies like round robin, least connections, or weighted routing.",
        },

        {
            id: "health",
            audio: "audio/load-balancer/health.mp3",
            text:
                "But distributing traffic isn't enough. The load balancer also checks whether each server is healthy.",
        },

        {
            id: "failure",
            audio: "audio/load-balancer/failure.mp3",
            text:
                "If a server becomes unhealthy, the load balancer stops sending requests to it. Traffic is automatically routed to the remaining healthy servers.",
        },

        {
            id: "final",
            audio: "audio/load-balancer/final.mp3",
            text:
                "That's how a load balancer helps your system scale, stay available, and handle more traffic.",
        },
    ],
};