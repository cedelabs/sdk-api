# syntax=docker/dockerfile:1

###################
# BUILD
###################
FROM node:20-alpine3.19 AS build

# Set the working directory to /app
WORKDIR /app

# Copy everything to the container
COPY --chown=node:node . ./

# Uncomment this line to run on localhost
# COPY --chown=node:node .env ./

RUN npm i -g corepack@latest

# Install aws cli
RUN apk update && apk add aws-cli

# Accept AWS credentials as build arguments
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

# Configure AWS CLI with the passed-in credentials
RUN echo "Using AWS Access Key: $AWS_ACCESS_KEY_ID" && \
    aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID && \
    aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY && \
    aws configure set region eu-west-1

# Login to AWS CodeArtifact
RUN aws codeartifact login --tool npm --repository cedelabs-private --domain cedelabs-private --domain-owner 343260416470 --region eu-west-1 --namespace @cedelabs-private

# Install dependencies
# We ignore scripts postinstall scripts because we don't need them in the production image
RUN set -ex; \
    pnpm i

# Build the application
RUN pnpm build

###################
# PRODUCTION
###################
FROM node:20-alpine3.19 AS production

USER node

# Set the working directory to /app
WORKDIR /app

# Copy the necessary files
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/package.json ./

# Uncomment this line to run on localhost
# COPY --chown=node:node --from=build /app/.env ./

# Run the app
CMD ["node", "dist/index"]
