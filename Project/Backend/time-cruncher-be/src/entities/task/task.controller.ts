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
import { TaskNotFoundException } from '../../custom-exceptions/task-not-found.exception';
import { pusher } from '../../pusher';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly groupService: GroupService,
    private readonly userService: UserService,
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskInfoDto> {
    const that = this;
    const group: Group = await this.groupService.findByIdWithUsers(createTaskDto.groupId);
    const assignedUsers: User[] = await createTaskDto.assignedUserIds.reduce(async (prevAcc, u) => {
      const acc = await prevAcc;
      if (group.users.filter(user => user.id == u).length > 0)
        acc.push(await that.userService.findById(u));
      return acc;
    }, Promise.resolve([]));
    const creator: User = await this.userService.findById(createTaskDto.creatorId);
    const newTask: Task = new Task();
    newTask.creator = creator;
    newTask.group = group;
    newTask.assignedUsers = assignedUsers;
    newTask.dueTime = createTaskDto.dueTime;
    newTask.name = createTaskDto.name;
    newTask.description = createTaskDto.description;
    newTask.isCompleted = false;
    const res: Task = await this.taskService.addTask(newTask);
    pusher.trigger('private-channel_for_group-' + group.id, 'task_added', JSON.stringify(res));
    return new TaskInfoDto(res);
  }

  @Get()
  async findAllTasks(): Promise<TaskInfoDto[]>{
    const res: Task[] = await this.taskService.findAll();
    return res.map( x => new TaskInfoDto(x));
  }

  @Get(':id')
  async findTaskById(@Param() params): Promise<TaskInfoDto>{
    const res: Task = await this.taskService.findById(params.id);
    if (!res)
      throw new TaskNotFoundException(params.id);
    return new TaskInfoDto(res);
  }

  @Delete(':id')
  async removeTaskById(@Param() params){
    if (!this.taskService.existsWithId(params.id))
      throw new TaskNotFoundException(params.id);
    const res = await this.taskService.removeById(params.id);
    return {messsage: `Task with id = ${params.id} successfully removed.`};
  }

  @Put(':id')
  async editTask(@Param() params, @Body() editTaskDto: EditTaskDto) {
    const retTask: Task = await this.taskService.edit(params.id, editTaskDto);
    return new TaskInfoDto(retTask);
  }
}
