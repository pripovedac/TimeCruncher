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
import { TaskService } from './task.service';
import { Task } from './task.entity';
import DateTimeFormat = Intl.DateTimeFormat;
import { User } from '../user/user.entity';
import { GroupService } from '../group/group.service';
import { UserService } from '../user/user.service';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly groupService: GroupService,
    private readonly userService: UserService,
  ) {}
  @Post()
  @HttpCode(201)
  async addTask(@Body() taskData): Promise<object>{
    try{
      if (taskData.group === null || taskData.group === undefined || !await this.groupService.existsWithId(taskData.group))
        throw new BadRequestException();
      if (taskData.creator === null || taskData.creator === undefined || !await this.userService.existsWithId(taskData.creator))
        throw new BadRequestException();
      if (taskData.assignedUserIds !== undefined && taskData.assignedUserIds !== null){
        const that = this;
        taskData.assignedUsers = await Promise.all(taskData.assignedUserIds.map(async u => await that.userService.findById(u) ));
        delete taskData.assignedUserIds;
      }
      return await this.taskService.addTask(taskData);
    }
    catch (exception){
      console.log(exception.message);
      throw new BadRequestException();
    }
  }

  @Get()
  async findAllTasks(): Promise<Task[]>{
    return await this.taskService.findAll();
  }

  @Get(':id')
  async findTaskById(@Param() params): Promise<object>{
    return await this.taskService.findById(params.id);
  }

  @Delete(':id')
  async removeTaskById(@Param() params){
    const res = await this.taskService.removeById(params.id);
    if (res.raw.affectedRows === 0){
      throw new NotFoundException();
    }
    return {
      statusCode: 200,
      message: 'Task successfully removed',
    };
  }

  @Put(':id')
  async editTask(@Param() params, @Body() taskData: Task) {
    const exists = await this.taskService.existsWithId(params.id);
    if (!exists)
      throw new NotFoundException();
    const res = await this.taskService.edit(params.id, taskData);
    if (res.raw.affectedRows === 0)
      throw new InternalServerErrorException();
    taskData.id = params.id;
    return taskData;
  }
}
