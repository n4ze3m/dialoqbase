FROM node:18-slim as server

WORKDIR /app

RUN apt update && apt -y install g++ make python3
# RUN npm install -g node-gyp

COPY ./server/ .

RUN yarn config set registry https://registry.npmjs.org/
RUN yarn config set network-timeout 1200000
RUN yarn install --frozen-lockfile

RUN yarn build

FROM node:18-slim as build
WORKDIR /app

RUN apt update
RUN npm --no-update-notifier --no-fund --global install pnpm

COPY . .
RUN pnpm install

RUN pnpm build

FROM node:18-slim
WORKDIR /app

RUN yarn config set registry https://registry.npmjs.org/
RUN yarn config set network-timeout 1200000

RUN apt update && apt -y install --no-install-recommends ca-certificates git git-lfs openssh-client curl jq cmake sqlite3 openssl psmisc python3

# RUN apt-get update && apt-get install gnupg wget -y && \
#   wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
#   sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
#   apt-get update && \
#   apt-get install google-chrome-stable -y --no-install-recommends && \
#   rm -rf /var/lib/apt/lists/*

RUN apt -y install g++ make
# RUN npm install -g node-gyp
RUN apt-get clean autoclean && apt-get autoremove --yes && rm -rf /var/lib/{apt,dpkg,cache,log}/
RUN npm --no-update-notifier --no-fund --global install pnpm
# Copy API
COPY --from=server /app/dist/ .
COPY --from=server /app/prisma/ ./prisma
COPY --from=server /app/package.json .
# Copy UI
COPY --from=build /app/app/ui/dist/ ./public
# Copy widgets 
COPY --from=build /app/app/widget/dist/assets/ ./public/assets
COPY --from=build /app/app/widget/dist/index.html ./public/bot.html
# Copy script
COPY --from=build /app/app/script/dist/chat.min.js ./public/chat.min.js

RUN yarn install --production  --frozen-lockfile

ENV NODE_ENV=production

# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

CMD ["yarn", "start"]