import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Body,
  Delete,
  Post,
  HttpCode,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo-dto';
import { UpdateTodoDto } from './dto/update-todo-dto';
import { TodoEntity } from './todo.entity';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  @Get()
  @ApiOperation({ summary: 'Get tasks' })
  @ApiResponse({ status: 200, type: [TodoEntity] })
  findAll(): Promise<TodoEntity[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task from ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: TodoEntity })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TodoEntity> {
    return this.todoService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create task' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({ status: 201, type: TodoEntity })
  create(@Body() dto: CreateTodoDto): Promise<TodoEntity> {
    return this.todoService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Refresh task' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateTodoDto })
  @ApiResponse({ status: 200, type: TodoEntity })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    return this.todoService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.todoService.remove(id);
  }
}
