export class UserResponseDto {
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}
