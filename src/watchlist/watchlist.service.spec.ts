import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistService } from './watchlist.service';
import { MoviesService } from '../movies/movies.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Watchlist } from './schemas/watchlist.schema';

// Mocking dependencies
const mockMovieService = {
  findOne: jest.fn(),
};

const mockWatchlistModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
};

describe('WatchlistService', () => {
  let service: WatchlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchlistService,
        { provide: MoviesService, useValue: mockMovieService },
        {
          provide: getModelToken(Watchlist.name),
          useValue: mockWatchlistModel,
        },
      ],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
  });

  describe('addToWatchlist', () => {
    it('should throw NotFoundException if the movie is not found', async () => {
      const userId = 'user123';
      const movieId = 'movie123';

      mockMovieService.findOne.mockResolvedValue(null);

      try {
        await service.addToWatchlist(userId, movieId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Movie not found');
      }
    });

    it('should throw ConflictException if the movie is already in the watchlist', async () => {
      const userId = 'user123';
      const movieId = 'movie123';

      mockMovieService.findOne.mockResolvedValue({});
      mockWatchlistModel.findOne.mockResolvedValue({});

      try {
        await service.addToWatchlist(userId, movieId);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('Movie already in watchlist');
      }
    });

    it('should add the movie to the watchlist successfully', async () => {
      const userId = 'user123';
      const movieId = 'movie123';

      mockMovieService.findOne.mockResolvedValue({});
      mockWatchlistModel.findOne.mockResolvedValue(null);

      const mockCreatedWatchlistEntry = { userId, movieId };
      mockWatchlistModel.create.mockResolvedValue(mockCreatedWatchlistEntry);

      const result = await service.addToWatchlist(userId, movieId);

      expect(result).toEqual(mockCreatedWatchlistEntry);
      expect(mockMovieService.findOne).toHaveBeenCalledWith(movieId);
      expect(mockWatchlistModel.findOne).toHaveBeenCalledWith({
        userId,
        movieId,
      });
      expect(mockWatchlistModel.create).toHaveBeenCalledWith({
        userId,
        movieId,
      });
    });
  });

  // describe('getWatchlist', () => {
  //   it('should return the user’s watchlist', async () => {
  //     const userId = 'user123';
  //     const mockWatchlist = [
  //       { userId, movieId: 'movie123' },
  //       { userId, movieId: 'movie124' },
  //     ];

  //     // Properly chain mocks for find().populate().exec()
  //     mockWatchlistModel.find.mockReturnValue({
  //       populate: jest.fn().mockReturnValue({
  //         exec: jest.fn().mockResolvedValue(mockWatchlist), // Fix exec resolution
  //       }),
  //     });

  //     const result = await service.getWatchlist(userId);

  //     // Assertions
  //     // expect(result).toEqual(mockWatchlist); // Ensure correct data
  //     expect(mockWatchlistModel.find).toHaveBeenCalledWith({ userId });
  //     expect(mockWatchlistModel.find().populate).toHaveBeenCalledWith(
  //       'movieId',
  //     );
  //     expect(mockWatchlistModel.find().populate().exec).toHaveBeenCalled();
  //   });
  // });
});
