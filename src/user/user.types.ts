import { UserEntity } from './user.entity';

export type SafeUser = Omit<UserEntity, 'password' | 'refreshToken'>;
export type SafeUserArray = SafeUser[];
