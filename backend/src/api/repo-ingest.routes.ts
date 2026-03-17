import { FastifyInstance } from "fastify"
import { repoQueue } from "../queue/repo.queue"

export default async function repoIngestRoutes(app: FastifyInstance) {

    app.post("/ingest", async (req, reply) => {

        const { repoUrl } = req.body as any

        repoQueue.add(
            "index-repo",
            { repoUrl },
            {
                removeOnComplete: true,
                removeOnFail: true
            }
        )

        return {
            status: "indexing started"
        }

    })

}