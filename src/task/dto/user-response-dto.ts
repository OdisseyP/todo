import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: 'demo@x.com' }) email: string;
  @ApiProperty({ example: 'Steve' }) firstName: string;
  @ApiProperty({ example: 'Minecraft' }) lastName: string;
}
