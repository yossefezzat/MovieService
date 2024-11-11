import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserView } from './views/user.view';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(
    createUserBody: CreateUserDto,
  ): Promise<UserDto | UserDto[]> {
    const existingUser = await this.userModel
      .findOne({
        username: createUserBody.username,
      })
      .exec();

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const { name, username, password } = createUserBody;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      username,
      password: hashedPassword,
    });

    return new UserView(user).render();
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel
      .findOne({
        username,
      })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }
}
