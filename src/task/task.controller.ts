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
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { TaskEntity } from './task.entity';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
export class TaskController {
  constructor(private readonly todoService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Get tasks' })
  @ApiResponse({ status: 200, type: [TaskEntity] })
  findAll(): Promise<TaskEntity[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task from ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: TaskEntity })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.todoService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, type: TaskEntity })
  create(@Body() dto: CreateTaskDto): Promise<TaskEntity> {
    return this.todoService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Refresh task' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, type: TaskEntity })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskEntity> {
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
