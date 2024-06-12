import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './../../src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup({ name, email, password }: SignupDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('User already exists');
    } else if (password === '') {
      throw new BadRequestException('Password cannot be empty');
    } else {
      await this.usersService.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
      });

      // Return 201 code with success message
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User successfully signed up',
      };
    }
  }
  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User successfully logged in',
      token,
      email,
    };
  }
}
