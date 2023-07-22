import { QSource } from "../type";
// import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { DialoqbaseGithub } from "../../loader/github";

export const githubQueueController = async (
  source: QSource,
) => {
  let options = JSON.parse(JSON.stringify(source.options));

 const loader =  new DialoqbaseGithub({
    branch:  options.branch,
    url: source.content!,
    is_private: options.is_private,
  })
  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await textSplitter.splitDocuments(docs);

  await DialoqbaseVectorStore.fromDocuments(
    chunks,
    embeddings(source.embedding),
    {
      botId: source.botId,
      sourceId: source.id,
    },
  );
};
