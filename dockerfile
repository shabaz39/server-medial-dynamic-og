# Use a Node.js base image
FROM node:20

# Set working directory
WORKDIR /app

ENV HOST 0.0.0.0

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Install TypeScript globally (if not already installed)
RUN npm install -g typescript

# Build TypeScript code
RUN npm run build

# Fix permissions (if needed)
RUN chown -R node:node /app


# Expose the port your app runs on
EXPOSE 8080

# Command to run your app
CMD ["npm", "start"]
