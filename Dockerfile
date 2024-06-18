FROM node:18-slim AS base
WORKDIR /app
RUN apt update && apt install -y \
    g++ make python3 wget gnupg dirmngr unzip

# Server stage
FROM base AS server
COPY ./server/ .
RUN yarn config set registry https://registry.npmjs.org/ && \
    yarn config set network-timeout 1200000 && \
    yarn install --frozen-lockfile && \
    yarn build

# Build stage
FROM base AS build
RUN npm --no-update-notifier --no-fund --global install pnpm
COPY . .
RUN pnpm install && pnpm build

# Final stage
FROM node:18-slim
WORKDIR /app

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV NODE_ENV=production
# Install dependencies
RUN apt update && apt install -y wget gnupg dirmngr unzip
# Install dependencies and google chrome based on architecture
RUN apt update && apt install -y wget gnupg dirmngr curl && \
    ARCH=$(dpkg --print-architecture) && \
    if [ "$ARCH" = "amd64" ]; then \
        wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
        sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
        apt-get update && \
        apt-get install google-chrome-stable -y --no-install-recommends; \
    elif [ "$ARCH" = "arm64" ]; then \
        wget -q -O chromium-linux-arm64.zip 'https://playwright.azureedge.net/builds/chromium/1088/chromium-linux-arm64.zip' && \
        unzip chromium-linux-arm64.zip && \
        mv chrome-linux /usr/bin/chromium-browser && \
        ln -s /usr/bin/chromium-browser /usr/bin/google-chrome && \
        rm chromium-linux-arm64.zip; \
    else \
        echo "Unsupported architecture: $ARCH" && exit 1; \
    fi && \
    rm -rf /var/lib/apt/lists/* \
    && apt-get clean && rm -rf /var/lib/{apt,dpkg,cache,log}/

# Install other dependencies
RUN apt update && apt install -y --no-install-recommends \
    ca-certificates git git-lfs openssh-client curl jq cmake sqlite3 openssl psmisc python3 g++ make && \
    apt-get clean autoclean && apt-get autoremove --yes && rm -rf /var/lib/{apt,dpkg,cache,log}/

# Copying build artifacts
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

# Start the application
CMD ["yarn", "start"]