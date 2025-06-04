import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/user/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([]), UsersModule],
  controllers: [AuthController],
})
export class AuthModule {}
