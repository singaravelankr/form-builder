FROM node:20-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache python3 make g++

# Use the existing node user
USER node

# Start Vite dev server
CMD ["sh", "-c", "npm install && npm run dev -- --host"] 