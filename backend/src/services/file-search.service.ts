import { prisma } from "../db/prisma"
import { createEmbedding } from "./embedding.service"
import { cosineSimilarity } from "./search.service"

export async function searchFiles(repoId: string, query: string) {

    const queryEmbedding = await createEmbedding(query)

    const files = await prisma.file.findMany({
        where: { repoId }
    })

    const scored = files.map(file => {

        const embedding = file.embedding as number[]

        const score = cosineSimilarity(queryEmbedding, embedding)

        return { file, score }

    })

    scored.sort((a, b) => b.score - a.score)

    return scored.slice(0, 3)

}