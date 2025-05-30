import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { createTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';

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
      throw new NotFoundException(`Task with id ${id} not found`);
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

  async update(id: number, dto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.findOne(id);

    return this.taskRepository.save({
      ...task,
      ...dto,
    });
  }

  async remove(id: number): Promise<boolean> {
    await this.findOne(id);
    await this.taskRepository.delete(id);

    return true;
  }
}
