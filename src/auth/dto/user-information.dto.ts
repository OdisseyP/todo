import { ApiProperty } from '@nestjs/swagger';

export class UserInformationDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
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
