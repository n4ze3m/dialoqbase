import axios from "axios";
import { load } from "cheerio";

type CrawlResult = {
  links: Set<string>;
  errors: Set<string>;
};

const visitedLinks: Set<string> = new Set();
const errorLinks: Set<string> = new Set();
const queuedLinks: Set<string> = new Set();

export const crawl = async (
  startUrl: string,
  maxDepth = 2,
  maxLinks = 20
): Promise<CrawlResult> => {
  const queue: { url: string; depth: number }[] = [{ url: startUrl, depth: 0 }];
  const fetchedLinks: Set<string> = new Set();

  while (queue.length > 0 && visitedLinks.size < maxLinks) {
    const batch = queue.splice(0, Math.min(queue.length, maxLinks - visitedLinks.size));
    
    await Promise.all(
      batch.map(async ({ url, depth }) => {
        if (visitedLinks.has(url) || depth > maxDepth) {
          return;
        }

        try {
          const response = await axios.get(url, {
            headers: { Accept: "text/html" },
          });

          const contentType = response.headers['content-type'];
          if (!contentType || !contentType.includes("text/html")) {
            return;
          }

          const $ = load(response.data);

          visitedLinks.add(url);
          fetchedLinks.add(url);

          $("a").each((_, element) => {
            const href = $(element).attr("href");
            if (!href) {
              return;
            }

            const absoluteUrl = normalizeUrl(new URL(href, url).href);
            if (isSameDomain(absoluteUrl, startUrl) && !visitedLinks.has(absoluteUrl) && !queuedLinks.has(absoluteUrl)) {
              queue.push({ url: absoluteUrl, depth: depth + 1 });
              queuedLinks.add(absoluteUrl);
            }
          });
        } catch (error: any) {
          console.error(`Failed to fetch ${url}:`, error?.message || error);
          errorLinks.add(url);
        }
      })
    );
  }

  return { links: fetchedLinks, errors: errorLinks };
};

const isSameDomain = (url1: string, url2: string): boolean => {
  const { hostname: host1 } = new URL(url1);
  const { hostname: host2 } = new URL(url2);
  return host1 === host2;
};

const normalizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    urlObj.hash = '';
    return urlObj.href;
  } catch (error) {
    return url;
  }
};
