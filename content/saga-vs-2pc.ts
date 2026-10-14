
import { VideoContent } from "./types";

export const sagaVs2pc: VideoContent = {
    id: "saga-vs-2pc",
    title: "Saga Pattern vs. Two-Phase Commit",
    subtitle:
        "How to handle distributed transactions across microservices",

    sections: [
        {
            id: "hook",
            audio: "audio/saga-vs-2pc/hook.mp3",
            text:
                "How do you manage distributed transactions across microservices without locking up your database? When multiple services need to update data together, traditional database locking can destroy system performance.",
        },
        {
            id: "two-phase-commit",
            audio: "audio/saga-vs-2pc/two-phase-commit.mp3",
            text:
                "First up is Two-Phase Commit, or 2PC. It coordinates participants through a prepare phase and a commit phase. If every participant votes yes, the coordinator commits. Otherwise, it aborts. But participants may have to wait while the coordinator decides, creating blocking and reducing availability during failures.",
        },
        {
            id: "saga-pattern",
            audio: "audio/saga-vs-2pc/saga-pattern.mp3",
            text:
                "That's where the Saga Pattern comes in. Sagas break distributed transactions into a sequence of local transactions. Each service commits its own change and triggers the next step through events or commands. If a later step fails, the Saga runs compensating transactions to address earlier changes instead of relying on one global rollback.",
        },
        {
            id: "comparison",
            audio: "audio/saga-vs-2pc/comparison.mp3",
            text:
                "So, when should you use each? Two-Phase Commit is useful when you need atomic coordination and your infrastructure supports it. Saga is often better for long-running workflows across independent microservices, where availability and loose coupling matter. But Saga introduces eventual consistency and requires careful failure handling.",
        },
        {
            id: "ending",
            audio: "audio/saga-vs-2pc/ending.mp3",
            text:
                "Remember: 2PC coordinates one atomic outcome, while Saga coordinates multiple local transactions with compensating actions.",
        },
        {
            id: "cta",
            audio: "audio/saga-vs-2pc/cta.mp3",
            text:
                "Which approach would you choose for an e-commerce checkout? Drop your answer in the comments, and follow AI Hub Insider for daily backend engineering and system design tips!",
        },
    ],
};