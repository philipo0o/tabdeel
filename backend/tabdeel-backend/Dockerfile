# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Build the NestJS project
RUN npm run build

# Expose the application port
EXPOSE 3000

# Run the app in production mode
CMD ["npm", "run", "start:prod"]