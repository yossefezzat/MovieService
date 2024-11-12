import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './schemas/movie.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Genre } from './schemas/genre.schema';
import { MovieFilterDto } from './dto/movie-filters.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    @InjectModel(Genre.name) private readonly genreModel: Model<Genre>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = {
      ...createMovieDto,
      averageRating: 0,
      rateCount: 0,
    };

    const result = await this.movieModel.create(movie);
    return result;
  }

  async findAll(
    page?: number,
    limit?: number,
    filters?: MovieFilterDto[],
  ): Promise<{ movies: Movie[]; totalPages: number; totalCount: number }> {
    const skip = (page - 1) * limit;
    const query = await this.buildMoviesFilters(filters);

    const [movies, totalCount] = await Promise.all([
      this.movieModel.find(query).skip(skip).limit(limit),
      this.movieModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return { movies, totalPages, totalCount };
  }

  async findOne(id: string): Promise<Movie> {
    const movieId = new Types.ObjectId(id);
    const movie = await this.movieModel.findById(movieId);

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movieId = new Types.ObjectId(id);
    const updatedMovie = await this.movieModel.findByIdAndUpdate(
      movieId,
      updateMovieDto,
      { new: true },
    );
    if (!updatedMovie) {
      throw new NotFoundException('Movie not found');
    }
    return updatedMovie;
  }

  async remove(id: string): Promise<string> {
    const movieId = new Types.ObjectId(id);
    const result = await this.movieModel.findByIdAndDelete(movieId);
    if (!result) {
      throw new NotFoundException('Movie not found');
    }
    return `Movie with ID ${id} deleted successfully`;
  }

  async buildMoviesFilters(filters: MovieFilterDto[]): Promise<any> {
    const query: any = {};

    for (const filter of filters) {
      const { field, value } = filter;

      switch (field) {
        case 'title':
          query[field] = { $regex: value, $options: 'i' }; // Case-insensitive regex search
          break;

        case 'genres':
          const genreNames = Array.isArray(value) ? value : [value];
          const genres = await this.genreModel
            .find({ name: { $in: genreNames } })
            .exec();
          const genreIds = genres.map((g) => g.id);
          query['genre_ids'] = { $all: genreIds };
          break;

        case 'minRating':
          query['averageRating'] = { $gte: value };
          break;

        default:
          break;
      }
    }
    return query;
  }

  async updateRatingAndCount(id: string, newRating: number): Promise<void> {
    const movieId = new Types.ObjectId(id);
    const movie = await this.movieModel.findById(movieId);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Compute the delta for the new averageRating
    const ratingIncrement =
      (newRating - movie.averageRating) / (movie.rateCount + 1);

    await this.movieModel.updateOne(
      { _id: movieId },
      {
        $inc: {
          rateCount: 1,
          averageRating: ratingIncrement,
        },
      },
    );
  }
}
