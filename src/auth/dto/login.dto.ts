import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8)
  password: string;
}
