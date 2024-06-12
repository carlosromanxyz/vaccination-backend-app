import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    if (Object.keys(createDrugDto).length === 0) {
      throw new BadRequestException('The drug object cannot be empty');
    }
    return this.drugRepository.save(createDrugDto);
  }

  async findAll() {
    const drugs = await this.drugRepository.find();
    // if drugs is empty, throw a not found exception
    if (drugs.length === 0) {
      throw new NotFoundException('No drugs found');
    }
    return drugs;
  }

  async findOne(id: string) {
    const drug = await this.drugRepository.findOne({ where: { id } });
    if (!drug) {
      throw new NotFoundException(`Drug with ID ${id} not found`);
    }

    if (Object.keys(drug).length === 0) {
      throw new BadRequestException(`Drug object is empty`);
    }
    return drug;
  }

  async update(id: string, updateDrugDto: UpdateDrugDto) {
    const result = await this.drugRepository.update(id, updateDrugDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Drug with ID ${id} not found`);
    }

    const updatedDrug = await this.drugRepository.findOne({ where: { id } });
    if (!updatedDrug) {
      throw new NotFoundException(`Drug with ID ${id} not found after update`);
    }

    return updatedDrug;
  }

  async remove(deleteDrugDto: DeleteDrugDto) {
    const { id } = deleteDrugDto;
    const result = await this.drugRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Drug with ID ${id} not found`);
    } else if (!result.affected) {
      throw new Error('Invalid result object from delete operation');
    } else {
      return {
        message: `Drug with ID ${id} has been deleted`,
        statusCode: HttpStatus.OK,
        data: result,
      };
    }
  }
}
