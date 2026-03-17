import { FastifyInstance } from "fastify"
import { explainFile, explainFunction } from "../services/explain.service"

export default async function explainRoutes(app: FastifyInstance) {

    app.post("/file", async (req) => {
        const { filePath } = req.body as any
        const explanation = await explainFile(filePath)
        
        return { explanation }
    })

    app.post("/function", async (req) => {
        const { repoId, name } = req.body as any
        const explanation = await explainFunction(repoId, name)

        return { explanation }
    })

}