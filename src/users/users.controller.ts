import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/register')
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiCreatedResponse({
    description: 'User successfully Created',
    type: UserDto,
  })
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('/login')
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiCreatedResponse({
    description: 'User successfully loggedin',
    type: UserDto,
  })
  async login(@Body(new ValidationPipe()) body: LoginUserDto) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    return this.authService.login(user);
  }
}
