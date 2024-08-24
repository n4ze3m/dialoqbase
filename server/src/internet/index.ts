import * as cheerio from "cheerio";
import { Embeddings } from "@langchain/core/embeddings";
import { Document } from "@langchain/core/documents";
import * as ml_distance from "ml-distance"

const SERACH_PROVIDER = process.env.DB_SEARCH_PROVIDER || "default";
const TOTAL_RESULTS_LIMIT = process.env.DB_TOTAL_RESULTS_LIMIT ? parseInt(process.env.DB_TOTAL_RESULTS_LIMIT) : 5;

export const duckduckgoSearchUnOffical = async (query: string) => {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), 10000);

    const htmlString = await fetch(
        "https://html.duckduckgo.com/html/?q=" + query,
        {
            signal: abortController.signal,
        }
    )
        .then((response) => response.text())
        .catch();

    const $ = cheerio.load(htmlString);

    const searchResults = Array.from($("div.results_links_deep")).map(
        (result) => {
            const title = $(result).find("a.result__a").text();
            const link = $(result)
                .find("a.result__snippet")
                .attr("href")
                .replace("//duckduckgo.com/l/?uddg=", "")
                .replace(/&rut=.*/, "");

            const content = $(result).find("a.result__snippet").text();
            const decodedLink = decodeURIComponent(link);
            return { title, link: decodedLink, content };
        }
    );

    return searchResults;
};

export const googleSearchUnOffical = async (query: string) => {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), 10000);

    const htmlString = await fetch(
        "https://www.google.com/search?hl=en&q=" + query,
        {
            signal: abortController.signal,
        }
    )
        .then((response) => response.text())
        .catch();

    const $ = cheerio.load(htmlString);

    const searchResults = $("div.g").map((_, result) => {
        const title = $(result).find("h3").text();
        const link = $(result).find("a").attr("href");
        const content = $(result).find("span").map((_, span) => $(span).text()).get().join(" ");
        return { title, link, content };
    }).get();

    return searchResults;
};

export const searxngSearch = async (query: string) => {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), 10000);

    const searxngUrl = process.env.DB_SEARXNG_URL;

    if (!searxngUrl) {
        throw new Error("SEARXNG_URL is not set");
    }
    const url = new URL(`${searxngUrl}/search`);

    url.searchParams.append("q", query);
    url.searchParams.append("format", "json");
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        const err = await response.json();
        console.error(`Error: ${err}`);
        throw new Error(`Error: ${response.status}`);
    }

    const data = (await response.json()) as {
        results: {
            title: string;
            url: string;
            content: string;
        }[];
    };

    return data.results.map((result) => ({
        title: result.title,
        link: result.url,
        content: result.content,
    }));
};

const searchProviders = {
    duckduckgo: duckduckgoSearchUnOffical,
    google: googleSearchUnOffical,
    searxng: searxngSearch,
    default:
        process.env.IS_RAILWAY != "true"
            ? searxngSearch
            : duckduckgoSearchUnOffical,
};

export const searchInternet = async (embedding: Embeddings, { query }: { query: string }) => {

    if (process.env.DISABLE_INTERNET_SEARCH == "true") {
        return [];
    }

    const searchProvider = searchProviders[SERACH_PROVIDER];
    if (!searchProvider) {
        throw new Error(`Search provider ${SERACH_PROVIDER} not found`);
    }
    const datat = await searchProvider(query);

    const data = datat.filter((doc) => doc?.content.length > 0);

    const results = data.slice(0, TOTAL_RESULTS_LIMIT)

    const [docEmbeddings, queryEmbedding] = await Promise.all([
        embedding.embedDocuments(results.map((doc) => doc.content)),
        embedding.embedQuery(query),
    ]);


    const similarity = docEmbeddings.map((docEmbedding, i) => {
        const sim = ml_distance.similarity.cosine(queryEmbedding, docEmbedding)

        return {
            index: i,
            similarity: sim
        }
    })

    const sortedDocs = similarity
        .sort((a, b) => b.similarity - a.similarity)
        .filter((sim) => sim.similarity > 0.5)
        .slice(0, 15)
        .map((sim) => {
            return [
                {
                    pageContent: results[sim.index]?.content || "",
                    metadata: {
                        source: results[sim.index]?.link || "",
                    }
                } as Document,
                sim.similarity
            ]
        })

    return sortedDocs;
};
