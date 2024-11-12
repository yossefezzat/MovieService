import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { Query } from 'mongoose';
import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel;

  beforeEach(async () => {
    const mockQuery: Partial<Query<any, User>> = {
      exec: jest.fn(),
    };

    mockUserModel = {
      findOne: jest.fn().mockReturnValue(mockQuery),
      create: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should throw ConflictException if user already exists', async () => {
      (mockUserModel.findOne().exec as jest.Mock).mockResolvedValueOnce({
        username: 'existingUser',
      });

      await expect(
        service.createUser({
          username: 'existingUser',
          name: 'John',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a new user and return UserDto', async () => {
      (mockUserModel.findOne().exec as jest.Mock).mockResolvedValueOnce(null);

      mockUserModel.create.mockResolvedValueOnce({
        username: 'newUser',
        name: 'John Doe',
        password: 'hashedPassword',
      });

      const createUserDto = {
        username: 'newUser',
        name: 'John',
        password: 'password123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await service.createUser(createUserDto);

      expect(result).toEqual({
        username: 'newUser',
        name: 'John Doe',
      });
    });
  });

  describe('validateUser', () => {
    it('should return null if password is incorrect', async () => {
      const mockUser = {
        _id: '123',
        username: 'existingUser',
        password: 'hashedPassword',
      };
      (mockUserModel.findOne().exec as jest.Mock).mockResolvedValueOnce(
        mockUser,
      );
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      const result = await service.validateUser(
        'existingUser',
        'wrongPassword',
      );
      expect(result).toBeNull();
    });

    it('should return user if password is correct', async () => {
      const mockUser = {
        _id: '123',
        username: 'existingUser',
        password: 'hashedPassword',
      };
      (mockUserModel.findOne().exec as jest.Mock).mockResolvedValueOnce(
        mockUser,
      );

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validateUser('existingUser', 'password123');
      expect(result).toEqual(mockUser);
    });
  });
});
