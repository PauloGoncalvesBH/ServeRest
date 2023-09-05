# hadolint ignore=DL3029
FROM --platform=linux/amd64 datadog/serverless-init:1-alpine as datadog-serverless

FROM node:lts-alpine3.17@sha256:e0641d0ac1f49f045c8dc05bbedc066fc7c88bc2730ead423088eeb0788623a1 as base

# Production dockerfile

LABEL repository="https://github.com/ServeRest/ServeRest" \
      homepage="https://github.com/ServeRest/ServeRest" \
      maintainer="Paulo Gonçalves <https://www.linkedin.com/in/paulo-goncalves/>"

ENV ENVIRONMENT='docker'

COPY --from=datadog-serverless /datadog-init /app/datadog-init

ENV DD_SITE='datadoghq.eu'
ENV DD_SERVICE='serverest'
ENV DD_ENV=$ENVIRONMENT
ENV DD_LOGS_ENABLED=true

WORKDIR /app

COPY package*.json ./

RUN npm ci --production --ignore-scripts

COPY . .

ENV TERM=xterm-256color

EXPOSE 3000
ENTRYPOINT ["/app/datadog-init"]
CMD ["npm", "start", "--", "0"]
