import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Movie } from '../../movies/schemas/movie.schema';

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Movie.name, required: true })
  movieId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 10 })
  rating: number;

  @Prop({ required: false })
  reviewText?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
