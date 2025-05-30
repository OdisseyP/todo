/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { createTaskDto } from './dto/create-task-dto';
import { updateTaskDto } from './dto/update-task-dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  findAll(): Promise<TaskEntity[]> {
    return this.taskRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Entity task with id ${id} not found`);
    }

    return task;
  }

  async create(dto: createTaskDto): Promise<TaskEntity> {
    const task = this.taskRepository.create({
      name: dto.name,
      done: dto.done ?? false,
    });

    return await this.taskRepository.save(task);
  }

  async update(id: number, dto: updateTaskDto): Promise<TaskEntity> {
    const task = await this.findOne(id);
    const updated = {
      ...task,
      ...dto,
    };

    return await this.taskRepository.save(updated);
  }

  async remove(id: number): Promise<boolean> {
    await this.findOne(id);
    await this.taskRepository.delete(id);
    return true;
  }
}
