FROM node:current-alpine3.22

# Create app directory
WORKDIR /home/node/app

# Copy package files and install dependencies as root
COPY package*.json ./
RUN npm install

# Switch to non-root user
RUN addgroup -g 1001 appgroup && adduser -D -G appgroup -u 1001 appuser
USER appuser

# Copy remaining files
COPY --chown=appuser:appgroup . .

# Run the app
CMD [ "node", "index.js" ]
