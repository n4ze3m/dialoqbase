# Support for Custom AI Models

Dialoqbase supports custom AI models, allowing you to utilize your own AI model to generate responses. This is particularly beneficial if you prefer using a model that Dialoqbase does not support or if you wish to avoid relying on third-party services.

## Providers

We support two types of Custom AI model providers:

1. AI models API compatible with the OpenAI API.
2. Ollama (*recommended*).

### Prerequisites

- Ensure a running instance of the AI model API or the Ollama server.

### Integration Steps

To integrate a custom AI model with Dialoqbase, follow these steps:

#### 1. Log in as an Administrator

- Log in to Dialoqbase as an administrator.

#### 2. Navigate to Model Settings

- Go to `Settings`.
- From the side menu, select `Models`.

#### 3. Add a New Model

- Click on `Add Model`.

#### 4. Fill in the Model Details

- By default, the custom model type is set to OpenAI API-compatible models.

::: warning IMPORTANT

If you are using a local AI server from the local machine, make sure to use `host.docker.internal` instead of `localhost` in the URL. For example:

For OpenAI API-compatible models:

`http://host.docker.internal:8080/v1`

For Ollama:

`http://host.docker.internal:11434`

:::

##### 4.1. Adding an OpenAI API Compatible Model

Add the following details:

- **URL**: The URL of the AI model API.

   For example, if you are using the LocalAI server, the URL will be `http://localhost:8080/v1`. Ensure to include `/v1` at the end of the URL.

- **API Key**: The API key of the AI model API (optional).

Then click on `Fetch Models` to retrieve the list of models from the API.

The list of models will be displayed in the `Model` dropdown. Select the desired model and provide a name. Then click on `Save`.

##### 4.2. Adding an Ollama Model

Add the following details:

- **URL**: The URL of the Ollama server.

   For example, if you are using the LocalAI server, the URL will be `http://localhost:11434`.

Then click on `Fetch Models` to retrieve the list of models from the API.

The list of models will be displayed in the `Model` dropdown. Select the desired model and provide a name. Then click on `Save`.

### Conclusion

That's it! You have successfully integrated a custom AI model with Dialoqbase. Now, you can use it to generate responses or engage in a conversation with a document.