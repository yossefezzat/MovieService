import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../schemas/movie.schema';

export class MoviesIndexDto {
  @ApiProperty({
    type: Number,
    description: 'Number of total movies in the index.',
    example: 10,
  })
  readonly totalPages: number;

  @ApiProperty({
    type: Number,
    description: 'Number of movies in row.',
    example: 10,
  })
  readonly totalCount: number;

  @ApiProperty({ type: [Movie], description: 'List of movies in row.' })
  readonly movies: Movie[];
}
