import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    // should throw a BadRequestException when an empty password is provided
    it('should throw a BadRequestException when an empty password is provided', async () => {
      const signupDto: SignupDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '',
      };

      await expect(authService.signup(signupDto)).rejects.toThrow(
        new BadRequestException('Password cannot be empty'),
      );
      expect(usersService.create).not.toHaveBeenCalled();
    });

    // should create a user when a valid password is provided
    it('should create a user when a valid password is provided', async () => {
      const signupDto: SignupDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };

      usersService.findOneByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(undefined);

      await authService.signup(signupDto);

      expect(usersService.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      });
    });
  });
});
