import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { UsersService } from '../user/users.service';
import { RegisterUserDto } from '../task/dto/register-user.dto';
import { RefreshTokenEntity } from 'src/refresh-token.entity';
import { AuthTokenDto } from './auth-tokens-dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwt: JwtService,
    @InjectRepository(RefreshTokenEntity)
    private readonly rtRepo: Repository<RefreshTokenEntity>,
  ) {}

  async register(dto: RegisterUserDto): Promise<AuthTokenDto> {
    const userDto = await this.userService.register(dto);

    const payload = { sub: userDto.id, email: userDto.email };
    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });

    const rt = this.rtRepo.create({
      user: { id: userDto.id } as DeepPartial<UserEntity>,
      token: refreshToken,
    });

    await this.rtRepo.save(rt);
    // const rt = this.rtRepo.create({
    //   user: { id: user.id } as UserEntity,
    //   token: refreshToken,
    // });
    // await this.rtRepo.save(rt);

    return { accessToken, refreshToken };
  }
}
