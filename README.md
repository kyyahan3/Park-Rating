## Project set up
#### web
- install [nodejs](https://nodejs.org/en/download)
- create a react app: `npx create-react-app web`<br>
Main js code are in `src` folder and `index.js` is the project entry file. Dependencies are in `node_modules` folder recorded in package.json.
- activate front-end:<br>
`cd web/`<br>
`pnpm start` or `npm start`
#### server
- ` pip install Django`
- create a django server: `django-admin startproject server`. 
- Create a application in the project : `python3 manage.py startapp {name}`, name is `app` for this project. 
- start the server: <br>
`cd server/`<br>
`python3 manage.py runserver localhost:8081`
#### database
- enter the folder with docker-compose.yml and start dockers `docker-compse up -d`
- mongodb: `docker-compose exec mongodb bash` or `docker-compose exec mongodb mongosh`
- redis: `docker-compose exec redis redis-cli`. we can use `keys *` to check what was stored in redis DB, but this is not recommended when the db is large.
#### .env
To use the Google Map feature, we need to have an API key. create your `.env` like `.env.example` and set the key values.
## Main points
1. System Architecture:
- Caching with Redis: We implemented Redis as our caching system to enhance performance for frequently accessed data. When our system receives a request, it first checks the Redis cache. If the requested data is found there, it is returned immediately. However, if the data is not in the Redis cache, our system will then search for it in the MongoDB database.
- Database with MongoDB: MongoDB serves as our primary database, ideal for storing complex information about national parks in America.
  - The main collection is called ca_np with all kinds of detailed information of National Parks in CA.
  - There are other collections such as comments, newsreleases, thingstodo and images to store more data. We used hash (md5) to avoid duplicates in image collection because images are large files and we do not want to waste space on that.
- APIs for Detailed Searches: Developed RESTful APIs to enable detailed searches of park information.<br></br>
    <p float="left">
      <img src="home_page.png" height=360 width="600" />
      <img src="detail.png" height=500 width="600" /> 
    </p>
2. Web UI Design:
- Built Using Django: We designed a simple web UI with Django to display park information.
- Home Page Overview: The home page (first image) provides a brief view of each park.
- Detailed Park Information: Upon clicking on a specific park (second image), detailed information is displayed including location on Google Maps, park rating, description, images, and the most updated user comments.


## Other information
UI component package: Ant Design (we used components like Layout, Button, Rate, Input textbox, Card, List, Typography, etc.)<br>
`pnpm install axios` is a Promise based HTTP client for the browser and node.js




