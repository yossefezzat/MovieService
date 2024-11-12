import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    let mockUser;

    beforeEach(() => {
      mockUser = {
        _id: 'mock-id',
        username: 'mock-username',
        name: 'mock-name',
        password: 'mock-password',
        toObject: jest.fn().mockReturnValue({
          _id: 'mock-id',
          username: 'mock-username',
          name: 'mock-name',
        }),
      };
      jest.spyOn(usersService, 'validateUser').mockResolvedValueOnce(mockUser);
    });

    afterEach(() => {
      jest.spyOn(usersService, 'validateUser').mockRestore();
    });

    it('should return user data if user is found', async () => {
      const username = 'mock-username';
      const password = 'mock-password';
      const result = await authService.validateUser(username, password);
      expect(result).toEqual({
        _id: 'mock-id',
        username: 'mock-username',
        name: 'mock-name',
      });
      expect(usersService.validateUser).toHaveBeenCalledWith(
        username,
        password,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest
        .spyOn(usersService, 'validateUser')
        .mockReset()
        .mockResolvedValueOnce(null);

      const username = 'mock-username';
      const password = 'mock-password';

      await expect(
        authService.validateUser(username, password),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    let user;
    let expectedPayload;
    let mockAccessToken;

    beforeEach(() => {
      user = {
        _id: 'mock-id',
        username: 'mock-username',
        name: 'mock-name',
      };
      expectedPayload = {
        username: user.username,
        name: user.name,
        id: user._id,
      };
      mockAccessToken = 'mock-access-token';

      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(mockAccessToken);
    });

    afterEach(() => {
      jest.spyOn(jwtService, 'sign').mockRestore();
    });

    it('should return access token for valid user', async () => {
      const result = await authService.login(user);

      expect(result).toEqual({ access_token: mockAccessToken });
      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
    });
  });
});
