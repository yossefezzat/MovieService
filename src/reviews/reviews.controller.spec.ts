import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockReviewsService = {
  createReview: jest.fn(),
  findReviewsByMovie: jest.fn(),
};

describe('ReviewsController', () => {
  let controller: ReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [{ provide: ReviewsService, useValue: mockReviewsService }],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  describe('createReview', () => {
    it('should successfully create a review', async () => {
      const userId = 'user123';
      const createReviewDto: CreateReviewDto = {
        movieId: 'movie123',
        rating: 4,
        reviewText: 'Great movie!',
      };
      const mockReview = {
        userId,
        movieId: 'movie123',
        rating: 4,
        reviewText: 'Great movie!',
      };

      mockReviewsService.createReview.mockResolvedValue(mockReview);

      const req = {
        user: { id: userId },
      };

      const result = await controller.createReview(createReviewDto, req);
      expect(result).toEqual(mockReview);
      expect(mockReviewsService.createReview).toHaveBeenCalledWith(
        userId,
        createReviewDto,
      );
    });

    it('should throw NotFoundException if the movie does not exist', async () => {
      const userId = 'user123';
      const createReviewDto: CreateReviewDto = {
        movieId: 'movie123',
        rating: 4,
        reviewText: 'Great movie!',
      };

      mockReviewsService.createReview.mockRejectedValue(
        new NotFoundException('Movie not found'),
      );

      const req = {
        user: { id: userId },
      };

      try {
        await controller.createReview(createReviewDto, req);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Movie not found');
      }
    });

    it('should throw ConflictException if the user has already reviewed the movie', async () => {
      const userId = 'user123';
      const createReviewDto: CreateReviewDto = {
        movieId: 'movie123',
        rating: 4,
        reviewText: 'Great movie!',
      };

      mockReviewsService.createReview.mockRejectedValue(
        new ConflictException('User has already reviewed this movie'),
      );

      const req = {
        user: { id: userId },
      };

      try {
        await controller.createReview(createReviewDto, req);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('User has already reviewed this movie');
      }
    });
  });

  describe('findReviewsByMovie', () => {
    it('should return a list of reviews for a movie', async () => {
      const movieId = 'movie123';
      const mockReviews = [
        { userId: 'user123', movieId, rating: 4, reviewText: 'Great movie!' },
        { userId: 'user456', movieId, rating: 5, reviewText: 'Amazing movie!' },
      ];

      mockReviewsService.findReviewsByMovie.mockResolvedValue(mockReviews);

      const result = await controller.findReviewsByMovie(movieId);
      expect(result).toEqual(mockReviews);
      expect(mockReviewsService.findReviewsByMovie).toHaveBeenCalledWith(
        movieId,
      );
    });
  });
});
