import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RefreshTokenEntity } from 'src/refresh-token.entity';
import { TaskEntity } from 'src/task/task.entity';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(protected readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.getOrThrow('POSTGRES_HOST'),
      port: +this.configService.getOrThrow('POSTGRES_PORT'),
      username: this.configService.getOrThrow('POSTGRES_USER'),
      password: this.configService.getOrThrow('POSTGRES_PASSWORD'),
      database: this.configService.getOrThrow('POSTGRES_DB'),
      entities: [TaskEntity, UserEntity, RefreshTokenEntity],
      synchronize: this.configService.get('DB_SYNC') === 'true',
    };
  }
}
