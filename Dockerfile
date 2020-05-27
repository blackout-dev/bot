### BUILDER STAGE ###
FROM node:12.17.0-alpine AS builder

# Create app directory
WORKDIR /usr/src/builder

ENV NODE_ENV=production

# Install dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases/yarn-berry.js .yarn/releases/yarn-berry.js

# (1/21) Installing binutils (2.33.1-r0)
# (2/21) Installing gmp (6.1.2-r1)
# (3/21) Installing isl (0.18-r0)
# (4/21) Installing libgomp (9.2.0-r4)
# (5/21) Installing libatomic (9.2.0-r4)
# (6/21) Installing mpfr4 (4.0.2-r1)
# (7/21) Installing mpc1 (1.1.0-r1)
# (8/21) Installing gcc (9.2.0-r4)
# (9/21) Installing musl-dev (1.1.24-r2)
# (10/21) Installing libc-dev (0.7.2-r0)
# (11/21) Installing g++ (9.2.0-r4)
# (12/21) Installing make (4.2.1-r2)
# (13/21) Installing libbz2 (1.0.8-r1)
# (14/21) Installing expat (2.2.9-r1)
# (15/21) Installing libffi (3.2.1-r6)
# (16/21) Installing gdbm (1.13-r1)
# (17/21) Installing ncurses-terminfo-base (6.1_p20200118-r4)
# (18/21) Installing ncurses-libs (6.1_p20200118-r4)
# (19/21) Installing readline (8.0.1-r0)
# (20/21) Installing sqlite-libs (3.30.1-r2)
# (21/21) Installing python2 (2.7.18-r0)

# Setup node-gyp
RUN apk --no-cache add python=2.7.18-r0 g++=9.2.0-r4 make=4.2.1-r2 && rm -rf /var/cache/apk/*
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
RUN apk --no-cache add python=2.7.18-r0 g++=9.2.0-r4 make=4.2.1-r2 && rm -rf /var/cache/apk/*
RUN yarn install

ENTRYPOINT ["yarn", "run", "start"]
