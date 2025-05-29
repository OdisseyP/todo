import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './todo.interface';
import { CreateTodoDto } from './dto/create-todo-dto';
import { UpdateTodoDto } from './dto/update-todo-dto';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo | undefined {
    const todo = this.todos.find((t) => t.id === id);

    if (!todo) {
      throw new NotFoundException(`Not found ${id}`);
    }

    return todo;
  }

  create(dto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: Date.now(),
      name: dto.name,
      done: dto.done ?? false,
    };

    this.todos.push(todo);

    return todo;
  }

  update(id: number, dto: UpdateTodoDto): Todo | undefined {
    const idx = this.todos.findIndex((t) => t.id === id);

    if (idx === -1) {
      throw new NotFoundException(`Not found ${id}`);
    }

    this.todos[idx] = { ...this.todos[idx], ...dto };

    return this.todos[idx];
  }

  remove(id: number): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((t) => t.id !== id);

    if (this.todos.length === initialLength) {
      throw new NotFoundException(`Not found ${id}`);
    }

    return true;
  }
}
