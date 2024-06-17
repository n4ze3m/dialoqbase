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

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN npm init -y &&  \
    npm i puppeteer \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /node_modules \
    && chown -R pptruser:pptruser /package.json \
    && chown -R pptruser:pptruser /package-lock.json

USER pptruser

RUN yarn config set registry https://registry.npmjs.org/
RUN yarn config set network-timeout 1200000

RUN apt update && apt -y install --no-install-recommends ca-certificates git git-lfs openssh-client curl jq cmake sqlite3 openssl psmisc python3

RUN apt -y install libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libatk1.0-0 libatk-bridge2.0-0 libpangocairo-1.0-0 libgtk-3-0

RUN apt -y install g++ make

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

CMD ["yarn", "start"]