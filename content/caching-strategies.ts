import { VideoContent } from "./types";

export const cachingStrategies: VideoContent = {
    id: "caching-strategies",

    title: "3 Caching Strategies You Need to Know",
    subtitle:
        "Cache-Aside, Read-Through, and Write-Through",

    sections: [
        {
            id: "hook",
            audio: "audio/caching-strategies/hook.mp3",
            text:
                "Ever wondered how Netflix or Instagram handles huge traffic spikes?",
        },

        {
            id: "intro",
            audio: "audio/caching-strategies/intro.mp3",
            text:
                "One important piece is caching. Instead of hitting the database for every request, we keep frequently used data in a faster storage layer.",
        },

        {
            id: "cache-aside",
            audio: "audio/caching-strategies/cache-aside.mp3",
            text:
                "First: Cache-Aside. The application checks the cache first. If the data isn't there, it queries the database and stores the result in the cache.",
        },

        {
            id: "read-through",
            audio: "audio/caching-strategies/read-through.mp3",
            text:
                "Second: Read-Through. The application always reads through the cache. When data is missing, the cache automatically fetches it from the database.",
        },

        {
            id: "write-through",
            audio: "audio/caching-strategies/write-through.mp3",
            text:
                "Third: Write-Through. When the application writes data, the cache updates and synchronously persists it to the database.",
        },

        {
            id: "summary",
            audio: "audio/caching-strategies/summary.mp3",
            text:
                "So: Cache-Aside means the application manages the cache. Read-Through means the cache manages reads. And Write-Through means writes go through the cache to the database.",
        },

        {
            id: "cta",
            audio: "audio/caching-strategies/cta.mp3",
            text:
                "Which strategy does your application use? Follow AI Hub Insider for daily backend and system design tips.",
        },
    ],
};