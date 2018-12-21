import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDTO{
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}