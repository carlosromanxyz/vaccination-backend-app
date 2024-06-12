import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationController } from './Vaccination.controller';
import { VaccinationService } from './Vaccination.service';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';

describe('VaccinationController', () => {
  let controller: VaccinationController;
  let service: VaccinationService;

  const mockVaccinationService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaccinationController],
      providers: [
        {
          provide: VaccinationService,
          useValue: mockVaccinationService,
        },
      ],
    }).compile();

    controller = module.get<VaccinationController>(VaccinationController);
    service = module.get<VaccinationService>(VaccinationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a vaccination', async () => {
      const vaccinationDto: CreateVaccinationDto = {
        name: 'vaccination 1',
        drug_id: 'XXXX-XXXX-XXXX-XXXX',
        dose: 1,
        date: new Date('2023-12-31'),
      };
      const result = { ...vaccinationDto, id: '1' };
      mockVaccinationService.create.mockResolvedValue(result);

      expect(await controller.create(vaccinationDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(vaccinationDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of Vaccination', async () => {
      const result = [{ name: 'vaccination 1' }, { name: 'vaccination 2' }];
      mockVaccinationService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single vaccination', async () => {
      const result = { name: 'vaccination 1' };
      mockVaccinationService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a vaccination', async () => {
      const updateDto: UpdateVaccinationDto = {
        name: 'vaccination 1',
        drug_id: 'XXXX-XXXX-XXXX-XXXX',
        dose: 1,
        date: new Date('2023-12-31'),
      };
      const result = { ...updateDto, id: '1' };
      mockVaccinationService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateDto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    // should remove a vaccination
    it('should remove a vaccination', async () => {
      const result = {
        message: 'vaccination with ID 1 has been deleted',
        statusCode: 200,
        data: { affected: 1 },
      };
      mockVaccinationService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
    });
  });
});
