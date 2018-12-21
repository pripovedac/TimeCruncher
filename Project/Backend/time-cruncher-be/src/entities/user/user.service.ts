import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { User } from './user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import { Task } from '../task/task.entity';
import { MissingFieldException } from '../../custom-exceptions/missingfield.exception';
import { Group } from '../group/group.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}
  async addUser(newUserData: User): Promise<User>{
    try {
      return await this.userRepository.save(newUserData);
    }
    catch (exception){
      throw new MissingFieldException(exception.message);
    }
  }
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async findById(id: number): Promise<User>{
    try {
    return await this.userRepository.findOne({ where: {id} });
    } catch (exception) {
      throw new MissingFieldException(exception.message);
    }
  }
  async findByIdWithGroups(id: number): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { id }, relations: ['groups'] });
    } catch (exception) {
      throw new MissingFieldException(exception.message);
    }
  }
  async findByIdWithAssignedTasks(id: number): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { id }, relations: ['assignedTasks'] });
    } catch (exception) {
      throw new MissingFieldException(exception.message);
    }
  }
  async findByIdWithCreatedTasks(id: number): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { id }, relations: ['createdTasks'] });
    } catch (exception) {
      throw new MissingFieldException(exception.message);
    }
  }
  async findDailyTasksByUserId(id: number, dateString: string): Promise<User> {
    try {
      const dateLow = new Date(new Date(dateString).setHours(0, 0, 0, 0));
      const dateHigh = new Date(new Date(dateString).setHours(23, 59, 59, 0));
      return this.userRepository.createQueryBuilder('user')
        .innerJoinAndSelect('user.assignedTasks', 'task', 'task.dueTime >= :dateLow and task.dueTime <= :dateHigh', { dateLow, dateHigh })
        .where('user.id = :id', { id })
        .getOne();
    } catch (exception) {
      throw new MissingFieldException(exception.message);
    }
  }
  async findMonthlyTasksByUserId(id: number, dateString: string): Promise<User> {
    try {
      const targetDate = new Date(dateString);
      const dateLow = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1, 0, 0, 0);
      const dateHigh = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59);
      return this.userRepository.createQueryBuilder('user')
        .innerJoinAndSelect('user.assignedTasks', 'task', 'task.dueTime >= :dateLow and task.dueTime <= :dateHigh', { dateLow, dateHigh })
        .where('user.id = :id', { id })
        .getOne();
    } catch (exception) {
      throw new MissingFieldException(exception.message);
    }
  }
  async removeById(id: number) {
    try {
      return await getConnection()
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('id = :id', { id })
        .execute();
    } catch (exception) {
      throw new MissingFieldException(exception.message);
    }
  }
  async edit(newUserData: User) {
    try {
      return await this.userRepository.save(newUserData);
    } catch (exception) {
      throw new MissingFieldException(exception.message);
    }
  }
  async existsWithId(id: number) {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .where('id = :id', { id })
        .getCount() === 1;
    } catch (exception) {
      throw new MissingFieldException(exception.message);
    }
  }
}
