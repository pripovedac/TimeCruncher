import { HttpException, HttpStatus } from '@nestjs/common';

export class MissingFieldException extends HttpException{
  constructor(message: string) {
    super({
      message,
      status: HttpStatus.BAD_REQUEST,
    }, HttpStatus.BAD_REQUEST);
  }
}