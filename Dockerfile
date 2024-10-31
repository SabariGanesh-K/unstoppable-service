FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies   

RUN npm install

# Copy the rest of the source code
COPY . .

# Build   
RUN npm run build

# Expose the port the app will listen on
EXPOSE 3000

# Start the app
CMD ["node", "dist/app.js"]