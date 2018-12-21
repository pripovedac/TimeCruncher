import { Controller, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // @Post()
  // async addNewComment(@Body() newCommentData): Promise<Comment>{
  //
  //   return await this.commentService.addNew(newCommentData);
  // }

}
