import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RefreshTokenEntity } from 'src/refresh-token.entity';

@Entity('users')
export class UserEntity {
  @ApiProperty({ example: 1, description: 'User ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'iloveandroid@example.com',
    description: 'User email',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'Steve', description: 'User first name' })
  @Column()
  firstName: string;

  @ApiProperty({ example: 'Jobs', description: 'User last name' })
  @Column()
  lastName: string;

  @ApiProperty({ example: 'hashed_password', description: 'User password' })
  @Column()
  password: string;

  @OneToMany(() => RefreshTokenEntity, (rt) => rt.user)
  refreshTokens: RefreshTokenEntity[];
}
