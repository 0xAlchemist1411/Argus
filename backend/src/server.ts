import { buildApp } from "./app"
import { env } from "./config/env"

const app = buildApp()

async function start() {

    await app.listen({
        port: env.PORT
    })

    console.log(`Server running on ${env.PORT}`)
}

start()