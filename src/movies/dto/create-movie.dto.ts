import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  ArrayMinSize,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Title of the movie',
    type: String,
    example: 'Venom',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Overview of the movie',
    type: String,
    example: 'A movie about Venom, the antihero',
  })
  @IsNotEmpty()
  @IsString()
  readonly overview: string;

  @ApiProperty({
    description: 'Array of genre IDs associated with the movie',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  readonly genre_ids: number[];

  @ApiProperty({
    description: 'Original title of the movie (optional)',
    type: String,
    example: 'Venom: Let There Be Carnage',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly original_title?: string;

  @ApiProperty({
    description: 'Average rating of the movie',
    type: Number,
    example: 7.5,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly averageRating?: number = 0;

  @ApiProperty({
    description: 'Number of ratings the movie has received',
    type: Number,
    example: 1500,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly rateCount?: number = 0;
}
