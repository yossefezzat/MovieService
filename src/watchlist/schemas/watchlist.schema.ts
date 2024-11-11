// src/watchlist/schemas/watchlist.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Watchlist extends Document {
  @ApiProperty({
    description: 'The ID of the user who added the movie to the watchlist',
    type: String,
    example: '64b0cddb8b6b6c27f7f03e77',
  })
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @ApiProperty({
    description: 'The ID of the movie added to the watchlist',
    type: String,
    example: '64b0ce5f8b6b6c27f7f03e79',
  })
  @Prop({ type: Types.ObjectId, required: true, ref: 'Movie' })
  movieId: Types.ObjectId;

  @ApiProperty({
    description: 'The date when the movie was added to the watchlist',
    type: Date,
    example: '2024-11-11T03:34:30.000Z',
  })
  @Prop({ default: Date.now })
  addedAt: Date;
}

export const WatchlistSchema = SchemaFactory.createForClass(Watchlist);
