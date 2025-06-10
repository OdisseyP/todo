import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { TaskStatus } from './task-status';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  findAll(status?: TaskStatus): Promise<TaskEntity[]> {
    if (status) {
      return this.taskRepository.find({
        where: { status },
        order: { id: 'DESC' },
        relations: ['creator'],
      });
    }

    return this.taskRepository.find({ 
      order: { id: 'DESC' },
      relations: ['creator'],
    });
  }

  async findOne(id: number): Promise<TaskEntity> {
    const findTask = await this.taskRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!findTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return findTask;
  }

  async create(dto: CreateTaskDto, creatorId: number): Promise<TaskEntity> {
    const createTask = this.taskRepository.create({
      name: dto.name,
      done: dto.done ?? false,
      status: dto.status ?? TaskStatus.Pending,
      creatorId: creatorId,
    });

    return await this.taskRepository.save(createTask);
  }

  async update(id: number, dto: UpdateTaskDto, currentUserId: number): Promise<TaskEntity> {
    const task = await this.findOne(id);

    if (task.creatorId !== currentUserId) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    return this.taskRepository.save({
      ...task,
      ...dto,
    });
  }

  async remove(id: number, currentUserId: number): Promise<boolean> {
    const task = await this.findOne(id);

    if (task.creatorId !== currentUserId) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    await this.taskRepository.delete(id);
    return true;
  }

  async changeStatus(id: number, status: TaskStatus, currentUserId: number): Promise<TaskEntity> {
    const task = await this.findOne(id);

    if (task.creatorId !== currentUserId) {
      throw new ForbiddenException('You can only change status of your own tasks');
    }

    task.status = status;
    return this.taskRepository.save(task);
  }
}
