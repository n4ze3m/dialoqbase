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

2. Edit the `.env` file and set the following environment variables:

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

Set the `OPENAI_API_KEY` variable to your OpenAI API key. You can obtain an API key [here](https://platform.openai.com/account/api-keys).
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

- [X] Website (_one page only_)
- [X] Plane text
- [X] PDF (beta)
- [X] Web crawler (beta)
- [X] Microsoft Word documents (beta)
- [X] Github repository
- [X] mp3
- [X] mp4
- [X] Sitemap
- [X] Youtube
- [ ] Notion

and more...

### Language models

- [X] OpenAI
- [X] Anthropic
- [X] Google chat-bison-001
- [X] fireworks.ai's llama 2 models
- [X] fireworks.ai's mistral
- [X] Local AI models
- [X] Ollama

### Embedding models

- [X] OpenAI
- [X] TensorFlow (removed)
- [X] Hugging Face
- [X] Cohere
- [X] all-MiniLM-L6-v2 using [xenova/transformers.js](https://github.com/xenova/transformers.js/)
- [X] Ollama embedding
- [X] Google text-gecko-001

need more ? create an issue...

### Application

- [X] Create chatbots
- [X] Create knowledge base
- [X] Generate responses
- [X] Vector search
- [X] Bot embed script for websites
- [X] Prompt Editor
- [X] Chatbot API
- [X] Chatbot theme editor
- [X] Streaming responses

### Integrations

- [X] Web embed script
- [X] Telegram (beta)
- [X] Discord (beta)
- [ ] Slack
- [X] Whatsapp (experimental)

need more ? create an issue...

## Contributors ✨

<a href="https://github.com/n4ze3m/dialoqbase/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=n4ze3m/dialoqbase" />
</a>

Interested in contributing? Check out the [contributing guide](CONTRIBUTION.md).

## License 📝

[MIT](LICENSE)
