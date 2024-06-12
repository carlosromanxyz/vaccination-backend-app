import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { Repository } from 'typeorm';
import { Vaccination } from './entities/vaccination.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteVaccinationDto } from './dto/delete-vaccination.dto';

@Injectable()
export class VaccinationService {
  constructor(
    @InjectRepository(Vaccination)
    private readonly vaccinationRepository: Repository<Vaccination>,
  ) {}
  create(createVaccinationDto: CreateVaccinationDto) {
    return this.vaccinationRepository.save(createVaccinationDto);
  }

  findAll() {
    return this.vaccinationRepository.find();
  }

  findOne(id: string) {
    return this.vaccinationRepository.findOne({ where: { id } });
  }

  async update(id: string, updateVaccinationDto: UpdateVaccinationDto) {
    await this.vaccinationRepository.update(id, updateVaccinationDto);
    const updatedVaccination = await this.vaccinationRepository.findOne({
      where: { id },
    });
    if (!updatedVaccination) {
      throw new NotFoundException(`Vaccination with ID ${id} not found`);
    }
    return updatedVaccination;
  }

  async remove(deleteVaccinationDto: DeleteVaccinationDto) {
    const { id } = deleteVaccinationDto;
    const result = await this.vaccinationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Drug with ID ${id} not found`);
    }
    return result;
  }
}
