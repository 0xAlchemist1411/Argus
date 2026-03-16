import OpenAI from "openai"
import { searchChunks } from "./search.service"
import { prisma } from "../db/prisma"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function chatWithRepo(repoId: string, question: string) {

    function compressContext(chunks: any[]) {
        return chunks.map((chunk, i) => {
            return `Source ${i + 1} (${chunk.file}):

        ${chunk.content}
    `
        }).join("\n")
    }

    const chunks = await searchChunks(repoId, question)

    if (chunks.length === 0) {
        return "I couldn't find relevant code in this repository to answer that question."
    }

    const context = compressContext(chunks)

    const repo = await prisma.repository.findUnique({
        where: { id: repoId }
    })

    const prompt = `
        You are a senior software engineer.

        Try the repository summary first, it may contain important information about the 
        architecture and main modules. 
        Then use the code context to answer the question.

        Repository summary:
        ${repo?.summary}

        Strict Rules:
        - Be concise.
        - If possible, answer in bullet points.
        - Do NOT repeat the question.
        - Do NOT explain general concepts.
        - Try to answer in the context of the code, do NOT use general knowledge.
        - If the answer is not in the code, say "Not found in repository".

        Code context:${context}
        Question:${question}

    `

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.1,
        max_completion_tokens: 300,
        messages: [
            { role: "user", content: prompt }
        ]
    })

    return {
        answer: completion.choices[0].message.content,
        sources: chunks.map(c => c.file)
    }
}