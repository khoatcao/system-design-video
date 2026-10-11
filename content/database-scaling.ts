import { VideoContent } from "./types";

const content: VideoContent = {
    id: "database-scaling",
    title: "7 Must-Know Database Scaling Strategies",

    sections: [
        {
            id: "hook",
            audio: "audio/database-scaling/hook.mp3",
            text:
                "Your database CPU hits 99 percent during a traffic spike. " +
                "What do you do? Here are seven ways to scale your database.",
        },

        {
            id: "indexing",
            audio: "audio/database-scaling/indexing.mp3",
            text:
                "First, indexing. If your queries repeatedly filter, join, " +
                "or sort by the same columns, an index can avoid scanning the " +
                "entire table. Reads become much faster, but indexes consume " +
                "storage and make writes more expensive.",
        },

        {
            id: "materialized",
            audio: "audio/database-scaling/materialized.mp3",
            text:
                "Second, materialized views. Instead of calculating expensive " +
                "joins and aggregations every time, precompute the result and " +
                "store it. This is great for dashboards and reports, but the " +
                "data can become stale and refreshing the view costs resources.",
        },

        {
            id: "denormalization",
            audio: "audio/database-scaling/denormalization.mp3",
            text:
                "Third, denormalization. If your application constantly joins " +
                "the same tables, duplicate some data to make reads simpler " +
                "and faster. The tradeoff is more storage and more complexity " +
                "when duplicated data needs to stay consistent.",
        },

        {
            id: "vertical",
            audio: "audio/database-scaling/vertical.mp3",
            text:
                "Fourth, vertical scaling. Give your database more CPU, RAM, " +
                "or faster storage. It's simple and usually requires fewer " +
                "application changes, but eventually you hit the limits of " +
                "a single machine.",
        },

        {
            id: "caching",
            audio: "audio/database-scaling/caching.mp3",
            text:
                "Fifth, caching. Put frequently requested data in Redis or " +
                "Memcached. Cache hits can completely bypass the database, " +
                "dramatically reducing database load. But now you have to " +
                "deal with expiration, invalidation, and stale data.",
        },

        {
            id: "replication",
            audio: "audio/database-scaling/replication.mp3",
            text:
                "Sixth, replication. Keep one primary database for writes " +
                "and send read traffic to replicas. This helps scale " +
                "read-heavy workloads and improves availability, but replicas " +
                "can lag behind the primary.",
        },

        {
            id: "sharding",
            audio: "audio/database-scaling/sharding.mp3",
            text:
                "Finally, sharding. Split your data across multiple database " +
                "servers using a shard key. This lets you scale data and write " +
                "throughput horizontally, but cross-shard queries, transactions, " +
                "hotspots, and rebalancing become much harder.",
        },

        {
            id: "ending",
            audio: "audio/database-scaling/ending.mp3",
            text:
                "Don't jump straight to sharding. First identify the bottleneck, " +
                "then choose the simplest strategy that solves it. Follow " +
                "AI Hub Insider for more system design tips.",
        },
    ],
};

export default content;