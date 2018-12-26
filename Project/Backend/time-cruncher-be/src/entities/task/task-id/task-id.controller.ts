import { Body, Controller, Param, Put } from '@nestjs/common';
import { TaskService } from '../task.service';
import { Task } from '../task.entity';
import { TaskInfoDto } from '../DTOs/task-info.dto';
import { TaskWithAssignedUsersDto } from '../DTOs/task-with-assigned-users.dto';
import { UserIdArrayDto } from '../../group/DTOs/user-id-array.dto';

@Controller('task/:id')
export class TaskIdController {
  constructor(private readonly taskService: TaskService){}

  @Put('markCompleted')
  async markTaskCompleted(@Param() params){
    const res: Task = await this.taskService.markCompleted(params.id);
    return new TaskInfoDto(res);
  }
  @Put('resetCompleted')
  async resetTaskCompleted(@Param() params): Promise<TaskWithAssignedUsersDto>{
    const res: Task = await this.taskService.resetCompleted(params.id);
    return new TaskWithAssignedUsersDto(res);
  }
  @Put('assignUsers')
  async assignUsersToTask(@Param() params, @Body() assignedUserIds: UserIdArrayDto): Promise<TaskWithAssignedUsersDto>{
    const res: Task = await this.taskService.assignUsers(params.id, assignedUserIds.userIds);
    return new TaskWithAssignedUsersDto(res);
  }
}
