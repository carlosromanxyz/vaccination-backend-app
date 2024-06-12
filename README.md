<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Install Database with Docker and Docker Compose

1. Ensure if Docker is installed on your machine typing in a terminal `docker -v`.
2. Clone or download this repo.
3. Use your terminal and open it, then run `docker-compose up`, add `-d` if you don't need watch the logs.
4. Check on Docker Desktop if the database called db on "vaccination-backend-app" is running.

# Environment variables
1. Copy `.env.example` variables and use yours

# Initialize app

1. Ensure if `npm` is installed on your machine
2. On app root folder run `npm i`
3. Run `npm start dev`
4. Go to your favorite API Client and connect it using `http://localhost:3000`

# API documentation

1. After server start, you can go to `http://localhost:3000/api` (Based on Swagger)