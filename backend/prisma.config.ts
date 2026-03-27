import { defineConfig } from "@prisma/config"
import dotenv from "dotenv"

dotenv.config()

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required for Prisma migrations")
}

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: databaseUrl
    }
})