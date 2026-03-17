import fs from "fs"
import OpenAI from "openai"
import { prisma } from "../db/prisma"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function explainFile(filePath: string) {

    const code = await fs.promises.readFile(filePath, "utf-8")

    const prompt = `
        You are a senior software engineer.

        Explain this file concisely.

        Focus on:
        - purpose of the file
        - main logic
        - key functions

        Code:
        ${code.slice(0, 4000)}
    `

    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }]
    })

    return res.choices[0].message.content
}


export async function explainFunction(repoId: string, name: string) {

    const symbol = await prisma.symbol.findFirst({
        where: {
            name,
            file: { repoId }
        },
        include: { file: true }
    })

    if (!symbol) {
        return "Function not found in repository"
    }

    const code = await fs.promises.readFile(symbol.file.path, "utf-8")

    const snippet = code
        .split("\n")
        .slice(symbol.line - 1, symbol.line + 30)
        .join("\n")

    const prompt = `
        Explain this function clearly and concisely:
        ${snippet}
    `

    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.1,
        messages: [{ role: "user", content: prompt }]
    })

    return res.choices[0].message.content
}