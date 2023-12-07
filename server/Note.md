### Start the project
1. activate front-end:<br>
`cd web/`<br>
`pnpm start`
2. run the server:<br>
`python3 manage.py runserver localhost:8081`

create a django server: django-admin startproject server;
create project application: python3 manage.py startapp {name}, here the name is `app`.
### Check databases
redis: `docker-compose exec redis redis-cli`<br>
we can use `keys *` to check what was stored in redis DB, but not recommended when the db is large.




