import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { UserEntity } from './user.entity';
import { RegisterResponseDto } from 'src/auth/dto/register-response.dto';
import { UserListItemDto } from './dto/user-list-item.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserListItemDto],
  })
  
  async findAllUsers(): Promise<UserListItemDto[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User information',
    type: UserListItemDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  
  async getUserById(@Param('id') id: string): Promise<UserListItemDto> {
    return this.userService.getUserWithoutPasswordById(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only delete own account' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: { userId: number },
  ): Promise<void> {
    if (currentUser.userId !== +id) {
      
      throw new ForbiddenException('You can only delete your own account');
    }
    await this.userService.deleteUser(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    type: UserListItemDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - can only update own account' })
  @ApiResponse({ status: 404, description: 'User not found' })

  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: { userId: number },
  ): Promise<UserListItemDto> {

    if (currentUser.userId !== +id) {
      throw new ForbiddenException('You can only update your own account');
    }
    return this.userService.updateUser(+id, updateUserDto);
  }
}
