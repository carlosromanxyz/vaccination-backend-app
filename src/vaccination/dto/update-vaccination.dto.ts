import { PartialType } from '@nestjs/mapped-types';
import { CreateVaccinationDto } from './create-vaccination.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateVaccinationDto extends PartialType(CreateVaccinationDto) {
  @ApiProperty({
    example: 'John Doe',
    description: 'Patient name',
  })
  @IsNotEmpty({ message: 'The name cannot be empty' })
  @MinLength(3, { message: 'The name must be at least 3 characters' })
  name: string;

  @ApiProperty({
    example: 'XXXX-XXXX-XXXX-XXXX',
    description: 'The drug identification string',
  })
  @IsString({ message: 'The drug_id must be a string value' })
  @IsNotEmpty({ message: 'The drug_id cannot be empty' })
  @MinLength(3, { message: 'The drug_id must be at least 3 characters' })
  drug_id: string;

  @ApiProperty({
    example: '1',
    description: 'The dose of the drug',
  })
  @IsNumber({}, { message: 'The dose must be a number' })
  dose: number;

  @ApiProperty({
    example: '2024-06-12T00:05:53.356Z',
    description: 'The date of the vaccination',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'The date must be a valid date' })
  date: Date;
}
