// src/todos/todos.controller.ts

import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Patch,
  Body,
  Delete,
  Post,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo-dto';
import { UpdateTodoDto } from './dto/update-todo-dto';
import { Todo } from './todo.interface';

@Controller('todos')
export class TodosController {
  constructor(private readonly svc: TodosService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Todo {
    const todo = this.svc.findOne(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ): Todo {
    const updated = this.svc.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): void {
    const success = this.svc.remove(id);
    if (!success) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }

  @Post()
  create(@Body() dto: CreateTodoDto): Todo {
    return this.svc.create(dto);
  }

  @Get()
  findAll(): Todo[] {
    return this.svc.findAll();
  }
}
