FROM node:24-alpine3.21 AS builder

WORKDIR /app

COPY package*.json pnpm-lock.yam[l] yarn.loc[k] ./

RUN npm install

COPY . .

RUN npm run build

FROM node:24-alpine3.21 AS runner

WORKDIR /app

COPY --from=builder /app/.output ./
COPY --from=builder /app/package.json ./package.json
RUN npm install --omit=dev --no-fund --no-audit

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]
