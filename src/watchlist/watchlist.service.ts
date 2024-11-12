import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Watchlist } from './schemas/watchlist.schema';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(Watchlist.name)
    private readonly watchlistModel: Model<Watchlist>,
    private readonly moviesService: MoviesService,
  ) {}

  async addToWatchlist(userId: string, movieId: string): Promise<Watchlist> {
    const existingMovie = await this.moviesService.findOne(movieId);
    if (!existingMovie) {
      throw new NotFoundException('Movie not found');
    }

    const existingWatchlistEntry = await this.watchlistModel.findOne({
      userId,
      movieId,
    });

    if (existingWatchlistEntry) {
      throw new ConflictException('Movie already in watchlist');
    }

    const watchlistEntry = await this.watchlistModel.create({
      userId,
      movieId,
    });

    return watchlistEntry;
  }

  async getWatchlist(userId: string): Promise<Watchlist[]> {
    return this.watchlistModel.find({ userId }).populate('movieId');
  }
}
