import { ApiProperty } from '@nestjs/swagger';
import { UserInformationDto } from '../../user/dto/user-information.dto';
import { TokenResponseDto } from './tokens-response.dto';

export class AuthResponseDto extends TokenResponseDto {
  @ApiProperty({
    description: 'User information',
    type: UserInformationDto,
  })
  user: UserInformationDto;
}
