import { Injectable } from '@nestjs/common';
import { IUserService } from './interfaces/user-service.inteface';
import { IUserRepository } from './interfaces/user-repository.interface';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(payload: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(payload);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findUserByEmail(email);
  }
}
