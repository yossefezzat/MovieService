import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: AuthRequest, res: Response, next: () => any) {
    const authToken = this.getAuthTokenFromRequest(req);
    if (!authToken) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        errors: [
          {
            code: 'USER_NOT_AUTHORIZED',
            message: 'User credentials are invalid',
          },
        ],
      });
    }

    try {
      const decoded = await this.jwtService.verifyAsync(authToken, {
        secret: process.env.JWT_SECRET,
      });
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        errors: [
          {
            code: 'USER_NOT_AUTHORIZED',
            message: 'User credentials are invalid',
          },
        ],
      });
    }
  }

  private getAuthTokenFromRequest(req: Request) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
}
