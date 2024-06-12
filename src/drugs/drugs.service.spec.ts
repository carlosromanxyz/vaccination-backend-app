import { Test, TestingModule } from '@nestjs/testing';
import { DrugsService } from './drugs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Drug } from './entities/drug.entity';
import { Repository } from 'typeorm';

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
    it('should return an array of drugs', async () => {
      const drugs = [{ name: 'Drug 1' }, { name: 'Drug 2' }];
      repository.find.mockResolvedValue(drugs);

      const result = await service.findAll();
      expect(result).toEqual(drugs);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single drug', async () => {
      const drug = { name: 'Drug 1' };
      repository.findOne.mockResolvedValue(drug);

      const result = await service.findOne('1');
      expect(result).toEqual(drug);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('update', () => {
    it('should update a drug', async () => {
      const updateResult = { affected: 1 };
      repository.update.mockResolvedValue(updateResult);

      const result = await service.update('1', { name: 'Updated Drug' } as any);
      expect(result).toEqual(updateResult);
      expect(repository.update).toHaveBeenCalledWith('1', {
        name: 'Updated Drug',
      });
    });
  });

  describe('remove', () => {
    it('should remove a drug', async () => {
      const deleteResult = { affected: 1 };
      repository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove('1');
      expect(result).toEqual(deleteResult);
      expect(repository.delete).toHaveBeenCalledWith('1');
    });
  });
});
