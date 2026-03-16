import pLimit from "p-limit"
import { prisma } from "../db/prisma"
import { createEmbedding } from "./embedding.service"

const limit = pLimit(5)

export async function chunkCode(fileId: string, code: string) {

    const lines = code.split("\n")
    const chunks: string[] = []

    for (let i = 0; i < lines.length; i += 100) {
        chunks.push(lines.slice(i, i + 100).join("\n"))
    }

    const tasks = chunks.map(chunk =>
        limit(async () => {

            const embedding = await createEmbedding(chunk)

            await prisma.chunk.create({
                data: {
                    content: chunk,
                    embedding,
                    fileId
                }
            })

        })
    )

    await Promise.all(tasks)

}