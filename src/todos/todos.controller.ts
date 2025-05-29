import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
  constructor(private readonly todoService: TodosService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Todo {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ): Todo | undefined {
    return this.todoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): boolean {
    return this.todoService.remove(id);
  }

  @Post()
  create(@Body() dto: CreateTodoDto): Todo {
    return this.todoService.create(dto);
  }

  @Get()
  findAll(): Todo[] {
    return this.todoService.findAll();
  }
}
