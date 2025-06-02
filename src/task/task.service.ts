import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { createTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { TaskStatus } from './tast-status';

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
    const findTask = await this.taskRepository.findOneBy({ id });

    if (!findTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return findTask;
  }

  async create(dto: createTaskDto): Promise<TaskEntity> {
    const newTask = this.taskRepository.create({
      name: dto.name,
      done: dto.done ?? false,
      status: dto.status ?? TaskStatus.Pending,
    });

    return await this.taskRepository.save(newTask);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<TaskEntity> {
    const updatedTask = await this.findOne(id);

    return this.taskRepository.save({
      ...updatedTask,
      ...dto,
    });
  }

  async remove(id: number): Promise<boolean> {
    await this.findOne(id);
    await this.taskRepository.delete(id);

    return true;
  }
}
