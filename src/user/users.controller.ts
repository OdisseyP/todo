import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { UserEntity } from './user.entity';
import { SafeUser, SafeUserArray } from './user.types';

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

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserEntity],
  })
  async getAllUsers(): Promise<SafeUserArray> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'User found',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<SafeUser> {
    return this.userService.getSafeUserById(id);
  }
}
