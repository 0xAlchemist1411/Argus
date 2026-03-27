import { FastifyInstance } from "fastify"
import { prisma } from "../db/prisma"

export default async function repoRoutes(app: FastifyInstance) {

    app.get("/:repoId/files", async (req) => {
        const { repoId } = req.params as any

        const files = await prisma.file.findMany({
            where: { repoId },
            select: { path: true }
        })

        const uniquePaths = Array.from(new Set(files.map(f => f.path)))

        return {
            files: uniquePaths
        }
    })

    app.get("/:repoId/summary", async (req) => {
        const { repoId } = req.params as any

        const repo = await prisma.repository.findUnique({
            where: { id: repoId },
            select: {
                summary: true,
                status: true
            }
        })

        return repo
    })
}