import { Body, Controller, Post, Headers, HttpException, ForbiddenException, HttpStatus, HttpCode } from '@nestjs/common';
import { pusher } from '../pusher';
import { UserService } from '../entities/user/user.service';
import { GroupService } from '../entities/group/group.service';
import { Group } from '../entities/group/group.entity';

@Controller('pusher')
export class PusherAuthController {
  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ){}
  @Post('auth')
  @HttpCode(HttpStatus.OK)
  async authGroupManagement(@Headers() headers, @Body() body){
    if (!this.userService.authUser(headers.user_id, headers.user_password))
      throw new ForbiddenException();
    const channelNameSplit = body.channel_name.split('-', 3);
    const channelName = channelNameSplit[1];
    if (channelName === 'channel_for_user'){
      const userId = channelNameSplit[2];
      if (userId !== headers.user_id)
        throw new ForbiddenException();
    }
    if (channelName === 'channel_for_group'){
      const groupId = channelNameSplit[2];
      const group: Group = await this.groupService.findByIdWithUsers(groupId);
      const isInGroup: boolean = group.users.filter(  user => headers.user_id == user.id ).length > 0;
      if (!isInGroup)
        throw new ForbiddenException();
    }
    const auth = pusher.authenticate(body.socket_id, body.channel_name);
    return JSON.stringify(auth);
  }
}
