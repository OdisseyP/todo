import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'hellowhatsapp@example.com',
    description: 'User email address (must be unique)',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    example: 'Steve',
    description: 'First name of the user (2–25 characters)',
  })
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(25, { message: 'First name must be less than 26 characters' })
  firstName: string;

  @ApiProperty({
    example: 'Minecraft',
    description: 'Last name of the user (2–25 characters)',
  })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(25, { message: 'Last name must be less than 26 characters' })
  lastName: string;

  @ApiProperty({
    example: 'sTRongpass123$!',
    description: 'Password (minimum 6 characters)',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
