import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfigs from './configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: appConfigs,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
