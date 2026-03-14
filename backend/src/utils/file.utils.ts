import path from "path"

const CODE_EXTENSIONS = new Set([
    ".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs", ".java", ".cpp", ".c", ".cs", ".md"
])

const IGNORE_DIRS = new Set([
    "node_modules", ".git", "dist", "build", ".next", ".cache"
])

export function isCodeFile(file: string) {

    const ext = path.extname(file)

    return CODE_EXTENSIONS.has(ext)

}

export function shouldIgnoreDir(dir: string) {

    return IGNORE_DIRS.has(dir)

}