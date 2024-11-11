import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { MoviesModule } from '../movies/movies.module';
import { AuthMiddleware } from '../shared/auth.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MoviesModule,
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, JwtService],
})
export class ReviewsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: '/reviews/movie/:movieId', method: RequestMethod.GET })
      .forRoutes(ReviewsController);
  }
}
