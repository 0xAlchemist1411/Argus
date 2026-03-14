import { FastifyInstance } from "fastify"
import { repoQueue } from "../queue/repo.queue"

export default async function reposRoutes(app: FastifyInstance) {

    app.post("/ingest", async (req, reply) => {

        const { repoUrl } = req.body as any

        await repoQueue.add("index-repo", {
            repoUrl
        })

        return {
            status: "indexing started"
        }

    })

}