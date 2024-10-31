
postgres:
	docker run --name postgres -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:16.3-alpine3.20
stoppostgres:
	docker stop postgres
createdb:
	docker exec -it postgres createdb --username=root --owner=root booking-service-db
dropdb:
	docker exec -it postgres dropdb  booking-service-db

redis:
	docker run --name redis -p 6379:6379 -d redis:7-alpine
migrateup:

migratedown:

server:

.PHONY: postgres createdb dropdb migrateup migratedown  server  redis 
