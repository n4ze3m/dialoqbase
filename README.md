# Dialoqbase ⚡

Dialoqbase is an open-source application designed to facilitate the creation of custom chatbots using a personalized knowledge base. The application leverages advanced language models to generate accurate and context-aware responses. Additionally, it utilizes PostgreSQL, a robust relational database management system, for efficient vector search operations and for storing the knowledge base.

Here's a demo of how it works (v0.0.1):

[![DialoqBase Demo](https://img.youtube.com/vi/Kktfs8JI4yI/0.jpg)](https://www.youtube.com/watch?v=Kktfs8JI4yI)

## Quick Deployments

### Railway with Supabase

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/TXdjD7?referralCode=olbszX)

for more details - [watch demo](https://twitter.com/n4ze3m/status/1668208861663354882)

## Installation

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

## Features

- Create custom chatbots with your own knowledge base

- Utilize powerful language models to generate responses

- Utilize PostgreSQL for vector search and storing the knowledge base.

## Stack

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Fastify](https://www.fastify.io/)
- [LangChain](https://langchain.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Rspack](https://rspack.dev)

## Disclaimer

Dialoqbase is a side project and is not ready for production. It is still in the early stages of development and may contain bugs and security issues. Use it at your own risk. _Breaking changes may occur at any time without prior notice._

## Roadmap

### Data loaders

- [x] Website (_one page only_)
- [x] Plane text
- [x] PDF (beta)
- [x] Web crawler (beta)
- [ ] site map
- [ ] Github repository
- [ ] mp3
- [ ] Notion

and more...

### Language models

- [x] OpenAI
- [x] Anthropic

open source chatmodels soon...

### Embedding models

- [x] OpenAI
- [x] TensorFlow
- [x] Hugging Face
- [x] Cohere

need more ? create an issue...

### Application

- [x] Create chatbots
- [x] Create knowledge base
- [x] Generate responses
- [x] Vector search
- [x] Bot embed script for websites
- [ ] Supabase Integration
- [ ] Bot style editor
- [ ] Chatbot API
- [ ] Chatbot theme editor
- [ ] Chatbot analytics
- [ ] UI/UX improvements

## License

[MIT](LICENSE)


## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->