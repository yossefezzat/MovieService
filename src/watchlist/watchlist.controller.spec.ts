import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { NotFoundException } from '@nestjs/common';

describe('WatchlistController', () => {
  let watchlistController: WatchlistController;
  let watchlistService: WatchlistService;

  const mockWatchlistService = {
    addToWatchlist: jest.fn(),
    getWatchlist: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchlistController],
      providers: [
        {
          provide: WatchlistService,
          useValue: mockWatchlistService,
        },
      ],
    }).compile();

    watchlistController = module.get<WatchlistController>(WatchlistController);
    watchlistService = module.get<WatchlistService>(WatchlistService);
  });

  it('should be defined', () => {
    expect(watchlistController).toBeDefined();
  });

  describe('addToWatchlist', () => {
    it('should add a movie to the user’s watchlist', async () => {
      const userId = 'userId123';
      const movieId = 'movieId123';
      const mockResponse = { userId, movieId };

      mockWatchlistService.addToWatchlist.mockResolvedValue(mockResponse);

      const req = { user: { id: userId } };
      const result = await watchlistController.addToWatchlist(req, movieId);

      expect(result).toEqual(mockResponse);
      expect(watchlistService.addToWatchlist).toHaveBeenCalledWith(
        userId,
        movieId,
      );
    });

    it('should throw NotFoundException if movie not found', async () => {
      const userId = 'userId123';
      const movieId = 'movieId123';

      mockWatchlistService.addToWatchlist.mockRejectedValue(
        new NotFoundException('Movie not found'),
      );

      const req = { user: { id: userId } };

      await expect(
        watchlistController.addToWatchlist(req, movieId),
      ).rejects.toThrowError(NotFoundException);
      expect(watchlistService.addToWatchlist).toHaveBeenCalledWith(
        userId,
        movieId,
      );
    });
  });

  describe('getWatchlist', () => {
    it('should return the user’s watchlist', async () => {
      const userId = 'userId123';
      const mockWatchlist = [
        { userId, movieId: 'movieId1' },
        { userId, movieId: 'movieId2' },
      ];

      mockWatchlistService.getWatchlist.mockResolvedValue(mockWatchlist);

      const req = { user: { id: userId } };
      const result = await watchlistController.getWatchlist(req);

      expect(result).toEqual(mockWatchlist);
      expect(watchlistService.getWatchlist).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if watchlist not found', async () => {
      const userId = 'userId123';
      mockWatchlistService.getWatchlist.mockRejectedValue(
        new NotFoundException('Watchlist not found'),
      );

      const req = { user: { id: userId } };

      await expect(watchlistController.getWatchlist(req)).rejects.toThrowError(
        NotFoundException,
      );
      expect(watchlistService.getWatchlist).toHaveBeenCalledWith(userId);
    });
  });
});
