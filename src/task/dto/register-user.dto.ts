import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'primer@example.com',
    description: 'User email (must be unique)',
  })
  @IsEmail({}, { message: 'Email must be a valid' })
  email: string;

  @ApiProperty({
    example: 'Ivan',
    description: 'User name',
  })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(26, { message: 'Name must be less than 26 characters' })
  FirstName: string;

  @ApiProperty({
    example: 'Ivan',
    description: 'User surname',
  })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(26, { message: 'Surname must be less than 26 characters' })
  LastName: string;

  @ApiProperty({
    example: 'strongExamplePassword123$',
    description: 'User password (minimun 6 characters)',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must at least 6 characters long' })
  password: string;
}
