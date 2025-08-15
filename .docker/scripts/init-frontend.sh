#!/bin/sh

echo "Installing dependencies for frontend..."
npm install --legacy-peer-deps

if [ "$NODE_ENV" = "production" ]; then
    echo "Production mode detected"
    npm run build
else
    echo "Development mode detected"
    npm run dev -- --host 0.0.0.0  # Modifiez cette ligne
fi 