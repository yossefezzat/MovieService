import { AuthMiddleware } from './auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

jest.mock('@nestjs/jwt');

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let mockJwtService: JwtService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFn: jest.Mock;
  let decoded;

  beforeEach(() => {
    mockJwtService = new JwtService({});
    authMiddleware = new AuthMiddleware(mockJwtService);

    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    decoded = { userId: '1234', username: 'user' };
    nextFn = jest.fn();

    mockJwtService.verifyAsync = jest.fn().mockResolvedValue(decoded);
  });

  it('should return unauthorized if no token is provided', async () => {
    mockRequest.headers = {};

    await authMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFn,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockResponse.send).toHaveBeenCalledWith({
      errors: [
        {
          code: 'USER_NOT_AUTHORIZED',
          message: 'User credentials are invalid',
        },
      ],
    });
    expect(nextFn).not.toHaveBeenCalled();
  });

  it('should return unauthorized if token is invalid', async () => {
    mockRequest.headers = { authorization: 'Bearer invalid_token' };

    mockJwtService.verifyAsync = jest
      .fn()
      .mockRejectedValue(new Error('Invalid token'));

    await authMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFn,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockResponse.send).toHaveBeenCalledWith({
      errors: [
        {
          code: 'USER_NOT_AUTHORIZED',
          message: 'User credentials are invalid',
        },
      ],
    });
    expect(nextFn).not.toHaveBeenCalled();
  });

  it('should set user on request and call next if token is valid', async () => {
    mockRequest.headers = { authorization: 'Bearer valid_token' };

    await authMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFn,
    );

    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid_token', {
      secret: process.env.JWT_SECRET,
    });
    expect(nextFn).toHaveBeenCalled();
  });

  it('should return unauthorized if token is malformed', async () => {
    mockRequest.headers = { authorization: 'Bearer malformed_token' };

    mockJwtService.verifyAsync = jest
      .fn()
      .mockRejectedValue(new Error('Malformed token'));

    await authMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFn,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockResponse.send).toHaveBeenCalledWith({
      errors: [
        {
          code: 'USER_NOT_AUTHORIZED',
          message: 'User credentials are invalid',
        },
      ],
    });
    expect(nextFn).not.toHaveBeenCalled();
  });
});
