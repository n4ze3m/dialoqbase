# Dialoqbase

Dialoqbase is a web application that allows you to create custom chatbots with your own knowledge base. 

*Currently, it only supports OpenAI API but more LLMs will be added in the future.*

Here's a demo of how it works:

[![DialoqBase Demo](https://img.youtube.com/vi/Kktfs8JI4yI/0.jpg)](https://www.youtube.com/watch?v=Kktfs8JI4yI)

## Installation

1. Clone the repository and enter the docker directory

```bash
git clone https://github.com/n4ze3m/dialoqbase.git
cd dialoqbase/docker
```

2. Edit the `imp.env` file and set the environment variables

- On Linux

```bash
nano imp.env
```
or 

```bash
vim imp.env
```

- On Windows

```bash
notepad imp.env
```


`OPENAI_API_KEY` - OpenAI API key is required to use the OpenAI API. You can get one [here](https://platform.openai.com/account/api-keys)


3. Run the docker-compose file

```bash
docker-compose up -d
```

or

```bash
docker compose up -d
```

4. Open the browser and go to `http://localhost:3000`

5. Login with the default credentials

```bash
username: admin
password: admin
```

_important: change the default credentials after the first login_

## Features

- Create custom chatbots with your own knowledge base (website and text)

- Use the power of powerful LLMs to generate responses (currently only supports OpenAI API)

- Using PostgreSQL for vector search and storing the knowledge base (you don't need another vector database)


## TODO

- [ ] Add more LLMs both free and paid

- [ ] Add more dataloaders

- [ ] Support other embedding models

- [ ] Fix the UI issues

- [ ] Add more features


## License

[MIT](LICENSE)