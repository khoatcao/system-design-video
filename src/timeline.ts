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
    // System Design
    "01-hook.mp3": 6.083628,
    "02-problem.mp3": 7.569705,
    "03-scalability.mp3": 12.910295,
    "04-reliability.mp3": 12.956735,
    "05-maturity.mp3": 13.374694,
    "06-interview.mp3": 11.192018,
    "07-career.mp3": 11.470658,
    "08-final.mp3": 13.839093,

    // URL Request
    // URL Request
    "hook.mp3": 2.925714,
    "dns.mp3": 7.523265,
    "tcp.mp3": 7.198186,
    "tls.mp3": 5.758549,
    "http.mp3": 4.922630,
    "backend.mp3": 5.294150,
    "database.mp3": 9.148662,
    "response.mp3": 8.034104,
};

export function createTimeline(content: VideoContent) {
    let currentFrame = 0;

    const sections: TimelineSection[] = content.sections.map((section) => {
        const fileName = section.audio.split("/").pop() ?? section.audio;

        const durationSeconds = AUDIO_DURATIONS[fileName];

        if (durationSeconds === undefined) {
            throw new Error(
                `Audio duration not found for "${fileName}". ` +
                `Add it to AUDIO_DURATIONS in src/timeline.ts`
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