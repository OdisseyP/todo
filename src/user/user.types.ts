import { UserEntity } from './user.entity';

export type UserWithoutPassword = Omit<UserEntity, 'password' | 'refreshToken'>; 