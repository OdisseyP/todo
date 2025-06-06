import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Неверный формат email' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль пользователя',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  password: string;
}