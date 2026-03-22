# Use the latest LTS Node version on Alpine Linux for a lightweight image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container to install dependencies separately from code
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all project files into the image (excluding those in .dockerignore)
COPY . .

# Expose the default Vite development port (5173) to external access
EXPOSE 5173

# Start the development server (configured in vite.config.js)
CMD ["npm", "run", "dev"]
