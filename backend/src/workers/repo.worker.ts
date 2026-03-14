import { Worker } from "bullmq"

import { cloneRepo } from "../services/repo.service"
import { scanRepo } from "../services/scanner.service"
import { redisConfig } from "../config/redis"

new Worker(
    "repo-index",
    async (job) => {

        const { repoUrl } = job.data

        const repoPath = await cloneRepo(repoUrl)

        await scanRepo(repoPath)

    },
    {
        connection: redisConfig
    }
)