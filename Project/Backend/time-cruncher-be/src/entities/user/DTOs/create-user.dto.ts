import { Allow, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto{
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @Allow()
  email: string;

  @IsString()
  password: string;

}