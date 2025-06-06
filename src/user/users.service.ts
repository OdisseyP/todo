import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto as CreateUserDto } from 'src/user/dto/register-user.dto';
import { QueryFailedError } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UserInformationDto } from './dto/user-information.dto';
import { SafeUser, SafeUserArray } from './user.types';

@Injectable()
export class UsersService {
  updateRefreshToken(_userId: number, _refreshToken: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(dto: CreateUserDto): Promise<SafeUser> {
    const existing = await this.userRepository.findOneBy({
      email: dto.email,
    });

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

      return plainToInstance(UserInformationDto, saved, {
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

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User whith ID ${id} not found');
    }
    return user;
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async findAllUsers(): Promise<SafeUserArray> {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName'],
    });
  }

  async getSafeUserById(id: number): Promise<SafeUser> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
