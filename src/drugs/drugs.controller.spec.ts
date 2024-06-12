import { Test, TestingModule } from '@nestjs/testing';
import { DrugsController } from './drugs.controller';
import { DrugsService } from './drugs.service';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';

describe('DrugsController', () => {
  let controller: DrugsController;
  let service: DrugsService;

  const mockDrugsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrugsController],
      providers: [
        {
          provide: DrugsService,
          useValue: mockDrugsService,
        },
      ],
    }).compile();

    controller = module.get<DrugsController>(DrugsController);
    service = module.get<DrugsService>(DrugsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a drug', async () => {
      const drugDto: CreateDrugDto = {
        name: 'Drug 1',
        approved: true,
        min_dose: 1,
        max_dose: 10,
        available_at: new Date('2023-12-31'),
      };
      const result = { ...drugDto, id: '1' };
      mockDrugsService.create.mockResolvedValue(result);

      expect(await controller.create(drugDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(drugDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of drugs', async () => {
      const result = [{ name: 'Drug 1' }, { name: 'Drug 2' }];
      mockDrugsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single drug', async () => {
      const result = { name: 'Drug 1' };
      mockDrugsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a drug', async () => {
      const updateDto: UpdateDrugDto = {
        name: 'Updated Drug',
        approved: false,
        min_dose: 0,
        max_dose: 0,
        available_at: new Date(''),
      };
      const result = { ...updateDto, id: '1' };
      mockDrugsService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateDto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    // should remove a drug
    it('should remove a drug', async () => {
      const result = {
        message: 'Drug with ID 1 has been deleted',
        statusCode: 200,
        data: { affected: 1 },
      };
      mockDrugsService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
    });
  });
});
