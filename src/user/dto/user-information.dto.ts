import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserInformationDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email adress',
  })
  email: string;

  @ApiProperty({
    example: 'Steve',
    description: 'User first name',
  })
  firstName: string;

  @ApiProperty({
    example: 'Jobs',
    description: 'User last name',
  })
  lastName: string;
}
