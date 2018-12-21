// @ts-ignore
import { HttpException, HttpStatus } from '@nestjs/common';

export class IdNotAllowedException extends HttpException{
  constructor() {
    super({
      message: 'ID is auto-defined. Custom definitions not allowed.',
      status: HttpStatus.BAD_REQUEST,
    }, HttpStatus.BAD_REQUEST);
  }
}