const WEBSITE_REGEX = /^(http|https):\/\/[^ "]+$/;
const GITHUB_REGEX = "^(https?://)?(www.)?github.com/([a-zA-Z0-9-]+)/([a-zA-Z0-9_-]+)(.git)?$";
const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/


export const validateDataSource = (source: {
    type: string;
    content: string;
    maxDepth?: number;
    maxLinks?: number;
    options?: any;
}[]) => {

    const errors: string[] = [];

    for (const s of source) {
        if (s.type === "text") {
            if (!s.content || s.content.trim().length === 0) {
                errors.push("Content is required for text source");
            }
        }

        if (s.type === "website" || s.type === "sitemap") {
            if (!s.content || s.content.trim().length === 0) {
                errors.push("Content is required for website source");
            } else if (!WEBSITE_REGEX.test(s.content)) {
                errors.push("Invalid website URL for website source");
            }
        }

        if (s.type === "github") {
            if (!s.content || s.content.trim().length === 0) {
                errors.push("Content is required for github source");
            } else if (RegExp(GITHUB_REGEX).test(s.content)) {
                errors.push("Invalid github URL for github source");
            }

            if (s.options) {
                if (s.options.is_private === undefined) {
                    errors.push("is_private is required for github source");
                } else if (typeof s.options.is_private !== "boolean") {
                    errors.push("is_private must be a boolean for github source");
                }

                if (s.options.branch === undefined) {
                    errors.push("branch is required for github source");
                } else if (typeof s.options.branch !== "string") {
                    errors.push("branch must be a string for github source");
                }
            } else {
                errors.push("options is required for github source");
            }
        }

        if (s.type === "youtube") {
            if (!s.content || s.content.trim().length === 0) {
                errors.push("Content is required for youtube source");
            } else if (!YOUTUBE_REGEX.test(s.content)) {
                errors.push("Invalid youtube URL for youtube source");
            }


            if (s.options) {
                if (s.options.youtube_mode === undefined) {
                    errors.push("youtube_mode is required for youtube source");
                } else if (s.options.youtube_mode !== "whisper" && s.options.youtube_mode !== "transcript") {
                    errors.push("youtube_mode must be either whisper or transcript for youtube source");
                }
            } else {
                errors.push("options is required for youtube source");
            }
        }

        if (s.type === "rest") {
            if (!s.content || s.content.trim().length === 0) {
                errors.push("Content is required for rest source");
            } else if (!WEBSITE_REGEX.test(s.content)) {
                errors.push("Invalid rest URL for rest source");
            }

            if (s.options) {
                if (s.options.method === undefined) {
                    errors.push("method is required for rest source");
                } else if (typeof s.options.method !== "string") {
                    errors.push("method must be a string for rest source");
                }
            } else {
                errors.push("options is required for rest source");
            }
        }
        if(s.type === "crawl") {
            if (!s.content || s.content.trim().length === 0) {
                errors.push("Content is required for crawl source");
            }  else if (!WEBSITE_REGEX.test(s.content)) {
                errors.push("Invalid website URL for crawl source");
            }

            if(!s.maxDepth) {
                errors.push("maxDepth is required for crawl source");
            }
            
            if(!s.maxLinks) {
                errors.push("maxLinks is required for crawl source");
            }
        }
    }


    return errors;
}