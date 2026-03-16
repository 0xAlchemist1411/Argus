import Fastify from "fastify"
import reposRoutes from "./api/repos.routes"
import chatRoutes from "./api/chat.routes"

export function buildApp() {

    const app = Fastify({
        logger: true
    })

    app.register(reposRoutes, { prefix: "/repos" })
    app.register(chatRoutes, { prefix: "/chat" })

    return app
}