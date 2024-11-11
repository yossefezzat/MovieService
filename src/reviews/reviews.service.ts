import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    private readonly movieService: MoviesService,
  ) {}

  async createReview(
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const { movieId, rating, reviewText } = createReviewDto;
    const existingMovie = await this.movieService.findOne(movieId);
    if (!existingMovie) {
      throw new NotFoundException('Movie not found');
    }

    const existingReview = await this.reviewModel.findOne({ userId, movieId });
    if (existingReview) {
      throw new ConflictException('User has already reviewed this movie');
    }

    const review = await this.reviewModel.create({
      userId,
      movieId,
      rating,
      reviewText,
    });

    // Increment rateCount and update averageRating atomically
    await this.movieService.updateRatingAndCount(movieId, rating);

    return review;
  }

  async findReviewsByMovie(movieId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ movieId })
      .populate('userId', 'username')
      .exec();
  }
}
