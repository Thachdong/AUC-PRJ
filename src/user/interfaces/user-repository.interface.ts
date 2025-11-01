import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

export abstract class IUserRepository {
  abstract findUserByEmail(email: string): Promise<User>;

  abstract createUser(payload: CreateUserDto): Promise<User>;
}
