FROM node:16-alpine
WORKDIR /app
COPY .env.local /
COPY ui /ui/
COPY api /api/
COPY assets /assets/
COPY pages /pages/
COPY public /public/
COPY styles /styles/
COPY contexts /contexts/
COPY hooks /hooks/
COPY routes /routes/
COPY types/ /types/
COPY typings /typings/
COPY utils /utils/
COPY web3 /web3/
COPY *.js /
COPY *.json /
RUN npm install --legacy-peer-deps
RUN yarn build
EXPOSE 55334
ENTRYPOINT yarn start -p 55334
