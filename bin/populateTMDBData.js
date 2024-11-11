const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env.staging' });

const MOVIE_API_URL = process.env.TMDB_API_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const GENRE_API_URL = process.env.TMDB_GENRE_API_URL;

const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;
const host = process.env.DATABASE_HOST;

const DATABASE_CONNECTION_URL = `mongodb://${username}:${password}@${host}/${database}?authSource=admin`;

// MongoDB Models
const movieSchema = new mongoose.Schema({
  overview: String,
  title: { type: String, required: true, unique: true },
  genre_ids: [Number],
  original_title: String,
  averageRating: { type: Number, default: 0 },
  rateCount: { type: Number, default: 0 },
});
const genreSchema = new mongoose.Schema({ id: Number, name: String });

const Movie = mongoose.model('Movie', movieSchema);
const Genre = mongoose.model('Genre', genreSchema);

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${TMDB_API_TOKEN}`,
    accept: 'application/json',
  },
});

// Fetch genres from the API
async function getMovieGenres() {
  try {
    const { data } = await axiosInstance.get(GENRE_API_URL);
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
}

// Fetch movies with pagination and retry logic
const fetchMovies = async (page) => {
  try {
    const { data } = await axiosInstance.get(MOVIE_API_URL, {
      params: {
        include_adult: false,
        include_video: false,
        language: 'en-US',
        page,
        primary_release_date: '2025-12-01',
        sort_by: 'popularity.desc',
      },
    });
    return data;
  } catch (error) {
    if (error.response?.status === 429) {
      console.log('Rate limit exceeded, retrying after 1 second...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchMovies(page);
    }
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// Get all movies across multiple pages
async function getAllMovies(totalPages = 50) {
  let page = 1;
  const allMovies = [];

  while (page <= totalPages) {
    const data = await fetchMovies(page);
    allMovies.push(...data.results);
    console.log(`Fetched page ${page}/${totalPages}`);
    page++;
  }

  return allMovies.map((movie) => ({
    overview: movie.overview,
    title: movie.title,
    genre_ids: movie.genre_ids,
    original_title: movie.original_title,
    averageRating: 0,
    rateCount: 0,
  }));
}

// Seed movie data into MongoDB
async function seedMovies() {
  try {
    const allMovies = await getAllMovies();
    await Movie.insertMany(allMovies);
    console.log('Movies data seeded successfully');
  } catch (error) {
    console.error('Error seeding movies:', error);
  }
}

// Seed genre data into MongoDB
async function seedGenres() {
  try {
    const allGenres = await getMovieGenres();
    await Genre.insertMany(allGenres);
    console.log('Genres data seeded successfully');
  } catch (error) {
    console.error('Error seeding genres:', error);
  }
}

// Initialize MongoDB connection and seed data
async function seedDatabase() {
  try {
    await mongoose.connect(DATABASE_CONNECTION_URL);
    console.log('Connected to MongoDB');

    await seedGenres();
    await seedMovies();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase();
