import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { MoviesService } from '../movies/movies.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

// Mocking dependencies
const mockMovieService = {
  findOne: jest.fn(),
  updateRatingAndCount: jest.fn(),
};

const mockReviewModel = {
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
};

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: MoviesService, useValue: mockMovieService },
        { provide: getModelToken(Review.name), useValue: mockReviewModel },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  describe('findReviewsByMovie', () => {
    it('should return a list of reviews for a movie', async () => {
      const movieId = 'movieId123';
      const mockReviews = [
        { userId: 'userId1', movieId: movieId, rating: 4, reviewText: 'Good' },
        {
          userId: 'userId2',
          movieId: movieId,
          rating: 5,
          reviewText: 'Excellent',
        },
      ];

      mockReviewModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        findOne: jest.fn(),
        exec: jest.fn().mockResolvedValue(mockReviews),
      });

      const result = await service.findReviewsByMovie(movieId);

      expect(result).toEqual(mockReviews);
      expect(mockReviewModel.find).toHaveBeenCalledWith({ movieId });
      expect(mockReviewModel.find().populate).toHaveBeenCalledWith(
        'userId',
        'username',
      );
      expect(mockReviewModel.find().exec).toHaveBeenCalled();
    });
  });

  describe('createReview', () => {
    it('should throw NotFoundException if the movie does not exist', async () => {
      const userId = 'user123';
      const createReviewDto: CreateReviewDto = {
        movieId: 'movie123',
        rating: 4,
        reviewText: 'Great movie!',
      };

      mockMovieService.findOne.mockResolvedValue(null);

      try {
        await service.createReview(userId, createReviewDto);
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

      mockMovieService.findOne.mockResolvedValue({});
      mockReviewModel.findOne.mockResolvedValue({});

      try {
        await service.createReview(userId, createReviewDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('User has already reviewed this movie');
      }
    });

    it('should create a review successfully and update the movie rating', async () => {
      const userId = 'user123';
      const createReviewDto: CreateReviewDto = {
        movieId: 'movie123',
        rating: 4,
        reviewText: 'Great movie!',
      };

      mockMovieService.findOne.mockResolvedValue({});
      mockReviewModel.findOne.mockResolvedValue(null);

      const mockCreatedReview = {
        userId,
        movieId: createReviewDto.movieId,
        rating: createReviewDto.rating,
        reviewText: createReviewDto.reviewText,
      };
      mockReviewModel.create.mockResolvedValue(mockCreatedReview);
      mockMovieService.updateRatingAndCount.mockResolvedValue(undefined);

      const result = await service.createReview(userId, createReviewDto);

      expect(result).toEqual(mockCreatedReview);
      expect(mockMovieService.findOne).toHaveBeenCalledWith(
        createReviewDto.movieId,
      );
      expect(mockReviewModel.findOne).toHaveBeenCalledWith({
        userId,
        movieId: createReviewDto.movieId,
      });
      expect(mockReviewModel.create).toHaveBeenCalledWith({
        userId,
        movieId: createReviewDto.movieId,
        rating: createReviewDto.rating,
        reviewText: createReviewDto.reviewText,
      });
      expect(mockMovieService.updateRatingAndCount).toHaveBeenCalledWith(
        createReviewDto.movieId,
        createReviewDto.rating,
      );
    });
  });
});
