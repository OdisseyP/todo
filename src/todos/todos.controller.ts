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
  constructor(private readonly svc: TodosService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Todo | undefined {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ): Todo | undefined {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): boolean {
    return this.svc.remove(id);
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
