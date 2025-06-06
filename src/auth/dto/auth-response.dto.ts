import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access токен',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh токен',
  })
  refreshToken: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    description: 'Информация о пользователе',
  })
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}