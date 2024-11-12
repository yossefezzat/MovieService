import { Controller, Post, Body, Get, Param, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
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
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-apiKey',
    description: 'API key to access the endpoint',
    required: true,
  })
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req,
  ): Promise<Review> {
    const userId = req.user.id;
    return this.reviewsService.createReview(userId, createReviewDto);
  }

  @Get('/movie/:movieId')
  @ApiOkResponse({
    description: 'List of reviews for a specific movie',
    type: [Review],
  })
  @ApiParam({
    name: 'movieId',
    description: 'The ID of the movie to retrieve reviews for',
    type: String,
  })
  @ApiHeader({
    name: 'x-apiKey',
    description: 'API key to access the endpoint',
    required: true,
  })
  async findReviewsByMovie(
    @Param('movieId') movieId: string,
  ): Promise<Review[]> {
    return this.reviewsService.findReviewsByMovie(movieId);
  }
}
