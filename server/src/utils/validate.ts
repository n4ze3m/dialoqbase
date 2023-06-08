export const embeddingsValidation = (embeddingsType: string) => {
    switch (embeddingsType) {
        case "tensorflow":
            return true;
        case "openai":
            return process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length > 0 : false;
        case "cohere":
            return process.env.COHERE_API_KEY ? process.env.COHERE_API_KEY.length > 0 : false;
    }
}


export const embeddingsValidationMessage = (embeddingsType: string) => {
    switch (embeddingsType) {
        case "openai":
            return "Please add OPENAI_API_KEY to your .env file"
        case "cohere":
            return "Please add COHERE_API_KEY to your .env file"
    }
}