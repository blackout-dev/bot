### BUILDER STAGE ###
FROM node:12.17.0-alpine AS builder

# Create app directory
WORKDIR /usr/src/builder

ENV NODE_ENV=production

# Install dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases/yarn-berry.js .yarn/releases/yarn-berry.js

# Setup node-gyp
RUN apk --no-cache add python g++ make && rm -rf /var/cache/apk/*
RUN yarn install

# Copy build configurations
COPY tsconfig.json ./

# Copy source
COPY src ./src

# Build the project
RUN yarn run build

### BOT STAGE ###
FROM node:12.17.0-alpine AS bot

WORKDIR /usr/src/blackout

ENV NODE_ENV=production

# Install dependencies
COPY --from=builder /usr/src/builder/.yarn ./.yarn
COPY --from=builder /usr/src/builder/yarn.lock ./yarn.lock

# Copy other required files
COPY package.json .yarnrc.yml ./

# Copy compiled TypeScript
COPY --from=builder /usr/src/builder/tsc_output ./tsc_output

# Link dependencies
RUN apk --no-cache add python g++ make && rm -rf /var/cache/apk/*
RUN yarn install

ENTRYPOINT ["yarn", "run", "start"]
