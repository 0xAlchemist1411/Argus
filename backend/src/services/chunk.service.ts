import { prisma } from "../db/prisma"
import { createEmbedding } from "./embedding.service"

export async function chunkCode(fileId: string, code: string) {

    const lines = code.split("\n")

    const size = 100

    for (let i = 0; i < lines.length; i += size) {

        const chunk = lines.slice(i, i + size).join("\n")

        const embedding = await createEmbedding(chunk)

        await prisma.chunk.create({
            data: {
                content: chunk,
                embedding,
                fileId
            }
        })

    }

}