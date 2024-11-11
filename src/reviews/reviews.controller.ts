import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Review } from './schemas/review.schema';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Review successfully created',
    type: Review,
  })
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.createReview(createReviewDto);
  }

  @Get('/movie/:movieId')
  @ApiOkResponse({
    description: 'List of reviews for a specific movie',
    type: [Review],
  })
  async findReviewsByMovie(
    @Param('movieId') movieId: string,
  ): Promise<Review[]> {
    return this.reviewsService.findReviewsByMovie(movieId);
  }
}
