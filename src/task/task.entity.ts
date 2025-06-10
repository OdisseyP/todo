import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from './task-status';
import { UserEntity } from '../user/user.entity';

@Entity('tasks')
export class TaskEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ default: false })
  done: boolean;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.Pending,
  })
  status: TaskStatus;

  @ApiProperty()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'creator_id' })
  creator: UserEntity;

  @ApiProperty()
  @Column({ name: 'creator_id' })
  creatorId: number;
}
