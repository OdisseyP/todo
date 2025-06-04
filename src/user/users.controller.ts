import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

import { UsersService } from '../user/users.service';
import { RegisterUserDto } from '../task/dto/register-user.dto';
import { UserResponseDto } from '../task/dto/user-response-dto';

@ApiTags('auth')
@Controller('auth')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  async register(@Body() dto: RegisterUserDto): Promise<UserResponseDto> {
    return this.usersService.register(dto);
  }
}
