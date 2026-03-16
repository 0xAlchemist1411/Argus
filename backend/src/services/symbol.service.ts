import { prisma } from "../db/prisma"

export async function extractSymbols(fileId: string, code: string) {

    const lines = code.split("\n")

    const symbols: any[] = []

    lines.forEach((line, i) => {

        const fn = line.match(/function\s+(\w+)/)
        if (fn) {
            symbols.push({
                name: fn[1],
                type: "function",
                fileId,
                line: i + 1
            })
        }

        const cls = line.match(/class\s+(\w+)/)
        if (cls) {
            symbols.push({
                name: cls[1],
                type: "class",
                fileId,
                line: i + 1
            })
        }

    })

    if (symbols.length > 0) {
        await prisma.symbol.createMany({
            data: symbols
        })
    }
}