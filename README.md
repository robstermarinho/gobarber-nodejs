## JS Libraries

### sucrase

Sucrase is an alternative to Babel that allows super-fast development builds.

### nodemon

Nodemon is a utility that will monitor for any changes in the source and automatically restart the server.

## Docker

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

Start/Stop Container

```
docker start {NAME/ID}
docker stop {NAME/ID}
```

## ES LINT

```
yarn eslint --init

# Fix all files in the src folder
yarn eslint --fix .\src\ --ext .js
```

## Migrations

Create migration file with the sequelize CLI

```
yarn sequelize migration:create --name=create-users
```

Run migrations

```
# Migrate
yarn sequelize db:migrate

# Undo Last
yarn sequelize db:migrate:undo

# Undo All
yarn sequelize db:migrate:undo:all
```

Redis

```
docker run --name redis -p 6379:6379 -d -t redis:alpine
```
