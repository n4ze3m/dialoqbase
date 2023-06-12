import axios from "axios";
import { load } from "cheerio";

const visitedLinks: Set<string> = new Set();

export const crawl = async (
  link: string,
  maxDepth = 2,
  currentDepth = 0,
  maxLinks = 20,
): Promise<Set<string>> => {
  const parentUrl = new URL(link);

  if (currentDepth > maxDepth || visitedLinks.size >= maxLinks) {
    return new Set();
  }

  if (visitedLinks.has(link)) {
    return new Set();
  }

  visitedLinks.add(link);

  try {
    const response = await axios.get(link, {
      headers: {
        Accept: "text/html",
      },
    });

    const contentType = response.headers["content-type"];

    if (!contentType.includes("text/html")) {
      console.log(`Skipping ${link} (content type: ${contentType})`);
      return new Set();
    }

    const $ = load(response.data);
    const links = $("a");
    const fetchedLinks: Set<string> = new Set();

    for (let i = 0; i < links.length; i++) {
      const href = $(links[i]).attr("href");

      if (!href) {
        continue;
      }

      let absolute: string;
      if (href.startsWith("/")) {
        absolute = new URL(href, parentUrl.origin).href;
      } else if (!isWebUrl(href)) {
        absolute = new URL(href, parentUrl.origin).href;
      } else {
        absolute = href;
      }

      if (new URL(absolute).host !== parentUrl.host) {
        continue;
      }

      const childLinks = await crawl(
        absolute,
        maxDepth,
        currentDepth + 1,
        maxLinks,
      );
      childLinks.forEach((childLink) => fetchedLinks.add(childLink));
    }
    fetchedLinks.add(link);
    return fetchedLinks;
  } catch (error: any) {
    console.log(`Error crawling ${link}: ${error?.message}`);
    return new Set();
  }
};

function isWebUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
