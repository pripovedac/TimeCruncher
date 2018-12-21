import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Group} from './group.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { GroupIdController } from './group-id/group-id.controller';
import { GroupIdModule } from './group-id/group-id.module';
import { Task } from '../task/task.entity';
import { TaskService } from '../task/task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User, Task]), GroupIdModule],
  controllers: [GroupController, GroupIdController],
  providers: [GroupService, UserService, TaskService],
  exports: [GroupService],
})
export class GroupModule {}
