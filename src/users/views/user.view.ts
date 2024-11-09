import * as _ from 'lodash';
import { User } from '../schemas/user.schema';
import { UserDto } from '../dto/user.dto';

export class UserView {
  constructor(private readonly data: User | User[]) {}

  render(): UserDto[] | UserDto {
    if (Array.isArray(this.data)) {
      return this.data.map((user) => this.renderUser(user));
    }

    return this.renderUser(this.data);
  }

  private renderUser(user: User): UserDto {
    const renderedUser = _.pick(user, ['name', 'username']);
    return renderedUser;
  }
}
