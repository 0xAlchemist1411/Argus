import dotenv from "dotenv"
dotenv.config()

import { Worker } from "bullmq"
import IORedis from "ioredis"

import { cloneRepo } from "../services/repo.service"
import { scanRepo } from "../services/scanner.service"
import { prisma } from "../db/prisma"

const connection = new IORedis(process.env.REDIS_URL!)

const worker = new Worker(
    "repo-index",
    async (job) => {

        const { repoUrl } = job.data

        console.log("Indexing repo:", repoUrl)

        // 1. clone repo locally
        const repoPath = await cloneRepo(repoUrl)

        // 2. create repo record
        const repo = await prisma.repository.create({
            data: {
                repoUrl,
                name: repoUrl.split("/").pop()
            }
        })

        // 3. scan + chunk + embed
        await scanRepo(repoPath, repo.id)

        console.log("Finished indexing:", repo.name)

    },
    { connection : connection as any}
)

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`)
})

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed`, err)
})