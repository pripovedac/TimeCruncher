import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService, private readonly userService: UserService){}

  @Post()
  @HttpCode(201)
  async addGroup(@Body() body): Promise<object>{
    try{
      const creatorId = body.creatorId;
      const creatorUser = await this.userService.findById(creatorId);
      if (creatorUser === null || creatorUser === undefined)
        throw new BadRequestException();
      delete body.creatorId;
      const createdGroup: Group = body;
      createdGroup.users = [];
      createdGroup.users.push(creatorUser);
      return await this.groupService.addGroup(createdGroup);
    }
    catch (exception){
      throw new BadRequestException();
    }
  }

  @Get()
  async findAllGroups(): Promise<Group[]>{
    return await this.groupService.findAll();
  }

  @Get(':id')
  async findGroupById(@Param() params): Promise<object>{
    return await this.groupService.findById(params.id);
  }

  @Delete(':id')
  async removeGroupById(@Param() params){
    const res = await this.groupService.removeById(params.id);
    if (res.raw.affectedRows === 0){
      throw new NotFoundException();
    }
    return {
      statusCode: 200,
      message: 'Group successfully removed',
    };
  }

  @Put(':id')
  async editGroup(@Param() params, @Body() groupData: Group) {
    const exists = await this.groupService.existsWithId(params.id);
    if (!exists)
      throw new NotFoundException();
    const res = await this.groupService.edit(params.id, groupData);
    if (res.raw.affectedRows === 0)
      throw new InternalServerErrorException();
    groupData.id = params.id;
    return groupData;
  }
}
