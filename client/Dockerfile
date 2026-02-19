FROM node:24-alpine3.21 AS builder

WORKDIR /app

# Copia de archivos de configuración
COPY package.json package-lock.js[o]n pnpm-lock.yam[l] yarn.loc[k] ./

RUN npm install

COPY . .

# --- AQUÍ DEFINIMOS LOS ARGUMENTOS QUE VIENEN DEL .ENV ---
ARG BACKEND_URL
ARG NITRO_PRESET
# Hacemos que estén disponibles como variables de entorno en el build
ENV BACKEND_URL=${BACKEND_URL}
ENV NITRO_PRESET=${NITRO_PRESET}

RUN npm run build


FROM node:24-alpine3.21 AS runner

WORKDIR /app

# Usamos el PORT de tu .env (8010)
ARG PORT=8010
ENV PORT=${PORT}
# Importante para Nuxt/Nitro
ENV NITRO_PORT=${PORT} 

COPY --from=builder /app/.output ./
COPY --from=builder /app/package.json ./package.json

RUN npm install --omit=dev --no-fund --no-audit

EXPOSE ${PORT}

CMD [ "node", ".output/server/index.mjs" ]