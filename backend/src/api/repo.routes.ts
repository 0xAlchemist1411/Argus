import { FastifyInstance } from "fastify"
import { prisma } from "../db/prisma"

export default async function repoRoutes(app: FastifyInstance) {

    app.get("/:repoId/files", async (req, reply) => {
        const { repoId } = req.params as any

        const files = await prisma.file.findMany({
            where: { repoId },
            select: { path: true }
        })

        return {
            files: files.map(f => f.path.replace(/^repos\/[^/]+\//, ""))
        }
    })

    app.get("/:repoId/summary", async (req) => {
        const { repoId } = req.params as any

        const repo = await prisma.repository.findUnique({
            where: { id: repoId },
            select: { summary: true }
        })

        return { summary: repo?.summary }
    })
}