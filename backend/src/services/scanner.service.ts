import fs from "fs"
import path from "path"
import { chunkCode } from "./chunk.service"

export async function scanRepo(repoPath: string) {

    const files: string[] = []

    function walk(dir: string) {

        const entries = fs.readdirSync(dir)

        for (const entry of entries) {

            const fullPath = path.join(dir, entry)

            const stat = fs.statSync(fullPath)

            if (stat.isDirectory()) {

                if (entry === "node_modules" || entry === ".git") continue

                walk(fullPath)

            } else {

                files.push(fullPath)

            }

        }

    }

    walk(repoPath)

    for (const file of files) {

        const code = fs.readFileSync(file, "utf-8")

        await chunkCode(file, code)

    }

}