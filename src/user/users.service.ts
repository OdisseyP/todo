import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/task/dto/register-user.dto';
import { QueryFailedError } from 'typeorm';
import { UserResponseDto } from 'src/task/dto/user-response-dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(dto: RegisterUserDto): Promise<Omit<UserEntity, 'password' | 'refreshToken'>> {
    const existing = await this.userRepository.findOneBy({ email: dto.email });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    let hashedPassword: string;

    try {
      hashedPassword = await bcrypt.hash(dto.password, 10);
    } catch {
      throw new InternalServerErrorException('Error hashing password');
    }

    const user = this.userRepository.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: hashedPassword,
    });

    try {
      const saved = await this.userRepository.save(user);

      return plainToInstance(UserResponseDto, saved, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const drv = err.driverError as Record<string, unknown>;
        const code = drv?.code as string | undefined;

        if (code === '23503') {
          throw new ConflictException('User with this email already exists');
        }
      }

      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await this.userRepository.update(userId, { 
      refreshToken: refreshToken || undefined 
    });
  }
}
