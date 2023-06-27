exports.piplelineTransformer = async () => {
    let { pipeline } = await import("@xenova/transformers");
    return pipeline;
}