import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGci0Juziksfsiaodjfiojas43rft...',
    description: 'Refresh token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'Ert97yuYUIYUIuiop023pou...',
    description: 'Refresh token',
  })
  refreshToken: string;
}
