import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateGroupDto{
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  creatorId: number;

  @IsArray()
  memberEmails: string[];
}