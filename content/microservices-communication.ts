import { VideoContent } from "./types";

const content: VideoContent = {
    id: "microservices-communication",
    title: "Microservices Communication Protocols",

    sections: [
        {
            id: "hook",
            audio: "audio/microservices-communication/hook.mp3",
            text:
                "REST, gRPC, WebSockets, or messaging. " +
                "How should your microservices communicate? " +
                "Let's break down four common patterns.",
        },

        {
            id: "rest",
            audio: "audio/microservices-communication/rest.mp3",
            text:
                "First, REST. REST uses HTTP and usually JSON for " +
                "request and response communication. It's simple, " +
                "human-readable, and widely supported. REST is a common " +
                "choice for public APIs, web applications, and mobile clients.",
        },

        {
            id: "grpc",
            audio: "audio/microservices-communication/grpc.mp3",
            text:
                "Second, gRPC. gRPC lets one service call another service " +
                "using a strongly typed contract. It uses HTTP/2 and " +
                "Protocol Buffers for compact binary messages. " +
                "It's commonly used for internal service-to-service calls " +
                "where efficient communication and strong contracts matter.",
        },

        {
            id: "websockets",
            audio: "audio/microservices-communication/websockets.mp3",
            text:
                "Third, WebSockets. Instead of opening a new request every " +
                "time something changes, WebSockets keep a persistent " +
                "connection open. Both the client and server can send data " +
                "at any time. This is useful for chat, live sports scores, " +
                "and real-time notifications.",
        },

        {
            id: "messaging",
            audio: "audio/microservices-communication/messaging.mp3",
            text:
                "Finally, event-driven messaging. Services publish events " +
                "to systems like Kafka, RabbitMQ, or SQS instead of waiting " +
                "for an immediate response. Consumers process those events " +
                "asynchronously. This helps decouple services and handle " +
                "background or high-volume workloads.",
        },

        {
            id: "comparison",
            audio: "audio/microservices-communication/comparison.mp3",
            text:
                "So which one should you choose? REST is a common choice " +
                "for client-facing APIs. gRPC fits synchronous internal " +
                "service-to-service calls. WebSockets fit real-time " +
                "bidirectional communication. And messaging fits " +
                "asynchronous, event-driven workflows.",
        },

        {
            id: "ending",
            audio: "audio/microservices-communication/ending.mp3",
            text:
                "The key is to choose based on the communication pattern, " +
                "not because one protocol is always better. " +
                "Follow AI Hub Insider for more system design tips.",
        },
    ],
};

export default content;