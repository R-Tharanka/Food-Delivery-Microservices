# Use a specific version of the Node.js slim image
FROM node:18.16.0-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# # Set environment variables file
# ENV NODE_ENV=production

# Expose the application port
EXPOSE 5004

# Start the application
CMD ["npm", "start"]
