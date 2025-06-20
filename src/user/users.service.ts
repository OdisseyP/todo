import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFailedError } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UserInformationDto } from './dto/user-information.dto';
import { RegisterResponseDto } from 'src/auth/dto/register-response.dto';
import { UserListItemDto } from './dto/user-list-item.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithoutPassword } from './user.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<RegisterResponseDto> {
    const existing = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    let hashedPassword: string;

    try {
      hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    } catch {
      throw new InternalServerErrorException('Error hashing password');
    }

    const user = this.userRepository.create({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      password: hashedPassword,
    });

    try {
      const saved = await this.userRepository.save(user);

      return plainToInstance(RegisterResponseDto, saved, {
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
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async findAllUsers(): Promise<UserListItemDto[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName'],
      order: {
        id: 'DESC',
      },
    });
  }

  async getUserWithoutPasswordById(id: number): Promise<UserListItemDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await this.userRepository.update(userId, { 
      refreshToken: refreshToken || undefined 
    });
  }

  async deleteUser(id: number, currentUserId: number): Promise<void> {

    if (currentUserId !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }

    const user = await this.findById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, currentUserId: number): Promise<UserListItemDto> {

    if (currentUserId !== id) {
      throw new ForbiddenException('You can only update your own account');
    }

    const user = await this.findById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    await this.userRepository.update(id, updateUserDto);

    return this.getUserWithoutPasswordById(id);
  }
}