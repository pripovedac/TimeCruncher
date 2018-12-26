import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import { EditTaskDto } from './DTOs/edit-task.dto';
import { UserService } from '../user/user.service';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}
  async addTask(newTaskData: Task): Promise<Task>{
    return await this.taskRepository.save(newTaskData);
  }
  async findAll(): Promise<Task[]>{
    return await this.taskRepository.find();
  }
  async findById(id: number): Promise<Task>{
    return await this.taskRepository.findOne({ where: {id}});
  }
  async removeById(id: number){
    return await this.taskRepository.delete(id);
  }
  async edit(id: number, editTaskDto: EditTaskDto) {
    const task: Task = await this.taskRepository.findOne(id);
    task.description = editTaskDto.description;
    task.dueTime = editTaskDto.dueTime;
    return await this.taskRepository.save(task);
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
  async markCompleted(id: number){
    const task: Task = await this.taskRepository.findOne(id);
    task.isCompleted = true;
    task.completionTime = (new Date()).toISOString();
    return await this.taskRepository.save(task);
  }
  async resetCompleted(id: number){
    const task: Task = await this.taskRepository.findOne(id);
    task.isCompleted = false;
    task.completionTime = null;
    return await this.taskRepository.save(task);
  }
  async assignUsers(id: number, assignedUserIds: number[]): Promise<Task>{
    const that = this;
    const task = await this.taskRepository.findOne(id);
    const filteredIds = assignedUserIds.filter( uId => !task.assignedUsers.reduce((acc, el) => acc || uId === el.id, false))
    const users: User[] = await Promise.all(assignedUserIds.map( async uId => await that.userService.findById(uId)));
    task.assignedUsers.concat(users);
    return await this.taskRepository.save(task);
  }
}
