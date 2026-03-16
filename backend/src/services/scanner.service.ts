import fs from "fs"
import path from "path"
import { prisma } from "../db/prisma"
import { chunkCode } from "./chunk.service"
import { createEmbedding } from "./embedding.service"
import { isCodeFile, shouldIgnoreDir } from "../utils/file.utils"
import { extractSymbols } from "./symbol.service"

export async function scanRepo(repoPath: string, repoId: string) {

    const files: string[] = []

    function walk(dir: string) {

        const entries = fs.readdirSync(dir)

        for (const entry of entries) {

            const fullPath = path.join(dir, entry)

            const stat = fs.statSync(fullPath)

            if (stat.isDirectory()) {

                if (shouldIgnoreDir(entry)) continue

                walk(fullPath)

            } else {

                if (!isCodeFile(fullPath)) continue

                files.push(fullPath)

            }

        }

    }

    walk(repoPath)

    console.log("Code files:", files.length)

    for (const file of files) {

        const code = await fs.promises.readFile(file, "utf-8")

        const embedding = await createEmbedding(code.slice(0, 4000))

        const fileRecord = await prisma.file.create({
            data: {
                path: file,
                repoId,
                embedding
            }
        })

        await extractSymbols(fileRecord.id, code)

        await chunkCode(fileRecord.id, code)
    }
}