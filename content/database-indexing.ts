import { VideoContent } from "./types";

export const databaseIndexing: VideoContent = {
    id: "database-indexing",

    title: "How to Design Database Indexes",
    subtitle:
        "Design indexes from your query patterns",

    sections: [
        {
            id: "hook",
            audio: "audio/database-indexing/hook.mp3",
            text:
                "Your database has a million rows, but your query should return twenty. So how do you design the right index?",
        },

        {
            id: "query",
            audio: "audio/database-indexing/query.mp3",
            text:
                "Start with the query, not the table. Look at what your application actually asks the database to find, filter, and sort.",
        },

        {
            id: "access-pattern",
            audio: "audio/database-indexing/access-pattern.mp3",
            text:
                "Next, identify the access pattern. Are you filtering by equality, querying a range, or sorting by a column?",
        },

        {
            id: "choose-index",
            audio: "audio/database-indexing/choose-index.mp3",
            text:
                "Now choose the index based on that access pattern. For most relational database queries, a B-Tree is the default starting point.",
        },

        {
            id: "composite-index",
            audio: "audio/database-indexing/composite-index.mp3",
            text:
                "When a query filters on multiple columns, consider a composite index. For example, user ID, status, then created time.",
        },

        {
            id: "explain",
            audio: "audio/database-indexing/explain.mp3",
            text:
                "But don't stop after creating the index. Run EXPLAIN and check whether the database actually uses it instead of scanning the entire table.",
        },

        {
            id: "measure",
            audio: "audio/database-indexing/measure.mp3",
            text:
                "Then measure the real query performance. Compare latency, rows examined, and the execution plan before and after the index.",
        },

        {
            id: "tradeoff",
            audio: "audio/database-indexing/tradeoff.mp3",
            text:
                "Remember, indexes are not free. They can make reads faster, but they consume storage and increase the cost of inserts and updates.",
        },

        {
            id: "final",
            audio: "audio/database-indexing/final.mp3",
            text:
                "The rule is simple: design indexes for your access patterns, verify them with EXPLAIN, and measure the result.",
        },
    ],
};