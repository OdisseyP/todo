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

  @ApiProperty({ example: 'Steve', description: 'Full user name' })
  @Column()
  FirstName: string;

  @ApiProperty({ example: 'Jobs', description: 'Full user surname' })
  @Column()
  LastName: string;

  @ApiProperty({ example: 'hashed_password', description: 'USER PASSWORD' })
  @Column()
  password: string;
}
