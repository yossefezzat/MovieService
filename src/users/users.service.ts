import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { Db, Collection, WithId } from 'mongodb';
import { DATABASE_CONNECTION } from '../database/database.providers';
import { CreateUserDto } from './dto/create-user.dto';
import { UserView } from './views/user.view';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private readonly userCollection: Collection;

  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Db) {
    this.userCollection = this.db.collection('users');
  }

  async createUser(
    createUserBody: CreateUserDto,
  ): Promise<UserDto | UserDto[]> {
    const existingUser = (await this.userCollection.findOne({
      username: createUserBody.username,
    })) as WithId<User> | null;

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const { name, username, password } = createUserBody;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userCollection.insertOne({
      name,
      username,
      password: hashedPassword,
    });

    const newUser = (await this.userCollection.findOne({
      _id: user.insertedId,
    })) as WithId<User>;

    return new UserView(newUser).render();
  }

  async findByUsername(username: string): Promise<User> {
    const user = (await this.userCollection.findOne({
      username,
    })) as WithId<User>;

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
