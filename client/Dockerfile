FROM node:24-alpine3.21 AS builder

WORKDIR /app

# Copia de archivos de configuración
COPY package.json package-lock.js[o]n pnpm-lock.yam[l] yarn.loc[k] ./

RUN npm install

COPY . .

# --- AQUÍ DEFINIMOS LOS ARGUMENTOS QUE VIENEN DEL .ENV ---
ARG BACKEND_URL
ARG NITRO_PRESET=static
# Hacemos que estén disponibles como variables de entorno en el build
ENV BACKEND_URL=${BACKEND_URL}
ENV NITRO_PRESET=${NITRO_PRESET}

RUN npm run build


FROM node:24-alpine3.21 AS runner

WORKDIR /app

# Usamos el PORT de tu .env (8010)
ARG PORT=8010
ENV PORT=${PORT}

# Copiamos solo el build estático
COPY --from=builder /app/.output/public ./public

RUN npm install -g serve

EXPOSE ${PORT}

CMD [ "sh", "-c", "serve -s /app/public -l ${PORT}" ]