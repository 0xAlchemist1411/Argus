import Fastify from "fastify"
import chatRoutes from "./api/chat.routes"
import repoIngestRoutes from "./api/repo-ingest.routes"
import repoRoutes from "./api/repo.routes"
import fileRoutes from "./api/file.routes"
import explainRoutes from "./api/explain.routes"
import symbolRoutes from "./api/symbol.routes"
import cors from "@fastify/cors"

export function buildApp() {

    const app = Fastify({
        logger: true
    })

    app.register(cors, {
        origin : "*",
    })

    app.register(repoIngestRoutes, { prefix: "/repos" })
    app.register(chatRoutes, { prefix: "/chat" })
    app.register(repoRoutes, { prefix: "/repo" })
    app.register(fileRoutes, { prefix: "/file" })
    app.register(explainRoutes, { prefix: "/explain" })
    app.register(symbolRoutes, { prefix: "/symbols" })

    return app
}