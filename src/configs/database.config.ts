import { registerAs } from '@nestjs/config';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { EConfigKeys } from 'src/helpers/constants';
import { validateObjectAgainstType } from 'src/helpers/validate-object-against-type';
import * as envConfig from 'dotenv';
envConfig.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export class DatabaseConfig {
  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  @IsBoolean()
  @Transform(({ value }: { value: string }) => value === 'true')
  POSTGRES_SYNC: boolean;
}

export default registerAs(EConfigKeys.DATABASE, async () => {
  await validateObjectAgainstType<DatabaseConfig>(process.env, DatabaseConfig);

  return {
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
  };
});
