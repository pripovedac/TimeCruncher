import { IsArray } from 'class-validator';

export class UserIdArrayDto{
  @IsArray({each: true})
  userIds: number[];
}