# Use a Node.js base image
FROM node:20-bookworm

# Set working directory
WORKDIR /app

ENV HOST 0.0.0.0
ENV PLAYWRIGHT_BROWSERS_PATH=/usr/lib/playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Install Playwright browsers and system dependencies
RUN npx playwright install --with-deps

# Copy the rest of the application code
COPY . .

# Install TypeScript globally (if not already installed)
RUN npm install -g typescript

# Build TypeScript code
RUN npm run build

# Fix permissions (if needed)
RUN chown -R node:node /app

# Rebuild bcrypt with correct permissions if necessary
RUN npm rebuild bcrypt  

# Expose the port your app runs on
EXPOSE 8080

# Command to run your app
CMD ["node", "index.js"]
