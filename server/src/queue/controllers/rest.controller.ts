import { QSource } from "../type";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { DialoqbaseRestApi } from "../../loader/rest";

export const restQueueController = async (
  source: QSource,
) => {
  let options = JSON.parse(JSON.stringify(source.options));

  const loader = new DialoqbaseRestApi({
    method: options.method,
    url: source.content!,
    body: options.body,
    headers: options.headers,
  });
  const docs = await loader.load();

  await DialoqbaseVectorStore.fromDocuments(
    docs,
    embeddings(source.embedding),
    {
      botId: source.botId,
      sourceId: source.id,
    },
  );
};
