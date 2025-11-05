import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

import appConfigs from './configs';
import { AuthenticationConfig } from './configs/authentication.config';
import { EConfigKeys } from './helpers/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: appConfigs,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const authenticationConfig = config.get<AuthenticationConfig>(
          EConfigKeys.AUTHENTICATION,
        );

        if (!authenticationConfig) {
          throw new Error('Authentication configuration not found');
        }

        const jwtConfig: JwtModuleOptions = {
          secret: authenticationConfig.JWT_TOKEN_SECRET,
          signOptions: {
            expiresIn:
              parseInt(authenticationConfig.JWT_TOKEN_EXPIRY, 10) || '3600s',
          },
        };

        return jwtConfig;
      },
    }),
    DatabaseModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
