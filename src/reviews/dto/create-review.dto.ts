import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Movie ID', example: '64b1d4f5c3f02a432f324a12' })
  @IsNotEmpty()
  movieId: string;

  @ApiProperty({ description: 'Rating for the movie (1-5)', example: 4 })
  @IsInt()
  @Min(1)
  @Max(10)
  rating: number;

  @ApiProperty({
    description: 'Optional review text',
    example: 'Amazing movie!',
    required: false,
  })
  @IsOptional()
  @IsString()
  reviewText?: string;
}
