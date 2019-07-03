# JS Libraries

## sucrase

Sucrase is an alternative to Babel that allows super-fast development builds.

## nodemon

Nodemon is a utility that will monitor for any changes in the source and automatically restart the server.

# Docker

#### Install Postgress container

Starts a postgres listening the PORT 5432 on my machine and fowarding to the 5432 on the container

```
docker run --name database -e POSTGRES_PASSWORD=deswaq -p 5432:5432 -d postgres
```

List all containers running now

```
docker ps
```

List all containers

```
docker ps -a
docker logs {ID}
```

# ES LINT

```
yarn eslint --init

# Fix all files in the src folder
yarn eslint --fix .\src\ --ext .js
```
