import { IsString } from 'class-validator';

export class EditGroupDto{
  @IsString()
  name: string;

  @IsString()
  description: string;
}