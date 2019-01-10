import { Task } from '../task.entity';
import { classToPlain, plainToClass } from 'class-transformer';
import { Allow, IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

export class EditTaskDto{

  @IsString()
  name: string;

  @IsString()
  description: string;

  @Allow()
  dueTime: string;
}