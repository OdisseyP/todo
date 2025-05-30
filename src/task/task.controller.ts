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
import { createTaskDto } from './dto/create-task-dto';
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
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Get tasks' })
  @ApiResponse({ status: 200, type: [TaskEntity] })
  findAll(): Promise<TaskEntity[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: TaskEntity })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.taskService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create task' })
  @ApiBody({ type: createTaskDto })
  @ApiResponse({ status: 201, type: TaskEntity })
  create(@Body() dto: createTaskDto): Promise<TaskEntity> {
    return this.taskService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, type: TaskEntity })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.taskService.remove(id);
  }
}
