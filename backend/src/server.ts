import dotenv from "dotenv"
import { buildApp } from "./app"

dotenv.config()

const app = buildApp()

async function start() {
    app.listen({
        port: Number(process.env.PORT) || 4000
    })

    console.log(`Server running on ${process.env.PORT}`)
}

start()