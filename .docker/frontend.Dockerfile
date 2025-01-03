FROM node:latest

WORKDIR /app

EXPOSE 5173

CMD ["npm", "run", "dev"] 