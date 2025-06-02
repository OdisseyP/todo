import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UserEntity {
  @ApiProperty({ example: 1, description: 'USER ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'iloveandroid@example.com',
    description: 'USER EMAIL',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'Steve Jobs', description: 'USER NAME' })
  @Column()
  name: string;

  @ApiProperty({ example: 'qwerty123', description: 'USER PASSWORD' })
  @Column()
  password: string;
}
