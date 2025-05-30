import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto as CreateTaskDto } from './create-task-dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ example: 'Example' })
  name?: string;

  @ApiPropertyOptional({ example: true })
  done?: boolean;
}
