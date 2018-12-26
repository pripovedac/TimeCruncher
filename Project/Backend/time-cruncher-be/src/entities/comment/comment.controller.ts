import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './DTOs/create-comment.dto';
import { UserService } from '../user/user.service';
import { TaskService } from '../task/task.service';
import { EditCommentDto } from './DTOs/edit-comment.dto';
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    ) {}
  @Get()
  async findAllComments(): Promise<Comment[]>{
    return await this.commentService.findAll();
  }

  @Get(':id')
  async findCommentById(@Param() params){
    return await this.commentService.findById(params.id);
  }

  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto){
    const creator = await this.userService.findById(createCommentDto.creatorId);
    const task = await this.taskService.findById(createCommentDto.taskId);
    const newComment: Partial<Comment> = {text: createCommentDto.text, creator, task};
    return await this.commentService.create(newComment);
  }

  @Delete(':id')
  async deleteComment(@Param() params){
    const res = await this.commentService.delete(params.id);
    return res;
  }

  @Put(':id')
  async editComment(@Param() params, @Body() editCommentDto: EditCommentDto){
    const comment: Comment = await this.commentService.findById(params.id);
    comment.text = editCommentDto.text;
    return this.commentService.edit(comment);
  }
}
