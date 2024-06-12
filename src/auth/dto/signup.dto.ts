import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsNull } from 'typeorm';

export class SignupDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Email of the user',
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Name of the user' })
  @Transform(({ value }) => value.trim())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
