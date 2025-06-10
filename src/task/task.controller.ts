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
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { TaskEntity } from './task.entity';
import { ChangeStatusDto } from './dto/change-status-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TaskStatus } from './task-status';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Get tasks' })
  @ApiResponse({ status: 200, type: [TaskEntity] })
  findAll(@Query('status') status?: TaskStatus): Promise<TaskEntity[]> {
    return this.taskService.findAll(status);
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
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, type: TaskEntity })
  create(
    @Body() CreateTaskDto: CreateTaskDto,
    @CurrentUser() currentUser: { userId: number },
  ): Promise<TaskEntity> {
    return this.taskService.create(CreateTaskDto, currentUser.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, type: TaskEntity })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your task' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateTaskDto: UpdateTaskDto,
    @CurrentUser() currentUser: { userId: number },
  ): Promise<TaskEntity> {
    return this.taskService.update(id, UpdateTaskDto, currentUser.userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change Status' })
  @ApiParam({ name: 'id', example: 1, description: 'Task ID' })
  @ApiBody({ type: ChangeStatusDto })
  @ApiResponse({ status: 200, type: TaskEntity })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your task' })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() ChangeStatusDto: ChangeStatusDto,
    @CurrentUser() currentUser: { userId: number },
  ): Promise<TaskEntity> {
    return this.taskService.changeStatus(id, ChangeStatusDto.status, currentUser.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your task' })
  @HttpCode(204)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: { userId: number },
  ): Promise<boolean> {
    return this.taskService.remove(id, currentUser.userId);
  }
}
