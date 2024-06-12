import { Module } from '@nestjs/common';
import { DrugsService } from './drugs.service';
import { DrugsController } from './drugs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drug } from './entities/drug.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Drug])],
  controllers: [DrugsController],
  providers: [DrugsService, JwtService],
  exports: [DrugsService],
})
export class DrugsModule {}
