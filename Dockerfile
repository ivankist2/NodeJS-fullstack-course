FROM node:20
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm install -g npm@10.8.3
RUN npm install
EXPOSE 4444
CMD npm start