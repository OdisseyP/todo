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
import { RegisterResponseDto } from 'src/auth/dto/register-response.dto';
import { UserListItemDto } from './dto/user-list-item.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  async register(@Body() createUserDto: CreateUserDto): Promise<RegisterResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserListItemDto],
  })
  async getAllUsers(): Promise<UserListItemDto[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserListItemDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: number): Promise<UserListItemDto> {
    return this.userService.getUserWithoutPasswordById(id);
  }
}
