import * as _ from 'lodash';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

export enum ApplicationAgents {
  MOVIE_APP = 'Movie-app',
}

const API_KEYS = [
  {
    key: process.env.MOVIE_APP_API_KEY,
    application: ApplicationAgents.MOVIE_APP,
  },
];

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: () => any) {
    const apiKey = req.get('x-apiKey') || this.getApiKey(req.query.apiKey);

    if (!this.validateApiKey(apiKey)) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Api key is invalid',
      });
    }

    const application = _.find(API_KEYS, (k) => k.key === apiKey).application;

    req.headers['application-name'] = application;

    next();
  }

  private getApiKey(apiKey) {
    return apiKey ? apiKey : undefined;
  }

  private validateApiKey(apiKey): boolean {
    return API_KEYS.map((k) => k.key).includes(apiKey);
  }
}
