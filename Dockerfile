FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# The build command in package.json should be set to "tsc"

EXPOSE 3000

# We are going to run the seed and then the app in the same container for simplicity.
# But note: In production, you might want to run the seed separately.

CMD npm run seed && npm start