import "dotenv/config";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const apiKey = process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is missing from your .env file");
}

const client = new ElevenLabsClient({
    apiKey,
});

const voiceId = process.env.ELEVENLABS_VOICE_ID;

if (!voiceId) {
    throw new Error("ELEVENLABS_VOICE_ID is missing from your .env file");
}

async function loadTopic(topic: string) {
    const contentPath = path.resolve(
        "content",
        `${topic}.ts`
    );

    if (!fs.existsSync(contentPath)) {
        throw new Error(
            `Topic "${topic}" not found.\n` +
            `Expected file: ${contentPath}`
        );
    }

    const module = await import(
        pathToFileURL(contentPath).href
    );

    const content = Object.values(module).find(
        (value: any) =>
            value &&
            typeof value === "object" &&
            Array.isArray(value.sections)
    );

    if (!content) {
        throw new Error(
            `No valid VideoContent export found in ${contentPath}`
        );
    }

    return content as {
        title: string;
        sections: {
            id: string;
            text: string;
            audio?: string;
        }[];
    };
}

async function generateAudio(
    topic: string,
    id: string,
    text: string
) {
    console.log(`Generating ${topic}/${id}...`);

    const audio = await client.textToSpeech.convert(voiceId, {
        text,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
    });

    const chunks: Buffer[] = [];

    for await (const chunk of audio) {
        chunks.push(Buffer.from(chunk));
    }

    const outputPath = path.join(
        "public",
        "audio",
        topic,
        `${id}.mp3`
    );

    fs.mkdirSync(path.dirname(outputPath), {
        recursive: true,
    });

    fs.writeFileSync(
        outputPath,
        Buffer.concat(chunks)
    );

    console.log(`✓ Created ${outputPath}`);
}

async function main() {
    const topic = process.argv[2];

    if (!topic) {
        console.error(
            "Usage: npm run generate:voice -- <topic>"
        );

        console.error(
            "\nExample:"
        );

        console.error(
            "  npm run generate:voice -- url-request"
        );

        process.exit(1);
    }

    const content = await loadTopic(topic);

    console.log(`\nTopic: ${content.title}`);
    console.log(`Sections: ${content.sections.length}\n`);

    for (const section of content.sections) {
        await generateAudio(
            topic,
            section.id,
            section.text
        );
    }

    console.log(
        `\n✓ All audio generated for "${topic}".`
    );
}

main().catch((error) => {
    console.error("\n✗ Audio generation failed:");
    console.error(error);
    process.exit(1);
});