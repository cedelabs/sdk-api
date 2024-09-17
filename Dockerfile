###################
# BUILD
###################
FROM node:20-alpine:3.19 AS build

# Set the working directory to /app
WORKDIR /app

# Copy everything to the container
COPY --chown=node:node . ./

# Install dependencies
# We ignore scripts postinstall scripts because we don't need them in the production image
RUN yarn install --silent --ignore-scripts

# Build the application
RUN yarn build

###################
# PRODUCTION
###################
FROM node:18-alpine3.18 AS production

USER node

# Set the working directory to /app
WORKDIR /app

# Copy the necessary files
COPY --chown=node:node --from=build /app/dist ./dist

# Uncomment this line to run on localhost
# COPY --chown=node:node --from=build /app/apps/api/.env ./.env

# Run the app
CMD ["node", "dist/index"]
