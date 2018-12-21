import { Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import {InjectRepository} from '@nestjs/typeorm';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async addTask(newTaskData: Task): Promise<Task>{
    return await this.taskRepository.save(newTaskData);
  }
  async findAll(): Promise<Task[]>{
    return await this.taskRepository.find();
  }
  async findById(id: number): Promise<object>{
    return await this.taskRepository.find({ where: {id}});
  }
  async removeById(id: number){
    return await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Task)
      .where('id = :id', {id})
      .execute();
  }
  async edit(id: number, newTaskData: Task) {
    return await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set(newTaskData)
      .where('id = :id', {id})
      .execute();
  }
  async existsWithId(id: number){
    return await this.taskRepository
      .createQueryBuilder()
      .where('id = :id', {id})
      .getCount() === 1;
  }
  async findAllByGroupId(groupId: number){
    return await this.taskRepository.find({where: {group: groupId}});
  }
}
