import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/DTOs/create-user.dto';
import { UserInfoDto } from '../user/DTOs/user-info.dto';
import { User } from '../user/user.entity';
import { SqlException } from '../../custom-exceptions/sql.exception';
import { AccessTokenService } from './access-token.service';
import { AccessToken } from './access-token.entity';

@Controller()
export class AccessTokenController {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly userService: UserService,
  ){}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async addUser(@Body() createUserDto: CreateUserDto){
    try {
      const user: User = await this.userService.addUser(createUserDto as User);
      const res: AccessToken = await this.accessTokenService.createToken(user);
      return res;
    }
    catch (exception){
      throw new SqlException(exception.message);
    }
  }
  @Get('login')
  async getAccessToken(@Body() loginData){
    const user: User = await this.userService.findByEmailWithAccessToken(loginData.email);
    if (user.password != loginData.password){
      throw new NotFoundException();
    }
    return user;
  }
}
