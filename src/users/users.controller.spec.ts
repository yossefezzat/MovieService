import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  const mockUser = {
    _id: 'mock-id',
    username: 'mock-username',
    name: 'mock-name',
  };

  const mockCreateUserDto: CreateUserDto = {
    username: 'mock-username',
    password: 'mock-password',
    name: 'mock-name',
  };

  const mockLoginUserDto: LoginUserDto = {
    username: 'mock-username',
    password: 'mock-password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn().mockResolvedValue(mockUser),
            login: jest
              .fn()
              .mockResolvedValue({ access_token: 'mock-access-token' }),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a user and return user data', async () => {
      const result = await usersController.register(mockCreateUserDto);

      expect(result).toEqual(mockUser);
      expect(usersService.createUser).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });

  describe('login', () => {
    it('should return a JWT access token for valid user', async () => {
      const result = await usersController.login(mockLoginUserDto);

      expect(result).toEqual({ access_token: 'mock-access-token' });
      expect(authService.validateUser).toHaveBeenCalledWith(
        mockLoginUserDto.username,
        mockLoginUserDto.password,
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });
});
