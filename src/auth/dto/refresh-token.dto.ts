import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'ikosdjfjaiosdjfigojasiojedfiookiopk213',
    description: 'Refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
