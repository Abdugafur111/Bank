FROM node:18.16.1-alpine

# Add a work directory
WORKDIR /app

# Cache and Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app files
COPY . .

# RUN npm install -g vite@4.1.0
RUN npm install
# Expose port
EXPOSE 8080
# Start the app
CMD [ "npm", "run", "dev" ]