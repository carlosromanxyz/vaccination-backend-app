import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateVaccinationDto {
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
    example: '2012-04-23T18:25:43.511Z',
    description: 'The date of the vaccination',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'The date must be a valid date' })
  date: Date;
}
