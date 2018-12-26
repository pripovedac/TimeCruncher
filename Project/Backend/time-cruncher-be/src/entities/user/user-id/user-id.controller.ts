import { Controller, Get, HttpException, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { UserService } from '../user.service';
import { TaskService } from '../../task/task.service';
import { GroupService } from '../../group/group.service';
import { Group } from '../../group/group.entity';
import { Task } from '../../task/task.entity';
import { GroupInfoDto } from '../../group/DTOs/group-info.dto';
import { TaskInfoDto } from '../../task/DTOs/task-info.dto';
import { UserTasksTimePropertiesDto } from '../DTOs/user-tasks-time-properties.dto';
import { User } from '../user.entity';
import { UserNotFoundException } from '../../../custom-exceptions/user-not-found.exception';

@Controller('users/:userId')
export class UserIdController {
  constructor(
    private readonly userService: UserService,
    // private readonly taskService: TaskService,
    // private readonly groupService: GroupService,
  ) {}
  @Get('groups')
  async getGroupsForUser(@Param() params): Promise<GroupInfoDto[]>{
    const user: User = await this.userService.findByIdWithGroups(params.userId);
    return user.groups.map(x => new GroupInfoDto(x));
  }
  @Get('assignedTasks')
  async getAssignedTasksForUser(@Param() params): Promise<TaskInfoDto[]>{
    const user: User = await this.userService.findByIdWithAssignedTasks(params.userId);
    return user.assignedTasks.map(x => new TaskInfoDto(x));
  }
  @Get('createdTasks')
  async getCreatedTasksForUser(@Param() params): Promise<TaskInfoDto[]>{
    const user: User = await this.userService.findByIdWithCreatedTasks(params.userId);
    return user.createdTasks.map( x => new TaskInfoDto(x));
  }
  @Get('daily/:dateString')
  async getDailyAssignedTasksForUser(@Param() params: UserTasksTimePropertiesDto): Promise<Task[]> {
    if (!await this.userService.existsWithId(params.userId))
      throw new UserNotFoundException(params.userId)
    const res: Task[] = await this.userService.findDailyTasksByUserId(params.userId, params.dateString);
    return res;
  }
  @Get('monthly/:dateString')
  async getMonthlyAssignedTasksForUser(@Param() params): Promise<Task[]> {
    if (!await this.userService.existsWithId(params.userId))
      throw new UserNotFoundException(params.userId);
    const res: Task[] = await this.userService.findMonthlyTasksByUserId(params.userId, params.dateString);
    return res;
  }
}
