import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

@Schema()
export class Movie extends Document {
  @ApiProperty({
    description: 'The unique ID of the movie',
    example: '60c72b2f9e6f8c001f3a1b76',
  })
  @Prop({ required: true })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'The title of the movie',
    example: 'Venom',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'The overview or description of the movie',
    example: 'A movie about Venom',
  })
  @Prop()
  overview: string;

  @ApiProperty({
    description: 'The list of genre IDs associated with the movie',
    example: [1, 2],
  })
  @Prop([Number])
  genre_ids: number[];

  @ApiProperty({
    description: 'The average rating of the movie',
    example: 4.5,
  })
  @Prop({ default: 0 })
  averageRating: number;

  @ApiProperty({
    description: 'The number of ratings the movie has received',
    example: 100,
  })
  @Prop({ default: 0 })
  rateCount: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
