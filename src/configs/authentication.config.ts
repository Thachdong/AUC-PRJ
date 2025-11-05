import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { EConfigKeys } from 'src/helpers/constants';
import { validateObjectAgainstType } from 'src/helpers/validate-object-against-type';
import * as envConfig from 'dotenv';
envConfig.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export class AuthenticationConfig {
  @IsString()
  JWT_TOKEN_SECRET: string;

  @IsString()
  JWT_TOKEN_EXPIRY: string;

  @IsString()
  JWT_REFRESH_TOKEN_SECRET: string;

  @IsString()
  JWT_REFRESH_TOKEN_EXPIRY: string;
}

export default registerAs(EConfigKeys.AUTHENTICATION, async () => {
  await validateObjectAgainstType<AuthenticationConfig>(
    process.env,
    AuthenticationConfig,
  );

  return {
    JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
    JWT_TOKEN_EXPIRY: process.env.JWT_TOKEN_EXPIRY,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  };
});
