import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RegisterResponseDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @Expose()
  lastName: string;
} 