import { Module } from '@nestjs/common';
import { VaccinationService } from './vaccination.service';
import { VaccinationController } from './vaccination.controller';
import { Vaccination } from './entities/vaccination.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Vaccination])],
  controllers: [VaccinationController],
  providers: [VaccinationService, JwtService],
  exports: [VaccinationService],
})
export class VaccinationModule {}
