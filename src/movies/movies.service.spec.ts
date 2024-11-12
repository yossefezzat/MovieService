import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getModelToken } from '@nestjs/mongoose';
import { Movie } from './schemas/movie.schema';
import { Genre } from './schemas/genre.schema';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('MoviesService', () => {
  let service: MoviesService;
  let mockMovieModel: any;
  let mockGenreModel: any;

  beforeEach(async () => {
    mockMovieModel = {
      create: jest.fn(),
      find: jest.fn(),
      countDocuments: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      updateOne: jest.fn(),
    };

    mockGenreModel = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getModelToken(Movie.name),
          useValue: mockMovieModel,
        },
        {
          provide: getModelToken(Genre.name),
          useValue: mockGenreModel,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  describe('create', () => {
    it('should create and return a movie', async () => {
      const createMovieDto = {
        title: 'Inception',
        overview: 'test',
        genre_ids: [1, 2, 3],
      };
      const mockMovie = { id: 'movieId', ...createMovieDto };
      mockMovieModel.create.mockResolvedValue(mockMovie);

      const result = await service.create(createMovieDto);
      expect(result).toEqual(mockMovie);
      expect(mockMovieModel.create).toHaveBeenCalledWith({
        ...createMovieDto,
        averageRating: 0,
        rateCount: 0,
      });
    });
  });

  //   describe('findAll', () => {
  //     beforeEach(() => {
  //       mockMovieModel.find.mockImplementation((query) => ({
  //         skip: jest.fn().mockImplementation((skip) => ({
  //           limit: jest.fn().mockResolvedValue([{ title: 'Mock Movie' }]), // mock result
  //         })),
  //       }));
  //       mockMovieModel.countDocuments.mockResolvedValue(1); // Mock total count
  //     });

  //     it('should return paginated movies and counts', async () => {
  //       const filters = [];
  //       const skip = 0;
  //       const limit = 10;

  //       // Mock find to return some result
  //       mockMovieModel.find.mockResolvedValue([
  //         { id: '1', title: 'Movie 1' },
  //         { id: '2', title: 'Movie 2' },
  //       ]);

  //       const result = await service.findAll(1, limit, filters);

  //       expect(result.movies).toHaveLength(2);
  //       expect(result.totalPages).toBe(1);
  //       expect(result.totalCount).toBe(0);
  //       expect(mockMovieModel.find).toHaveBeenCalledWith(filters);
  //       expect(mockMovieModel.skip).toHaveBeenCalledWith(skip);
  //       expect(mockMovieModel.limit).toHaveBeenCalledWith(limit);
  //     });
  //   });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      const movieId = new Types.ObjectId().toHexString();
      const mockMovie = { id: movieId, title: 'Inception' };
      mockMovieModel.findById.mockResolvedValue(mockMovie);

      const result = await service.findOne(movieId);
      expect(result).toEqual(mockMovie);
      expect(mockMovieModel.findById).toHaveBeenCalledWith(
        new Types.ObjectId(movieId),
      );
    });

    it('should throw NotFoundException if movie not found', async () => {
      const validObjectId = new Types.ObjectId().toHexString();
      mockMovieModel.findById.mockResolvedValue(null);
      await expect(service.findOne(validObjectId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the movie', async () => {
      const movieId = new Types.ObjectId().toHexString();
      const updateMovieDto = { title: 'Updated Title' };
      const mockUpdatedMovie = { id: movieId, ...updateMovieDto };

      mockMovieModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedMovie);

      const result = await service.update(movieId, updateMovieDto);
      expect(result).toEqual(mockUpdatedMovie);
      expect(mockMovieModel.findByIdAndUpdate).toHaveBeenCalledWith(
        new Types.ObjectId(movieId),
        updateMovieDto,
        { new: true },
      );
    });

    it('should throw NotFoundException if movie not found', async () => {
      const validObjectId = new Types.ObjectId().toHexString();
      mockMovieModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(
        service.update(validObjectId, { title: 'New Title' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if movie not found', async () => {
      const validObjectId = new Types.ObjectId().toHexString();
      mockMovieModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove(validObjectId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for invalid ObjectId format', async () => {
      const validObjectId = new Types.ObjectId().toHexString();
      await expect(service.remove(validObjectId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
