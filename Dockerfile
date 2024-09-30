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


# Install aws cli
RUN apk update && apk add aws-cli


# Set the aws credentials 
RUN --mount=type=secret,id=aws_access_key_id \
 echo $aws_access_key_id # would output "foo".

RUN --mount=type=secret,id=aws_access_key_id \
 aws configure set aws_access_key_id $(cat /run/secrets/aws_access_key_id)
RUN --mount=type=secret,id=aws_secret_access_key \
 aws configure set aws_secret_access_key $(cat /run/secrets/aws_secret_access_key)
RUN aws configure set region eu-west-1

# Login to AWS CodeArtifact
RUN aws codeartifact login --tool npm --repository cedelabs-private --domain cedelabs-private --domain-owner 343260416470 --region eu-west-1 --namespace @cedelabs-private

# Install dependencies
# We ignore scripts postinstall scripts because we don't need them in the production image
RUN yarn install --silent --ignore-scripts

# Build the application
RUN yarn build

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
