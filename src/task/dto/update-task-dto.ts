import { PartialType } from '@nestjs/mapped-types';
import { createTaskDto } from './create-task-dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class updateTaskDto extends PartialType(createTaskDto) {
  @ApiPropertyOptional({ example: 'Example' })
  name?: string;

  @ApiPropertyOptional({ example: true })
  done?: boolean;
}
