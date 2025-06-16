FROM node:current-alpine3.22

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

RUN addgroup -g 1001 appgroup && adduser -D -G appgroup -u 1001 appuser
USER appuser

COPY --chown=appuser:appgroup . .

CMD [ "node", "index.js" ]
