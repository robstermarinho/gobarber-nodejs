# Gobarber backend - NodeJS

NodeJS API to manage users and providers and schedule/cancel appointments. It also handle notifications and emails.

### Run the app

##### 1) Start the services

To run the app we need the following services:

- [PostgreSQL](https://www.postgresql.org/) - Main database
- [MongoDB](https://www.mongodb.com/) - Notification database
- [Redis](https://redis.io/) - Queue database

Optionally you can run the following docker containers:

```bash
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
docker run --name mongodb -p 27017:27017 -d -t mongo
docker run --name redis -p 6379:6379 -d -t redis:alpine
```

##### 2) Create a `.env` file based on `.env.example`

##### 3) Install dependencies

```
yarn
```

##### 4) Run the app

```
yarn runserver
```

##### 4) Run the queue

```
yarn runqueue
```

##### 5) Check if the service is runnning

You should get the following response opening the url `http://localhost:3333/`

```
{ "OK": "OK" }
```
