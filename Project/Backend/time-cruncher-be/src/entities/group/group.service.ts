import { Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { Group } from './group.entity';
import { getConnection, getRepository, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { reduce } from 'rxjs/operators';
import { UserNotFoundException } from '../../custom-exceptions/usernotfound.exception';
@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ){}
  async addGroup(newGroupData: Group): Promise<Group>{
    return await this.groupRepository.save(newGroupData);
  }
  async addUsersToGroup(groupId: number, userIds: number[]): Promise<Group>{
    const group = await this.findByIdWithUsers(groupId);
    if (group === undefined)
      throw new NotFoundException();
    userIds = userIds.filter(uID => !group.users.reduce((acc, user) => acc || (user.id === uID), false));
    const users = await Promise.all(userIds.map(async uID => {
      const user = await getRepository(User).findOne(uID);
      if (user === undefined)
        throw new UserNotFoundException(uID);
      return user;
    }));
    group.users = group.users.concat(users);
    return await this.groupRepository.save(group);
  }
  async findAll(): Promise<Group[]>{
    return await this.groupRepository.find();
  }
  async findById(id: number): Promise<Group>{
    return await this.groupRepository.findOne({ where: {id} });
  }
  async findByIdWithUsers(id: number): Promise<Group>{
    return await this.groupRepository.findOne({ where: {id}, relations: ['users']});
  }
  async removeById(id: number){
    return await this.groupRepository
      .createQueryBuilder()
      .delete()
      .from(Group)
      .where('id = :id', {id})
      .execute();
  }
  async removeGroupsWithLastUser(userId: number){

    const res = await this.groupRepository
      .createQueryBuilder('group')
      .innerJoin('group.users', 'user', 'user.id = :userId', {userId})
      .getMany();
    const that = this;
    return await Promise.all(res.map( async group => {
      const userCount = await getRepository(User)
        .createQueryBuilder('user')
        .innerJoin('user.groups', 'group', 'group.id = :id', { id: group.id })
        .getCount();
      if (userCount === 1)
        that.removeById(group.id);
    } ));
  }
  async edit(id: number, newGroupData: Group) {
    return await this.groupRepository
      .createQueryBuilder()
      .update(Group)
      .set(newGroupData)
      .where('id = :id', {id})
      .execute();
  }
  async existsWithId(id: number){
    return await this.groupRepository
      .createQueryBuilder()
      .where('id = :id', {id})
      .getCount() === 1;
  }
}
