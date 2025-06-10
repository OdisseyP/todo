import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskEntity } from './task.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]),
    AuthModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [],
})
export class TodosModule {}
