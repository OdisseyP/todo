import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterUserDto } from 'src/task/dto/register-user.dto';
import { UserEntity } from './user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
    @Body() dto: RegisterUserDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = this.userService.register(dto);

    return user;
  }
}
