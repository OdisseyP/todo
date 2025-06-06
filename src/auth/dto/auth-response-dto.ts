import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'DSAD#fsdfa4321332r42345234534twgffd...',
    description: 'Access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'ERHWIUHEWIUHii32uhuieware54re...',
    description: 'Refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@example.com',
      firstName: 'Steve',
      lastName: 'Jobs',
    },
    description: 'Information about user',
  })
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}
