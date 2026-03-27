export const redisConfig = {
    host: "localhost",
    port: 6379
}

export const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"