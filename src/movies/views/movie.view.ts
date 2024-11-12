import * as _ from 'lodash';
import { MovieDto } from '../dto/movie.dto';
import { Movie } from '../schemas/movie.schema';

export class MovieView {
  constructor(private readonly data: Movie | Movie[]) {}

  render(): MovieDto[] | MovieDto {
    if (Array.isArray(this.data)) {
      return this.data.map((movie) => this.renderMovie(movie));
    }

    return this.renderMovie(this.data);
  }

  private renderMovie(user: Movie): MovieDto {
    const renderedMovie = _.pick(user, [
      '_id',
      'title',
      'overview',
      'genre_ids',
      'averageRating',
      'rateCount',
    ]);
    return renderedMovie;
  }
}
