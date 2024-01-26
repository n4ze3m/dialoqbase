export const apiKeyValidaton = (modelType: string) => {
  console.log("apiKeyValidaton", modelType);
  switch (modelType.toLocaleLowerCase()) {
    case "transformer":
    case "jina":
    case "ollama":
    case "local":
      return true;
    case "jina-api":
      return process.env.JINA_API_KEY
        ? process.env.JINA_API_KEY.length > 0
        : false;
    case "supabase":
      return true;
    case "google-bison":
    case "google-gecko":
    case "google":
    case "google palm":
      return process.env.GOOGLE_API_KEY
        ? process.env.GOOGLE_API_KEY.length > 0
        : false;
    case "openai":
    case "openai-instruct":
      let flag = process.env.OPENAI_API_KEY
        ? process.env.OPENAI_API_KEY.length > 0
        : false;
      if (!flag) {
        flag = process.env.AZURE_OPENAI_API_KEY
          ? process.env.AZURE_OPENAI_API_KEY.length > 0
          : false;
      }
      return flag;
    case "cohere":
      return process.env.COHERE_API_KEY
        ? process.env.COHERE_API_KEY.length > 0
        : false;
    case "huggingface-api":
      return process.env.HUGGINGFACEHUB_API_KEY
        ? process.env.HUGGINGFACEHUB_API_KEY.length > 0
        : false;
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY
        ? process.env.ANTHROPIC_API_KEY.length > 0
        : false;
    case "fireworks":
      return process.env.FIREWORKS_API_KEY
        ? process.env.FIREWORKS_API_KEY.length > 0
        : false;
    default:
      return false;
  }
};

export const apiKeyValidatonMessage = (modelType: string) => {
  switch (modelType.toLowerCase()) {
    case "openai":
    case "openai-instruct":
      return "Please add OPENAI_API_KEY to your .env file";
    case "cohere":
      return "Please add COHERE_API_KEY to your .env file";
    case "huggingface-api":
      return "Please add HUGGINGFACEHUB_API_KEY to your .env file";
    case "ollama":
      return "Please add OLLAMA_EMBEDDING_API_URL and OLLAMA_EMBEDDING_MODEL to your .env file";
    case "google-bison":
    case "google-gecko":
    case "google":
    case "google palm":
      return "Please add GOOGLE_API_KEY to your .env file";
    case "anthropic":
      return "Please add ANTHROPIC_API_KEY to your .env file";
    case "fireworks":
      return "Please add FIREWORKS_API_KEY to your .env file";
    case "jina-api":
      return "Please add JINA_API_KEY to your .env file";
    default:
      return "Unable to validate API key";
  }
};
