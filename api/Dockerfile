FROM node:20 as builder

WORKDIR /usr/api

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]
RUN npm install
COPY . .

RUN npm run build
CMD ["node", "dist/index.js"]
