import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty({
    description: '_id of the movie',
    type: String,
    example: 'id',
  })
  readonly _id: string;

  @ApiProperty({
    description: 'Title of the movie',
    type: String,
    example: 'Venom',
  })
  readonly title: string;

  @ApiProperty({
    description: 'Overview of the movie',
    type: String,
    example: 'A movie about Venom, the antihero',
  })
  readonly overview: string;

  @ApiProperty({
    description: 'Array of genre IDs associated with the movie',
    type: [Number],
    example: [1, 2, 3],
  })
  readonly genre_ids: number[];

  @ApiProperty({
    description: 'Original title of the movie (optional)',
    type: String,
    example: 'Venom: Let There Be Carnage',
    required: false,
  })
  readonly original_title?: string;

  @ApiProperty({
    description: 'Average rating of the movie',
    type: Number,
    example: 7.5,
    required: false,
    default: 0,
  })
  readonly averageRating?: number;

  @ApiProperty({
    description: 'Number of ratings the movie has received',
    type: Number,
    example: 1500,
    required: false,
    default: 0,
  })
  readonly rateCount?: number;
}
