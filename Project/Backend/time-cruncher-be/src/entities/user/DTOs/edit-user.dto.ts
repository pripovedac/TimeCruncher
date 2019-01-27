import { Allow, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EditUserDto{
  @IsNumber()
  id: number;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @Allow()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}