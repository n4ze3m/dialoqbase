# Contribution guide
## How to run locally
### Configure Redis
There are a few possible ways to deal with Redis. Please follow either one of these methods:
#### Running the Redis server locally
- Install [Redis](https://redis.io/download/). If you are on macOS, I strongly recommend using Homebrew by running: `brew install redis`
- Run `redis-server`
You should see information about the server, such as the port (for example `6379`). Your Redis URL (i.e. `DB_REDIS_URL`) will be: `redis://localhost:[PORT]`.

#### Running the Redis server using Upstash or Railway
Go to the official [Upstash](https://upstash.com/) or [Railway](https://railway.app/) website and follow the instructions to create a Redis server.
You should obtain a URL, which will be your `DB_REDIS_URL`.

### Run the app
1. Rename the example environment variables located at `app/ui/`, `app/widget/`, and `server/` to `.env`
2. Configure properly the environment variables. The ones located inside of the `app` folder can be used by default, but you must change the environment variables inside of the `server/` folder.
- `DATABASE_URL` is the URL of the PostgreSQL database
- `DB_REDIS_URL` should be set to the Redis URL. See the previous section for more details
- `OPENAI_API_KEY` is the OpenAI API key
- `DB_SECRET_KEY` is a random key that you can set to whatever you want
3. Run `yarn install` in the main folder and in the `server/` folder
4. Run `yarn build` in the main folder
5. Run `mv app/ui/dist server/dist/public && mv app/widget/dist/index.html server/dist/public/bot.html && cp -r app/widget/dist/assets/*  server/dist/public/assets/` in the main folder
6. Run `yarn dev` in the main folder **and** in the `server/` folder

From there you can open the app by using the URL printed by this last command.

