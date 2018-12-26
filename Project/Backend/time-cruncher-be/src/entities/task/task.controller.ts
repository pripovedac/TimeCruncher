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
import { CreateTaskDto } from './DTOs/create-task.dto';
import { Group } from '../group/group.entity';
import { create } from 'domain';
import { TaskInfoDto } from './DTOs/task-info.dto';
import { EditTaskDto } from './DTOs/edit-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly groupService: GroupService,
    private readonly userService: UserService,
  ) {}
  @Post()
  @HttpCode(201)
  async addTask(@Body() createTaskDto: CreateTaskDto): Promise<object> {
    const that = this;
    const assignedUsers: User[] = await Promise.all(createTaskDto.assignedUserIds.map(async u => await that.userService.findById(u)));
    const creator: User = await this.userService.findById(createTaskDto.creatorId);
    const group: Group = await this.groupService.findById(createTaskDto.groupId);
    const newTask: Task = new Task();
    newTask.creator = creator;
    newTask.group = group;
    newTask.assignedUsers = assignedUsers;
    newTask.dueTime = createTaskDto.dueTime;
    newTask.description = createTaskDto.description;
    newTask.isCompleted = false;
    return await this.taskService.addTask(newTask);
  }

  @Get()
  async findAllTasks(): Promise<TaskInfoDto[]>{
    const res: Task[] = await this.taskService.findAll();
    return res.map( x => new TaskInfoDto(x));
  }

  @Get(':id')
  async findTaskById(@Param() params): Promise<TaskInfoDto>{
    const res: Task = await this.taskService.findById(params.id);
    return new TaskInfoDto(res);
  }

  @Delete(':id')
  async removeTaskById(@Param() params){
    const res = await this.taskService.removeById(params.id);
    return {
      statusCode: 200,
      message: 'Task successfully removed',
    };
  }

  @Put(':id')
  async editTask(@Param() params, @Body() editTaskDto: EditTaskDto) {
    const retTask: Task = await this.taskService.edit(params.id, editTaskDto);
    return new TaskInfoDto(retTask);
  }
}
