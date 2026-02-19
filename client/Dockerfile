FROM node:24-alpine3.21 AS builder

WORKDIR /app

# Este comando copia el package.json y LUEGO intenta copiar cualquier lockfile si existe.
# Si no existen, no lanza error gracias a los corchetes [ ].
COPY package.json package-lock.js[o]n pnpm-lock.yam[l] yarn.loc[k] ./

# Instalamos dependencias
RUN npm install

COPY . .

RUN npm run build


FROM node:24-alpine3.21 AS runner

WORKDIR /app

# Allow runtime/build-time override of the port (default 3000)
ARG PORT=3000
ENV PORT=${PORT}

COPY --from=builder /app/.output ./
COPY --from=builder /app/package.json ./package.json
RUN npm install --omit=dev --no-fund --no-audit

EXPOSE ${PORT}

CMD [ "node", ".output/server/index.mjs" ]
