export type LoadBalancingSectionId =
    | "hook"
    | "round-robin"
    | "weighted-round-robin"
    | "least-connections"
    | "ip-hash"
    | "random"
    | "least-response-time"
    | "final";

export type LoadBalancingSection = {
    id: LoadBalancingSectionId;
    title: string;
    subtitle: string;
    text: string;
    audio: string;
    duration: number;
};

export const loadBalancing = {
    title: "Top 6 Load Balancing Algorithms",

    sections: [
        {
            id: "hook",
            title: "Top 6 Load Balancing Algorithms",
            subtitle: "How does a load balancer choose a server?",
            text:
                "You have thousands of requests hitting your application. But how does a load balancer decide which server gets each request? Let's break down the six most common load balancing algorithms.",
            audio: "audio/load-balancing_algorithms/hook.mp3",
            duration: 0,
        },
        {
            id: "round-robin",
            title: "1. Round Robin",
            subtitle: "Rotate requests between servers",
            text:
                "First, Round Robin. The load balancer simply rotates through the servers: Server 1, Server 2, Server 3, then back to Server 1. It's simple and works well when your servers have similar capacity and your requests are relatively uniform.",
            audio: "audio/load-balancing_algorithms/round-robin.mp3",
            duration: 0,
        },
        {
            id: "weighted-round-robin",
            title: "2. Weighted Round Robin",
            subtitle: "Give powerful servers more traffic",
            text:
                "But what if your servers have different capacities? Weighted Round Robin gives each server a weight. For example, a powerful server might get five times more traffic than a smaller one. This lets you distribute traffic according to server capacity.",
            audio: "audio/load-balancing_algorithms/weighted-round-robin.mp3",
            duration: 0,
        },
        {
            id: "least-connections",
            title: "3. Least Connections",
            subtitle: "Send traffic to the server with fewer connections",
            text:
                "Next, Least Connections. Instead of following a fixed order, the load balancer sends the request to the server with the fewest active connections. This is useful when requests take different amounts of time or connections stay open for a long time.",
            audio: "audio/load-balancing_algorithms/least-connections.mp3",
            duration: 0,
        },
        {
            id: "ip-hash",
            title: "4. IP Hash",
            subtitle: "Route the same client to the same server",
            text:
                "What if the same client needs to keep reaching the same server? IP Hash uses the client's IP address to determine the destination server. The same IP will generally be routed to the same server. This can provide session persistence, but it can also create uneven traffic when many users share the same IP.",
            audio: "audio/load-balancing_algorithms/ip-hash.mp3",
            duration: 0,
        },
        {
            id: "random",
            title: "5. Random",
            subtitle: "Randomly choose a server",
            text:
                "The fifth algorithm is Random. The load balancer simply chooses a server randomly for each request. It's extremely simple, but it doesn't consider how busy each server currently is.",
            audio: "audio/load-balancing_algorithms/random.mp3",
            duration: 0,
        },
        {
            id: "least-response-time",
            title: "6. Least Response Time",
            subtitle: "Favor servers responding faster",
            text:
                "Finally, Least Response Time. The load balancer considers how quickly servers are responding and can favor servers with lower latency. This can be useful when server performance varies, but it requires more monitoring and decision-making.",
            audio: "audio/load-balancing_algorithms/least-response-time.mp3",
            duration: 0,
        },
        {
            id: "final",
            title: "Which One Should You Use?",
            subtitle: "Choose based on your workload",
            text:
                "So, which one should you use? It depends on your workload. Similar servers? Round Robin. Different server capacities? Weighted Round Robin. Long-lived connections? Least Connections. Need session affinity? IP Hash. Simple stateless workload? Random. Highly variable server performance? Least Response Time. The key is choosing the algorithm that matches your workload.",
            audio: "audio/load-balancing_algorithms/final.mp3",
            duration: 0,
        },
    ] as LoadBalancingSection[],
};