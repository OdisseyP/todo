import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import { RegisterUserDto } from 'src/task/dto/register-user.dto';
import { UserEntity } from 'src/user/user.entity';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    type: UserEntity,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    return this.usersService.register(registerUserDto);
  }
}
