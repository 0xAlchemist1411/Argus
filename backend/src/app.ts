import Fastify from "fastify"
import reposRoutes from "./api/repos.routes"

export function buildApp() {

    const app = Fastify({
        logger: true
    })

    app.register(reposRoutes, { prefix: "/repos" })

    return app
}