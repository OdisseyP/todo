import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import { RegisterUserDto } from 'src/task/dto/register-user.dto';
import { UserEntity } from 'src/user/user.entity';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    type: AuthResponseDto,
    description: 'Успешная аутентификация',
  })
  @ApiResponse({
    status: 401,
    description: 'Неверный email или пароль',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Refresh токен'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное обновление токенов',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Недействительный refresh токен',
  })
  async refresh(@Body('refreshToken') refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refresh(refreshToken);
  }
}
