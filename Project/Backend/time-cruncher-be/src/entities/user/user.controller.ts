import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus, NotFoundException,
  Param,
  Post, Put,
  Response,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UserInfoDto } from './DTOs/user-info.dto';
import { SqlException } from '../../custom-exceptions/sql.exception';
import { EditUserDto } from './DTOs/edit-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ){}



  @Get()
  async findAllUsers(): Promise<UserInfoDto[]>{
    const res: User[] = await this.userService.findAll();
    return res.map( x => new UserInfoDto(x) );
  }

  @Get(':id')
  async findUserById(@Param() params): Promise<UserInfoDto>{
    const res: User = await this.userService.findById(params.id);
    return new UserInfoDto(res);
  }

  @Delete(':id')
  async removeUserById(@Param() params){
    const res = await this.userService.removeById(params.id);
    return {
      message: `User with id = ${params.id} succesfully removed`,
    };
  }

  @Put(':id')
  async editUser(@Param() params, @Body() createUserDto: CreateUserDto): Promise<UserInfoDto>{
    const exists = await this.userService.existsWithId(params.id);
    if (!exists)
      throw new HttpException({message: `User with id = ${params.id} not found.`}, HttpStatus.NOT_FOUND);
    const editUserDto: EditUserDto = { id: parseInt(params.id, 10), ...createUserDto};
    const res = await this.userService.edit(editUserDto);
    return new UserInfoDto(res);
  }
}
