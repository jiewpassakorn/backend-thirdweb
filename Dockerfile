FROM node:20-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

# RUN npx tsc

FROM node:20-alpine

WORKDIR /usr/src/app

# COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/.env ./
COPY --from=build /usr/src/app/ ./uploads


# RUN npm install pm2 -g

# USER node

EXPOSE 3001

CMD ["npm", "run", "dev"]

# CMD ["pm2-runtime", "--env", "/app/.env", "dist/index.js"]  

