import { Injectable } from '@nestjs/common';
import {Comment} from './comment.entity';
import { Repository } from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ){}
  async findAll(): Promise<Comment[]>{
    return await this.commentRepository.find();
  }
  async findById(id: number): Promise<Comment>{
    return await this.commentRepository.findOne(id);
  }
  async create(newComment: Partial<Comment>): Promise<Comment>{
    const res: Comment = await this.commentRepository.save(newComment as Comment);
    return res;
  }
  async delete(id: number){
    return await this.commentRepository.delete(id);
  }
  async edit(comment: Comment): Promise<Comment>{
    const res = await this.commentRepository.save(comment);
    return res;
  }
}
