# Build stage
FROM node:18-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ make python3 wget gnupg dirmngr unzip \
    && rm -rf /var/lib/apt/lists/*

RUN npm --no-update-notifier --no-fund --global install pnpm

COPY . .
RUN pnpm install && pnpm build

# Server stage
FROM node:18-slim AS server
WORKDIR /app
COPY ./server/ .
RUN yarn config set registry https://registry.npmjs.org/ && \
    yarn config set network-timeout 1200000 && \
    yarn install --frozen-lockfile && \
    yarn build

# Final stage
FROM node:18-slim
WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
    wget gnupg dirmngr curl ca-certificates git git-lfs openssh-client \
    jq cmake sqlite3 openssl psmisc python3 g++ make \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome based on architecture
RUN ARCH=$(dpkg --print-architecture) && \
    if [ "$ARCH" = "amd64" ]; then \
        wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
        echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
        apt-get update && apt-get install -y google-chrome-stable --no-install-recommends; \
    elif [ "$ARCH" = "arm64" ]; then \
        wget -q -O chromium-linux-arm64.zip 'https://playwright.azureedge.net/builds/chromium/1088/chromium-linux-arm64.zip' && \
        unzip chromium-linux-arm64.zip && \
        mv chrome-linux /usr/bin/chromium-browser && \
        ln -s /usr/bin/chromium-browser /usr/bin/google-chrome && \
        rm chromium-linux-arm64.zip; \
    else \
        echo "Unsupported architecture: $ARCH" && exit 1; \
    fi && \
    rm -rf /var/lib/apt/lists/*

# Copy build artifacts
COPY --from=server /app/dist/ . 
COPY --from=server /app/prisma/ ./prisma 
COPY --from=server /app/package.json . 
COPY --from=build /app/app/ui/dist/ ./public 
COPY --from=build /app/app/widget/dist/assets/ ./public/assets 
COPY --from=build /app/app/widget/dist/index.html ./public/bot.html 
COPY --from=build /app/app/script/dist/chat.min.js ./public/chat.min.js 

# Install production dependencies
RUN yarn config set registry https://registry.npmjs.org/ && \
    yarn config set network-timeout 1200000 && \
    yarn install --production --frozen-lockfile

CMD ["yarn", "start"]