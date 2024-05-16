import { FastifyReply, FastifyRequest } from "fastify";
import {
  FetchModelFromInputedUrlRequest,
  SaveEmbeddingModelRequest,
  SaveModelFromInputedUrlRequest,
  ToogleModelRequest,
} from "./type";
import { removeTrailingSlash } from "../../../../utils/url";
import { getSettings } from "../../../../utils/common";
import {
  getModelFromUrl,
  getOllamaModels,
  isReplicateModelExist,
  isValidModel,
  modelProvider,
} from "./utils";

export const getAllModelsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const user = request.user;

  if (!user.is_admin) {
    return reply.status(403).send({
      message: "Forbidden",
    });
  }

  const settings = await getSettings(prisma);

  const not_to_hide_providers = settings?.hideDefaultModels
    ? ["Local", "local", "ollama", "transformer", "Transformer"]
    : undefined;
  const allModels = await prisma.dialoqbaseModels.findMany({
    where: {
      deleted: false,
      model_provider: {
        in: not_to_hide_providers,
      },
    },
  });
  try {
    return {
      data: allModels.filter((model) => model.model_type !== "embedding"),
      embedding: allModels.filter((model) => model.model_type === "embedding"),
    };
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};

export const fetchModelFromInputedUrlHandler = async (
  request: FastifyRequest<FetchModelFromInputedUrlRequest>,
  reply: FastifyReply
) => {
  try {
    const { url, api_key, api_type, ollama_url } = request.body;
    const user = request.user;
    if (!user.is_admin) {
      return reply.status(403).send({
        message: "Forbidden",
      });
    }

    if (api_type === "ollama") {
      const models = await getOllamaModels(removeTrailingSlash(ollama_url!));

      if (!models) {
        return reply.status(404).send({
          message:
            "Unable to fetch models from Ollama. Make sure Ollama is running and the url is correct",
        });
      }

      return {
        data: models,
      };
    } else if (api_type === "openai") {
      const model = await getModelFromUrl(removeTrailingSlash(url!), api_key);

      if (!model) {
        return reply.status(404).send({
          message:
            "Unable to fetch models. Make sure the url is correct and if the model is protected by api key, make sure the api key is correct",
        });
      }

      return {
        data: Array.isArray(model) ? model : model.data,
      };
    } else {
      return reply.status(400).send({
        message: "Invalid api type",
      });
    }
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};

export const saveModelFromInputedUrlHandler = async (
  request: FastifyRequest<SaveModelFromInputedUrlRequest>,
  reply: FastifyReply
) => {
  try {
    const user = request.user;
    const prisma = request.server.prisma;

    if (!user.is_admin) {
      return reply.status(403).send({
        message: "Forbidden",
      });
    }

    const { url, api_key, model_id, name, stream_available, api_type } =
      request.body;

    if (api_type === "replicate") {
      const isModelExist = await isReplicateModelExist(model_id, api_key!);

      if (!isModelExist.success) {
        return reply.status(404).send({
          message: isModelExist.message,
        });
      }

      const modelExist = await prisma.dialoqbaseModels.findFirst({
        where: {
          model_id: model_id,
          hide: false,
          deleted: false,
        },
      });

      if (modelExist) {
        return reply.status(400).send({
          message: "Model already exist",
        });
      }

      let newModelId = model_id.trim() + `_dialoqbase_${new Date().getTime()}`;
      await prisma.dialoqbaseModels.create({
        data: {
          name: isModelExist.name,
          model_id: newModelId,
          stream_available: stream_available,
          local_model: true,
          model_provider: "replicate",
          config: {
            baseURL: "https://api.replicate.com/v1/models/",
            apiKey: api_key,
          },
        },
      });

      return {
        message: "success",
      };
    } else if (
      api_type === "openai-api" ||
      api_type === "google" ||
      api_type === "anthropic" ||
      api_type === "groq"
    ) {
      const provider = modelProvider[api_type];
      console.log(provider, "provider");
      const validModel = await isValidModel(model_id.trim(), provider);

      if (!validModel) {
        return reply.status(404).send({
          message: `Model not found for the given model_id ${model_id}`,
        });
      }

      let newModelId = model_id.trim() + `_dialoqbase_${new Date().getTime()}`;

      await prisma.dialoqbaseModels.create({
        data: {
          name: name,
          model_id: newModelId,
          stream_available: true,
          local_model: true,
          model_provider: provider,
        },
      });

      return {
        message: "success",
      };
    }
    let newModelId = model_id.trim() + `_dialoqbase_${new Date().getTime()}`;

    await prisma.dialoqbaseModels.create({
      data: {
        name: name,
        model_id: newModelId,
        stream_available: stream_available,
        local_model: true,
        model_provider: api_type === "openai" ? "local" : "ollama",
        config: {
          baseURL: removeTrailingSlash(url),
          apiKey: api_key,
        },
      },
    });

    return {
      message: "success",
    };
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};

export const hideModelHandler = async (
  request: FastifyRequest<ToogleModelRequest>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.body;

    const user = request.user;

    const prisma = request.server.prisma;

    if (!user.is_admin) {
      return reply.status(403).send({
        message: "Forbidden",
      });
    }

    const model = await prisma.dialoqbaseModels.findFirst({
      where: {
        id: id,
        deleted: false,
      },
    });

    if (!model) {
      return reply.status(404).send({
        message: "Model not found",
      });
    }

    await prisma.dialoqbaseModels.update({
      where: {
        id: id,
      },
      data: {
        hide: !model.hide,
      },
    });

    return {
      message: "success",
    };
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};

export const deleteModelHandler = async (
  request: FastifyRequest<ToogleModelRequest>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.body;

    const user = request.user;

    const prisma = request.server.prisma;

    if (!user.is_admin) {
      return reply.status(403).send({
        message: "Forbidden",
      });
    }

    const model = await prisma.dialoqbaseModels.findFirst({
      where: {
        id: id,
        deleted: false,
      },
    });

    if (!model) {
      return reply.status(404).send({
        message: "Model not found",
      });
    }

    if (!model.local_model) {
      return reply.status(400).send({
        message: "Only local model can be deleted",
      });
    }

    await prisma.dialoqbaseModels.delete({
      where: {
        id: id,
      },
    });

    return {
      message: "success",
    };
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};

export const saveEmbedddingModelFromInputedUrlHandler = async (
  request: FastifyRequest<SaveEmbeddingModelRequest>,
  reply: FastifyReply
) => {
  try {
    const user = request.user;
    const prisma = request.server.prisma;

    if (!user.is_admin) {
      return reply.status(403).send({
        message: "Forbidden",
      });
    }

    const { url, api_key, model_id, model_name, api_type } = request.body;

    const modelExist = await prisma.dialoqbaseModels.findFirst({
      where: {
        model_id: model_id,
        model_type: "embedding",
        hide: false,
        deleted: false,
      },
    });

    if (modelExist) {
      return reply.status(400).send({
        message: "Model already exist",
      });
    }

    const model_provider = {
      openai: "local",
      ollama: "ollama",
      transformer: "transformer",
    };

    let newModelId =
      `dialoqbase_eb_${model_id}`.trim() +
      `_dialoqbase_${new Date().getTime()}`;

    await prisma.dialoqbaseModels.create({
      data: {
        name: model_name,
        model_id: newModelId,
        local_model: true,
        model_type: "embedding",
        model_provider: model_provider[api_type],
        config: {
          baseURL: url && removeTrailingSlash(url),
          apiKey: api_key,
        },
      },
    });

    return {
      message: "success",
    };
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};
