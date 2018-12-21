import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException{
  constructor(userId: number) {
    super({
      message: `User with id = ${userId} not found.`,
      status: HttpStatus.NOT_FOUND,
    }, HttpStatus.NOT_FOUND);
  }
}