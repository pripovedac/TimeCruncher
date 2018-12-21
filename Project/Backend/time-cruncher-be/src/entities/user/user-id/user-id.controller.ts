import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from '../user.service';
import { TaskService } from '../../task/task.service';
import { GroupService } from '../../group/group.service';
import { Group } from '../../group/group.entity';
import { Task } from '../../task/task.entity';

@Controller('users/:userId')
export class UserIdController {
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    private readonly groupService: GroupService,
  ) {}
  @Get('groups')
  async getGroupsForUser(@Param() params): Promise<Group[]>{
    if (!await this.userService.existsWithId(params.userId))
      throw new NotFoundException();
    return (await this.userService.findByIdWithGroups(params.userId)).groups;
  }
  @Get('assignedTasks')
  async getAssignedTasksForUser(@Param() params): Promise<Task[]>{
    if (!await this.userService.existsWithId(params.userId))
      throw new NotFoundException();
    return (await this.userService.findByIdWithAssignedTasks(params.userId)).assignedTasks;
  }
  @Get('createdTasks')
  async getCreatedTasksForUser(@Param() params): Promise<Task[]>{
    if (!await this.userService.existsWithId(params.userId))
      throw new NotFoundException();
    return (await this.userService.findByIdWithCreatedTasks(params.userId)).createdTasks;
  }
  @Get('daily/:dateString')
  async getDailyAssignedTasksForUser(@Param() params): Promise<object>{
    try{
      if (!await this.userService.existsWithId(params.userId))
        throw new NotFoundException();
      const res = await this.userService.findDailyTasksByUserId(params.userId, params.dateString);
      if (res === undefined)
        return [];
      return res.assignedTasks;
    }
    catch (exception) {
      console.log(exception.message);
    }
  }
  @Get('monthly/:dateString')
  async getMonthlyAssignedTasksForUser(@Param() params): Promise<object>{
    try{
      if (!await this.userService.existsWithId(params.userId))
        throw new NotFoundException();
      const res = await this.userService.findMonthlyTasksByUserId(params.userId, params.dateString);
      if (res === undefined)
        return [];
      return res.assignedTasks;
    }
    catch (exception) {
      console.log(exception.message);
    }
  }
}
