import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { RegisterUserDto } from 'src/task/dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(dto: RegisterUserDto) {
    const existing = await this.userRepository.findOneBy({ email: dto.email });

    if (existing) {
      throw new ConflictException('User with this email already exist');
    }

    const saltRounds = 10;
    let hashedPassword: string;

    try {
      hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    } catch {
      throw new InternalServerErrorException('Error hashing password');
    }

    const user = this.userRepository.create({
      email: dto.email,
      firstName: dto.FirstName,
      lastName: dto.LastName,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (err: any) {
      //   if (err.code === '23505') {
      //     throw new ConflictException('User with this email already exist');
      //   }
      console.log(err);
      throw new InternalServerErrorException('Error creating user');
    }
  }
}
