import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import puppeteerBlockResources from 'puppeteer-extra-plugin-block-resources';
import puppeteerPageProxy from 'puppeteer-extra-plugin-page-proxy';
import puppeteerStealth from 'puppeteer-extra-plugin-stealth'
import * as fs from 'fs';

const readabilityJsStr = fs.readFileSync(
    require.resolve("@mozilla/readability/Readability.js"),
    { encoding: "utf-8" }
);

function executor() {
    // @ts-ignore
    return new Readability({}, document).parse();
}

puppeteer.use(puppeteerStealth());


puppeteer.use(puppeteerBlockResources({
    blockedTypes: new Set(['media']),
    interceptResolutionPriority: 1,
}));
puppeteer.use(puppeteerPageProxy({
    interceptResolutionPriority: 1,
}));

let browser: Browser;


const init = async () => {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            timeout: 10_000,
        });
    }
}


const puppeteerFetch = async (url: string, useReadability = false) => {
    try {
        await init();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        if (useReadability) {
            const resultArticle = await page.evaluate(`
                (function(){
                  ${readabilityJsStr}
                  ${executor}
                  return executor();
                }())
              `) as { content?: string }
            if (resultArticle?.content) {
                await page.close();
                return resultArticle.content;
            }
            console.error(`[puppeteerFetch] Error fetching ${url}: Readability failed`);
        }
        const html = await page.content();
        await page.close();
        return html;
    } catch (error) {
        console.error(`[puppeteerFetch] Error fetching ${url}: ${error.message}`);
        return '';
    }
}



export default puppeteerFetch;