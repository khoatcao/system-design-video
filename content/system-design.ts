import { VideoContent } from "./types";

export const systemDesign: VideoContent = {
    id: "system-design",

    title: "What Is System Design?",
    subtitle: "From writing code to designing systems",

    sections: [
        {
            id: "hook",
            title: "Writing Code Is Only Half the Job",
            text: `
Writing code is only half the job.

What happens when millions of users start using your application?
`,
            audio: "audio/01-hook.mp3",
        },

        {
            id: "problem",
            title: "The Problem",
            text: `
A system that works for one user may not work for a thousand...
or a million.

The architecture has to evolve.
`,
            audio: "audio/02-problem.mp3",
        },

        {
            id: "scalability",
            title: "Scalability",
            text: `
First, scalability.

When traffic grows, we need to handle more requests without breaking the system.

Instead of relying on one giant server, we can scale out by adding more machines behind a load balancer.
`,
            audio: "audio/03-scalability.mp3",
        },

        {
            id: "reliability",
            title: "Reliability",
            text: `
Next, reliability.

What happens when something fails?

A server can go down at any time.

With redundancy and failover, traffic can move to a replica, keeping the system alive.
`,
            audio: "audio/04-reliability.mp3",
        },

        {
            id: "maturity",
            title: "Engineering Maturity",
            text: `
This is where engineering maturity comes in.

You stop thinking only about code.

You start thinking about services, systems, platforms, and trade-offs like scale, latency, cost, and failure.
`,
            audio: "audio/05-maturity.mp3",
        },

        {
            id: "interview",
            title: "System Design Interviews",
            text: `
And that's exactly why System Design appears in engineering interviews.

The question isn't just whether you can write code.

It's whether you can design a system that serves millions of users.
`,
            audio: "audio/06-interview.mp3",
        },

        {
            id: "career",
            title: "Career Growth",
            text: `
System Design also changes how your career grows.

Your responsibility expands from building features...
to services...
to systems...
and eventually entire platforms.
`,
            audio: "audio/07-career.mp3",
        },

        {
            id: "final",
            title: "The Takeaway",
            text: `
System Design changes how you think about software.

You move from code...
to architecture...
to systems...
and finally, to real-world software.

Learn the concepts.

Then design the system.
`,
            audio: "audio/08-final.mp3",
        },
    ],
};