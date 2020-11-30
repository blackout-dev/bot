### BUILDER STAGE ###
FROM node:12.20.0-alpine AS builder

# Create app directory
WORKDIR /usr/src/builder

ENV NODE_ENV=production

# Install dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases .yarn/releases

# Setup node-gyp
RUN apk --no-cache add python=2.7.18-r0 g++=9.2.0-r4 make=4.2.1-r2 && rm -rf /var/cache/apk/*

# Copy your local cache to speed up builds, Yarn will download any updates that are required, so this has no negative side effects
COPY .yarn ./.yarn

RUN yarn install

# Copy build configurations
COPY tsconfig.json ./

# Copy source
COPY src ./src

# Build the project
RUN yarn run build

### BOT STAGE ###
FROM node:12.20.0-alpine AS bot

WORKDIR /usr/src/blackouts

ENV NODE_ENV=production

# Install dependencies
COPY --from=builder /usr/src/builder/.yarn ./.yarn
COPY --from=builder /usr/src/builder/yarn.lock ./yarn.lock

# Copy other required files
COPY package.json .yarnrc.yml ./

# Copy compiled TypeScript
COPY --from=builder /usr/src/builder/tsc_output ./tsc_output

# Copy readme for GitHub Packages description
COPY readme.md readme.md

# Link dependencies
RUN apk --no-cache add python=2.7.18-r0 g++=9.2.0-r4 make=4.2.1-r2 && rm -rf /var/cache/apk/*
RUN yarn install

ENTRYPOINT ["yarn", "run", "start"]
