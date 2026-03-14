import { Queue } from "bullmq"
import { redisConfig } from "../config/redis"

export const repoQueue = new Queue("repo-index", {
    connection: redisConfig
})