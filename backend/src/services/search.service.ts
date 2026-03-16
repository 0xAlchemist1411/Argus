import { prisma } from "../db/prisma"
import { createEmbedding } from "./embedding.service"

function cosineSimilarity(a: number[], b: number[]) {

    let dot = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export async function searchChunks(repoId: string, query: string) {

    const queryEmbedding = await createEmbedding(query)

    const chunks = await prisma.chunk.findMany({
        where: {
            file: {
                repoId
            }
        },
        include: {
            file: true
        }
    })

    const scored = chunks.map(chunk => {

        const embedding = chunk.embedding as number[]

        const score = cosineSimilarity(queryEmbedding, embedding)

        return {
            score,
            content: chunk.content,
            file: chunk.file.path
        }

    })

    scored.sort((a, b) => b.score - a.score)

    return scored.slice(0, 5)

}