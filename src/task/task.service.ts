import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task-dto';
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

  async create(dto: CreateTaskDto): Promise<TaskEntity> {
    const createTask = this.taskRepository.create({
      name: dto.name,
      done: dto.done ?? false,
      status: dto.status ?? TaskStatus.Pending,
    });

    return await this.taskRepository.save(createTask);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<TaskEntity> {
    const updateTask = await this.findOne(id);

    return this.taskRepository.save({
      ...updateTask,
      ...dto,
    });
  }

  async remove(id: number): Promise<boolean> {
    await this.findOne(id);
    await this.taskRepository.delete(id);

    return true;
  }

  async changeStatus(id: number, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.findOne(id);
    task.status = status;

    return this.taskRepository.save(task);
  }
}
