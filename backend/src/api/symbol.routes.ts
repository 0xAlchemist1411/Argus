import { FastifyInstance } from "fastify"
import { prisma } from "../db/prisma"

export default async function symbolRoutes(app: FastifyInstance) {

    app.get("/", async (req) => {
        const { repoId, name } = req.query as any
        const symbols = await prisma.symbol.findMany({
            where: {
                name,
                file: { repoId }
            },
            include: { file: true }
        })

        return symbols.map(s => ({
            name: s.name,
            file: s.file.path,
            line: s.line
        }))
    })
}