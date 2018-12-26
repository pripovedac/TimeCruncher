import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EditUserDto{
  @IsNumber()
  id: number;

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