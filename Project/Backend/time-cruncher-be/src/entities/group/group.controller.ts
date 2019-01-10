import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from './group.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { GroupInfoDto } from './DTOs/group-info.dto';
import { CreateGroupDto } from './DTOs/create-group.dto';
import { EditGroupDto } from './DTOs/edit-group.dto';
import { GroupNotFoundException } from '../../custom-exceptions/group-not-found.exception';
import { pusher } from '../../pusher';
import { create } from 'domain';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService, private readonly userService: UserService){}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addGroup(@Body() body: CreateGroupDto): Promise<GroupInfoDto> {
    const creatorUser: User = await this.userService.findById(body.creatorId);
    const that = this;
    delete body.creatorId;

    const createdGroup: Partial<Group> = body;
    createdGroup.users = [];
    createdGroup.users.push(creatorUser);
    let members: User[] = [];
    if (!body.isPrivate){
      members = await body.memberEmails.reduce(async (prevAcc, email) => {
        const acc = await prevAcc;
        const user = await that.userService.findByEmail(email);
        if (user && user.id !== creatorUser.id){
          acc.push(user);
        }
        return acc;
      }, Promise.resolve([]));
      createdGroup.users = createdGroup.users.concat(members);
    }
    delete body.memberEmails;
    const res: Group = await this.groupService.addGroup(createdGroup as Group);
    if (!body.isPrivate){
      members.forEach( member => {
          pusher.trigger('private-channel_for_user-' + member.id, 'added_to_group', JSON.stringify(res));
        },
      );
    }
    return res;
  }
  @Get()
  async findAllGroups(): Promise<GroupInfoDto[]>{
    return await this.groupService.findAll();
  }

  @Get(':id')
  async findGroupById(@Param() params): Promise<GroupInfoDto>{
    const res: Group = await this.groupService.findById(params.id);
    return new GroupInfoDto(res);
  }

  @Delete(':id')
  async removeGroupById(@Param() params) {
    if (!await this.groupService.existsWithId(params.id)){
      throw new GroupNotFoundException(params.id);
    }
    const res = await this.groupService.removeById(params.id);
    return {
      message: `Group with id = ${params.id} successfully removed.`,
    };
  }

  @Put(':id')
  async editGroup(@Param() params, @Body() editGroupDto: EditGroupDto) {
    const res: Group = await this.groupService.edit(params.id, editGroupDto);
    return new GroupInfoDto(res);
  }
}
