import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DatabaseConfig } from 'src/configs/database.config';
import { EConfigKeys } from 'src/helpers/constants';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions() {
    const config = this.configService.get<DatabaseConfig>(EConfigKeys.DATABASE);

    if (!config) {
      throw new Error('Database configuration not found');
    }

    const typeormConfig: TypeOrmModuleOptions = {
      type: 'postgres',
      host: config.POSTGRES_HOST,
      port: config.POSTGRES_PORT,
      username: config.POSTGRES_USER,
      password: config.POSTGRES_PASSWORD,
      database: config.POSTGRES_DB,
      synchronize: config.POSTGRES_SYNC,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    };

    return typeormConfig;
  }
}
