#!/bin/sh

echo "Installing dependencies for backend..."
npm install --legacy-peer-deps

if [ "$NODE_ENV" = "production" ]; then
    echo "Production mode detected"
    npm run start
else
    echo "Development mode detected"
    npm run dev
fi 