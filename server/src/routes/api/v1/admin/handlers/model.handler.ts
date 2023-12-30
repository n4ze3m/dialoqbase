// this the dedicated file for the model handler for the admin route
// why i do this? because i want to make the code more readable and easy to maintain
import { FastifyReply, FastifyRequest } from "fastify";
import {
  FetchModelFromInputedUrlRequest,
  SaveModelFromInputedUrlRequest,
  ToogleModelRequest,
} from "./type";
import axios from "axios";

const _getModelFromUrl = async (url: string, apiKey?: string) => {
  try {
    const response = await axios.get(`${url}/models`, {
      headers: {
        "HTTP-Referer":
          process.env.LOCAL_REFER_URL || "https://dialoqbase.n4ze3m.com/",
        "X-Title": process.env.LOCAL_TITLE || "Dialoqbase",
        Authorization: apiKey && `Bearer ${apiKey}`,
      },
    });
    return response.data as {
      type: string;
      data: {
        id: string;
        object: string;
      }[];
    };
  } catch (error) {
    return null;
  }
};

const _getOllamaModels = async (url: string) => {
  try {
    const response = await axios.get(`${url}/api/tags`);
    const { models } = response.data as {
      models: {
        name: string;
      }[];
    };
    return models.map((data) => {
      return {
        id: data.name,
        object: data.name,
      };
    });
  } catch (error) {
    return null;
  }
};

export const getAllModelsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const prisma = request.server.prisma;
    const user = request.user;

    if (!user.is_admin) {
      return reply.status(403).send({
        message: "Forbidden",
      });
    }
    const allModels = await prisma.dialoqbaseModels.findMany({
      where: {
        deleted: false,
      },
    });

    return {
      data: allModels,
    };
  } catch (error) {
    console.log(error);
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
      const models = await _getOllamaModels(ollama_url!);

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
      const model = await _getModelFromUrl(url!, api_key);

      if (!model) {
        return reply.status(404).send({
          message:
            "Unable to fetch models. Make sure the url is correct and if the model is protected by api key, make sure the api key is correct",
        });
      }

      return {
        data: model.data,
      };
    }
  } catch (error) {
    console.log(error);
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

    await prisma.dialoqbaseModels.create({
      data: {
        name: name,
        model_id: model_id,
        stream_available: stream_available,
        local_model: true,
        model_provider: api_type === "openai" ? "local" : "ollama",
        config: {
          baseURL: url,
          apiKey: api_key,
        },
      },
    });

    return {
      message: "success",
    };
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};
