import { VideoContent } from "./types";

export const urlRequest: VideoContent = {
    id: "url-request",

    title: "What Happens When You Type a URL?",
    subtitle: "From your browser to the server",

    sections: [
        {
            id: "hook",
            title: "What Happens When You Type a URL?",
            text: `
What actually happens when you type a URL
and hit Enter?
`,
            audio: "audio/url-request/hook.mp3",
        },

        {
            id: "dns",
            title: "DNS",
            text: `
First, your browser needs to find the server's IP address.

DNS translates the domain name into an IP address.
`,
            audio: "audio/url-request/dns.mp3",
        },

        {
            id: "tcp",
            title: "TCP Connection",
            text: `
Next, your computer establishes a TCP connection
with the server.

This creates a reliable connection for the request.
`,
            audio: "audio/url-request/tcp.mp3",
        },

        {
            id: "tls",
            title: "TLS Encryption",
            text: `
Because we're using HTTPS,
TLS encrypts the connection.

Now the communication is secure.
`,
            audio: "audio/url-request/tls.mp3",
        },

        {
            id: "http",
            title: "HTTP Request",
            text: `
The browser can now send an HTTP request.

For example:

GET /
`,
            audio: "audio/url-request/http.mp3",
        },

        {
            id: "backend",
            title: "Load Balancer",
            text: `
The request reaches a load balancer.

It routes the request to one of the backend servers.
`,
            audio: "audio/url-request/backend.mp3",
        },

        {
            id: "database",
            title: "Cache and Database",
            text: `
The backend may need data from a cache
or a database.

Redis can provide fast cached data,
while PostgreSQL stores persistent data.
`,
            audio: "audio/url-request/database.mp3",
        },

        {
            id: "response",
            title: "The Response",
            text: `
Finally, the response travels back to your browser.

And the page appears.

One click.
Dozens of operations.
`,
            audio: "audio/url-request/response.mp3",
        },
    ],
};