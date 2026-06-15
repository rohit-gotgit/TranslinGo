# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create public/temp directory if it doesn't exist
RUN mkdir -p public/temp

# Expose port (Cloud Run will set PORT env variable)
EXPOSE 3001

# Start the application
CMD ["node", "src/index.js"]
