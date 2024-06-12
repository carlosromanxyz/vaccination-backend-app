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

export class UpdateVaccinationDto extends PartialType(CreateVaccinationDto) {
  @ApiProperty({
    example: 'John Doe',
    description: 'Patient name',
  })
  @IsString({ message: 'The name must be a text string' })
  @IsNotEmpty({ message: 'The name cannot be empty' })
  @MinLength(3, { message: 'The name must be at least 3 characters' })
  name: string;

  @ApiProperty({
    example: 'XXXX-XXXX-XXXX-XXXX',
    description: 'The drug identification string',
  })
  @IsString({ message: 'The drug_id must be a string value' })
  drug_id: string;

  @ApiProperty({
    example: '1',
    description: 'The dose of the drug',
  })
  @IsNumber({}, { message: 'The dose must be a number' })
  dose: number;

  @ApiProperty({
    example: '2012-04-23T18:25:43.511Z',
    description: 'The date of the vaccination',
  })
  @IsDate({ message: 'The date must be a valid date' })
  date: Date;
}