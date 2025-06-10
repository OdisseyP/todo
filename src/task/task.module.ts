import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskEntity } from './task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [],
})
export class TodosModule {}
