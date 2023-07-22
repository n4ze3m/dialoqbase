import { BaseDocumentLoader } from "langchain/document_loaders/base";
import { Document } from "langchain/document";
import { execSync } from "node:child_process";
import * as fs from "fs/promises";

export interface GithubRepoLoaderParams {
  branch: string;
  url: string;
  is_private: boolean;
}

export class DialoqbaseGithub extends BaseDocumentLoader
  implements GithubRepoLoaderParams {
  branch: string;
  url: string;
  is_private: boolean;
  output_folder = "./uploads/";
  ignore_folders = ["node_modules", ".git", ".github"];
  ignore_files = [
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
  ];

  constructor(
    {
      branch,
      url,
      is_private,
    }: GithubRepoLoaderParams,
  ) {
    super();
    this.branch = branch;
    this.url = url;
    this.is_private = is_private;
  }
  async load(): Promise<Document<Record<string, any>>[]> {
    const path = await this._cloneRepo();
    const data = await this._repoFilesData(
      path,
    );

    const docs = data.map((file) => {
      const doc = new Document<Record<string, any>>({
        pageContent: file.content,
        metadata: {
          path: file.path,
        },
      });

      return doc;
    });

    return docs;
  }

  private async is_folder(path: string) {
    try {
      await fs.access(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async deleteFolder(path: string) {
    const is_folder = await this.is_folder(path);
    if (!is_folder) {
      return;
    }
    await fs.rm(path, { recursive: true });
  }

  private async _cloneRepo() {
    const url = this.url.replace("https://", "").replace("http://", "");
    const repo_url = this.is_private
      ? `https://${process.env.GITHUB_ACCESS_TOKEN}@${url}`
      : `https://${url}`;
    const output = `${this.output_folder}${url.split("/")[1]}-${
      url.split("/")[2]
    }-${this.branch}`;
    await this.deleteFolder(output);
    const command =
      `git clone --single-branch --branch ${this.branch} ${repo_url} ${output}`;
    await Promise.resolve(execSync(command, { stdio: "inherit" }));
    return output;
  }

  private async _readFiles(
    dir: string,
    filelist: string[] = [],
  ): Promise<string[]> {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filepath = `${dir}/${file}`;
      const stat = await fs.stat(filepath);
      if (this.ignore_folders.includes(file) || this.ignore_files.includes(file)) {
        continue;
      }
      if (stat.isDirectory()) {
        filelist = await this._readFiles(filepath, filelist);
      } else {
        filelist.push(filepath);
      }
    }
    return filelist;
  }

  private async _readFile(path: string) {
    const content = await fs.readFile(path, "utf-8");
    return content;
  }

  private async _repoFilesData(dir: string) {
    const files = await this._readFiles(dir);
    const data = await Promise.all(
      files.map(async (file) => {
        const content = await this._readFile(file);
        return {
          path: file,
          content,
        };
      }),
    );
    return data;
  }
}
