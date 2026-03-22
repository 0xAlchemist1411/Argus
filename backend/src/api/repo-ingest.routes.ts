import { FastifyInstance } from "fastify"
import { repoQueue } from "../queue/repo.queue"
import { prisma } from "../db/prisma"

export default async function repoIngestRoutes(app: FastifyInstance) {

    app.post("/ingest", async (req, reply) => {

        const { repoUrl } = req.body as any

        const repo = await prisma.repository.upsert({
            where: { repoUrl },
            update: {},
            create: {
                repoUrl,
                name: repoUrl.split("/").pop()
            }
        })

        await repoQueue.add(
            "index-repo",
            {
                repoUrl,
                repoId: repo.id
            },
            {
                removeOnComplete: true,
                removeOnFail: true
            }
        )

        return {
            status: "indexing started",
            repoId: repo.id,
            name: repo.name
        }
    })
}