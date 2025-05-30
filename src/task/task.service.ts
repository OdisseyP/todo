/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repo: Repository<TaskEntity>,
  ) {}

  findAll(): Promise<TaskEntity[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<TaskEntity> {
    const task = await this.repo.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Not found ${id}`);
    }

    return task;
  }

  async create(dto: CreateTaskDto): Promise<TaskEntity> {
    const task = this.repo.create({
      name: dto.name,
      done: dto.done ?? false,
    });

    return await this.repo.save(task);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.findOne(id);
    Object.assign(task, dto);

    return await this.repo.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Not found ${id}`);
    }
  }
}
