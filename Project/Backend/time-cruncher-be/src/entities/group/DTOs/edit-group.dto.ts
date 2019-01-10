import { IsBoolean, IsString } from 'class-validator';

export class EditGroupDto{
  @IsBoolean()
  isPrivate: boolean;

  @IsString()
  name: string;

  @IsString()
  description: string;
}