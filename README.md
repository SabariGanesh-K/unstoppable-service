# Server Service

Uses Node with Typescript and Drizzle ORM for interaction with PostgreSQL .
The client service is present at https://github.com/SabariGanesh-K/unstoppable-angular-client

## Development
In development stage , it uses docker engine to run postgresql lightweight alpine image and connects to local docker db .
Uses the local run server [8080 port] of the service mapped above

## Production

Uses production DB at AWS RDS for postgresql [ can be shifted to aurora - no money :( ] 
Service can be deployed at AWS services such as AWS Elastic beanstalk

## Instruction to execute
## Environment setup
- env_sample has the configs to conenct to DB
  

## Development Service
- Install all dpendencies using
```bash
npm install 

````
- Config is default setted to production DB , hence at src/db/db.ts , switch to localDbConfig
- Ensure docker engine is installed with postgresql alpine lightweight image [ if not , it gets pulled by default]
- Setup DB local and database
```bash
make postgres
make createdb
npm migrate
````
- Refer Migrations section below to manually migrate/down and setup DB with initial data and tables
- Run the app
```bash
npm run start
````

## Production Service
- Install all dpendencies using
```bash
npm install 

````
- Config is default setted to production DB [ ensure to modify database name, username in src/db/db/ts as per RDS created ]

- Setup an RDS  DB in AWS with necessary roles
- adjust the env variable according to master password and endpoint [host]
-  ensure to modify database name, username in src/db/db/ts as per RDS created
- Migrate data to DB
```bash
npm migrate
````
- Refer Migrations section below to manually migrate/down and setup DB with initial data and tables
- Run the app
```bash
npm run start
````

## Migration [Manual]
- 2 utility routes have been created to facilitiate migrate up and down of tables with intial seating data [ for seat searching illustration]

  Refer to routes below
  /migrateup
  /migratedown

- Use these routes if you want to reset DB. Use it with caution as queries are heavy and might attract huge bill in AWS
  




