import fs from "fs"
import path from "path"
import simpleGit from "simple-git"

const git = simpleGit()

const REPO_DIR = "repos"

export async function cloneRepo(repoUrl: string) {
    if (!fs.existsSync(REPO_DIR)) {
        fs.mkdirSync(REPO_DIR)
    }

    const repoName = repoUrl.split("/").pop()?.replace(".git", "")

    const repoPath = path.join(REPO_DIR, repoName!)

    if (fs.existsSync(repoPath)) {
        console.log("Repo already exists, skipping clone")
        return repoPath
    }

    await git.clone(repoUrl, repoPath)

    return repoPath
}