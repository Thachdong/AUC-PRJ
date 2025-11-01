import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

export interface IUserService {
  createUser(payload: CreateUserDto): Promise<User>;
  findUserByEmail(email: string): Promise<User>;
}
