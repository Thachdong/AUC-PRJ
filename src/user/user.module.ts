import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userRepositoryProvider } from './repositories/user-repository.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, userRepositoryProvider],
})
export class UserModule {}
