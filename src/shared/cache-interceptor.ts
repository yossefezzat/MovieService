import {
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { MemoryCache } from 'cache-manager';
import { tap } from 'rxjs/operators';
import _ = require('lodash');
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CachingInterceptor implements NestInterceptor {
  private readonly CACHE_TTL_MAP;
  private readonly CACHE_DEFAULT_TTL;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: MemoryCache) {
    this.CACHE_TTL_MAP = JSON.parse(process.env.CACHE_TTL_MAP);
    this.CACHE_DEFAULT_TTL = process.env.CACHE_DEFAULT_TTL;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const http = context.switchToHttp();
    const route = http.getRequest().route.path;
    let path = http.getRequest()._parsedUrl.path;
    const queryParams = http.getRequest().query;

    if (!_.isEmpty(queryParams)) {
      const queryParamsKeys = Object.keys(queryParams).sort();
      const sortedQueryParams = queryParamsKeys
        .map((key) => `${key}=${queryParams[key]}`)
        .join('&');
      path = path.split('?')[0] + '?' + sortedQueryParams;
    }

    const cacheKey = path;
    const ttl = parseInt(this.CACHE_TTL_MAP[route] || this.CACHE_DEFAULT_TTL);

    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return [, cachedData]; // This is was done intentionally in order to get full data
    }

    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheManager.set(cacheKey, data, ttl);
        return data;
      }),
    );
  }
}
