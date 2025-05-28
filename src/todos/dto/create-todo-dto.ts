import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  done?: boolean;
}

export class FindTodoDto {
  @IsNotEmpty()
  @IsBoolean()
  id: boolean;
}
