exports.piplelineTransformer = async () => {
  let { pipeline, env } = await import("@xenova/transformers");
  env.useBrowserCache = false;
  if (process.env.NODE_ENV === "production") {
    
    env.cacheDir = "./uploads/.cache";
  }
  return pipeline;
};
