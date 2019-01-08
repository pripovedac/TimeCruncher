import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { getConnection, getRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import { SqlException } from '../../custom-exceptions/sql.exception';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UserInfoDto } from './DTOs/user-info.dto';
import { validate } from 'class-validator';
import { classToClass, classToPlain, plainToClass } from 'class-transformer';
import { GroupService } from '../group/group.service';
import { EditUserDto } from './DTOs/edit-user.dto';
import { Task } from '../task/task.entity';
import { UserNotFoundException } from '../../custom-exceptions/user-not-found.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly groupService: GroupService,
  ){}
  async addUser(createUserDTO: CreateUserDto): Promise<UserInfoDto>{
    const res: User = await this.userRepository.save(createUserDTO as User);
    return new UserInfoDto(res);
  }
  async findAll(): Promise<User[]> {
    const res: User[] = await this.userRepository.find();
    return res.map( x => new UserInfoDto(x));
  }
  async findById(id: number): Promise<User> {
    const res: User = await this.userRepository.findOne({ where: { id } });
    if (!res)
      throw new UserNotFoundException(id);
    return res;
  }
  async findByEmail(email: string): Promise<User> {
    const res: User = await this.userRepository.findOne({ where: { email } });
    return res;
  }
  async findByIdWithGroups(id: number): Promise<User> {
    const res: User = await this.userRepository.findOne({ where: { id }, relations: ['groups'] });
    if (!res)
      throw new UserNotFoundException(id);
    return res;
  }
  async findByIdWithAssignedTasks(id: number): Promise<User> {
    const res: User = await this.userRepository.findOne({ where: { id }, relations: ['assignedTasks'] });
    if (!res)
      throw new UserNotFoundException(id);
    return res;
  }
  async findByIdWithCreatedTasks(id: number): Promise<User> {
    const res: User = await this.userRepository.findOne({ where: { id }, relations: ['createdTasks'] });
    if (!res)
      throw new UserNotFoundException(id);
    return res;
  }
  async findDailyTasksByUserId(id: number, dateString: string): Promise<Task[]> {
    const dateLow = new Date(new Date(dateString).setHours(0, 0, 0, 0));
    const dateHigh = new Date(new Date(dateString).setHours(23, 59, 59, 0));
    const res: User = await this.userRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.assignedTasks', 'task', 'task.dueTime >= :dateLow and task.dueTime <= :dateHigh', { dateLow, dateHigh })
      .where('user.id = :id', { id })
      .getOne();
    if (!res) return [];
    return res.assignedTasks;
  }
  async findMonthlyTasksByUserId(id: number, dateString: string): Promise<Task[]> {
    const targetDate = new Date(dateString);
    const dateLow = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1, 0, 0, 0);
    const dateHigh = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59);
    const res: User = await this.userRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.assignedTasks', 'task', 'task.dueTime >= :dateLow and task.dueTime <= :dateHigh', { dateLow, dateHigh })
      .where('user.id = :id', { id })
      .getOne();
    if (!res) return [];
    return res.assignedTasks;
  }
  async removeById(id: number) {
    const res = (await this.findByIdWithGroups(id)).groups;
    const that = this;
    const groupIdList = [];
    await Promise.all(res.map( async group => {
      const userCount = await getRepository(User)
        .createQueryBuilder('user')
        .innerJoin('user.groups', 'group', 'group.id = :id', { id: group.id })
        .getCount();
      if (userCount === 1)
        groupIdList.push(group.id);
      return {};
    }));
    // await getRepository('Group').delete(groupIdList);
    await groupIdList.forEach( x => this.groupService.removeById(x));
    return await this.userRepository.delete(id);
  }
  async edit(editUserDto: EditUserDto): Promise<User> {
    try {
      return await this.userRepository.save(editUserDto as User);
    } catch (exception) {
      throw new SqlException(exception.message);
    }
  }
  async existsWithId(id: number) {
    return (await this.userRepository.findOne(id) !== undefined);
  }
}
