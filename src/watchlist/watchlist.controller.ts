import { Controller, Post, Get, Req, Param } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Watchlist } from './schemas/watchlist.schema';

@ApiTags('Watchlist')
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post('/:movieId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a movie to the user’s watchlist' })
  @ApiParam({
    name: 'movieId',
    description: 'The ID of the movie to add to the watchlist',
    example: '64b0ce5f8b6b6c27f7f03e79',
  })
  @ApiCreatedResponse({
    description: 'Movie successfully added to the watchlist',
    type: Watchlist,
  })
  async addToWatchlist(@Req() req, @Param('movieId') movieId: string) {
    const userId = req.user.id;
    return this.watchlistService.addToWatchlist(userId, movieId);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the user’s watchlist' })
  @ApiOkResponse({
    description: 'The user’s watchlist retrieved successfully',
    type: [Watchlist],
  })
  async getWatchlist(@Req() req) {
    const userId = req.user.id;
    return this.watchlistService.getWatchlist(userId);
  }
}
