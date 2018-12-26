import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { Group } from './group.entity';
import { getConnection, getRepository, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { reduce } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { GroupInfoDto } from './DTOs/group-info.dto';
import { EditGroupDto } from './DTOs/edit-group.dto';
import { UserNotFoundException } from '../../custom-exceptions/user-not-found.exception';
import { GroupNotFoundException } from '../../custom-exceptions/group-not-found.exception';
@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ){}
  async addGroup(newGroupData: Group): Promise<GroupInfoDto>{
    const res: Group = await this.groupRepository.save(newGroupData);
    return new GroupInfoDto(res);
  }
  async addUsersToGroup(groupId: number, userIds: number[]): Promise<Group>{
    const group = await this.findByIdWithUsers(groupId);
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
  async findAll(): Promise<GroupInfoDto[]>{
    const res: Group[] = await this.groupRepository.find();
    return res.map( x => new GroupInfoDto(x));
  }
  async findById(id: number): Promise<Group>{
    const res: Group = await this.groupRepository.findOne({ where: {id} });
    if (res === undefined)
      throw new GroupNotFoundException(id);
    return res;
  }
  async findByIdWithUsers(id: number): Promise<Group>{
    const res: Group = await this.groupRepository.findOne({ where: {id}, relations: ['users']});
    if (!res)
      throw new GroupNotFoundException(id);
    return res;
  }
  async findByIdWithTasks(id: number): Promise<Group>{
    const res: Group = await this.groupRepository.findOne({ where: {id}, relations: ['tasks']});
    if (!res)
      throw new GroupNotFoundException(id);
    return res;
  }
  async removeById(id: number){
    return await this.groupRepository.delete(id);
  }
  async edit(id: number, editGroupDto: EditGroupDto): Promise<GroupInfoDto> {
    const group: Group = await this.findById(id);
    group.description = editGroupDto.description;
    group.name = editGroupDto.name;
    const res = await this.groupRepository.save(group as Group);
    return res;
  }
  async existsWithId(id: number){
    return (await this.groupRepository.findOne(id)) !== undefined;
  }
}
