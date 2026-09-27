FROM node:22.14.0-alpine3.21
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma

ENV HUSKY=0
RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "if [ \"$SEED_ON_START\" = \"true\" ]; then npx prisma db seed; fi; exec node dist/main"]
