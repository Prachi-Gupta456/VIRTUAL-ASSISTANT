FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# install only production dependencies

RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
