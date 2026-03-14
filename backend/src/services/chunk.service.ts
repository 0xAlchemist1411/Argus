export async function chunkCode(filePath: string, code: string) {

    const lines = code.split("\n")

    const chunkSize = 100

    const chunks: string[] = []

    for (let i = 0; i < lines.length; i += chunkSize) {

        chunks.push(
            lines.slice(i, i + chunkSize).join("\n")
        )

    }

    console.log(`Chunks created for ${filePath}`, chunks.length)

}