import { PrismaClient, DialoqbaseModels } from "@prisma/client";
import { getSettings } from "./common";
import { cleanUrl, getAllOllamaModels } from "./ollama";

export const getModelInfo = async ({
  model,
  prisma,
  type = "all",
}: {
  prisma: PrismaClient;
  model: string;
  type?: "all" | "chat" | "embedding";
}): Promise<DialoqbaseModels | null> => {
  let modelInfo: DialoqbaseModels | null = null;
  const settings = await getSettings(prisma);
  const not_to_hide_providers = settings?.hideDefaultModels
    ? [ "Local", "local", "ollama", "transformer", "Transformer"]
    : undefined;
  if (type === "all") {
    modelInfo = await prisma.dialoqbaseModels.findFirst({
      where: {
        model_id: model,
        hide: false,
        deleted: false,
        model_provider: {
          in: not_to_hide_providers,
        },
      },
    });
  } else if (type === "chat") {
    modelInfo = await prisma.dialoqbaseModels.findFirst({
      where: {
        hide: false,
        deleted: false,
        model_provider: {
          in: not_to_hide_providers,
        },
        OR: [
          {
            model_id: model,
          },
          {
            model_id: `${model}-dbase`,
          },
        ],
      },
    });
  } else if (type === "embedding") {
    modelInfo = await prisma.dialoqbaseModels.findFirst({
      where: {
        OR: [
          {
            model_id: model,
          },
          {
            model_id: `dialoqbase_eb_${model}`,
          },
        ],
        hide: false,
        deleted: false,
        model_provider: {
          in: not_to_hide_providers,
        },
      },
    });
  }
  if (!modelInfo) {
    if (settings?.dynamicallyFetchOllamaModels) {
      const ollamaModles = await getAllOllamaModels(settings.ollamaURL);
      const ollamaInfo = ollamaModles.find((m) => m.value === model);
      if (ollamaInfo) {
        return {
          name: ollamaInfo.name,
          model_id: ollamaInfo.name,
          stream_available: true,
          local_model: true,
          model_provider: "ollama",
          config: {
            baseURL: cleanUrl(settings.ollamaURL),
          },
          createdAt: new Date(),
          model_type: "chat",
          deleted: false,
          hide: false,
          id: 1,
        };
      }
    }
  }

  return modelInfo;
};
