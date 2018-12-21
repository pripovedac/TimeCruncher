import { Body, Controller, Get, NotFoundException, Param, Put } from '@nestjs/common';
import { TaskService } from '../../task/task.service';
import { GroupService } from '../group.service';
import { UserService } from '../../user/user.service';

@Controller('groups/:groupId')
export class GroupIdController {
  constructor(
              private readonly taskService: TaskService,
              private readonly groupService: GroupService,
              private readonly userService: UserService,
  ){}
  @Put('addUsers')
  async addUsersToGroup(@Body() body, @Param() params){
    return await this.groupService.addUsersToGroup(params.groupId, body.userIds);
  }
  @Get('tasks')
  async getTasksForGroup(@Param() params){
    if (!await this.groupService.existsWithId(params.groupId))
      throw new NotFoundException();
    return await this.taskService.findAllByGroupId(params.groupId);
  }
  @Get('users')
  async getUsersForGroup(@Param() params){
    if (!await this.groupService.existsWithId(params.groupId))
      throw new NotFoundException();
    return (await this.groupService.findByIdWithUsers(params.groupId)).users;
  }
}
