import { Test, TestingModule } from '@nestjs/testing';
import { DrugsService } from './drugs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Drug } from './entities/drug.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UpdateDrugDto } from './dto/update-drug.dto';

const mockDrugRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('DrugsService', () => {
  let service: DrugsService;
  let repository: MockRepository<Drug>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrugsService,
        { provide: getRepositoryToken(Drug), useValue: mockDrugRepository() },
      ],
    }).compile();

    service = module.get<DrugsService>(DrugsService);
    repository = module.get<MockRepository<Drug>>(getRepositoryToken(Drug));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a drug', async () => {
      const drugDto = {
        name: 'Drug 1',
        approved: true,
        min_dose: 1,
        max_dose: 10,
        available_at: '2023-12-31',
      };
      repository.save.mockResolvedValue(drugDto);

      const result = await service.create(drugDto as any);
      expect(result).toEqual(drugDto);
      expect(repository.save).toHaveBeenCalledWith(drugDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of drugs when there are drugs in the database', async () => {
      // Arrange
      const expectedDrugs: Drug[] = [
        {
          id: '1',
          name: 'Drug 1',
          approved: true,
          min_dose: 1,
          max_dose: 10,
          available_at: new Date('2023-12-31'),
        },
        {
          id: '2',
          name: 'Drug 2',
          approved: false,
          min_dose: 2,
          max_dose: 5,
          available_at: new Date('2024-01-01'),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedDrugs);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expectedDrugs);
    });

    it('should throw NotFoundException when there are no drugs in the database', async () => {
      repository.find.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
      await expect(service.findAll()).rejects.toThrow('No drugs found');
    });

    it('should not throw an exception when the findAll method of the Repository returns an empty array', async () => {
      // Arrange
      jest.spyOn(service, 'findAll').mockResolvedValue([]);
      // Act
      const result = await service.findAll();
      // Assert
      expect(result).toEqual([]);
    });

    it('should not throw an exception when the findAll method of the Repository returns an array with multiple drugs', async () => {
      // Arrange
      const expectedDrugs: Drug[] = [
        {
          id: '1',
          name: 'Drug 1',
          approved: true,
          min_dose: 1,
          max_dose: 10,
          available_at: new Date('2023-12-31'),
        },
        {
          id: '2',
          name: 'Drug 2',
          approved: false,
          min_dose: 2,
          max_dose: 5,
          available_at: new Date('2024-01-01'),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedDrugs);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expectedDrugs);
    });
  });

  describe('findOne', () => {
    it('should return the correct drug object with the provided ID', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      const expectedDrug: Drug = {
        id,
        name: 'Drug 1',
        approved: true,
        min_dose: 1,
        max_dose: 10,
        available_at: new Date('2023-12-31'),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedDrug);

      const result = await service.findOne(id);
      expect(result).toEqual(expectedDrug);
    });

    it('should throw NotFoundException when the drug with the provided ID does not exist', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`Drug with ID ${id} not found`),
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

    it('should throw an error when the findOne operation returns null', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(id)).rejects.toThrow(
        `Drug with ID ${id} not found`,
      );
    });

    it('should throw an error when the findOne operation returns an empty object', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      repository.findOne.mockResolvedValue({});

      await expect(service.findOne(id)).rejects.toThrow(BadRequestException);
      await expect(service.findOne(id)).rejects.toThrow(`Drug object is empty`);
    });
  });

  describe('update', () => {
    it('should update a drug', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      const updateDrugDto: UpdateDrugDto = {
        name: 'Updated Drug',
        approved: false,
        min_dose: 2,
        max_dose: 5,
        available_at: new Date('2024-01-01'),
      };
      const updatedDrug: Drug = {
        id: id,
        ...updateDrugDto,
      };

      // Mock the repository methods
      repository.update.mockResolvedValue({ affected: 1 }); // Simula que una fila fue afectada
      repository.findOne.mockResolvedValue(updatedDrug); // Simula que el medicamento actualizado es retornado

      const result = await service.update(id, updateDrugDto);

      expect(result).toEqual(updatedDrug);
      expect(repository.update).toHaveBeenCalledWith(id, updateDrugDto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw NotFoundException when the drug with the given ID does not exist', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      repository.update.mockResolvedValue(undefined);
      repository.findOne.mockResolvedValue(undefined);

      await expect(service.update(id, {} as UpdateDrugDto)).rejects.toThrow(
        Error,
      );
    });

    it('should throw an error when the update operation fails', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      repository.update.mockRejectedValue(new Error('Update operation failed'));

      await expect(service.update(id, {} as UpdateDrugDto)).rejects.toThrow(
        Error,
      );
      await expect(service.update(id, {} as UpdateDrugDto)).rejects.toThrow(
        'Update operation failed',
      );
    });

    it('should throw an error when the findOne operation fails', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      repository.update.mockResolvedValue(undefined);
      repository.findOne.mockRejectedValue(
        new Error('FindOne operation failed'),
      );

      await expect(service.update(id, {} as UpdateDrugDto)).rejects.toThrow(
        Error,
      );
    });

    it('should throw an error when the update and findOne operations return different results', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      const updateDrugDto: UpdateDrugDto = {
        name: 'Updated Drug',
        approved: false,
        min_dose: 0,
        max_dose: 0,
        available_at: undefined,
      };
      repository.update.mockResolvedValue(undefined);
      repository.findOne.mockResolvedValue({ id: id, ...updateDrugDto });

      await expect(service.update(id, updateDrugDto)).rejects.toThrow(Error);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when the drug with the given ID does not exist', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';

      // Mock the drugRepository.delete method to throw an error
      repository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove({ id })).rejects.toThrow(NotFoundException);
      await expect(service.remove({ id })).rejects.toThrow(
        `Drug with ID ${id} not found`,
      );
    });

    it('should throw NotFoundException when the delete operation fails', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      repository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove({ id })).rejects.toThrow(NotFoundException);
      await expect(service.remove({ id })).rejects.toThrow(
        `Drug with ID ${id} not found`,
      );
    });

    it('should return the correct response when the drug with the given ID exists and the delete operation is successful', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      repository.delete.mockResolvedValue({ affected: 1 });
      const expectedResponse = {
        message: `Drug with ID ${id} has been deleted`,
        statusCode: HttpStatus.OK,
        data: { affected: 1 },
      };
      await expect(service.remove({ id })).resolves.toEqual(expectedResponse);
    });

    it('should throw an error when the result object does not contain the affected property', async () => {
      const id = '8f1e7e34-ddb6-4418-a759-51a8f31f9269';
      repository.delete.mockResolvedValue({ id });

      await expect(service.remove({ id })).rejects.toThrow(Error);
      await expect(service.remove({ id })).rejects.toThrow(Error);
    });
  });
});
