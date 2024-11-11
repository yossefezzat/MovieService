import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { FindAllMoviesDto } from './dto/find-all-movies.dto';
import { Movie } from './schemas/movie.schema';
import { MoviesIndexDto } from './dto/movies-index-dto';
import { MovieFilterDto } from './dto/movie-filters.to';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'List of Paginated Movies',
    type: MoviesIndexDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page for pagination',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'filters',
    required: false,
    description: 'Filters for searching movies (e.g., title, genres, etc.)',
    type: String,
    example: "[{ field: 'title', value: 'venom' }]",
  })
  async findAll(
    @Query(new ValidationPipe()) query: FindAllMoviesDto,
  ): Promise<MoviesIndexDto> {
    const DEFAULT_PAGE_SIZE = +process.env.DEFAULT_PAGE_SIZE;
    const limit = +query.limit || DEFAULT_PAGE_SIZE;
    const page = +query.page || 1;
    let filters: MovieFilterDto[];

    try {
      filters = query.filters
        ? JSON.parse(query.filters as unknown as string)
        : [];
    } catch (err) {
      throw new BadRequestException(err);
    }

    return this.moviesService.findAll(page, limit, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by its ID' })
  @ApiNotFoundResponse({ description: 'Movie not found.' })
  @ApiOkResponse({
    description: 'The movie has been successfully retrieved.',
    type: Movie,
  })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'The movie has been successfully updated.',
    type: Movie,
  })
  @ApiNotFoundResponse({ description: 'Movie not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'The movie has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Movie not found.' })
  async remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
