import { Injectable } from '@nestjs/common';
import {Comment} from './comment.entity';
import { Repository } from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ){}

}
