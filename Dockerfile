FROM node:15.11.0-slim AS deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production

FROM node:15.11.0-slim AS builder
WORKDIR /usr/src/app
COPY . ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
RUN yarn install
RUN yarn build

FROM node:15.11.0-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/build ./build/

HEALTHCHECK CMD curl -f http://localhost:3000/status || exit 1
EXPOSE 3000

CMD yarn start