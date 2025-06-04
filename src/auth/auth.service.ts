import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { UsersService } from '../user/users.service';
import { RegisterUserDto } from '../task/dto/register-user.dto';
import { RefreshTokenEntity } from 'src/refresh-token.entity';
import { AuthTokensDto } from './auth-tokens-dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwt: JwtService,

    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async register(dto: RegisterUserDto): Promise<AuthTokensDto> {
    const userDto = await this.userService.register(dto);

    const payload = { sub: userDto.id, email: userDto.email };
    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });

    await this.refreshTokenRepository.save({
      user: { id: userDto.id } as DeepPartial<UserEntity>,
      token: refreshToken,
    });

    return { accessToken, refreshToken, email: userDto.email, id: userDto.id };
  }
}
