const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env.staging' });

const MOVIE_API_URL = process.env.TMDB_API_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const GENERE_API_URL = process.env.TMDB_GENRE_API_URL;
const DATABASE_CONNECTION_URL = process.env.DATABASE_CONNECTION_URL;

async function getMovieGenres() {
  try {
    const response = await axios.get(GENERE_API_URL, {
      headers: {
        Authorization: `Bearer ${TMDB_API_TOKEN}`,
        accept: 'application/json',
      },
    });
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
}

const fetchMovies = async (page) => {
  try {
    const response = await axios.get(MOVIE_API_URL, {
      params: {
        include_adult: false,
        include_video: false,
        language: 'en-US',
        page: page,
        primary_release_date: 'gte=2025-12-01',
        sort_by: 'popularity.desc',
      },
      headers: {
        Authorization: `Bearer ${TMDB_API_TOKEN}`,
        accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log('Rate limit exceeded, waiting for 1 second...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchMovies(page);
    }

    console.error('Error fetching data:', error);
    throw error;
  }
};

const getAllMovies = async () => {
  let page = 2;
  let allMovies = [];
  let totalPages = 50;

  while (page <= totalPages) {
    const data = await fetchMovies(page);
    allMovies = [...allMovies, ...data.results];
    page++;
  }

  return allMovies;
};

async function seedMovies() {
  try {
    const allMovies = await getAllMovies();
    const filteredMovies = allMovies.map((movie) => ({
      overview: movie.overview,
      title: movie.title,
      genre_ids: movie.genre_ids,
      original_title: movie.original_title,
      averageRating: 0,
      rateCount: 0,
    }));

    await mongoose.connect(DATABASE_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create Movies collection and insert filtered data
    const Movie = mongoose.model(
      'Movie',
      new mongoose.Schema({
        overview: String,
        title: String,
        genre_ids: [Number],
        original_title: String,
        averageRating: { type: Number, default: 0 },
        rateCount: { type: Number, default: 0 },
      }),
    );
    await Movie.insertMany(filteredMovies);
    console.log('Movies data seeded');

    await mongoose.connection.close();
    console.log('Database seeding complete');
  } catch (err) {
    console.error('Error seeding the database', err);
  }
}

async function seedGenres() {
  try {
    const allGenres = await getMovieGenres();

    await mongoose.connect(DATABASE_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const Genre = mongoose.model(
      'Genre',
      new mongoose.Schema({ id: Number, name: String }),
    );
    await Genre.insertMany(allGenres);
    console.log('Genres data seeded');

    await mongoose.connection.close();
    console.log('Database seeding complete');
  } catch (err) {
    console.error('Error seeding the database', err);
  }
}

seedMovies();
seedGenres();
