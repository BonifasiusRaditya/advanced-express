FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5433
CMD ["npm", "start"]
