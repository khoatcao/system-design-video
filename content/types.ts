export type VideoSection = {
    id: string;
    title: string;
    text: string;
    audio: string;
};

export type VideoContent = {
    id: string;
    title: string;
    subtitle?: string;
    sections: VideoSection[];
};