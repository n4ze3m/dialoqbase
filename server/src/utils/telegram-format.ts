// this code is a typescript conversion of the original python code from the repo: https://github.com/Latand/formatter-chatgpt-telegram

function convertHtmlChars(text: string): string {
    text = text.replace(/&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    return text;
}

function splitByTag(outText: string, mdTag: string, htmlTag: string): string {
    const tagPattern = new RegExp(
        `(?<!\\w)${escapeRegExp(mdTag)}(.*?)${escapeRegExp(mdTag)}(?!\\w)`,
        "gs"
    );
    return outText.replace(tagPattern, `<${htmlTag}>$1</${htmlTag}>`);
}

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ensureClosingDelimiters(text: string): string {
    if ((text.match(/```/g) || []).length % 2 !== 0) {
        text += "```";
    }
    if ((text.match(/`/g) || []).length % 2 !== 0) {
        text += "`";
    }
    return text;
}

function extractAndConvertCodeBlocks(text: string): [string, Record<string, string>] {
    text = ensureClosingDelimiters(text);
    const placeholders: string[] = [];
    const codeBlocks: Record<string, string> = {};

    const replacer = (match: RegExpMatchArray): [string, string] => {
        const language = match[1] || "";
        const codeContent = match[3];
        const placeholder = `CODEBLOCKPLACEHOLDER${placeholders.length}`;
        placeholders.push(placeholder);
        const htmlCodeBlock = language
            ? `<pre><code class="language-${language}">${codeContent}</code></pre>`
            : `<pre><code>${codeContent}</code></pre>`;
        return [placeholder, htmlCodeBlock];
    };

    let modifiedText = text;
    const regex = /```(\w*)?(\n)?(.*?)```/gs;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        const [placeholder, htmlCodeBlock] = replacer(match);
        codeBlocks[placeholder] = htmlCodeBlock;
        modifiedText = modifiedText.replace(match[0], placeholder);
    }

    return [modifiedText, codeBlocks];
}

function reinsertCodeBlocks(text: string, codeBlocks: Record<string, string>): string {
    for (const [placeholder, htmlCodeBlock] of Object.entries(codeBlocks)) {
        text = text.replace(placeholder, htmlCodeBlock);
    }
    return text;
}

function combineBlockquotes(text: string): string {
    const lines = text.split("\n");
    const combinedLines: string[] = [];
    let blockquoteLines: string[] = [];
    let inBlockquote = false;

    for (const line of lines) {
        if (line.startsWith(">")) {
            inBlockquote = true;
            blockquoteLines.push(line.slice(1).trim());
        } else {
            if (inBlockquote) {
                combinedLines.push(
                    `<blockquote>${blockquoteLines.join("\n")}</blockquote>`
                );
                blockquoteLines = [];
                inBlockquote = false;
            }
            combinedLines.push(line);
        }
    }

    if (inBlockquote) {
        combinedLines.push(
            `<blockquote>${blockquoteLines.join("\n")}</blockquote>`
        );
    }

    return combinedLines.join("\n");
}

function removeBlockquoteEscaping(output: string): string {
    return output
        .replace(/&lt;blockquote&gt;/g, "<blockquote>")
        .replace(/&lt;\/blockquote&gt;/g, "</blockquote>");
}

export function telegramFormat(text: string): string {
    text = combineBlockquotes(text);
    text = convertHtmlChars(text);

    let [output, codeBlocks] = extractAndConvertCodeBlocks(text);

    output = output.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    output = output.replace(/`(.*?)`/g, "<code>$1</code>");
    output = output.replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>");
    output = output.replace(/\_\_\_(.*?)\_\_\_/g, "<u><i>$1</i></u>");

    output = splitByTag(output, "**", "b");
    output = splitByTag(output, "__", "u");
    output = splitByTag(output, "_", "i");
    output = splitByTag(output, "*", "i");
    output = splitByTag(output, "~~", "s");

    output = output.replace(/【[^】]+】/g, "");
    output = output.replace(/!?\\[(.*?)\\]\\((.*?)\\)/g, '<a href="$2">$1</a>');
    output = output.replace(/^\s*#+ (.+)/gm, "<b>$1</b>");
    output = output.replace(/^(\s*)[\-\*] (.+)/gm, "$1• $2");

    output = reinsertCodeBlocks(output, codeBlocks);
    output = removeBlockquoteEscaping(output);

    return output;
}
