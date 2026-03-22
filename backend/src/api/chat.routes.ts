import { FastifyInstance } from "fastify"
import { chatWithRepo } from "../services/chat.service"
import { prisma } from "../db/prisma"

export default async function chatRoutes(app: FastifyInstance) {

    app.post("/", async (req, reply) => {
        const { repoId, question } = req.body as any

        if (!repoId || !question) {
            return reply.status(400).send({
                error: "repoId and question are required"
            })
        }

        const repo = await prisma.repository.findUnique({
            where: { id: repoId }
        })

        if (!repo) {
            return reply.status(404).send({
                error: "Repository not found"
            })
        }

        return await chatWithRepo(repoId, question)
    })
}