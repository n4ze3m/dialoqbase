<h1 align="center">⚡Dialoqbase ⚡</h1>
<p align="center">
 Create chatbots with ease
</p>

<div align="center">

  [![Join dialoqbase #welcome](https://img.shields.io/badge/discord-join%20chat-blue.svg)](https://discord.gg/SPE3npH7Wu)
  [![Build Status](https://github.com/n4ze3m/dialoqbase/actions/workflows/build.yml/badge.svg)](https://github.com/n4ze3m/dialoqbase/actions/workflows/build.yml)
  [![License: MIT](https://img.shields.io/github/license/n4ze3m/dialoqbase)](https://github.com/n4ze3m/dialoqbase/blob/master/LICENSE)

</div>

Dialoqbase is an open-source application designed to facilitate the creation of custom chatbots using a personalized knowledge base. The application leverages advanced language models to generate accurate and context-aware responses. Additionally, it utilizes PostgreSQL, a robust relational database management system, for efficient vector search operations and for storing the knowledge base.

Here's a demo of how it works (v0.0.23):

<div align="center">

[![DialoqBase Demo](https://img.youtube.com/vi/D3X3ZIYsT_w/0.jpg)](https://www.youtube.com/watch?v=D3X3ZIYsT_w)

</div>

Want to check more demo videos? Follow me on [Twitter](https://twitter.com/n4ze3m) or [BlueSky](https://bsky.app/profile/n4ze3m.com) for more updates.

## Quick Deployments 🚀

### Railway with Supabase

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/TXdjD7?referralCode=olbszX)

for more details - [watch demo](https://twitter.com/n4ze3m/status/1668208861663354882)

## Installation 🛠️

1. Clone the repository and navigate to the docker directory:

```bash
git clone https://github.com/n4ze3m/dialoqbase.git
cd dialoqbase/docker
```

2. Edit the `.env` <!--(see the [Environment Variables](#environment-variables) section for more details)-->:

- On Linux:

```bash
nano .env
```

or

```bash
vim .env
```

- On Windows:

```bash
notepad .env
```

Set the `DB_SECRET_KEY` varible.

3. Run the docker-compose file:

```bash
docker-compose up -d
```

or

```bash
docker compose up -d
```

4. Open your browser and go to `http://localhost:3000`.
5. Log in using the default credentials:

```bash
username: admin
password: admin
```

_Important: After the first login, remember to change the default credentials._

## Features 🚀

- Create custom chatbots with your own knowledge base
- Utilize powerful language models to generate responses
- Utilize PostgreSQL for vector search and storing the knowledge base.
- Use any language models or embedding models you want

## Stack 📚

- [React](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [Node.js](https://nodejs.org/)
- [Fastify](https://www.fastify.io/)
- [LangChain](https://langchain.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Rspack](https://rspack.dev)
- [@waylaidwanderer/fastify-sse-v2](https://github.com/waylaidwanderer/fastify-sse-v2) (Server-Sent Events)

## Disclaimer ⚠️

Dialoqbase is a side project and is not ready for production. It is still in the early stages of development and may contain bugs and security issues. Use it at your own risk. _Breaking changes may occur at any time without prior notice._

## Roadmap 🗺️

### Data loaders

| Loader |Status |
| ----------- |  ------ |
| Website | ✅ |
| Plane text |  ✅ |
| PDF |  ✅ |
| Web crawler |  ✅ |
| Microsoft Word documents |  ✅ |
| Github repository | ✅ |
| mp3 | ✅ |
| mp4 |  ✅ |
| Sitemap |  ✅ |
| Youtube | ✅ |
| Notion |  ❌ |


### Language models


| Provider | Models |
| ----------- | ----------- |
| OpenAI | gpt-3.5-turbo, gpt-3.5-turbo-16k, gpt-4, gpt-4-0613, gpt-3.5-instruct, gpt-3.5-turbo-1106, gpt-4-1106-preview	| 
| Anthropic | Claude 1, Claude 2 |
| Google | chat-bison-001, Gemini |
| Fireworks | Llama 2, Mistral, Mixtral and more |
| Local AI | Local AI models |
| Ollama | All Ollama supported models |

### Embedding models

| Provider | Models | Status |
| ----------- | ----------- | ------ |
| OpenAI | text-embedding-ada-002 | ✅ |
| TensorFlow | universal-sentence-encoder | ❌ |
| Hugging Face | distilbert-base-uncased | ✅ |
| Cohere | Embed | ✅ |
| Huggingface Transformers.js | all-MiniLM-L6-v2 | ✅ |
| Ollama | Ollama embedding | ✅ |
| Google | text-gecko-001, embedding-001 | ✅ |
| Jina | Jina embedding | ✅ |

need more ? create an issue...

### Integrations

| Type | Stage | Status |
| ----------- | ----------- | ------ |
| Web embed script |  stable | ✅ |
| Telegram | beta | ✅ |
| Discord | beta | ✅ |
| Slack | development | ❌ |
| Whatsapp | experimental | ✅ |

need more ? create an issue...


## Contributors ✨

<a href="https://github.com/n4ze3m/dialoqbase/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=n4ze3m/dialoqbase" />
</a>

Interested in contributing? Check out the [contributing guide](CONTRIBUTION.md).


## Sponsors 💖

<p>
  <a href="https://flogesoft.com/?utm_source=dialoqbase&utm_medium=sponsor&utm_campaign=dialoqbase">
    <img src="https://flogesoft.com/images/floges_sponsored.svg" width="150"
    height="50"
     />
  </a>
</p>

## License 📝

[MIT](LICENSE)
