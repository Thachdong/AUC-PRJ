import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Get('profile')
  async getProfile(@Query('email') email: string) {
    return this.userService.findUserByEmail(email);
  }
}
