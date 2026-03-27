import dotenv from "dotenv"
import { buildApp } from "./app"

dotenv.config()

const app = buildApp()

async function start() {
    const port = Number(process.env.PORT) || 4000

    await app.listen({
        port,
        host: "0.0.0.0"
    })

    console.log(`Server running on ${port}`)
}

start()