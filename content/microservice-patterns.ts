
import { VideoContent } from "./types";

export const microservicePatterns: VideoContent = {
    id: "microservice-patterns",
    title: "Top 7 Microservice & Cloud Architecture Patterns",
    subtitle: "Seven essential patterns and design approaches for distributed systems",

    sections: [
        {
            id: "hook",
            audio: "audio/microservice-patterns/hook.mp3",
            text: "Building modern distributed systems? Here are seven essential microservice and cloud architecture patterns every software engineer should know.",
        },
        {
            id: "api-gateway",
            audio: "audio/microservice-patterns/api-gateway.mp3",
            text: "Number one, API Gateway. Give clients one entry point instead of exposing every service directly. The gateway can handle routing, authentication, and rate limiting. It simplifies client access while keeping backend services behind a clear boundary.",
        },
        {
            id: "circuit-breaker",
            audio: "audio/microservice-patterns/circuit-breaker.mp3",
            text: "Number two, Circuit Breaker. When a dependency keeps failing, stop calling it temporarily. The circuit opens, requests fail fast, and resources are protected. After a recovery period, test the service before returning to normal traffic.",
        },
        {
            id: "bulkhead",
            audio: "audio/microservice-patterns/bulkhead.mp3",
            text: "Number three, Bulkhead. Isolate thread pools, connection pools, or concurrency limits across dependencies. If one service becomes slow, it cannot consume every resource and starve unrelated requests. One failure should not sink the whole application.",
        },
        {
            id: "saga",
            audio: "audio/microservice-patterns/saga.mp3",
            text: "Number four, Saga. A business workflow spans multiple services, each with its own local transaction. If a later step fails, compensating actions reverse the earlier business effects. Use Saga when a distributed workflow cannot fit inside one database transaction.",
        },
        {
            id: "serverless",
            audio: "audio/microservice-patterns/serverless.mp3",
            text: "Number five, Serverless Architecture. Run code in managed functions, such as AWS Lambda, triggered by HTTP requests, messages, or scheduled events. The platform manages much of the infrastructure and scales execution automatically, although you still need to design for timeouts, retries, and cold starts.",
        },
        {
            id: "loose-coupling",
            audio: "audio/microservice-patterns/loose-coupling.mp3",
            text: "Number six, Loose Coupling with queues and pub-sub. Producers publish messages without directly depending on each consumer. A broker such as Kafka or RabbitMQ helps services communicate asynchronously, absorb traffic spikes, and evolve independently. Design for retries and duplicate messages.",
        },
        {
            id: "transactional-outbox",
            audio: "audio/microservice-patterns/transactional-outbox.mp3",
            text: "Number seven, Transactional Outbox. Write your business data and an event record to the same database transaction. A separate publisher sends the event to the broker. This prevents a database commit and event publish from drifting apart, while consumers still need to handle duplicates.",
        },
        {
            id: "recap",
            audio: "audio/microservice-patterns/recap.mp3",
            text: "Quick recap. API Gateway routes requests. Circuit Breaker limits cascading failures. Bulkhead isolates resources. Saga coordinates distributed workflows. Serverless runs managed functions. Loose Coupling enables asynchronous communication. Transactional Outbox reliably records events with database changes.",
        },
        {
            id: "ending",
            audio: "audio/microservice-patterns/ending.mp3",
            text: "These approaches solve different problems. Choose based on your traffic, failure modes, consistency needs, and operational trade-offs. More patterns do not automatically mean better architecture.",
        },
        {
            id: "cta",
            audio: "audio/microservice-patterns/cta.mp3",
            text: "Which architecture pattern powers your stack? Tell us in the comments, and follow AI Hub Insider for more visual system design and backend engineering breakdowns.",
        },
    ],
};