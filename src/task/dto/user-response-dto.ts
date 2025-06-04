import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsEmail, IsString } from 'class-validator';

@Exclude()
export class UserResponseDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  firstName: string;

  @Expose()
  @IsString()
  lastName: string;
}
