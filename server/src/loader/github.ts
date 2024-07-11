import { BaseDocumentLoader } from "langchain/document_loaders/base";
import { Document } from "langchain/document";
import { exec } from "node:child_process";
import * as fs from "fs/promises";
import * as path from "path";

export interface GithubRepoLoaderParams {
  branch: string;
  url: string;
  isPrivate: boolean;
}

export class DialoqbaseGithub
  extends BaseDocumentLoader
  implements GithubRepoLoaderParams
{
  branch: string;
  url: string;
  isPrivate: boolean;
  private readonly outputFolder = "./uploads/";
  private readonly ignoreFolders = new Set(["node_modules", ".git", ".github"]);
  private readonly ignoreFiles = new Set([
    ".gitignore",
    ".gitattributes",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "pnpm-lock.json",
    "npm-debug.log",
    ".npmrc",
    ".yarnrc.yml",
    ".yarnrc",
    ".env",
    ".env.local",
    ".eslintignore",
  ]);

  constructor({ branch, url, isPrivate }: GithubRepoLoaderParams) {
    super();
    this.branch = branch;
    this.url = url;
    this.isPrivate = isPrivate;
  }

  async load(): Promise<Document<Record<string, any>>[]> {
    const repoPath = await this.cloneRepo();
    const filesData = await this.getRepoFilesData(repoPath);

    return filesData.map(
      ({ path, content }) =>
        new Document({
          pageContent: content,
          metadata: { path },
        })
    );
  }

  private async cloneRepo(): Promise<string> {
    const sanitizedUrl = this.url.replace(/^https?:\/\//, "");
    const repoUrl = this.isPrivate
      ? `https://${process.env.GITHUB_ACCESS_TOKEN}@${sanitizedUrl}`
      : `https://${sanitizedUrl}`;
    const outputPath = path.join(
      this.outputFolder,
      `${sanitizedUrl.replace("/", "-")}-${this.branch}`
    );

    await this.deleteFolder(outputPath);

    const command = `git clone --single-branch --branch ${this.branch} ${repoUrl} ${outputPath}`;
    await this.execCommand(command);

    return outputPath;
  }

  private async deleteFolder(folderPath: string): Promise<void> {
    try {
      await fs.access(folderPath);
      await fs.rm(folderPath, { recursive: true });
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  private async execCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        resolve();
      });
    });
  }

  private async getRepoFilesData(
    dir: string
  ): Promise<{ path: string; content: string }[]> {
    const files = await this.readFiles(dir);
    return Promise.all(
      files.map(async (file) => ({
        path: file,
        content: await fs.readFile(file, "utf-8"),
      }))
    );
  }

  private async readFiles(
    dir: string,
    fileList: string[] = []
  ): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (
        this.ignoreFolders.has(entry.name) ||
        this.ignoreFiles.has(entry.name)
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        await this.readFiles(fullPath, fileList);
      } else {
        fileList.push(fullPath);
      }
    }

    return fileList;
  }
}
