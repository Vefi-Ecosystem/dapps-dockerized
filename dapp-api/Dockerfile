FROM node:16-alpine
WORKDIR /app
COPY package.json /
COPY .env /
COPY src /src/
RUN npm install
EXPOSE 5340
ENTRYPOINT ["npm", "start"]
