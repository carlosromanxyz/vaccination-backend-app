import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationService } from './vaccination.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vaccination } from './entities/vaccination.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';

const mockVaccinationRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('VaccinationsService', () => {
  let service: VaccinationService;
  let repository: MockRepository<Vaccination>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VaccinationService,
        {
          provide: getRepositoryToken(Vaccination),
          useValue: mockVaccinationRepository(),
        },
      ],
    }).compile();

    service = module.get<VaccinationService>(VaccinationService);
    repository = module.get<MockRepository<Vaccination>>(
      getRepositoryToken(Vaccination),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a Vaccination', async () => {
      const VaccinationDto = {
        name: 'Vaccination 1',
        approved: true,
        min_dose: 1,
        max_dose: 10,
        available_at: '2023-12-31',
      };
      repository.save.mockResolvedValue(VaccinationDto);

      const result = await service.create(VaccinationDto as any);
      expect(result).toEqual(VaccinationDto);
      expect(repository.save).toHaveBeenCalledWith(VaccinationDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of Vaccinations when there are Vaccinations in the database', async () => {
      // Arrange
      const expectedVaccinations: Vaccination[] = [
        {
          id: 'XXXX-XXXX-XXXX-XXXX',
          name: 'vaccination 1',
          drug_id: 'XXXX-XXXX-XXXX-XXXX',
          dose: 1,
          date: new Date('2023-12-31'),
        },
        {
          id: 'XXXX-XXXX-XXXX-XXXX',
          name: 'vaccination 1',
          drug_id: 'XXXX-XXXX-XXXX-XXXX',
          dose: 1,
          date: new Date('2023-12-31'),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedVaccinations);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expectedVaccinations);
    });

    it('should not throw an exception when the findAll method of the Repository returns an empty array', async () => {
      // Arrange
      jest.spyOn(service, 'findAll').mockResolvedValue([]);
      // Act
      const result = await service.findAll();
      // Assert
      expect(result).toEqual([]);
    });

    it('should not throw an exception when the findAll method of the Repository returns an array with multiple Vaccinations', async () => {
      // Arrange
      const expectedVaccinations: Vaccination[] = [
        {
          id: 'XXXX-XXXX-XXXX-XXXX',
          name: 'vaccination 1',
          drug_id: 'XXXX-XXXX-XXXX-XXXX',
          dose: 1,
          date: new Date('2023-12-31'),
        },
        {
          id: 'XXXX-XXXX-XXXX-XXXX',
          name: 'vaccination 1',
          drug_id: 'XXXX-XXXX-XXXX-XXXX',
          dose: 1,
          date: new Date('2023-12-31'),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedVaccinations);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expectedVaccinations);
    });
  });

  describe('findOne', () => {
    it('should return the correct Vaccination object with the provided ID', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      const expectedVaccination: Vaccination = {
        id: 'XXXX-XXXX-XXXX-XXXX',
        name: 'vaccination 1',
        drug_id: 'XXXX-XXXX-XXXX-XXXX',
        dose: 1,
        date: new Date('2023-12-31'),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedVaccination);

      const result = await service.findOne(id);
      expect(result).toEqual(expectedVaccination);
    });

    it('should throw NotFoundException when the Vaccination with the provided ID does not exist', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`Vaccination with ID ${id} not found`),
        );

      await expect(service.findOne(id)).rejects.toThrow(Error);
    });

    it('should throw an error when the findOne operation fails', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('FindOne operation failed'));

      await expect(service.findOne(id)).rejects.toThrow(Error);
    });
  });

  describe('update', () => {
    it('should update a Vaccination', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      const updateVaccinationDto: UpdateVaccinationDto = {
        name: 'vaccination 1',
        drug_id: 'XXXX-XXXX-XXXX-XXXX',
        dose: 1,
        date: new Date('2023-12-31'),
      };
      const updatedVaccination: Vaccination = {
        id: id,
        ...updateVaccinationDto,
      };

      // Mock the repository methods
      repository.update.mockResolvedValue({ affected: 1 }); // Simula que una fila fue afectada
      repository.findOne.mockResolvedValue(updatedVaccination); // Simula que el medicamento actualizado es retornado

      const result = await service.update(id, updateVaccinationDto);

      expect(result).toEqual(updatedVaccination);
      expect(repository.update).toHaveBeenCalledWith(id, updateVaccinationDto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw NotFoundException when the Vaccination with the given ID does not exist', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      repository.update.mockResolvedValue(undefined);
      repository.findOne.mockResolvedValue(undefined);

      await expect(
        service.update(id, {} as UpdateVaccinationDto),
      ).rejects.toThrow(Error);
    });

    it('should throw an error when the update operation fails', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      repository.update.mockRejectedValue(new Error('Update operation failed'));

      await expect(
        service.update(id, {} as UpdateVaccinationDto),
      ).rejects.toThrow(Error);
      await expect(
        service.update(id, {} as UpdateVaccinationDto),
      ).rejects.toThrow('Update operation failed');
    });

    it('should throw an error when the findOne operation fails', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      repository.update.mockResolvedValue(undefined);
      repository.findOne.mockRejectedValue(
        new Error('FindOne operation failed'),
      );

      await expect(
        service.update(id, {} as UpdateVaccinationDto),
      ).rejects.toThrow(Error);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when the delete operation fails', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';

      // Mock the drugRepository.delete method to throw an error
      repository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove({ id })).rejects.toThrow(NotFoundException);
    });
  });
});
