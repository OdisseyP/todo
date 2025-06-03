import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import { RegisterUserDto } from 'src/task/dto/register-user.dto';
import { UserEntity } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    return this.usersService.register(registerUserDto);
  }
}
