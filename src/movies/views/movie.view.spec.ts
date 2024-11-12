import { MovieView } from './movie.view';
import { MovieDto } from '../dto/movie.dto';
import { Movie } from '../schemas/movie.schema';

describe('MovieView', () => {
  const mockMovie: Movie = {
    _id: '1',
    title: 'Venom',
    overview: 'A movie about Venom, the antihero',
    genre_ids: [1, 2, 3],
    averageRating: 7.5,
    rateCount: 1500,
  } as unknown as Movie;

  const expectedMovieDto: MovieDto = {
    _id: '1',
    title: 'Venom',
    overview: 'A movie about Venom, the antihero',
    genre_ids: [1, 2, 3],
    averageRating: 7.5,
    rateCount: 1500,
  };

  it('should render a single MovieDto correctly', () => {
    const movieView = new MovieView(mockMovie);
    const result = movieView.render();

    expect(result).toEqual(expectedMovieDto);
  });

  it('should render an array of MovieDto correctly', () => {
    const movies = [
      mockMovie,
      { ...mockMovie, _id: '2', title: 'Spider-Man' },
    ] as unknown as Movie[];

    const expectedMoviesDto = [
      expectedMovieDto,
      { ...expectedMovieDto, _id: '2', title: 'Spider-Man' },
    ];

    const movieView = new MovieView(movies);
    const result = movieView.render();

    expect(result).toEqual(expectedMoviesDto);
  });

  it('should pick only specified fields from the Movie object', () => {
    const movieView = new MovieView(mockMovie);
    const result = movieView.render() as MovieDto;

    expect(result).toHaveProperty('_id');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('overview');
    expect(result).toHaveProperty('genre_ids');
    expect(result).toHaveProperty('averageRating');
    expect(result).toHaveProperty('rateCount');

    expect(Object.keys(result)).toHaveLength(6);
  });
});
