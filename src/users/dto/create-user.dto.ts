import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'John Doe' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'johndoe' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'hashed-password' })
  password: string;
}
