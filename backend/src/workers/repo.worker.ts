import dotenv from "dotenv"
dotenv.config()

import { Worker } from "bullmq"
import IORedis from "ioredis"

import { cloneRepo } from "../services/repo.service"
import { scanRepo } from "../services/scanner.service"
import { prisma } from "../db/prisma"
import { generateRepoSummary } from "../services/repo-summary.service"

const connection = new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null
})

const worker = new Worker(
    "repo-index",
    async (job) => {

        const startTime = Date.now()
        const { repoUrl } = job.data

        console.log("────────────────────────────────────────")
        console.log(`🚀 [JOB ${job.id}] Starting repository indexing`)
        console.log(`📦 Repo URL: ${repoUrl}`)

        console.log("⬇️  Cloning repository...")

        const repoPath = await cloneRepo(repoUrl)

        console.log(`✅ Repo cloned at: ${repoPath}`)

        console.log("🗄️  Creating repository record in database...")

        const repo = await prisma.repository.create({
            data: {
                repoUrl,
                name: repoUrl.split("/").pop()
            }
        })

        console.log(`✅ Repository saved with ID: ${repo.id}`)

        console.log("🔍 Scanning repository files...")

        await scanRepo(repoPath, repo.id)

        await generateRepoSummary(repo.id)

        console.log("✅ Repository scan completed")

        const duration = ((Date.now() - startTime) / 1000).toFixed(2)

        console.log(`🎉 Indexing finished for ${repo.name}`)
        console.log(`⏱️  Total time: ${duration}s`)
        console.log("────────────────────────────────────────")

    },
    { connection }
)


worker.on("active", (job) => {
    console.log(`⚙️  Job ${job.id} is now active`)
})

worker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed successfully`)
})

worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed`)
    console.error(err)
})