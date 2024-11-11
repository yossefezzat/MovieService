import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MovieFilterDto {
  @ApiProperty({
    description: 'Field to filter by (e.g., title, genres, minRating).',
    example: 'title',
  })
  @IsString()
  field: string;

  @ApiProperty({
    description:
      'Value to filter the field by (e.g., string, number, or array for multiple values).',
    example: 'venom',
  })
  value: string | string[] | number;
}
