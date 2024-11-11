import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users.service';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password: _, ...result } = user.toObject();
    return result;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      name: user.name,
      id: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
