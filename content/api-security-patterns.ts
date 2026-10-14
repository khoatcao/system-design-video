
import { VideoContent } from "./types";

export const apiSecurityPatterns: VideoContent = {
    id: "api-security-patterns",
    title: "4 API Security Patterns Every Engineer Should Know",
    subtitle: "Stop stolen tokens, service impersonation, injection, and traffic abuse",

    sections: [
        {
            id: "hook",
            audio: "audio/api-security-patterns/hook.mp3",
            text:
                "Your API is under attack. Stolen tokens. SQL injection. Thousands of requests hitting your backend at once. If every request reaches your database, you're already in trouble. Here are four security patterns that stop attacks before they take down your system.",
        },
        {
            id: "oauth2-jwt",
            audio: "audio/api-security-patterns/oauth2-jwt.mp3",
            text:
                "First, OAuth 2.0 and JWT. A user signs in and receives an access token. The API Gateway checks the request, and services validate the token's signature, issuer, audience, and expiration. An expired or invalid token gets rejected before protected business logic runs. Remember, a valid token does not automatically mean a user is authorized to access every resource.",
        },
        {
            id: "mtls",
            audio: "audio/api-security-patterns/mtls.mp3",
            text:
                "Second, mutual TLS. Imagine your payment service receives a request from another service. How does it know who is really calling? With mutual TLS, both sides verify certificates during the connection handshake, and traffic is encrypted. A service without a trusted identity should not be allowed to connect just because it lives inside your network.",
        },
        {
            id: "waf-sanitization",
            audio: "audio/api-security-patterns/waf-sanitization.mp3",
            text:
                "Third, a Web Application Firewall and input validation. An attacker sends a SQL injection payload through a search endpoint. The WAF can detect and block suspicious traffic. But don't rely on the WAF alone. Validate request schemas and use parameterized SQL queries, so user input stays data instead of becoming executable SQL.",
        },
        {
            id: "rate-limiting",
            audio: "audio/api-security-patterns/rate-limiting.mp3",
            text:
                "Fourth, rate limiting. One client sends hundreds of requests in seconds, exhausting your API and database connections. A rate limiter tracks requests by client or identity and allows traffic within a defined limit. Excess requests receive HTTP 429. Token Bucket and Sliding Window are two common ways to enforce those limits.",
        },
        {
            id: "comparison",
            audio: "audio/api-security-patterns/comparison.mp3",
            text:
                "These layers solve different problems. OAuth and JWT establish user identity and access claims. Mutual TLS authenticates services. WAF rules and input validation defend against malicious input. Rate limiting controls excessive traffic. Put them together, because no single security layer can protect your entire API.",
        },
        {
            id: "ending",
            audio: "audio/api-security-patterns/ending.mp3",
            text:
                "Now imagine you're protecting a payment API. Which layer would you implement first, and what attack would it stop? Tell me in the comments.",
        },
        {
            id: "cta",
            audio: "audio/api-security-patterns/cta.mp3",
            text:
                "Follow AI Hub Insider for daily backend engineering and system design tips.",
        },
    ],
};