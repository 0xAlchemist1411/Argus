import { FastifyInstance } from "fastify"
import fs from "fs"

export default async function fileRoutes(app: FastifyInstance) {

    app.get("/", async (req, reply) => {

        const { path } = req.query as any

        if (!path) {
            return reply.status(400).send({ error: "path is required" })
        }

        try {
            const content = await fs.promises.readFile(path, "utf-8")
            return { content }
        } catch (err) {
            return reply.status(404).send({ error: "File not found" })
        }
    })
}