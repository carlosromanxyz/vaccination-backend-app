import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { Drug } from './entities/drug.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteDrugDto } from './dto/delete-drug.dto';

@Injectable()
export class DrugsService {
  constructor(
    @InjectRepository(Drug)
    private readonly drugRepository: Repository<Drug>,
  ) {}
  create(createDrugDto: CreateDrugDto) {
    return this.drugRepository.save(createDrugDto);
  }

  findAll() {
    return this.drugRepository.find();
  }

  findOne(id: string) {
    return this.drugRepository.findOne({ where: { id } });
  }

  async update(id: string, updateDrugDto: UpdateDrugDto) {
    await this.drugRepository.update(id, updateDrugDto);
    const updatedDrug = await this.drugRepository.findOne({ where: { id } });
    if (!updatedDrug) {
      throw new NotFoundException(`Drug with ID ${id} not found`);
    }
    return updatedDrug;
  }

  async remove(deleteDrugDto: DeleteDrugDto) {
    const { id } = deleteDrugDto;
    const result = await this.drugRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Drug with ID ${id} not found`);
    }
    return result;
  }
}
