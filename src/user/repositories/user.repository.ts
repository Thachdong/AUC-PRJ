import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base.repository';
import { EntityManager, Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { IEmailVerificationPayload } from '../interfaces/email-verification-payload.interface';

@Injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  // ============== Private Methods ==============
  private async _createEmailVerification(
    payload: IEmailVerificationPayload,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  private _userRepository(entityManager?: EntityManager): Repository<User> {
    return this.getRepository<User>(User, entityManager);
  }

  // ============== Public Methods ==============
  async findUserByEmail(email: string): Promise<User> {
    return this._userRepository().findOneOrFail({ where: { email } });
  }

  async createUser(payload: CreateUserDto): Promise<User> {
    const userData: User = Object.assign(new User(), payload);
    userData.emailVerified = false;
    userData.verifiedAt = null;
    userData.phone = null;
    userData.address = null;
    userData.avatarUrl = null;
    userData.bio = null;
    userData.fullName = null;
    userData.companyName = null;
    userData.taxCode = null;
    userData.isActive = false;
    userData.bannedUntil = null;
    userData.banReason = null;

    const emailVerificationToken = await this._createEmailVerification({
      email: userData.email,
    });

    userData.emailVerificationToken = emailVerificationToken;

    const user = this._userRepository().create(userData);

    return this._userRepository().save(user);
  }
}
