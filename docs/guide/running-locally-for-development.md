# Running Locally for Development

This documentation explains how to setup and run the app locally for development purposes. Running locally allows you to test changes and new features before deploying to production.


## Introduction

The app consists of two main parts - the frontend app located in `app/` and the backend server located in `server/`. The frontend contains the UI and widgets while the backend handles the API and database.

To run everything locally, you need to:

- Configure environment variables  
- Install dependencies
- Build the frontend assets
- Start the dev servers


## Prerequisites

- [Node.js](https://nodejs.org/en/) v18 or higher  
- [Yarn](https://yarnpkg.com/)
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/) 
- [Redis](https://redis.io/)


## Configure Redis

There are a few options for setting up Redis:

#### Running the Redis server locally
- Install [Redis](https://redis.io/download/). If you are on macOS, I strongly recommend using Homebrew by running: `brew install redis`
- Run `redis-server`
You should see information about the server, such as the port (for example `6379`). Your Redis URL (i.e. `DB_REDIS_URL`) will be: `redis://localhost:[PORT]`.

#### Running the Redis server using Upstash or Railway  
Go to the official [Upstash](https://upstash.com/) or [Railway](https://railway.app/) website and follow the instructions to create a Redis server. You should obtain a URL, which will be your `DB_REDIS_URL`.


## Configure PostgreSQL

Dialoqbase requires a PostgreSQL database with pgvector installed. If you don't have a PostgreSQL database, I recommend spinning up a docker container with the following command:

```sh  
docker run -d --name pgvector -p 5432:5432 ankane/pgvector:latest
```

If you already have a PostgreSQL database, you can install pgvector by following the instructions [here](https://github.com/pgvector/pgvector#additional-installation-methods)

Once you have a PostgreSQL database with pgvector installed, you need to create a database and a user. You can do this by running the following commands:

- Go to the `/server` folder

    ```sh
    npx prisma migrate deploy
    ```
    *note*: This is a one-time command. Do not run it again unless you want to reset the database.
  

Set the `DATABASE_URL` environment variable to the URL of your PostgreSQL database. The URL should look something like this: `postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]`.
## Steps to Run Locally

1. Rename the example environment variable files located at `app/ui/`, `app/widget/`, and `server/` to `.env` and comment out all of the variables inside of them.

2. Configure properly the environment variables. The ones located inside of the `app` folder can be used by default, but you must change the environment variables inside of the `server/` folder:

    - `DATABASE_URL` is the URL of the PostgreSQL database
    - `DB_REDIS_URL` should be set to the Redis URL. See the previous section for more details.  
    - `OPENAI_API_KEY` is the OpenAI API key
    - `DB_SECRET_KEY` is a random key that you can set to whatever you want
    
3. Run `yarn install` in the main folder, `app/ui/`, `app/widget/`, `app/script/` and in the `server/` folder to install dependencies.  

4. Run `yarn build` in the main folder to build the frontend assets.

5. Use the following commands for this step:  

    - Move the built frontend assets to the backend:
      ```sh
      mv app/ui/dist server/dist/public
      ```
      
    - Move the built widget code to the backend:
      ```sh  
      mv app/widget/dist/index.html server/dist/public/bot.html
      ```
      
    - Copy the widget assets to the backend:
      ```sh
      cp -r app/widget/dist/assets/* server/dist/public/assets/
      ```

6. Run `pnpm dev` in the main folder **and** in the `server/` folder to start the dev servers.

    - If you don't have `pnpm` installed, you can install it globally with `npm install -g pnpm` 
    - If you don't have `yarn` installed, you can install Yarn globally with `npm install -g yarn`

Now you should be able to access the frontend at `localhost:5173` and the backend API at `localhost:3000`. As you make code changes, the servers will reload and reflect the updates. But if you make changes to the widget, you will need to run the asset copy command again to update the widget assets in the backend.
