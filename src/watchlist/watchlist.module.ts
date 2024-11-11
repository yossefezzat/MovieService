import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/shared/auth.middleware';
import { Watchlist, WatchlistSchema } from './schemas/watchlist.schema';
import { MoviesModule } from 'src/movies/movies.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MoviesModule,
    MongooseModule.forFeature([
      { name: Watchlist.name, schema: WatchlistSchema },
    ]),
  ],
  controllers: [WatchlistController],
  providers: [WatchlistService, JwtService],
})
export class WatchlistModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(WatchlistController);
  }
}
