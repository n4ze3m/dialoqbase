exports.piplelineTransformer = async () => {
  let { pipeline, env } = await import("@xenova/transformers");
  env.useBrowserCache = false;
  env.allowLocalModels = false;
  if (process.env.NODE_ENV === "production") {
    env.cacheDir = "./.cache";
  }
  return pipeline;
};
