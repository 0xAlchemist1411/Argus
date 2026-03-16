import { prisma } from "../db/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function generateRepoSummary(repoId: string) {

    const files = await prisma.file.findMany({
        where: { repoId }
    })

    const fileList = files.map(f => f.path).join("\n")

    const prompt = `
        You are analyzing a GitHub repository.

        List:
        - main modules
        - important files
        - overall architecture

        Files:
        ${fileList}
    `

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }]
    })

    const summary = completion.choices[0].message.content

    await prisma.repository.update({
        where: { id: repoId },
        data: { summary }
    })
}