import { ValidationPipe } from './validation.pipe'; // Adjust the import path
import { ArgumentMetadata } from '@nestjs/common';

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(() => {
    pipe = new ValidationPipe();
  });

  it('should return value when no validation is needed', async () => {
    const value = 'test';
    const metadata: ArgumentMetadata = { type: 'body', metatype: String };

    const result = await pipe.transform(value, metadata);

    expect(result).toBe(value);
  });

  it('should skip validation for primitive types', async () => {
    const value = 123;
    const metadata: ArgumentMetadata = { type: 'body', metatype: Number };

    const result = await pipe.transform(value, metadata);

    expect(result).toBe(value);
  });

  it('should skip validation for Object and Array', async () => {
    const value = { key: 'value' };
    const metadata: ArgumentMetadata = { type: 'body', metatype: Object };

    const result = await pipe.transform(value, metadata);

    expect(result).toBe(value);
  });
});
