# **TMDB CRUD Application**

A RESTful application that interacts with **The Movie Database (TMDB)** API to manage movie data. This application allows users to view, rate, and manage watchlists or favorites. It leverages **NestJS** for the backend and includes features such as caching, pagination, and filtering by genre.

---

## **Table of Contents**

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Testing](#testing)
- [Caching Mechanism](#caching-mechanism)
- [API Documentation](#api-documentation)

---

## **Features**

- CRUD operations for movies.
- Integration with **TMDB API** to fetch and sync movie data.
- User interactions:
  - Rate a movie (with average rating calculation).
  - Add to watchlist or mark as favorite.
- Search, filter, and paginate movie data.
- Caching to reduce database calls.
- Filter by genre (e.g., Action, Thriller, Horror).

---

## **Prerequisites**

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [NestJs](https://docs.nestjs.com/)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)
- [Redis](https://redis.io/)
- TMDB API Key (Register for free [here](https://www.themoviedb.org/))

- Seeding stage:
   - After the app is up we will need to run the migration file found in the /bin file with the credentials of the database inside (.env.staging) Env.
   - In this migration we got the movies and movies genres.

---

## **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/yossefezzat/MovieService.git
   cd MovieService
   ```

2. Create a `.env` file in the project root:
   ```env
   PORT=8000
   JWT_SECRET=
   JWT_EXPIRATION_DURATION=1hr
   DATABASE_USERNAME=
   DATABASE_PASSWORD=
   DATABASE_NAME=  
   DATABASE_HOST=
   CACHE_DEFAULT_TTL=
   CACHE_TTL_MAP={ "route": 180000 }
   DEFAULT_PAGE_SIZE=10
   REDIS_HOST=
   REDIS_PORT=
   REDIS_PASSWORD=
   REDIS_USERNAME=
   REDIS_CACHE_DATABASE_NUMBER=0
   MOVIE_APP_API_KEY=movie-apikey
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

---

## **Running the Application**

### Using Docker:
1. Build and start the application:
   ```bash
   docker-compose up --build
   ```

2. The app will be available at [http://localhost:8000](http://localhost:8000).

### Without Docker:
1. Start the database (PostgreSQL) locally.
2. Run the application:
   ```bash
   npm run start
   ```

---

## **Main API Endpoints**

### **Movies**
- `GET moviesservice/movies` - List all movies with pagination and filtering.
- `GET moviesservice/movies/:id` - Get details of a specific movie.
- `POST moviesservice/movies` - Add a new movie.
- `PUT moviesservice/movies/:id` - Update an existing movie.
- `DELETE moviesservice/movies/:id` - Delete a movie.

### **User Interactions**
- `POST moviesservice/reviews/            ` - Rate a movie.
- `POST moviesservice/watchlist/:movieId/` - Add a movie to the watchlist.

---

## **Project Structure**

```
src/
├── app.module.ts          # Main module
├── movies/                # Movies module
│   ├── movies.controller.ts
│   ├── movies.service.ts
│   ├── dto/              # Data transfer objects
│   ├── schemas/          # Database entities
├── reviews/              # Movies module
│   ├── reviews.controller.ts
│   ├── reviews.service.ts
│   ├── dto/              # Data transfer objects
│   ├── schemas/          # Database entities
├── watchlist/               # Movies module
│   ├── watchlist.controller.ts
│   ├── watchlist.service.ts
│   ├── dto/              # Data transfer objects
│   ├── schemas/          # Database entities
└── shared/               # Shared utilities, interceptors, and filters
```

---

## **Technologies Used**

- **NestJS**: Backend framework.
- **MongoDB**: Database.
- **Docker & Docker Compose**: Containerization.
- **TMDB API**: External movie data source.
- **Redis**: Caching (optional, if used).

---

## **Testing**

Unit tests are included to ensure functionality:
- Run tests:
  ```bash
  npm run test
  ```

---

## **Security**

- API Key Authentication

This project uses API Key authentication to secure its endpoints. All API requests must include a valid API key in the request header.

---

## **Caching Mechanism**

To reduce database calls, caching is implemented using **Redis**.

---

## **API Documentation**

API documentation is available via Swagger:
- Access it at [http://localhost:8000/api](http://localhost:8000/api).


## **Future Enhancements**

- We need to make a cloud task to run daily to seed our database with movies by created_date
- We need to intialize admin/moderator role and lock the movies creation and deletion and update endpoints
- Adding schema validation for envs, and load it from remote provider to store env secrets
- Introduce monitoring by adding logger module.

---