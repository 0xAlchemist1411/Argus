import dotenv from "dotenv"

dotenv.config()

export const env = {
    PORT: Number(process.env.PORT) || 4000,
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
    REPOS_DIR: process.env.REPOS_DIR || "./repos"
}