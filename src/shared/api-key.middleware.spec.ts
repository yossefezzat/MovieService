import { ApiKeyMiddleware } from './api-key.middleware';
import { UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

describe('ApiKeyMiddleware', () => {
  let apiKeyMiddleware: ApiKeyMiddleware;
  let mockRequest;
  let mockResponse;
  let next: jest.Mock;

  beforeEach(() => {
    apiKeyMiddleware = new ApiKeyMiddleware();
    mockRequest = {
      get: jest.fn(),
      query: {},
      headers: {},
    };
    mockResponse = {
      headers: {},
    };
    next = jest.fn();
  });

  it('should throw UnauthorizedException if API key is invalid', async () => {
    mockRequest.get.mockReturnValue('invalid-api-key');

    await expect(
      apiKeyMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        next,
      ),
    ).rejects.toThrowError(
      new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Api key is invalid',
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should set the application-name header when API key is valid', async () => {
    const validApiKey = process.env.MOVIE_APP_API_KEY;
    mockRequest.get.mockReturnValue(validApiKey);

    await apiKeyMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      next,
    );

    expect(mockRequest.headers['application-name']).toBe('Movie-app');
    expect(next).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if API key is invalid in query params', async () => {
    mockRequest.query = { apiKey: 'invalid-api-key' };

    await expect(
      apiKeyMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        next,
      ),
    ).rejects.toThrowError(
      new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Api key is invalid',
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should set the application-name header when API key is valid in query params', async () => {
    const validApiKey = process.env.MOVIE_APP_API_KEY;
    mockRequest.query = { apiKey: validApiKey };

    await apiKeyMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      next,
    );

    expect(mockRequest.headers['application-name']).toBe('Movie-app');
    expect(next).toHaveBeenCalled();
  });
});
