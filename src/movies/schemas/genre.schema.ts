import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Genre extends Document {
  @ApiProperty({
    description: 'The unique ID of the genre',
    example: 1,
  })
  @Prop({ required: true, unique: true })
  id: number;

  @ApiProperty({
    description: 'The name of the genre',
    example: 'Action',
  })
  @Prop({ required: true })
  name: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
