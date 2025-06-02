import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../tast-status';

export class ChangeStatusDto {
  @ApiProperty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
