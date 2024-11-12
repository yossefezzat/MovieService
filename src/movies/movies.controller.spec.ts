import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FindAllMoviesDto } from './dto/find-all-movies.dto';
import { CacheStoreModule } from '../cache-store/cache-store.module';

const mockMoviesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('MoviesController', () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheStoreModule],
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: mockMoviesService }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const dto: CreateMovieDto = {
        title: 'Inception',
        overview: 'mock-overview',
        genre_ids: [1, 2, 3],
      };
      mockMoviesService.create.mockResolvedValue(dto);

      expect(await controller.create(dto)).toEqual(dto);
      expect(mockMoviesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return paginated movies with filters', async () => {
      const query: FindAllMoviesDto = {
        page: 1,
        limit: 10,
      };
      const result = { data: [], total: 0 };
      mockMoviesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(query)).toEqual(result);
      expect(mockMoviesService.findAll).toHaveBeenCalledWith(1, 10, []);
    });
  });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      const movieId = 'movie123';
      const movie = { id: movieId, title: 'Inception' };
      mockMoviesService.findOne.mockResolvedValue(movie);

      expect(await controller.findOne(movieId)).toEqual(movie);
      expect(mockMoviesService.findOne).toHaveBeenCalledWith(movieId);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const movieId = 'movie123';
      const dto: UpdateMovieDto = { title: 'Updated Title' };
      const updatedMovie = { id: movieId, title: 'Updated Title' };
      mockMoviesService.update.mockResolvedValue(updatedMovie);

      expect(await controller.update(movieId, dto)).toEqual(updatedMovie);
      expect(mockMoviesService.update).toHaveBeenCalledWith(movieId, dto);
    });
  });

  describe('remove', () => {
    it('should delete a movie', async () => {
      const movieId = 'movie123';
      mockMoviesService.remove.mockResolvedValue({ deleted: true });

      expect(await controller.remove(movieId)).toEqual({ deleted: true });
      expect(mockMoviesService.remove).toHaveBeenCalledWith(movieId);
    });
  });
});
