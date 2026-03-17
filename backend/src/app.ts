import Fastify from "fastify"
import chatRoutes from "./api/chat.routes"
import repoIngestRoutes from "./api/repo-ingest.routes"

export function buildApp() {

    const app = Fastify({
        logger: true
    })

    app.register(repoIngestRoutes, { prefix: "/repos" })
    app.register(chatRoutes, { prefix: "/chat" })

    return app
}