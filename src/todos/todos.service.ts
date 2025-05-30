/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo-dto';
import { UpdateTodoDto } from './dto/update-todo-dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly repo: Repository<TodoEntity>,
  ) {}

  findAll(): Promise<TodoEntity[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<TodoEntity> {
    const todo = await this.repo.findOneBy({ id });

    if (!todo) {
      throw new NotFoundException(`Not found ${id}`);
    }

    return todo;
  }

  async create(dto: CreateTodoDto): Promise<TodoEntity> {
    const todo = this.repo.create({
      name: dto.name,
      done: dto.done ?? false,
    });

    return await this.repo.save(todo);
  }

  async update(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.findOne(id);
    Object.assign(todo, dto);

    return await this.repo.save(todo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Not found ${id}`);
    }
  }
}
