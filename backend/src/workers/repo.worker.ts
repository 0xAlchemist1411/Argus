import dotenv from "dotenv"
dotenv.config()

import { Worker } from "bullmq"
import IORedis from "ioredis"

import { cloneRepo } from "../services/repo.service"
import { scanRepo } from "../services/scanner.service"
import { prisma } from "../db/prisma"
import { generateRepoSummary } from "../services/repo-summary.service"
import { redisUrl } from "../config/redis"

const connection = new IORedis(redisUrl!, {
    maxRetriesPerRequest: 5
})

const worker = new Worker(
    "repo-index",
    async (job) => {

        const startTime = Date.now()
        const { repoUrl, repoId } = job.data

        await prisma.repository.update({
            where: { id: repoId },
            data: { status: "INDEXING" }
        })

        console.log("────────────────────────────────────────")
        console.log(`🚀 [JOB ${job.id}] Starting repository indexing`)
        console.log(`📦 Repo URL: ${repoUrl}`)
        console.log(`🆔 Repo ID: ${repoId}`)

        console.log("⬇️  Cloning repository...")

        const repoPath = await cloneRepo(repoUrl)

        console.log(`✅ Repo cloned at: ${repoPath}`)

        console.log("🧹 Clearing previous indexed files...")

        await prisma.symbol.deleteMany({
            where: { file: { repoId } }
        })

        await prisma.chunk.deleteMany({
            where: { file: { repoId } }
        })

        await prisma.file.deleteMany({
            where: { repoId }
        })

        console.log("✅ Removed previously indexed data")

        console.log("🔍 Scanning repository files...")

        await scanRepo(repoPath, repoId)

        console.log("🧠 Generating repository summary...")

        await generateRepoSummary(repoId)

        console.log("✅ Repository scan completed")

        const duration = ((Date.now() - startTime) / 1000).toFixed(2)

        await prisma.repository.update({
            where: { id: repoId },
            data: { status: "READY" }
        })

        console.log(`🎉 Indexing finished for repo ${repoId}`)
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

worker.on("failed", async (job, err) => {
    console.error(`❌ Job ${job?.id} failed`)
    console.error(err)

    if (job?.data?.repoId) {
        await prisma.repository.update({
            where: { id: job.data.repoId },
            data: { status: "FAILED" }
        })
    }
})