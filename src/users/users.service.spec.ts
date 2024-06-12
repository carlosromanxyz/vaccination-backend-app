import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockResolvedValue(null),
            findOne: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should save a user with a non-unique email', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // Act
      await service.create(createUserDto);

      // Assert
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
    });
  });
});
