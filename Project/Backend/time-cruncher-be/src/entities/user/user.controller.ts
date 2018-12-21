import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject, InternalServerErrorException, NotFoundException,
  Param,
  Post, Put,
  Response,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { catchError } from 'rxjs/operators';
import { getConnection } from 'typeorm';
import { IdNotAllowedException } from '../../custom-exceptions/idnotallowed.exception';
import { GroupService } from '../group/group.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService,
    ){}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addUser(@Body() userData: User): Promise<object> {
    if (userData.id !== undefined)
      throw new IdNotAllowedException();
    return await this.userService.addUser(userData);
  }

  @Get()
  async findAllUsers(): Promise<User[]>{
    return await this.userService.findAll();
  }

  @Get(':id')
  async findUserById(@Param() params): Promise<object>{
    const res = await this.userService.findById(params.id);
    if (res === undefined)
      throw new NotFoundException();
    return res;
  }

  @Delete(':id')
  async removeUserById(@Param() params){
    await this.groupService.removeGroupsWithLastUser(params.id);
    const res = await this.userService.removeById(params.id);
    if (res.raw.affectedRows === 0){
      throw new NotFoundException();
    }
    return {
      statusCode: 200,
      message: 'User successfully removed',
    };
  }

  @Put(':id')
  async editUser(@Param() params, @Body() userData: User) {
    const exists = await this.userService.existsWithId(params.id);
    if (!exists)
      throw new NotFoundException();
    userData.id = params.id;
    const res = await this.userService.edit(userData);
    return userData;
  }
}
