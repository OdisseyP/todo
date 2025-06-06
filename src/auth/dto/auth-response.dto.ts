import { ApiProperty } from '@nestjs/swagger';
import { UserInformationDto } from '../../user/dto/user-information.dto';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User information',
    type: UserInformationDto,
  })
  user: UserInformationDto;
}
