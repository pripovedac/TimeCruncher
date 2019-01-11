import { Module } from '@nestjs/common';
import { UserModule } from '../entities/user/user.module';
import { HttpStrategy } from './http.strategy';
import { AuthService } from './auth.service';
import { AccessTokenService } from '../entities/access-token/access-token.service';

@Module({
  imports: [UserModule],
  providers: [AuthService, HttpStrategy, AccessTokenService],
  exports: [AccessTokenService],
})
export class AuthModule {}
