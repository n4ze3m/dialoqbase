exports.piplelineTransformer = async () => {
    let { pipeline,env } = await import("@xenova/transformers");
    env.useBrowserCache = false;
    env.allowLocalModels = false;
    return pipeline;
}