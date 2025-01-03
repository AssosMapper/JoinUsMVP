# JoinUsMVP

1) copier les .env.example en .env se trouvant dans back-core ainsi que app
2) `docker compose --env-file ./back-core/.env up --build -d`


Pour executer les seeders :
`docker compose exec backend npm run seed`

Pour executer les migrations :
`docker compose exec backend npm run migration:run`