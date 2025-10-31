import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './typeorm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [TypeOrmConfigService],
})
export class DatabaseModule {}
