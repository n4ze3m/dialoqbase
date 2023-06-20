# Self Hosting (Local)

Here are the steps to get a local instance of the dialoqbase server up and running.

<div class="tip custom-block" style="padding-top: 8px">

Are you looking for a Railway deployment guide? [Click here](/guide/self-hosting-railway).

</div>


## Prerequisites

* [Docker](https://docs.docker.com/get-docker/)
* [Git](https://git-scm.com/downloads)
* [OpenAI API Key](https://platform.openai.com/account/api-keys)


## Steps

Follow the steps below to get a local instance of the dialoqbase server up and running.


### Clone the repository

```sh [git]
git clone https://github.com/n4ze3m/dialoqbase && cd dialoqbase
```

### Edit the `.env` file

Copy paste your `OPENAI_API_KEY` and other API keys in the `.env` file.

::: code-group

```sh [linux (nano)]
nano .env
```

```sh [linux (vim)]
vim .env
```

```powershell [windows (notepad)]
notepad .env
```
:::


### Launch the server

Run the following command to start the server.

::: code-group

```sh [docker-compose]
docker-compose up -d
```

```sh [docker compose]  
docker compose up -d
```
:::

### Wait for the server to start

For the first time, it may take a few minutes to start the server. You can check the logs to see if the server has started.

After the server has started, you can visit the following URL to see the dashboard.


```sh [dashboard]
http://localhost:3000
```

Use the following credentials to login to the dashboard.

```sh [credentials]
username: admin
password: admin
```

:::tip
Make sure to change the password after logging in. You can change the password from the settings page.
:::



### Stop the server (optional)

If you want to stop the server, run the following command.

::: code-group

```sh [docker-compose]
docker-compose down
```

```sh [docker compose]

docker compose down
```
