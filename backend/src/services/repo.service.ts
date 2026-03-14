import simpleGit from "simple-git"
import path from "path"
import fs from "fs"
import { env } from "../config/env"

export async function cloneRepo(repoUrl: string) {

    const repoName = repoUrl.split("/").pop()?.replace(".git", "")

    const repoPath = path.join(env.REPOS_DIR, repoName!)

    if (!fs.existsSync(repoPath)) {

        const git = simpleGit()

        await git.clone(repoUrl, repoPath)
    }

    return repoPath
}