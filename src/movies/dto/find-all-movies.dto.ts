import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllMoviesDto {
  @ApiProperty({ required: false, default: 1, description: 'Page number' })
  @IsOptional()
  page?: number;

  @ApiProperty({
    required: false,
    default: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    required: false,
    description:
      'Filters for querying movies, should be an array of objects with field and value',
    type: [Object],
  })
  @IsOptional()
  filters?: { field: string; value: any }[];
}
