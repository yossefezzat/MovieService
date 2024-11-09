import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'ID of User', type: String })
  id?: string;

  @ApiProperty({ description: 'Name of the user', type: String })
  name?: string;

  @ApiProperty({ description: 'username of the user', type: String })
  username?: string;

  @ApiProperty({ description: 'password of the user', type: String })
  password?: string;
}
