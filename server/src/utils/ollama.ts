import axios from "axios";

export const cleanUrl = (url: string) => {
  if (url.endsWith("/")) {
    return url.slice(0, -1);
  }
  return url;
};

export const getAllOllamaModels = async (url: string) => {
  try {
    const response = await axios.get(`${cleanUrl(url)}/api/tags`);
    const { models } = response.data as {
      models: {
        name: string;
        details?: {
            parent_model?: string
            format: string
            family: string
            families: string[]
            parameter_size: string
            quantization_level: string
          }
      }[];
    };
    return models.map((data) => {
      return {
        ...data,
        label: data.name,
        value: data.name,
        stream: true
      };
    });
  } catch (error) {
    console.log(`Error fetching Ollama models`, error);
    return [];
  }
};
