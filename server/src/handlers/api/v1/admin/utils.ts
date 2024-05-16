import axios from "axios";
import { chatModelProvider } from "../../../../utils/models";

export const isReplicateModelExist = async (
  model_id: string,
  token: string
) => {
  try {
    const url = "https://api.replicate.com/v1/models/";
    const isVersionModel = model_id.split(":").length > 1;
    if (!isVersionModel) {
      const res = await axios.get(`${url}${model_id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = res.data;
      return {
        success: true,
        message: "Model found",
        name: data.name,
      };
    } else {
      const [owner, model_name] = model_id.split("/");
      const version = model_name.split(":")[1];
      const res = await axios.get(
        `${url}${owner}/${model_name.split(":")[0]}/versions/${version}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = res.data;

      return {
        success: true,
        message: "Model found",
        name: data.name,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Model not found",
          name: undefined,
        };
      } else if (error.response?.status === 401) {
        return {
          success: false,
          message: "Unauthorized",
          name: undefined,
        };
      } else if (error.response?.status === 403) {
        return {
          success: false,
          message: "Forbidden",
          name: undefined,
        };
      } else if (error.response?.status === 500) {
        return {
          success: false,
          message: "Internal Server Error",
          name: undefined,
        };
      } else {
        return {
          success: false,
          message: "Internal Server Error",
          name: undefined,
        };
      }
    } else {
      return {
        success: false,
        message: "Internal Server Error",
        name: undefined,
      };
    }
  }
};

export const getModelFromUrl = async (url: string, apiKey?: string) => {
  try {
    const response = await axios.get(`${url}/models`, {
      headers: {
        "HTTP-Referer":
          process.env.LOCAL_REFER_URL || "https://dialoqbase.n4ze3m.com/",
        "X-Title": process.env.LOCAL_TITLE || "Dialoqbase",
        Authorization: apiKey && `Bearer ${apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getOllamaModels = async (url: string) => {
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

export const modelProvider = {
  "openai-api": "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  groq: "Groq",
};

export const isValidModel = async (
  model_id: string,
  model_provider: string
) => {
  try {
    const model = chatModelProvider(model_provider, model_id, 0.7, {});
    const chat = await model.invoke("Hello");
    return chat !== null;
  } catch (error) {
    console.error(error);
    return false;
  }
};
