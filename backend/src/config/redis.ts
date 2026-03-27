import { URL } from "url"

export const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

const parsed = new URL(redisUrl)

export const redisConfig = {
    host: parsed.hostname,
    port: Number(parsed.port),
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    tls: parsed.protocol === "rediss:" ? {} : undefined
}