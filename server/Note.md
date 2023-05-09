create a django server: django-admin startproject server;

run the server: python3 manage.py runserver 127.0.0.0:8081;

create project application: python3 manage.py startapp {name}, here the name is `app`.

APIs we need for the AI motion counting: 

- 1. user history list [ video thumbnail， description( count, category, date) ]
- 2. new video with the exercise category, count and date
2. try
